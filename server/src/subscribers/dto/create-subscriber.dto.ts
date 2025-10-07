import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateSubscriberDto {
  @ApiProperty({
    example: "Nguyễn Văn A",
    description: "Tên người đăng ký nhận thông báo",
  })
  @IsNotEmpty({ message: "Name không được để trống" })
  name: string;

  @ApiProperty({
    example: "subscriber@example.com",
    description: "Email để nhận thông báo việc làm",
  })
  @IsEmail({}, { message: "Email không đúng định dạng" })
  @IsNotEmpty({ message: "Email không được để trống" })
  email: string;

  @ApiProperty({
    example: ["React", "Node.js", "Python"],
    description: "Danh sách kỹ năng quan tâm",
    type: [String],
  })
  @IsNotEmpty({ message: "skills không được để trống" })
  @IsArray({ message: "skills có định dạng là array" })
  @IsString({ each: true, message: "skill định dạng là string" })
  skills: string[];
}
