import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendMail(options: {
    to: string;
    subject: string;
    template: string;
    context: Record<string, unknown>;
  }): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: options.to,
        subject: options.subject,
        template: options.template,
        context: options.context,
      });
      this.logger.log(`Email sent to ${options.to} (${options.subject})`);
    } catch (error) {
      // Fire-and-forget: log but don't throw.
      // A failed email must NOT break registration/booking.
      this.logger.error(
        `Failed to send email to ${options.to}: ${error?.message ?? error}`,
      );
    }
  }
}
