import { ApiProperty } from "@nestjs/swagger";
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
  @ApiProperty({
    example: "64b8c2f7a1b2c3d4e5f6a789",
    description: "ID của công ty",
  })
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;

  @ApiProperty({
    example: "Google Inc.",
    description: "Tên công ty",
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: "https://example.com/logo.png",
    description: "Logo công ty",
  })
  @IsNotEmpty()
  logo: string;
}

export class CreateJobDto {
  @ApiProperty({
    example: "Frontend Developer",
    description: "Tên công việc",
  })
  @IsNotEmpty({
    message: "Tên không được để trống",
  })
  name: string;

  @ApiProperty({
    example: ["React", "TypeScript", "Node.js"],
    description: "Danh sách kỹ năng yêu cầu",
    type: [String],
  })
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

  @ApiProperty({
    type: Company,
    description: "Thông tin công ty",
  })
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;

  @ApiProperty({
    example: "Hà Nội, Việt Nam",
    description: "Vị trí làm việc",
  })
  @IsNotEmpty()
  location: string;

  @ApiProperty({
    example: 50000000,
    description: "Mức lương (VNĐ)",
  })
  @IsNotEmpty({
    message: "Mức lương không được để trống",
  })
  salary: number;

  @ApiProperty({
    example: 5,
    description: "Số lượng tuyển dụng",
  })
  @IsNotEmpty({
    message: "Số lượng không được để trống",
  })
  quantity: number;

  @ApiProperty({
    example: "Junior",
    description: "Cấp bậc công việc",
  })
  @IsNotEmpty({
    message: "Cấp bậc không được để trống",
  })
  level: string;

  @ApiProperty({
    example: "We are looking for a talented Frontend Developer to join our team...",
    description: "Mô tả công việc chi tiết",
  })
  @IsNotEmpty({
    message: "Mô tả không được để trống",
  })
  description: string;

  @ApiProperty({
    example: "2025-01-01T00:00:00.000Z",
    description: "Ngày bắt đầu tuyển dụng",
    type: Date,
  })
  @IsNotEmpty({
    message: "Ngày bắt đầu không được để trống",
  })
  @Transform(({ value }) => new Date(value))
  @IsDate({
    message: "Ngày bắt đầu phải là một ngày hợp lệ",
  })
  startDate: Date;

  @ApiProperty({
    example: "2025-12-31T23:59:59.999Z",
    description: "Ngày kết thúc tuyển dụng",
    type: Date,
  })
  @IsNotEmpty({
    message: "Ngày kết thúc không được để trống",
  })
  @Transform(({ value }) => new Date(value))
  @IsDate({
    message: "Ngày kết thúc phải là một ngày hợp lệ",
  })
  endDate: Date;

  @ApiProperty({
    example: true,
    description: "Trạng thái hoạt động của công việc",
  })
  @IsNotEmpty({
    message: "Trạng thái không được để trống",
  })
  @IsBoolean({
    message: "Trạng thái phải là boolean",
  })
  isActive: boolean;
}
