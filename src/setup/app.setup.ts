import { INestApplication } from '@nestjs/common';
import { setupGlobalPipes } from './pipes.setup';
import { setupGlobalPrefix } from './global-prefix.setup';
import { setupSwagger } from './swagger.setup';
export function setupApp(app: INestApplication) {
  setupGlobalPipes(app);
  setupGlobalPrefix(app);
  setupSwagger(app);
}
