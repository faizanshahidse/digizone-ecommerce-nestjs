// import '@types/express'
import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { TestClass } from './products/TestClass';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    new TestClass().testmethod();
    return this.appService.getHello();
  }

  @Get('/config')
  getConfigEnv() {
    return this.appService.getConfigEnv();
  }
}
