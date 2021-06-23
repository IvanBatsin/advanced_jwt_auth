import jwt from 'jsonwebtoken';
import { TokenModel, TokenModelDocument } from '../models/Token';
import { UserDto } from '../dtos/userDto';

class TokenService {
  generateTokens(payload: UserDto): {accessToken: string, refreshToken: string} {
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY_ACCESS || 'secret key', {expiresIn: '30m'});
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_KEY_REFRESH || 'secret key', {expiresIn: '30d'});
    return {
      accessToken, refreshToken
    }
  }

  async saveToken(userId: string, refreshToken: string): Promise<TokenModelDocument | void> {
    try {
      const tokenData = await TokenModel.findOne({userId});

      if (tokenData) {
        tokenData.refreshToken = refreshToken;
        return await tokenData.save();
      }

      const token = await TokenModel.create({userId, refreshToken});
      return token;
    } catch (error) {
      console.log(error);
    }
  }

  async removeToken(refreshToken: string): Promise<any> {
    try {
      const token = await TokenModel.deleteOne({refreshToken});
      return token;
    } catch (error) {
      console.log(error);
    }
  }

  async findToken(refreshToken: string): Promise<TokenModelDocument | null> {
    const token = await TokenModel.findOne({refreshToken});
    return token;
  }

  validateAccessToken(token: string) {
    try {
      const userData = jwt.verify(token, process.env.JWT_SECRET_KEY_ACCESS!) as UserDto;
      return userData;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  validateRefreshToken(token: string) {
    try {
      const userData = jwt.verify(token, process.env.JWT_SECRET_KEY_REFRESH!) as UserDto;
      return userData;
    } catch (error) {
      console.log(error);
    }
  }
}

const tokenService = new TokenService();
export { tokenService };