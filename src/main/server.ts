import { buildApp } from './config/app';

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

async function bootstrap(): Promise<void> {
  const app = buildApp();

  try {
    await app.listen({ port: PORT, host: HOST });
    console.log(`\n🚀 MTG Manager API is running on http://localhost:${PORT}`);
    console.log(
      `📚 Swagger OpenAPI documentation available at http://localhost:${PORT}/api/docs\n`,
    );
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

bootstrap();
