import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotUpdate } from './bot.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './entity/song.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Song])],
  providers: [BotService, BotUpdate],
})
export class BotModule {}
