import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Schemas } from './data/schemas';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest'),
    MongooseModule.forFeature(Schemas),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
