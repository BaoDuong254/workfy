import { IsNotEmpty } from "class-validator";

export class CreateJobDto {
  @IsNotEmpty({
    message: "Tên không được để trống",
  })
  name: string;

  @IsNotEmpty({
    message: "Kỹ năng không được để trống",
  })
  skills: string[];

  @IsNotEmpty({
    message: "Công ty không được để trống",
  })
  company: {
    _id: string;
    name: string;
  };

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
  startDate: Date;

  @IsNotEmpty({
    message: "Ngày kết thúc không được để trống",
  })
  endDate: Date;

  @IsNotEmpty({
    message: "Trạng thái không được để trống",
  })
  isActive: boolean;
}
