import { ReflectionService } from '@grpc/reflection';
import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const MICROSERVICE_HERO_NAME = 'HERO_PACKAGE' as string;

export const grpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    url: '127.0.0.1:50051',
    package: 'hero', // ['hero', 'hero2']
    protoPath: join(__dirname, './proto/*.proto'), // ['./hero/hero.proto', './hero/hero2.proto']
    onLoadPackageDefinition: (pkg, server) => {
      new ReflectionService(pkg).addToServer(server);
    },
  },
};