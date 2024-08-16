import { Module } from '@nestjs/common';
import { HeroModule } from './hero/hero.module';
import { TestModule } from './modules/test/test.module';
import { MicroserviceModule } from './modules/microservice/microservice.module';

@Module({
  imports: [HeroModule, TestModule, MicroserviceModule],
})
export class AppModule {}