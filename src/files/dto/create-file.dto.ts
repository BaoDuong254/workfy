import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateFileDto {
  @ApiProperty({
    example: "document.pdf",
    description: "Tên file",
  })
  @IsNotEmpty({ message: "Tên file không được để trống" })
  @IsString({ message: "Tên file phải là chuỗi" })
  filename: string;

  @ApiProperty({
    example: "application/pdf",
    description: "Loại file (MIME type)",
  })
  @IsNotEmpty({ message: "Loại file không được để trống" })
  @IsString({ message: "Loại file phải là chuỗi" })
  mimetype: string;

  @ApiProperty({
    example: "/uploads/documents/document.pdf",
    description: "Đường dẫn file",
  })
  @IsNotEmpty({ message: "Đường dẫn file không được để trống" })
  @IsString({ message: "Đường dẫn file phải là chuỗi" })
  path: string;

  @ApiProperty({
    example: 1024000,
    description: "Kích thước file (bytes)",
    required: false,
  })
  @IsOptional()
  size?: number;
}
