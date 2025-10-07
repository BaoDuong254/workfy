import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateRoleDto {
  @ApiProperty({
    example: "Admin",
    description: "Tên vai trò",
  })
  @IsNotEmpty({ message: "name không được để trống" })
  name: string;

  @ApiProperty({
    example: "Administrator with full access to system",
    description: "Mô tả vai trò",
  })
  @IsNotEmpty({ message: "description không được để trống" })
  description: string;

  @ApiProperty({
    example: true,
    description: "Trạng thái hoạt động của vai trò",
  })
  @IsNotEmpty({ message: "isActive không được để trống" })
  @IsBoolean({ message: "isActive có giá trị boolean" })
  isActive: boolean;

  @ApiProperty({
    example: ["64b8c2f7a1b2c3d4e5f6a789", "64b8c2f7a1b2c3d4e5f6a790"],
    description: "Danh sách ID của các quyền",
    type: [String],
  })
  @IsNotEmpty({ message: "permissions không được để trống" })
  @IsMongoId({ each: true, message: "permissions phải là mảng id hợp lệ" })
  @IsArray({ message: "permissions có định dạng là array" })
  permissions: mongoose.Schema.Types.ObjectId[];
}
