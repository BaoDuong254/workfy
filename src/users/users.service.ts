import { Injectable } from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "src/users/schemas/user.schema";
import { Model } from "mongoose";
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

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
