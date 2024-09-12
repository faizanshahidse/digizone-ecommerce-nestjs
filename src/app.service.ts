import { Injectable } from '@nestjs/common';
import { ConfigService } from './config/config.service';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}
  getHello(): string {
    return 'Hello Pakistan!!';
  }

  getConfigEnv() {
    const env = this.configService.get('SUPPORT_EMAIL');

    return {
      message: 'success',
      result: env,
    };
  }
}
