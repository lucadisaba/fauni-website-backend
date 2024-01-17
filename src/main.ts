import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  const serviceAccount = require('../fauniweb-0120bf8912e4.json');
  initializeApp({
    credential: cert(serviceAccount),
  });
  const db = getFirestore();
}
bootstrap();
