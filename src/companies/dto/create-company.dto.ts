import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateCompanyDto {
  @ApiProperty({
    example: "Google Inc.",
    description: "Tên công ty",
  })
  @IsNotEmpty({
    message: "Tên không được để trống",
  })
  name: string;

  @ApiProperty({
    example: "123 Main Street, San Francisco, CA",
    description: "Địa chỉ công ty",
  })
  @IsNotEmpty({
    message: "Địa chỉ không được để trống",
  })
  address: string;

  @ApiProperty({
    example: "Leading technology company specializing in search engines and cloud services",
    description: "Mô tả về công ty",
  })
  @IsNotEmpty({
    message: "Mô tả không được để trống",
  })
  description: string;

  @ApiProperty({
    example: "https://example.com/logo.png",
    description: "URL của logo công ty",
  })
  @IsNotEmpty({
    message: "Logo không được để trống",
  })
  logo: string;
}
