"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const nestjs_telegraf_1 = require("nestjs-telegraf");
const bot_module_1 = require("./bot/bot.module");
const typeorm_1 = require("@nestjs/typeorm");
const song_entity_1 = require("./bot/entity/song.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bot_module_1.BotModule,
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: '127.0.0.1',
                port: 5432,
                database: 'gold_shazam',
                username: 'postgres',
                password: '123456',
                synchronize: true,
                entities: [song_entity_1.Song],
            }),
            nestjs_telegraf_1.TelegrafModule.forRoot({
                token: '7860537454:AAEcIGPq43x6vwlWYEC1q6SCuPE2bEyL-7A',
            }),
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map