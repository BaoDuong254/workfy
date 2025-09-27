import { Injectable } from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "src/users/schemas/user.schema";
import mongoose, { Model } from "mongoose";
import bcrypt from "bcrypt";
import { CreateUserDto } from "src/users/dto/create-user.dto";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  hashPassword = (password: string) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  };

  async create(createUserDto: CreateUserDto) {
    const password = this.hashPassword(createUserDto.password);
    const user = await this.userModel.create({
      ...createUserDto,
      password,
    });
    return user;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return "User not found";
    }
    return this.userModel.findOne({ _id: id });
  }

  findOneByUsername(username: string) {
    return this.userModel.findOne({
      email: username,
    });
  }

  isValidPassword(password: string, hashedPassword: string) {
    return bcrypt.compareSync(password, hashedPassword);
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne(
      {
        _id: updateUserDto._id,
      },
      {
        ...updateUserDto,
      }
    );
  }

  async remove(id: string) {
    return await this.userModel.deleteOne({ _id: id });
  }
}
