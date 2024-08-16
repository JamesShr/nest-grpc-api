import { Injectable } from '@nestjs/common';
import { GrpcService as HeroGrpcService } from '@/modules/microservice/hero/grpc/grpc.service';
import { HeroById } from '@/hero/interfaces/hero-by-id.interface';
import { Observable, ReplaySubject } from 'rxjs';
import { Hero } from '../microservice/hero/interfaces/hero.interface';

@Injectable()
export class TestService {
  constructor(private readonly heroGrpcService: HeroGrpcService) {}

  heroGetMany(ids: ReplaySubject<HeroById>) {
    return this.heroGrpcService.findMany(ids);
  }

  heroGetById(data: HeroById): Observable<Hero> {
    return this.heroGrpcService.findOne(data);
  }
}
