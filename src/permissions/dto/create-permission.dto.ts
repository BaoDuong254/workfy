import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreatePermissionDto {
  @ApiProperty({
    example: "Create User",
    description: "Tên quyền",
  })
  @IsNotEmpty({ message: "Name không được để trống" })
  name: string;

  @ApiProperty({
    example: "/api/v1/users",
    description: "Đường dẫn API",
  })
  @IsNotEmpty({ message: "ApiPath không được để trống" })
  apiPath: string;

  @ApiProperty({
    example: "POST",
    description: "Phương thức HTTP (GET, POST, PUT, DELETE)",
  })
  @IsNotEmpty({ message: "Method không được để trống" })
  method: string;

  @ApiProperty({
    example: "USERS",
    description: "Module quản lý quyền",
  })
  @IsNotEmpty({ message: "Module không được để trống" })
  module: string;
}
