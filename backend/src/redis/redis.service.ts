import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  constructor() {
    super(
      process.env.CARE247_REDIS_URL ||
        process.env.REDIS_URL ||
        'redis://127.0.0.1:6379',
    );
  }

  async onModuleDestroy() {
    await this.quit();
  }
}
