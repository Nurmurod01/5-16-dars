import { BotService } from './bot.service';
import { Context, Telegraf } from 'telegraf';
export declare class BotUpdate {
    private readonly bot;
    private readonly botService;
    musicListPage: number;
    constructor(bot: Telegraf<Context>, botService: BotService);
    startBot(ctx: Context): Promise<void>;
    handleText(ctx: any, page?: number): Promise<void>;
    musicAction(ctx: any): Promise<any>;
    pageAction(ctx: any): Promise<void>;
}
