import { BotService } from './bot.service';
import { InjectBot, Start, Update, On, Action } from 'nestjs-telegraf';
import { Context, Markup, Telegraf } from 'telegraf';
import { MyCustomLoggerService } from '../logger/logger.service'; // Import the custom logger

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
  items;
  errLogGroupID = -4513464624;
  unfind = `Afsuski, hech narsa topilmadi.😕`;
  errMsg = `Xato malumot botni qayta yurgazish uchun /start buyrugini bering😊.`;
  helloMsg = `Salom, \nQanaqa musiqa eshitishni xoxlaysiz 🔎`;
  private readonly logger = new MyCustomLoggerService();

  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly botService: BotService,
  ) {}

  @Start()
  async startBot(ctx: Context) {
    this.bot.telegram.setMyCommands([
      { command: 'start', description: 'Botni boshlash' },
    ]);
    try {
      await ctx.reply(this.helloMsg);
    } catch (error) {
      await ctx.telegram.sendMessage(
        this.errLogGroupID,
        `Error in handleText method: ${error}`,
      );

      ctx.reply('Xatolik yuz berdi. Iltimos, qaytadan urining.');
    }
  }

  @On('text')
  async handleText(ctx: any, page: number = 1) {
    try {
      if (ctx.message.text) {
        const userInput = ctx.message.text;
        const userId = String(ctx.from.id);
        // Fetch items
        this.items = await this.botService.retunInfo(userInput, page);
        if (
          !this.items ||
          !Array.isArray(this.items) ||
          this.items.length === 0
        ) {
          await ctx.reply(`<i>${this.unfind}</i>`, {
            parse_mode: 'HTML',
          });
          return;
        }

        userItemsMap.set(userId, this.items);
        const listpage = this.musicListPage;
        const item = this.items;

        const [list, btn]: any = await this.botService.pushButton(
          item,
          listpage,
        );

        await ctx.reply(
          `Quyidagilardan birini tanlang:👇\n${list}`,
          Markup.inlineKeyboard(btn),
        );
      } else {
        await ctx.reply('<i>Afsuski, hech narsa topilmadi.😕</i>', {
          parse_mode: 'HTML',
        });
      }
    } catch (error) {
      await ctx.telegram.sendMessage(
        this.errLogGroupID,
        `Error in handleText method: ${error}`,
      );
      await ctx.reply(this.errMsg);
    }
  }

  @Action(/^action_(\d+)$/)
  async musicAction(ctx: any) {
    try {
      const actionId = ctx.match[1];
      const userId = String(ctx.from.id);
      const poweredBy = `@gold_shazam_bot orqali olindi`;

      const items = userItemsMap.get(userId);
      if (!items) return ctx.reply(this.errMsg);

      const selectedMusic = items.find((item) => item.id === actionId);
      if (!selectedMusic) return ctx.reply(this.errMsg);

      ctx.replyWithAudio(selectedMusic.url, {
        caption: poweredBy,
      });
      this.logger.log(
        `Music sent to user ${userId}: ${selectedMusic.artist} - ${selectedMusic.title}`,
      );
    } catch (error) {
      this.logger.error('Error in musicAction method:', error.stack);
      ctx.reply('Xatolik yuz berdi. Iltimos, qaytadan urining.');
    }
  }

  @Action(/^page_(\d+)$/)
  async pageAction(ctx: any) {
    try {
      const actionId = ctx.match[1];
      const userId = String(ctx.from.id);

      if (actionId == 0) {
        const backbtn0 = "Bu tugmani hozir bosib bo'lmaydi.";
        const message = await ctx.reply(backbtn0);

        setTimeout(() => {
          ctx
            .deleteMessage(message.message_id)
            .catch(
              async (error) =>
                await ctx.telegram.sendMessage(
                  this.errLogGroupID,
                  `Error in handleText method: ${error}`,
                ),
            );
        }, 6500);
        this.logger.log(`Page action ${actionId} invalid for user ${userId}`);
        return;
      }
    } catch (error) {
      await ctx.telegram.sendMessage(
        this.errLogGroupID,
        `Error in handleText method: ${error}`,
      );
      ctx.reply('Xatolik yuz berdi. Iltimos, qaytadan urining.');
    }
  }
}
