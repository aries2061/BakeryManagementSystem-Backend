import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { configureApplication } from '../src/app-bootstrap';

type RequestLike = unknown;
type ResponseLike = unknown;
type HttpHandler = (req: RequestLike, res: ResponseLike) => unknown;

let cachedHandler: HttpHandler | null = null;

async function getHandler(): Promise<HttpHandler> {
  if (cachedHandler) {
    return cachedHandler;
  }

  const app = await NestFactory.create(AppModule);
  configureApplication(app);
  await app.init();

  const adapter = app.getHttpAdapter();
  const instance = adapter.getInstance() as HttpHandler;
  cachedHandler = instance;

  return cachedHandler;
}

export default async function handler(req: RequestLike, res: ResponseLike) {
  const appHandler = await getHandler();
  return appHandler(req, res);
}
