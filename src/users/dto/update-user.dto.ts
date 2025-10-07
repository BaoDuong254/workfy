import { ApiProperty, OmitType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";
import { IsNotEmpty } from "class-validator";

export class UpdateUserDto extends OmitType(CreateUserDto, ["password"] as const) {
  @ApiProperty({
    example: "64b8c2f7a1b2c3d4e5f6a789",
    description: "ID người dùng cần cập nhật",
  })
  @IsNotEmpty({ message: "User id is required" })
  _id: string;
}
