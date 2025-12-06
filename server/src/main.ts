import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { TransformInterceptor } from "src/core/transform.interceptor";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<string>("PORT");

  // Set up global JWT authentication guard
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  // Set up static assets and view engine
  app.useStaticAssets(join(__dirname, "..", "public"));
  app.setBaseViewsDir(join(__dirname, "..", "views"));

  // Config pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    })
  );

  // Config interceptors
  app.useGlobalInterceptors(new TransformInterceptor(reflector));

  // Config cookie parser
  app.use(cookieParser());

  // Config CORS
  app.enableCors({
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });

  // Enable API versioning
  app.setGlobalPrefix("api", {
    exclude: ["metrics", "health"], // Exclude Prometheus metrics and health check from /api prefix
  });
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ["1"],
  });

  // Use helmet for security
  app.use(helmet());

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle("Workfy")
    .setDescription("The Workfy API description")
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "Bearer",
        bearerFormat: "JWT",
        in: "header",
      },
      "token"
    )
    .addSecurityRequirements("token")
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Start the application
  await app.listen(port ?? 3000);
}

bootstrap().catch((err) => {
  console.error("Error starting the application:", err);
  process.exit(1);
});
