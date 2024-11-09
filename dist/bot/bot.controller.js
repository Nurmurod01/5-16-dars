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
exports.BotUpdate = void 0;
const bot_service_1 = require("./bot.service");
const nestjs_telegraf_1 = require("nestjs-telegraf");
const telegraf_1 = require("telegraf");
const logger_service_1 = require("../logger/logger.service");
const userItemsMap = new Map();
let BotUpdate = class BotUpdate {
    constructor(bot, botService) {
        this.bot = bot;
        this.botService = botService;
        this.musicListPage = 1;
        this.errLogGroupID = -4513464624;
        this.unfind = `Afsuski, hech narsa topilmadi.😕`;
        this.errMsg = `Xato malumot botni qayta yurgazish uchun /start buyrugini bering😊.`;
        this.helloMsg = `Salom, \nQanaqa musiqa eshitishni xoxlaysiz 🔎`;
        this.logger = new logger_service_1.MyCustomLoggerService();
    }
    async startBot(ctx) {
        this.bot.telegram.setMyCommands([
            { command: 'start', description: 'Botni boshlash' },
        ]);
        try {
            await ctx.reply(this.helloMsg);
        }
        catch (error) {
            await ctx.telegram.sendMessage(this.errLogGroupID, `Error in handleText method: ${error}`);
            ctx.reply('Xatolik yuz berdi. Iltimos, qaytadan urining.');
        }
    }
    async handleText(ctx, page = 1) {
        try {
            if (ctx.message.text) {
                const userInput = ctx.message.text;
                const userId = String(ctx.from.id);
                this.items = await this.botService.retunInfo(userInput, page);
                if (!this.items ||
                    !Array.isArray(this.items) ||
                    this.items.length === 0) {
                    await ctx.reply(`<i>${this.unfind}</i>`, {
                        parse_mode: 'HTML',
                    });
                    return;
                }
                userItemsMap.set(userId, this.items);
                const listpage = this.musicListPage;
                const item = this.items;
                const [list, btn] = await this.botService.pushButton(item, listpage);
                await ctx.reply(`Quyidagilardan birini tanlang:👇\n${list}`, telegraf_1.Markup.inlineKeyboard(btn));
            }
            else {
                await ctx.reply('<i>Afsuski, hech narsa topilmadi.😕</i>', {
                    parse_mode: 'HTML',
                });
            }
        }
        catch (error) {
            await ctx.telegram.sendMessage(this.errLogGroupID, `Error in handleText method: ${error}`);
            await ctx.reply(this.errMsg);
        }
    }
    async musicAction(ctx) {
        try {
            const actionId = ctx.match[1];
            const userId = String(ctx.from.id);
            const poweredBy = `@gold_shazam_bot orqali olindi`;
            const items = userItemsMap.get(userId);
            if (!items)
                return ctx.reply(this.errMsg);
            const selectedMusic = items.find((item) => item.id === actionId);
            if (!selectedMusic)
                return ctx.reply(this.errMsg);
            ctx.replyWithAudio(selectedMusic.url, {
                caption: poweredBy,
            });
            this.logger.log(`Music sent to user ${userId}: ${selectedMusic.artist} - ${selectedMusic.title}`);
        }
        catch (error) {
            this.logger.error('Error in musicAction method:', error.stack);
            ctx.reply('Xatolik yuz berdi. Iltimos, qaytadan urining.');
        }
    }
    async pageAction(ctx) {
        try {
            const actionId = ctx.match[1];
            const userId = String(ctx.from.id);
            if (actionId == 0) {
                const backbtn0 = "Bu tugmani hozir bosib bo'lmaydi.";
                const message = await ctx.reply(backbtn0);
                setTimeout(() => {
                    ctx
                        .deleteMessage(message.message_id)
                        .catch(async (error) => await ctx.telegram.sendMessage(this.errLogGroupID, `Error in handleText method: ${error}`));
                }, 6500);
                this.logger.log(`Page action ${actionId} invalid for user ${userId}`);
                return;
            }
        }
        catch (error) {
            await ctx.telegram.sendMessage(this.errLogGroupID, `Error in handleText method: ${error}`);
            ctx.reply('Xatolik yuz berdi. Iltimos, qaytadan urining.');
        }
    }
};
exports.BotUpdate = BotUpdate;
__decorate([
    (0, nestjs_telegraf_1.Start)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "startBot", null);
__decorate([
    (0, nestjs_telegraf_1.On)('text'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "handleText", null);
__decorate([
    (0, nestjs_telegraf_1.Action)(/^action_(\d+)$/),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "musicAction", null);
__decorate([
    (0, nestjs_telegraf_1.Action)(/^page_(\d+)$/),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "pageAction", null);
exports.BotUpdate = BotUpdate = __decorate([
    (0, nestjs_telegraf_1.Update)(),
    __param(0, (0, nestjs_telegraf_1.InjectBot)()),
    __metadata("design:paramtypes", [telegraf_1.Telegraf,
        bot_service_1.BotService])
], BotUpdate);
//# sourceMappingURL=bot.controller.js.map