import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Response } from "express";
import ms from "ms";
import { RegisterUserDto } from "src/users/dto/create-user.dto";
import { IUser } from "src/users/users.interface";
import { UsersService } from "src/users/users.service";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user) {
      const isValid = this.usersService.isValidPassword(pass, user.password);
      if (isValid === true) {
        return user;
      }
    }
    return null;
  }

  async login(user: IUser, response: Response) {
    const { _id, name, email, role } = user;
    const payload = {
      sub: "token login",
      iss: "from server",
      _id,
      name,
      email,
      role,
    };
    const refreshToken = this.createRefreshToken(payload);
    await this.usersService.updateUserToken(refreshToken, _id);
    // set refresh token in httpOnly cookie
    response.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE") as ms.StringValue),
    });
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id,
        name,
        email,
        role,
      },
    };
  }

  async register(user: RegisterUserDto) {
    const newUser = await this.usersService.register(user);

    return {
      _id: newUser?._id,
      createdAt: newUser?.createdAt,
    };
  }

  createRefreshToken = (payload: any): string => {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
      expiresIn: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE") as ms.StringValue) / 1000,
    });
    return refreshToken;
  };

  async processNewToken(refresh_token: string, response: Response) {
    try {
      this.jwtService.verify(refresh_token, {
        secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
      });
      const user = await this.usersService.findUserByToken(refresh_token);
      if (!user) {
        throw new BadRequestException("No user found");
      }
      const { _id, name, email, role } = user;
      const payload = {
        sub: "token refresh",
        iss: "from server",
        _id,
        name,
        email,
        role,
      };
      const refreshToken = this.createRefreshToken(payload);
      await this.usersService.updateUserToken(refreshToken, _id.toString());
      // set refresh token in httpOnly cookie
      response.clearCookie("refresh_token");
      response.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        maxAge: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE") as ms.StringValue),
      });
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          _id,
          name,
          email,
          role,
        },
      };
    } catch {
      throw new BadRequestException("Invalid token, please login again");
    }
  }

  async logout(response: Response, user: IUser) {
    await this.usersService.updateUserToken("", user._id);
    response.clearCookie("refresh_token");
    return "Logout successfully";
  }
}
