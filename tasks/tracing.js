import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { JaegerExporter } from "@opentelemetry/exporter-jaeger";
import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

const jaegerExporter = new JaegerExporter({
  endpoint: "http://localhost:14268/api/traces",
});

const resource = new Resource({
  [SemanticResourceAttributes.SERVICE_NAME]: "mi-monolito", 
  [SemanticResourceAttributes.SERVICE_VERSION]: "1.0.0",
  "deployment.environment": "development",
});

const sdk = new NodeSDK({
  traceExporter: jaegerExporter,
  instrumentations: [getNodeAutoInstrumentations()],
  resource,
});

async function initTracing() {
  try {
    await sdk.start();
    console.log("opentelemetry inicio");
  } catch (error) {
    console.error("error al iniciar", error);
  }
}

initTracing();

process.on("SIGTERM", () => {
  sdk
    .shutdown()
    .then(() => console.log("fin"))
    .catch((error) => console.error("Error terminating tracing", error))
    .finally(() => process.exit(0));
});
