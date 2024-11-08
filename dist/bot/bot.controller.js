'use strict';
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
            ? (desc = Object.getOwnPropertyDescriptor(target, key))
            : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function')
      return Reflect.metadata(k, v);
  };
var __param =
  (this && this.__param) ||
  function (paramIndex, decorator) {
    return function (target, key) {
      decorator(target, key, paramIndex);
    };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.BotUpdate = void 0;
const bot_service_1 = require('./bot.service');
const nestjs_telegraf_1 = require('nestjs-telegraf');
const telegraf_1 = require('telegraf');
const userItemsMap = new Map();
let BotUpdate = class BotUpdate {
  constructor(bot, botService) {
    this.bot = bot;
    this.botService = botService;
    this.musicListPage = 1;
  }
  async startBot(ctx) {
    await ctx.reply('Salom, \nQanaqa musiqa eshitishni xoxlaysiz 🔎');
  }
  async handleText(ctx, page = 1) {
    if (ctx.message.text) {
      const userInput = ctx.message.text;
      const userId = String(ctx.from.id);
      const result = await this.botService.fetchApi(userInput, page);
      if (result && result !== 'false') {
        const items = result
          ? result
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
              .filter(Boolean)
          : [];
        const music_btn = [];
        const buttonsPerRow = 5;
        for (let index = 0; index < items.length; index += buttonsPerRow) {
          const rowButtons = items
            .slice(index, index + buttonsPerRow)
            .map((item) =>
              telegraf_1.Markup.button.callback(item.id, `action_${item.id}`),
            );
          music_btn.push(rowButtons);
        }
        if (items.length == 20) {
          music_btn.push([
            telegraf_1.Markup.button.callback(
              '⬅️',
              `page_${this.musicListPage - 1}`,
            ),
            telegraf_1.Markup.button.callback(
              '➡️',
              `page_${this.musicListPage + 1}`,
            ),
          ]);
        }
        const reqMusicList = items
          .map((item) => `${item.id}. ${item.artist} - ${item.title}`)
          .join('\n');
        userItemsMap.set(userId, items);
        ctx.reply(
          `Quyidagilardan birini tanlang:👇\n${reqMusicList}`,
          telegraf_1.Markup.inlineKeyboard(music_btn),
        );
      } else {
        ctx.reply('<i>Afsuski, hech narsa topilmadi.😕</i>', {
          parse_mode: 'HTML',
        });
        return;
      }
    }
  }
  async musicAction(ctx) {
    const actionId = ctx.match[1];
    const userId = String(ctx.from.id);
    const items = userItemsMap.get(userId);
    if (!items)
      return ctx.reply(
        `Xato malumot botni qayta yurgazish uchun /start buyrugini bering😊.`,
      );
    const selectedMusic = items.find((item) => item.id === actionId);
    if (!selectedMusic)
      return ctx.reply(
        `Siz tanlagan musiqa topilmadi!. Botni qayta yurgazish uchun /start buyrugini bering😊.`,
      );
    ctx.replyWithAudio(selectedMusic.url, {
      caption: `Siz izlagan musiqa http://t.me/gold_shazam_bot`,
    });
  }
  async pageAction(ctx) {
    const actionId = ctx.match[1];
    const userId = String(ctx.from.id);
    if (actionId == 0) {
      const message = await ctx.reply("Bu tugmani hozir bosib bo'lmaydi.");
      setTimeout(() => {
        ctx
          .deleteMessage(message.message_id)
          .catch((error) => console.log("Xabarni o'chirishda xato:", error));
      }, 6500);
      return;
    }
  }
};
exports.BotUpdate = BotUpdate;
__decorate(
  [
    (0, nestjs_telegraf_1.Start)(),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [telegraf_1.Context]),
    __metadata('design:returntype', Promise),
  ],
  BotUpdate.prototype,
  'startBot',
  null,
);
__decorate(
  [
    (0, nestjs_telegraf_1.On)('text'),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object, Number]),
    __metadata('design:returntype', Promise),
  ],
  BotUpdate.prototype,
  'handleText',
  null,
);
__decorate(
  [
    (0, nestjs_telegraf_1.Action)(/^action_(\d+)$/),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', Promise),
  ],
  BotUpdate.prototype,
  'musicAction',
  null,
);
__decorate(
  [
    (0, nestjs_telegraf_1.Action)(/^page_(\d+)$/),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', Promise),
  ],
  BotUpdate.prototype,
  'pageAction',
  null,
);
exports.BotUpdate = BotUpdate = __decorate(
  [
    (0, nestjs_telegraf_1.Update)(),
    __param(0, (0, nestjs_telegraf_1.InjectBot)()),
    __metadata('design:paramtypes', [
      telegraf_1.Telegraf,
      bot_service_1.BotService,
    ]),
  ],
  BotUpdate,
);
//# sourceMappingURL=bot.controller.js.map
