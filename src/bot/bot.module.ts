import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotUpdate } from './bot.controller';
import { TelegrafModule } from 'nestjs-telegraf';
import LocalSession from 'telegraf-session-local';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './entity/song.entity';

// const sessions = new LocalSession({ database: 'session.db.json' });
@Module({
  imports: [TypeOrmModule.forFeature([Song])],
  providers: [BotService, BotUpdate],
})
export class BotModule {}
