// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   app.setGlobalPrefix('api'); // ← Ajoute cette ligne
  app.enableCors(); // ← Ajoute cette ligne

  // ✅ Middleware pour répondre aux requêtes OPTIONS avec les bons en-têtes CORS
  app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
      return res.sendStatus(200);
    }
    next();
  });

  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });

  await app.listen(process.env.PORT || 3000);
  console.log(`✅ Backend démarré sur http://localhost:${process.env.PORT || 3000}`);
}
bootstrap();