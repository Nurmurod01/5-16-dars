"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const song_entity_1 = require("./entity/song.entity");
let BotService = class BotService {
    constructor(songRepository) {
        this.songRepository = songRepository;
    }
    async fetchApi(text, page = 1) {
        const songsInDb = await this.songRepository.find({
            where: [
                { text: (0, typeorm_2.Like)(`%${text}%`) },
                { artist: (0, typeorm_2.Like)(`%${text}%`) },
                { title: (0, typeorm_2.Like)(`%${text}%`) },
            ],
        });
        if (songsInDb.length > 0) {
            return songsInDb
                .map((song) => `${song.id} 123., ${song.artist} 123., ${song.title} 123., ${song.url} \n\n`)
                .join('');
        }
        const url = `https://api.alijonov.uz/api/music.php?text=${encodeURIComponent(text)}&page=${page}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            if (data.success !== false) {
                const artists = [];
                for (const song of data.songs) {
                    artists.push(`${song.id} 123., ${song.artist} 123., ${song.title} 123., ${song.url} \n\n`);
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
        }
        catch (error) {
            console.error('Fetch error:', error);
            return undefined;
        }
    }
};
exports.BotService = BotService;
exports.BotService = BotService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(song_entity_1.Song)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BotService);
//# sourceMappingURL=bot.service.js.map