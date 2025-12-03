import { Controller, Get, Post, Param, Delete, UseInterceptors, UploadedFile, UseFilters } from "@nestjs/common";
import { FilesService } from "./files.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { ResponseMessage } from "src/decorator/customize";
import { HttpExceptionFilter } from "src/core/http-exception.filter";

@Controller("files")
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post("upload")
  @ResponseMessage("Upload Single File")
  @UseInterceptors(FileInterceptor("fileUpload"))
  @UseFilters(new HttpExceptionFilter())
  uploadFile(
    @UploadedFile()
    file: Express.Multer.File
  ) {
    return {
      fileName: file.filename,
    };
  }

  @Get()
  findAll() {
    return this.filesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.filesService.findOne(+id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.filesService.remove(+id);
  }
}
