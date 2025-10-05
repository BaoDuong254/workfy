import { BadRequestException, Injectable } from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User as UserM, UserDocument } from "src/users/schemas/user.schema";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { CreateUserDto, RegisterUserDto } from "src/users/dto/create-user.dto";
import type { SoftDeleteModel } from "mongoose-delete";
import type { IUser } from "src/users/users.interface";
import aqp from "api-query-params";

@Injectable()
export class UsersService {
  constructor(@InjectModel(UserM.name) private userModel: SoftDeleteModel<UserDocument>) {}

  hashPassword = (password: string) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  };

  async create(createUserDto: CreateUserDto, user: IUser) {
    const { name, email, password, age, gender, address, role, company } = createUserDto;
    const isExist = await this.userModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException(`Email ${email} has been registered`);
    }
    const hashPassword = this.hashPassword(password);
    const newUser = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      age,
      gender,
      address,
      role,
      company,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return newUser;
  }

  async findAll(currentPage: number, limit: number, query: string) {
    const { filter, sort, population } = aqp(query);
    delete filter.current;
    delete filter.pageSize;

    const offset = (currentPage - 1) * limit;
    const defaultLimit = limit ? limit : 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.userModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .select("-password")
      .populate(population)
      .exec();
    return {
      meta: {
        currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return "User not found";
    }
    return this.userModel
      .findOne({
        _id: id,
      })
      .select("-password")
      .populate({ path: "role", select: { _id: 1, name: 1 } });
  }

  findOneByUsername(username: string) {
    return this.userModel
      .findOne({
        email: username,
      })
      .populate({ path: "role", select: { name: 1, permissions: 1 } });
  }

  isValidPassword(password: string, hashedPassword: string) {
    return bcrypt.compareSync(password, hashedPassword);
  }

  async update(updateUserDto: UpdateUserDto, user: IUser) {
    return await this.userModel.updateOne(
      {
        _id: updateUserDto._id,
      },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      }
    );
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return "User not found";
    }

    const foundUser = await this.userModel.findById(id);
    if (foundUser?.role === "ADMIN") {
      throw new BadRequestException("Không thể xóa user ADMIN");
    }

    await this.userModel.updateOne(
      {
        _id: id,
      },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      }
    );
    return this.userModel.delete({ _id: id });
  }

  async register(user: RegisterUserDto) {
    const { name, email, password, age, gender, address } = user;
    const isExist = await this.userModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException(`Email ${email} has been registered`);
    }
    const hashedPassword = this.hashPassword(password);
    const newRegisteredUser = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
      age,
      gender,
      address,
      role: "USER",
    });
    return newRegisteredUser;
  }

  updateUserToken = async (refreshToken: string, _id: string) => {
    return await this.userModel.updateOne(
      {
        _id,
      },
      {
        refreshToken,
      }
    );
  };

  findUserByToken = async (refreshToken: string) => {
    return await this.userModel.findOne({ refreshToken });
  };
}
