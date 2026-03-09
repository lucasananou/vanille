import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MailService } from './mail.service';
import { B2BLeadDto, ContactMessageDto, NewsletterSubscriptionDto } from './dto/public-mail.dto';

@ApiTags('Store - Communications')
@Controller('store/communications')
export class StoreCommunicationsController {
  constructor(private readonly mailService: MailService) {}

  @Post('contact')
  @ApiOperation({ summary: 'Send contact form message' })
  async sendContactMessage(@Body() dto: ContactMessageDto) {
    await this.mailService.sendContactMessage(dto);
    return { message: 'Message envoyé avec succès.' };
  }

  @Post('b2b')
  @ApiOperation({ summary: 'Send B2B lead request' })
  async sendB2BLead(@Body() dto: B2BLeadDto) {
    await this.mailService.sendB2BLead(dto);
    return { message: 'Demande B2B envoyée avec succès.' };
  }

  @Post('newsletter')
  @ApiOperation({ summary: 'Subscribe to newsletter' })
  async subscribeNewsletter(@Body() dto: NewsletterSubscriptionDto) {
    await this.mailService.sendNewsletterSubscription(dto.email);
    return { message: 'Inscription newsletter confirmée.' };
  }
}
