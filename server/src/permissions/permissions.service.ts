import { BadRequestException, Injectable } from "@nestjs/common";
import { CreatePermissionDto } from "./dto/create-permission.dto";
import { UpdatePermissionDto } from "./dto/update-permission.dto";
import { IUser } from "src/users/users.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Permission, PermissionDocument } from "./schemas/permission.schema";
import aqp from "api-query-params";
import mongoose from "mongoose";
import type { SoftDeleteModel } from "mongoose-delete";

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: SoftDeleteModel<PermissionDocument>
  ) {}

  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const { name, apiPath, method, module } = createPermissionDto;

    const isExist = await this.permissionModel.findOne({ apiPath, method });
    if (isExist) {
      throw new BadRequestException(`Permission với apiPath=${apiPath} , method=${method} đã tồn tại!`);
    }

    const newPermission = (await this.permissionModel.create({
      name,
      apiPath,
      method,
      module,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    } as unknown as Permission)) as PermissionDocument;

    return {
      _id: newPermission._id,
      createdAt: newPermission.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    const offset = (+currentPage - 1) * +limit;
    const defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.permissionModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.permissionModel
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
      throw new BadRequestException("not found permission");
    }

    return await this.permissionModel.findById(id);
  }

  async update(_id: string, updatePermissionDto: UpdatePermissionDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new BadRequestException("not found permission");
    }
    const { module, method, apiPath, name } = updatePermissionDto;

    const updated = await this.permissionModel.updateOne(
      { _id },
      {
        module,
        method,
        apiPath,
        name,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      }
    );
    return updated;
  }

  async remove(id: string, user: IUser) {
    await this.permissionModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      }
    );
    return await this.permissionModel.delete({ _id: id });
  }
}
