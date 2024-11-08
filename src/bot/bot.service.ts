import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Song } from './entity/song.entity';

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
          // console.log('bazaga yozildi');
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
  
}
