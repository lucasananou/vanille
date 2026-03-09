import { Module, Global } from '@nestjs/common';
import { MailService } from './mail.service';
import { StoreCommunicationsController } from './mail.controller';

@Global()
@Module({
    controllers: [StoreCommunicationsController],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule { }
