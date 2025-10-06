/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";
import { LocalAuthGuard } from "src/auth/local-auth.guard";
import { Public, ResponseMessage, User } from "src/decorator/customize";
import { RegisterUserDto } from "src/users/dto/create-user.dto";
import type { Request, Response } from "express";
import type { IUser } from "src/users/users.interface";
import { RolesService } from "src/roles/roles.service";
import { Throttle, ThrottlerGuard } from "@nestjs/throttler";

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private rolesService: RolesService
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post("/login")
  @ResponseMessage("User login")
  handleLogin(@Req() req: Request & { user }, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user as IUser, response);
  }

  @Public()
  @ResponseMessage("Register a new user")
  @Post("/register")
  handleRegister(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @ResponseMessage("Get user info")
  @Get("/account")
  async handleGetAccount(@User() user: IUser) {
    const temp = (await this.rolesService.findOne(user.role._id)) as any;
    user.permissions = temp.permissions;
    return { user };
  }

  @Public()
  @ResponseMessage("Get User by refresh token")
  @Get("/refresh")
  handleRefreshToken(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const refresh_token = request.cookies["refresh_token"] as string;
    return this.authService.processNewToken(refresh_token, response);
  }

  @ResponseMessage("Logout user")
  @Post("/logout")
  handleLogout(@Res({ passthrough: true }) response: Response, @User() user: IUser) {
    return this.authService.logout(response, user);
  }
}
