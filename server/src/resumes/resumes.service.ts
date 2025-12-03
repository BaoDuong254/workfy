import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateUserCvDto } from "./dto/create-resume.dto";
import type { IUser } from "src/users/users.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Resume, ResumeDocument } from "src/resumes/schemas/resume.schema";
import type { SoftDeleteModel } from "mongoose-delete";
import mongoose from "mongoose";
import aqp from "api-query-params";

@Injectable()
export class ResumesService {
  constructor(
    @InjectModel(Resume.name)
    private resumeModel: SoftDeleteModel<ResumeDocument>
  ) {}

  async create(createUserCvDto: CreateUserCvDto, user: IUser) {
    const { url, companyId, jobId } = createUserCvDto;
    const { email, _id } = user;

    const newCV = (await this.resumeModel.create({
      url,
      companyId,
      email,
      jobId,
      userId: _id,
      status: "PENDING",
      createdBy: { _id, email },
      history: [
        {
          status: "PENDING",
          updatedAt: new Date(),
          updatedBy: {
            _id: user._id,
            email: user.email,
          },
        },
      ],
    } as unknown as Resume)) as ResumeDocument;

    return {
      _id: newCV._id,
      createdAt: newCV.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    const offset = (+currentPage - 1) * +limit;
    const defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.resumeModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.resumeModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as Record<string, 1 | -1>)
      .populate(population)
      .select(projection as string | Record<string, number>)
      .exec();

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException("not found resume");
    }

    return await this.resumeModel.findById(id);
  }

  async findByUsers(user: IUser) {
    return await this.resumeModel
      .find({
        userId: user._id as unknown as mongoose.Schema.Types.ObjectId,
      })
      .sort("-createdAt")
      .populate([
        {
          path: "companyId",
          select: { name: 1 },
        },
        {
          path: "jobId",
          select: { name: 1 },
        },
      ]);
  }

  async update(_id: string, status: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new BadRequestException("not found resume");
    }

    const updated = await this.resumeModel.updateOne(
      { _id },
      {
        status,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
        $push: {
          history: {
            status: status,
            updatedAt: new Date(),
            updatedBy: {
              _id: user._id,
              email: user.email,
            },
          },
        },
      }
    );

    return updated;
  }

  async remove(id: string, user: IUser) {
    await this.resumeModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      }
    );
    return await this.resumeModel.delete({ _id: id });
  }
}
