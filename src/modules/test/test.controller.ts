import { Controller, Get, Param } from '@nestjs/common';
import { Observable, ReplaySubject } from 'rxjs';
import { Hero } from '../microservice/hero/interfaces/hero.interface';
import { HeroById } from '../microservice/hero/interfaces/hero-by-id.interface';
import { TestService } from './test.service';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Get('hero')
  heroGetMany(): Observable<Hero[]> {
    const ids$ = new ReplaySubject<HeroById>();
    ids$.next({ id: 1 });
    ids$.next({ id: 2 });
    ids$.complete();
    return this.testService.heroGetMany(ids$);
  }

  @Get('hero/:id')
  heroGetById(@Param('id') id: string): Observable<Hero> {
    return this.testService.heroGetById({ id: +id });
  }
}
