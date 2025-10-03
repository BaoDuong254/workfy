import { Transform, Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
  ValidateNested,
} from "class-validator";
import mongoose from "mongoose";

class Company {
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  logo: string;
}

export class CreateJobDto {
  @IsNotEmpty({
    message: "Tên không được để trống",
  })
  name: string;

  @IsNotEmpty({
    message: "Kỹ năng không được để trống",
  })
  @IsArray({
    message: "Kỹ năng phải là một mảng",
  })
  @IsString({
    each: true,
    message: "Mỗi kỹ năng phải là một chuỗi",
  })
  skills: string[];

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;

  @IsNotEmpty()
  location: string;

  @IsNotEmpty({
    message: "Mức lương không được để trống",
  })
  salary: number;

  @IsNotEmpty({
    message: "Số lượng không được để trống",
  })
  quantity: number;

  @IsNotEmpty({
    message: "Cấp bậc không được để trống",
  })
  level: string;

  @IsNotEmpty({
    message: "Mô tả không được để trống",
  })
  description: string;

  @IsNotEmpty({
    message: "Ngày bắt đầu không được để trống",
  })
  @Transform(({ value }) => new Date(value))
  @IsDate({
    message: "Ngày bắt đầu phải là một ngày hợp lệ",
  })
  startDate: Date;

  @IsNotEmpty({
    message: "Ngày kết thúc không được để trống",
  })
  @Transform(({ value }) => new Date(value))
  @IsDate({
    message: "Ngày kết thúc phải là một ngày hợp lệ",
  })
  endDate: Date;

  @IsNotEmpty({
    message: "Trạng thái không được để trống",
  })
  @IsBoolean({
    message: "Trạng thái phải là boolean",
  })
  isActive: boolean;
}
