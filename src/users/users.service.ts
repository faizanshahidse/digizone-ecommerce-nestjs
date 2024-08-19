import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { userTypes } from 'src/shared/schema/users';
import config from 'config';
import { UserRepository } from 'src/shared/repositories/user.repository';
import {
  comparePassword,
  generateHashPassword,
} from 'src/utility/password-manager';
import { sendEmail } from 'src/utility/nodemailer';
import { generateAuthToken } from 'src/utility/token-generator';

@Injectable()
export class UsersService {
  constructor(@Inject() private readonly userDB: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    try {
      // generates hash password
      createUserDto.password = await generateHashPassword(
        createUserDto.password,
      );

      // check it for admin
      if (
        createUserDto.type === userTypes.ADMIN &&
        createUserDto.secretToken !== config.get('ADMIN_SECRET_TOKEN')
      ) {
        throw new Error('Not allowed to create admin');
      } else if (createUserDto.type !== userTypes.CUSTOMER) {
        createUserDto.isVerified = true;
      }

      // check user already exist!
      const user = await this.userDB.findOne({
        email: createUserDto.email,
      });

      if (user) {
        throw new Error('User is already exist!');
      }

      // generate otp
      const otp = Math.floor(Math.random() * 900000) + 100000;

      const otpExpiryTime = new Date();
      otpExpiryTime.setMinutes(otpExpiryTime.getMinutes() + 10);

      // create user
      const newUser = await this.userDB.create({
        ...createUserDto,
        otp,
        otpExpiryTime,
      });

      // if (newUser.type !== userTypes.ADMIN) {
      //   sendEmail(
      //     newUser.email,
      //     // config.get('MAILGUN.EMAIL_x/TEMPLATES.OTP'),
      //     'Verify Your Account',
      //     `<p>This is your OTP <b>${otp}</b><p/>`,
      //     // {
      //     //   customerName: newUser.name,
      //     //   customerEmail: newUser.email,
      //     //   otp,
      //     // },
      //   );
      // }

      return {
        success: true,
        message:
          newUser.type === userTypes.ADMIN
            ? 'Admin Created Successfully!'
            : 'Please activate your account by verifying your email. We have sent you an email with an otp.',
        result: newUser,
      };
    } catch (error) {
      throw error;
    }
  }

  async login(email, password) {
    try {
      const userExists = await this.userDB.findOne({
        email,
      });

      if (!userExists) {
        throw new Error('User does not exist');
      }

      if (!userExists.isVerified) {
        throw new Error('Please verify you email');
      }

      const isPasswordMatch = await comparePassword(
        password,
        userExists.password,
      );

      if (!isPasswordMatch) {
        throw new Error('Invalid email or password');
      }

      const token = await generateAuthToken(userExists.id);

      return {
        success: true,
        message: 'User Login Successfully!',
        result: {
          user: {
            id: userExists.id,
            name: userExists.name,
            email: userExists.email,
            type: userExists.type,
          },
          token,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async verifyEmail(otp, email) {
    try {
      const user = await this.userDB.findOne({
        email,
      });

      if (!user) {
        throw new Error('User not found');
      }

      if (user.otp !== otp) {
        throw new Error('Invalid otp');
      }

      if (user.otpExpiryTime < new Date()) {
        throw new Error('Otp time expired');
      }

      await this.userDB.updateOne(
        {
          email,
        },
        {
          isVerified: true,
        },
      );

      return {
        success: true,
        message: 'Email verified successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(email) {
    try {
      const user = await this.userDB.findOne({
        email,
      });

      if (!user) {
        throw new Error('User not found');
      }

      const otp = Math.floor(Math.random() * 900000) + 100000;
      const otpExpiryTime = new Date();
      otpExpiryTime.setMinutes(otpExpiryTime.getMinutes() + 10);

      sendEmail(
        user.email,
        'Forgot Password Otp',
        `<p>Your Otp <b>${otp}<b/><p/>`,
      );

      return {
        success: true,
        message: 'Otp send successfully. Please check you email and verify otp',
      };
    } catch (error) {
      throw error;
    }
  }

  findAll(type: string) {
    try {
      return this.userDB.find({
        type,
      });
    } catch (error) {
      throw error;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
