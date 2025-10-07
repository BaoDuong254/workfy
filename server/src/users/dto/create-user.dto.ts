import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmail, IsMongoId, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from "class-validator";
import mongoose from "mongoose";

class Company {
  @ApiProperty({
    example: "64b8c2f7a1b2c3d4e5f6a789",
    description: "ID công ty",
  })
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;

  @ApiProperty({
    example: "Google Inc.",
    description: "Tên công ty",
  })
  @IsNotEmpty()
  name: string;
}

export class CreateUserDto {
  @ApiProperty({
    example: "Nguyễn Văn A",
    description: "Tên người dùng",
  })
  @IsNotEmpty({
    message: "Name không được để trống",
  })
  name: string;

  @ApiProperty({
    example: "user@example.com",
    description: "Địa chỉ email",
  })
  @IsEmail()
  @IsNotEmpty({
    message: "Email không được để trống",
  })
  email: string;

  @ApiProperty({
    example: "123456",
    description: "Mật khẩu",
  })
  @IsNotEmpty({
    message: "Password không được để trống",
  })
  password: string;

  @ApiProperty({
    example: 25,
    description: "Tuổi",
  })
  @IsNotEmpty({
    message: "Age không được để trống",
  })
  age: number;

  @ApiProperty({
    example: 1,
    description: "Giới tính (0: Nữ, 1: Nam)",
  })
  @IsNotEmpty({
    message: "Gender không được để trống",
  })
  gender: number;

  @ApiProperty({
    example: "Hà Nội, Việt Nam",
    description: "Địa chỉ",
  })
  @IsNotEmpty({
    message: "Address không được để trống",
  })
  address: string;

  @ApiProperty({
    example: "64b8c2f7a1b2c3d4e5f6a789",
    description: "ID vai trò của người dùng",
  })
  @IsNotEmpty({
    message: "Role không được để trống",
  })
  @IsMongoId({
    message: "Role phải là id hợp lệ",
  })
  role: mongoose.Schema.Types.ObjectId;

  @ApiProperty({
    type: Company,
    description: "Thông tin công ty của người dùng",
  })
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;
}

export class RegisterUserDto {
  @ApiProperty({
    example: "Nguyễn Văn B",
    description: "Tên người dùng đăng ký",
  })
  @IsNotEmpty({
    message: "Name không được để trống",
  })
  name: string;

  @ApiProperty({
    example: "newuser@example.com",
    description: "Email đăng ký",
  })
  @IsEmail()
  @IsNotEmpty({
    message: "Email không được để trống",
  })
  email: string;

  @ApiProperty({
    example: "password123",
    description: "Mật khẩu đăng ký",
  })
  @IsNotEmpty({
    message: "Password không được để trống",
  })
  password: string;

  @ApiProperty({
    example: 23,
    description: "Tuổi của người đăng ký",
  })
  @IsNotEmpty({
    message: "Age không được để trống",
  })
  age: number;

  @ApiProperty({
    example: 0,
    description: "Giới tính (0: Nữ, 1: Nam)",
  })
  @IsNotEmpty({
    message: "Gender không được để trống",
  })
  gender: number;

  @ApiProperty({
    example: "Hồ Chí Minh, Việt Nam",
    description: "Địa chỉ",
  })
  @IsNotEmpty({
    message: "Address không được để trống",
  })
  address: string;
}

export class UserLoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "admin@gmail.com", description: "username" })
  readonly username: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: "123456",
    description: "password",
  })
  readonly password: string;
}
