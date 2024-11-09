import { Repository } from 'typeorm';
import { Song } from './entity/song.entity';
export declare class BotService {
    private songRepository;
    constructor(songRepository: Repository<Song>);
    fetchApi(text: string, page?: number): Promise<string>;
    retunInfo(userInput: string, page: number): Promise<{
        id: string;
        artist: string;
        title: string;
        url: string;
    }[]>;
    pushButton(items: {
        id: number;
        artist: string;
        title: string;
        url: string;
    }[], musicListPage: number): Promise<[string, any[]]>;
}
