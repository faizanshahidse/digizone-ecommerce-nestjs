import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Res,
  Put,
  Query,
} from '@nestjs/common';
import { Response } from 'express';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/shared/middleware/role.decorators';
import { userTypes } from 'src/shared/schema/users';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginuser: { email: string; password: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    const loginRes = await this.usersService.login(
      loginuser.email,
      loginuser.password,
    );

    if (loginRes.success) {
      response.cookie('_digi_auth_token', loginRes.result?.token, {
        httpOnly: true,
      });
    }
    delete loginRes.result?.token;
    return loginRes;
  }

  @Put('/logout')
  logout(@Res() res: Response) {
    res.clearCookie('_digi_auth_token');

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Logout successfylly',
    });
  }

  @Get('/verify-email/:otp/:email')
  verifyEmail(@Param('otp') otp: string, @Param('email') email: string) {
    return this.usersService.verifyEmail(otp, email);
  }

  @Get('/forgot-password/:email')
  forgotPassword(@Param('email') email: string) {
    return this.usersService.forgotPassword(email);
  }

  @Get()
  @Roles(userTypes.ADMIN)
  findAll(@Query('type') type: string) {
    return this.usersService.findAll(type);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
