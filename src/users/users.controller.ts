import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Public, ResponseMessage, User } from "src/decorator/customize";
import type { IUser } from "src/users/users.interface";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ResponseMessage("Create a new user")
  async create(@Body() createUserDto: CreateUserDto, @User() user: IUser) {
    const newUser = await this.usersService.create(createUserDto, user);

    return {
      _id: newUser?._id,
      createdAt: newUser?.createdAt,
    };
  }

  @Get()
  @ResponseMessage("Get all users")
  findAll(@Query("current") currentPage: string, @Query("pageSize") limit: string, @Query() query: string) {
    return this.usersService.findAll(+currentPage, +limit, query);
  }

  @Public()
  @Get(":id")
  @ResponseMessage("Get a user by id")
  findOne(@Param("id") id: string) {
    const user = this.usersService.findOne(id);
    return user;
  }

  @Patch()
  @ResponseMessage("Update a user")
  update(@Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    const updateUser = this.usersService.update(updateUserDto, user);
    return updateUser;
  }

  @Delete(":id")
  @ResponseMessage("Delete a user")
  remove(@Param("id") id: string, @User() user: IUser) {
    return this.usersService.remove(id, user);
  }
}
