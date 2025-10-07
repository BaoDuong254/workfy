import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateResumeDto {
  @ApiProperty({
    example: "user@example.com",
    description: "Email của ứng viên",
  })
  @IsNotEmpty({ message: "email không được để trống" })
  email: string;

  @ApiProperty({
    example: "64b8c2f7a1b2c3d4e5f6a789",
    description: "ID người dùng",
  })
  @IsNotEmpty({ message: "userId không được để trống" })
  userId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: "url không được để trống" })
  url: string;

  @ApiProperty({
    example: "PENDING",
    description: "Trạng thái CV (PENDING, REVIEWING, APPROVED, REJECTED)",
  })
  @IsNotEmpty({ message: "status không được để trống" })
  status: string;

  @ApiProperty({
    example: "64b8c2f7a1b2c3d4e5f6a789",
    description: "ID công ty",
  })
  @IsNotEmpty({ message: "companyId không được để trống" })
  companyId: mongoose.Schema.Types.ObjectId;

  @ApiProperty({
    example: "64b8c2f7a1b2c3d4e5f6a789",
    description: "ID công việc ứng tuyển",
  })
  @IsNotEmpty({ message: "jobId không được để trống" })
  jobId: mongoose.Schema.Types.ObjectId;
}

export class CreateUserCvDto {
  @ApiProperty({
    example: "https://example.com/user-cv.pdf",
    description: "URL của CV người dùng",
  })
  @IsNotEmpty({ message: "url không được để trống" })
  url: string;

  @ApiProperty({
    example: "64b8c2f7a1b2c3d4e5f6a789",
    description: "ID công ty mục tiêu",
  })
  @IsNotEmpty({ message: "companyId không được để trống" })
  @IsMongoId({ message: "companyId is a mongo id" })
  companyId: mongoose.Schema.Types.ObjectId;

  @ApiProperty({
    example: "64b8c2f7a1b2c3d4e5f6a789",
    description: "ID công việc ứng tuyển",
  })
  @IsNotEmpty({ message: "jobId không được để trống" })
  @IsMongoId({ message: "jobId is a mongo id" })
  jobId: mongoose.Schema.Types.ObjectId;
}
