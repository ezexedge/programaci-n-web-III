import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';

// Configurar logging de diagnóstico
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

// Función para crear exportador de Jaeger con manejo de errores
function createJaegerExporter() {
  try {
    return new JaegerExporter({
      endpoint: process.env.JAEGER_ENDPOINT || 'http://jaeger-service:14268/api/traces',
      serviceName: process.env.SERVICE_NAME || 'tasks-service'
    });
  } catch (error) {
    console.error('Error creating Jaeger exporter:', error);
    return null;
  }
}

// Configurar recursos
const resource = new Resource({
  [SemanticResourceAttributes.SERVICE_NAME]: process.env.SERVICE_NAME || 'tasks-service',
  [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
  'deployment.environment': process.env.NODE_ENV || 'development'
});

// Crear SDK de OpenTelemetry
const sdk = new NodeSDK({
  resource,
  // Usar un exportador nulo si no se puede conectar
  traceExporter: createJaegerExporter() || {
    export: () => Promise.resolve(),
    shutdown: () => Promise.resolve()
  },
  instrumentations: [
    getNodeAutoInstrumentations({
      // Configuraciones para evitar cargar módulos antes de instrumentación
      '@opentelemetry/instrumentation-express': {
        enabled: true,
        // Asegurar que la instrumentación se aplique antes de cargar express
        requireParentSpan: true
      },
      '@opentelemetry/instrumentation-mongoose': {
        enabled: true,
        // Configuraciones para evitar problemas de carga
        requireParentSpan: true
      },
      '@opentelemetry/instrumentation-http': {
        requestHook: (span, request) => {
          span.setAttribute('http.request.body', JSON.stringify(request.body || {}));
        }
      }
    })
  ]
});

// Configuración de instrumentación temprana
function setupEarlyInstrumentation() {
  const { registerInstrumentations } = require('@opentelemetry/instrumentation');
  const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');
  const { MongooseInstrumentation } = require('@opentelemetry/instrumentation-mongoose');

  registerInstrumentations({
    instrumentations: [
      new ExpressInstrumentation({
        enabled: true,
        requireParentSpan: true
      }),
      new MongooseInstrumentation({
        enabled: true,
        requireParentSpan: true
      })
    ]
  });
}

// Función para iniciar tracing
async function initTracing() {
  try {
    // Configuración temprana de instrumentación
    setupEarlyInstrumentation();

    // Iniciar SDK
    await sdk.start();
    console.log(`Tracing initialized for ${process.env.SERVICE_NAME || 'tasks-service'}`);

    // Manejar cierre graciado
    const gracefulShutdown = async () => {
      try {
        await sdk.shutdown();
        console.log('Tracing SDK shut down gracefully');
        process.exit(0);
      } catch (error) {
        console.error('Error shutting down tracing SDK', error);
        process.exit(1);
      }
    };

    // Escuchar señales de terminación
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

  } catch (error) {
    console.error('Error initializing tracing:', error);
    process.exit(1);
  }
}
