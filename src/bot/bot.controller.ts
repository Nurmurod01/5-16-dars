import { BotService } from './bot.service';
import { InjectBot, Start, Update, On, Action } from 'nestjs-telegraf';
import { Context, Markup, Telegraf } from 'telegraf';

interface Item {
  id: string;
  url: string;
  artist: string;
  title: string;
}

const userItemsMap = new Map<string, Item[]>();

@Update()
export class BotUpdate {
  musicListPage = 1;
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly botService: BotService,
  ) {}

  @Start()
  async startBot(ctx: Context) {
    await ctx.reply('Salom, \nQanaqa musiqa eshitishni xoxlaysiz 🔎');
  }

  @On('text')
  async handleText(ctx: any, page: number = 1) {
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
              Markup.button.callback(item.id, `action_${item.id}`),
            );

          music_btn.push(rowButtons);
        }

        if (items.length == 20) {
          music_btn.push([
            Markup.button.callback('⬅️', `page_${this.musicListPage - 1}`),
            Markup.button.callback('➡️', `page_${this.musicListPage + 1}`),
          ]);
        }

        const reqMusicList = items
          .map((item) => `${item.id}. ${item.artist} - ${item.title}`)
          .join('\n');

        userItemsMap.set(userId, items);

        ctx.reply(
          `Quyidagilardan birini tanlang:👇\n${reqMusicList}`,
          Markup.inlineKeyboard(music_btn),
        );
      } else {
        ctx.reply('<i>Afsuski, hech narsa topilmadi.😕</i>', {
          parse_mode: 'HTML',
        });
        return;
      }
    }
  }

  @Action(/^action_(\d+)$/)
  async musicAction(ctx: any) {
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

  @Action(/^page_(\d+)$/)
  async pageAction(ctx: any) {
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
}
