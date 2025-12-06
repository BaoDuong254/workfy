import { Controller, Get } from "@nestjs/common";
import {
  HealthCheck,
  HealthCheckService,
  MongooseHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from "@nestjs/terminus";
import { Public } from "src/decorator/customize";

@Controller("health")
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: MongooseHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator
  ) {}

  @Get()
  @Public()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck("database"),
      // Check if heap memory usage is less than 300MB
      () => this.memory.checkHeap("memory_heap", 300 * 1024 * 1024),
      // Check if RSS memory usage is less than 300MB
      () => this.memory.checkRSS("memory_rss", 300 * 1024 * 1024),
      // Check if disk storage is less than 90% used (adjust path based on your OS)
      () =>
        this.disk.checkStorage("disk", {
          path: process.platform === "win32" ? "C:\\" : "/",
          thresholdPercent: 0.9,
        }),
    ]);
  }

  @Get("liveness")
  @Public()
  @HealthCheck()
  checkLiveness() {
    // Simple liveness probe - just checks if the app is running
    return this.health.check([]);
  }

  @Get("readiness")
  @Public()
  @HealthCheck()
  checkReadiness() {
    // Readiness probe - checks if the app is ready to accept traffic
    return this.health.check([() => this.db.pingCheck("database")]);
  }
}
