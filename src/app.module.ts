import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotModule } from './bot/bot.module';
import * as LocalSession from 'telegraf-session-local';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './bot/entity/song.entity';

@Module({
  imports: [
    BotModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      database: 'gold_shazam',
      username: 'postgres',
      password: '123456',
      synchronize: true,
      entities: [Song],
    }),
    TelegrafModule.forRoot({
      token: '7860537454:AAEcIGPq43x6vwlWYEC1q6SCuPE2bEyL-7A',
    }),
  ],
})
export class AppModule {}
