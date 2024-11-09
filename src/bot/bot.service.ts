import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Song } from './entity/song.entity';
import { Markup } from 'telegraf';

@Injectable()
export class BotService {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
  ) {}

  async fetchApi(text: string, page: number = 1): Promise<string> {
    const songsInDb = await this.songRepository.find({
      where: [
        { text: Like(`%${text}%`) },
        { artist: Like(`%${text}%`) },
        { title: Like(`%${text}%`) },
      ],
    });

    if (songsInDb.length > 0) {
      return songsInDb
        .map(
          (song) =>
            `${song.id} 123., ${song.artist} 123., ${song.title} 123., ${song.url} \n\n`,
        )
        .join('');
    }

    const url = `https://api.alijonov.uz/api/music.php?text=${encodeURIComponent(
      text,
    )}&page=${page}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data: {
        success: boolean;
        songs: { id: number; url: string; artist: string; title: string }[];
      } = await response.json();

      if (data.success !== false) {
        const artists: string[] = [];

        for (const song of data.songs) {
          artists.push(
            `${song.id} 123., ${song.artist} 123., ${song.title} 123., ${song.url} \n\n`,
          );

          const songEntity = this.songRepository.create({
            text,
            id: song.id,
            artist: song.artist,
            title: song.title,
            url: song.url,
          });
          await this.songRepository.save(songEntity);
        }

        const artistsString = artists.join('');
        return artistsString;
      }

      return 'false';
    } catch (error) {
      console.error('Fetch error:', error);
      return undefined;
    }
  }

  async retunInfo(userInput: string, page: number) {
    try {
      const result = await this.fetchApi(userInput, page);

      if (!result || result === 'false') {
        return [];
      }

      const items = result
        .split(' \n\n')
        .map((item) => {
          if (!item) return;

          const [id, artist, title, url] = item.split(' 123., ');

          return {
            id: id,
            artist: artist,
            title: title,
            url: url,
          };
        })
        .filter(Boolean);

      return items;
    } catch (error) {
      console.error('Error in retunInfo method:', error);
      return [];
    }
  }

  async pushButton(
    items: { id: number; artist: string; title: string; url: string }[],
    musicListPage: number,
  ): Promise<[string, any[]]> {
    const music_btn = [];
    const buttonsPerRow = 5;

    for (let index = 0; index < items.length; index += buttonsPerRow) {
      const rowButtons = items
        .slice(index, index + buttonsPerRow)
        .map((item) => Markup.button.callback(`${item.id}`, `action_${item.id}`));

      music_btn.push(rowButtons);
    }

    if (items.length == 20) {
      music_btn.push([
        Markup.button.callback('⬅️', `page_${musicListPage - 1}`),
        Markup.button.callback('➡️', `page_${musicListPage + 1}`),
      ]);
    }

    const reqMusicList = items
      .map((item) => `${item.id}. ${item.artist} - ${item.title}`)
      .join('\n');

    return [reqMusicList, music_btn];
  }
}
