import { Repository } from 'typeorm';
import { Song } from './entity/song.entity';
export declare class BotService {
    private songRepository;
    constructor(songRepository: Repository<Song>);
    fetchApi(text: string, page?: number): Promise<string>;
}
