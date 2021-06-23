import { UserModel, UserModelDocument } from '../models/User';
import bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import { mailService } from './mailSevice';
import { tokenService } from './tokenService';
import { UserDto } from '../dtos/userDto';
import { ApiError } from '../exeptions/apiError';

type UserServiceReturnData = {
  accessToken: string;
  refreshToken: string;
  user: UserDto
}

class UserService {
  async registration(email: string, password: string): Promise<UserServiceReturnData | void> {
    try {
      const condidate = await UserModel.findOne({email});

      if (condidate) {
        throw ApiError.BadRequest(`User with this email (${email}) already exists`);
      }

      const hashPassword = await bcrypt.hash(password, 10);
      const activationLink = uuid.v4();
      const user = await UserModel.create({email, password: hashPassword, activationLink});
      await mailService.sendActivationEmail(email, `${process.env.API_URL}/api/activate/${activationLink}`);
      const userDto = new UserDto(user.toJSON());
      const tokens = tokenService.generateTokens({...userDto});
      await tokenService.saveToken(user._id, tokens.refreshToken);
      return { ...tokens, user: userDto };
    } catch (error) {
      console.log(error);
    }
  } 

  async activateAccount(activationLink: string): Promise<void> {
    try {
      const user = await UserModel.findOne({activationLink});

      if (!user) {
        throw ApiError.BadRequest('User not found');
      }

      user.isActivate = true;
      await user.save();
    } catch (error) {
      console.log(error);
    }
  }

  async login(email: string, password: string): Promise<UserServiceReturnData | void> {
    try {
      const user = await UserModel.findOne({email});

      if (!user) {
        throw ApiError.BadRequest('User not found');
      }
      
      const passwordsAreEqual = await bcrypt.compare(password, user.password);

      if (!passwordsAreEqual) {
        throw ApiError.BadRequest('Invalid password');
      }

      const userDto = new UserDto(user.toJSON());
      const tokens = tokenService.generateTokens({...userDto});
      await tokenService.saveToken(user._id, tokens.refreshToken);
      return { ...tokens, user: userDto };
    } catch (error) {
      console.log(error);
    }
  }

  async logout(refreshToken: string): Promise<any> {
    try {
      const token = await tokenService.removeToken(refreshToken);
      return token;
    } catch (error) {
      console.log(error);
    }
  }

  async refresh(refreshToken: string): Promise<UserServiceReturnData | void> {
    try {
      if (!refreshToken) {
        throw ApiError.UnauthorizedError();
      }

      const userData = tokenService.validateRefreshToken(refreshToken);
      const tokenFromDB = await tokenService.findToken(refreshToken);

      if (!userData || !tokenFromDB) {
        throw ApiError.UnauthorizedError();
      }

      const user = await UserModel.findById(userData.id);
      const userDto = new UserDto(user!.toJSON());
      const tokens = tokenService.generateTokens({...userDto});
      await tokenService.saveToken(user?._id, tokens.refreshToken);

      return { ...tokens, user: userDto };
    } catch (error) {
      console.log(error);
    }
  }

  async getAllUsers(): Promise<UserModelDocument[] | void> {
    try {
      const users = await UserModel.find();
      return users;
    } catch (error) {
      console.log(error);
    }
  }
}

const userService = new UserService();
export { userService };