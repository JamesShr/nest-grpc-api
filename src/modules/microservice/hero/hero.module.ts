import { Module } from '@nestjs/common';
import { GrpcService } from './grpc/grpc.service';
import { ClientsModule } from '@nestjs/microservices';
import { grpcClientOptions, MICROSERVICE_HERO_NAME } from '@/config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MICROSERVICE_HERO_NAME,
        ...grpcClientOptions,
      },
    ]),
  ],
  providers: [GrpcService],
})
export class HeroModule {}
