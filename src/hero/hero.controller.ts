import { Controller, Get, Inject, OnModuleInit, Param } from '@nestjs/common';
import {
  ClientGrpc,
  GrpcMethod,
  GrpcStreamMethod,
} from '@nestjs/microservices';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { HeroById } from './interfaces/hero-by-id.interface';
import { Hero } from './interfaces/hero.interface';
import { HelloRequest } from './interfaces/hello-request.interface';
import { HelloResponse } from './interfaces/hello-response.interface';
import { Metadata, ServerDuplexStream } from '@grpc/grpc-js';

interface HeroesService {
  findOne(data: HeroById): Observable<Hero>;
  findMany(upstream: Observable<HeroById>): Observable<Hero>;
  bidiHello(upstream: Observable<HelloRequest>): Observable<HelloResponse>;
  lotsOfGreetings(
    upstream: Observable<HelloRequest>,
  ): Observable<HelloResponse>;
}

@Controller('hero')
export class HeroController implements OnModuleInit {
  private readonly items: Hero[] = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Doe' },
  ];
  private heroesService: HeroesService;

  constructor(@Inject('HERO_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.heroesService = this.client.getService<HeroesService>('HeroesService');
  }

  @Get()
  getMany(): Observable<Hero[]> {
    const ids$ = new ReplaySubject<HeroById>();
    ids$.next({ id: 1 });
    ids$.next({ id: 2 });
    ids$.complete();

    const stream = this.heroesService.findMany(ids$.asObservable());
    return stream.pipe(toArray());
  }

  @Get(':id')
  getById(@Param('id') id: string): Observable<Hero> {
    return this.heroesService.findOne({ id: +id });
  }

  @GrpcMethod('HeroesService')
  findOne(data: HeroById): Hero {
    return this.items.find(({ id }) => id === data.id);
  }

  @GrpcStreamMethod('HeroesService')
  findMany(data$: Observable<HeroById>): Observable<Hero> {
    const hero$ = new Subject<Hero>();

    const onNext = (heroById: HeroById) => {
      const item = this.items.find(({ id }) => id === heroById.id);
      hero$.next(item);
    };
    const onComplete = () => hero$.complete();
    data$.subscribe({
      next: onNext,
      complete: onComplete,
    });

    return hero$.asObservable();
  }

  // @GrpcStreamMethod()
  // bidiHello(
  //   messages: Observable<any>,
  //   metadata: Metadata,
  //   call: ServerDuplexStream<any, any>,
  // ): Observable<any> {
  //   const subject = new Subject();

  //   const onNext = (message) => {
  //     console.log(message);
  //     subject.next({
  //       reply: 'Hello, world!',
  //     });
  //   };
  //   const onComplete = () => subject.complete();
  //   messages.subscribe({
  //     next: onNext,
  //     complete: onComplete,
  //   });

  //   return subject.asObservable();
  // }
}
