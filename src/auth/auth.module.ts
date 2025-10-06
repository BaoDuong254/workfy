import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersModule } from "src/users/users.module";
import { LocalStrategy } from "src/auth/passport/local.strategy";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtStrategy } from "src/auth/passport/jwt.strategy";
import ms, { StringValue } from "ms";
import { AuthController } from "src/auth/auth.controller";
import { RolesModule } from "src/roles/roles.module";

@Module({
  imports: [
    UsersModule,
    RolesModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_ACCESS_TOKEN_SECRET"),
        signOptions: {
          expiresIn: ms(configService.get<string>("JWT_ACCESS_EXPIRE") as StringValue) / 1000,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
