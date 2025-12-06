import {
  makeCounterProvider,
  makeHistogramProvider,
  makeGaugeProvider,
  makeSummaryProvider,
} from "@willsoto/nestjs-prometheus";
import { Provider } from "@nestjs/common";

export const httpMetricsProviders: Provider[] = [
  makeCounterProvider({
    name: "http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: ["method", "path", "status"],
  }),
  makeHistogramProvider({
    name: "http_request_duration_seconds",
    help: "HTTP request duration in seconds",
    labelNames: ["method", "path", "status"],
    buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  }),
  makeSummaryProvider({
    name: "http_request_size_bytes",
    help: "HTTP request size in bytes",
    labelNames: ["method", "path", "status"],
    percentiles: [0.5, 0.9, 0.99],
  }),
  makeSummaryProvider({
    name: "http_response_size_bytes",
    help: "HTTP response size in bytes",
    labelNames: ["method", "path", "status"],
    percentiles: [0.5, 0.9, 0.99],
  }),
];

export const processMetricsProviders: Provider[] = [
  makeGaugeProvider({
    name: "process_cpu_user_seconds_total",
    help: "Total user CPU time spent in seconds",
  }),
  makeGaugeProvider({
    name: "process_cpu_system_seconds_total",
    help: "Total system CPU time spent in seconds",
  }),
  makeGaugeProvider({
    name: "process_resident_memory_bytes",
    help: "Resident memory size in bytes",
  }),
];

export const nodejsMetricsProviders: Provider[] = [
  makeGaugeProvider({
    name: "nodejs_eventloop_lag_seconds",
    help: "Lag of event loop in seconds",
  }),
  makeHistogramProvider({
    name: "nodejs_gc_duration_seconds",
    help: "Garbage collection duration by kind",
    labelNames: ["kind"],
    buckets: [0.001, 0.01, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  }),
];

export const databaseMetricsProviders: Provider[] = [
  makeHistogramProvider({
    name: "db_query_duration_seconds",
    help: "Database query duration in seconds",
    labelNames: ["operation", "collection"],
    buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
  }),
  makeCounterProvider({
    name: "db_queries_total",
    help: "Total number of database queries",
    labelNames: ["operation", "collection", "status"],
  }),
  makeGaugeProvider({
    name: "active_db_connections",
    help: "Number of active database connections",
  }),
];

export const allMetricsProviders: Provider[] = [
  ...httpMetricsProviders,
  ...processMetricsProviders,
  ...nodejsMetricsProviders,
  ...databaseMetricsProviders,
];
