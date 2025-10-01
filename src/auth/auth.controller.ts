import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";
import { Public, ResponseMessage } from "src/decorator/customize";
import { RegisterUserDto } from "src/users/dto/create-user.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @ResponseMessage("Register a new user")
  @Post("/register")
  handleRegister(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }
}
