import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { HeroesService } from '../interfaces/heroService.interface';
import { ClientGrpc } from '@nestjs/microservices';
import { MICROSERVICE_HERO_NAME } from '@/config';
import { Observable, ReplaySubject, toArray } from 'rxjs';
import { HeroById } from '../interfaces/hero-by-id.interface';
import { Hero } from '../interfaces/hero.interface';

@Injectable()
export class GrpcService implements OnModuleInit {
  private heroesService: HeroesService;
  constructor(
    @Inject(MICROSERVICE_HERO_NAME) private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.heroesService = this.client.getService<HeroesService>('HeroesService');
  }

  findMany(ids: ReplaySubject<HeroById>): Observable<Hero[]> {
    const stream = this.heroesService.findMany(ids.asObservable());
    return stream.pipe(toArray());
  }

  findOne(data: HeroById): Observable<Hero> {
    return this.heroesService.findOne({ id: +data.id });
  }
}
