import { Observable } from 'rxjs';
import { HelloRequest } from './hello-request.interface';
import { HelloResponse } from './hello-response.interface';
import { HeroById } from './hero-by-id.interface';
import { Hero } from './hero.interface';

export interface HeroesService {
  findOne(data: HeroById): Observable<Hero>;
  findMany(upstream: Observable<HeroById>): Observable<Hero>;
  bidiHello(upstream: Observable<HelloRequest>): Observable<HelloResponse>;
  lotsOfGreetings(
    upstream: Observable<HelloRequest>,
  ): Observable<HelloResponse>;
}
