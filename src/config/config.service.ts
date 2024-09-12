import { Inject, Injectable } from '@nestjs/common';
import path from 'path';
import { CONFIG_OPTIONS } from './constants';
import dotenv from 'dotenv';
import fs from 'fs';
import { EnvConfig } from './interfaces/envConfig.interface';
import { ConfigOptions } from './interfaces/config-options.interface';

@Injectable()
export class ConfigService {
  private envConfig: EnvConfig;
  constructor(@Inject(CONFIG_OPTIONS) private readonly options: ConfigOptions) {
    const filePath = `${process.env.NODE_ENV || 'development'}.env`;
    const envFile = path.resolve(__dirname, '../../', options.folder, filePath);
    this.envConfig = dotenv.parse(fs.readFileSync(envFile));
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}
