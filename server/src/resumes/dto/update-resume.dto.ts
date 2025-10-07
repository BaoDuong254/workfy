import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateResumeDto } from "./create-resume.dto";
import { IsArray, IsEmail, IsNotEmpty, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { Types } from "mongoose";

class UpdatedBy {
  @ApiProperty({
    example: "64b8c2f7a1b2c3d4e5f6a789",
    description: "ID người cập nhật",
  })
  @IsNotEmpty()
  _id: Types.ObjectId;

  @ApiProperty({
    example: "admin@example.com",
    description: "Email người cập nhật",
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

class History {
  @ApiProperty({
    example: "REVIEWED",
    description: "Trạng thái mới của CV",
  })
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    example: "2025-01-01T00:00:00.000Z",
    description: "Thời gian cập nhật",
    type: Date,
  })
  @IsNotEmpty()
  updatedAt: Date;

  @ApiProperty({
    type: UpdatedBy,
    description: "Thông tin người cập nhật",
  })
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => UpdatedBy)
  updatedBy: UpdatedBy;
}

export class UpdateResumeDto extends PartialType(CreateResumeDto) {
  @ApiProperty({
    type: [History],
    description: "Lịch sử cập nhật trạng thái CV",
  })
  @IsNotEmpty({ message: "history không được để trống" })
  @IsArray({ message: "history có định dạng là array" })
  @ValidateNested()
  @Type(() => History)
  history: History[];
}
