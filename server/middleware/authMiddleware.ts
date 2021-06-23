import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../exeptions/apiError';
import { tokenService } from '../services/tokenService';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      return next(ApiError.UnauthorizedError());
    }

    const accessToken = authorizationHeader.split(' ')[1];

    if (!accessToken) {
      return next(ApiError.UnauthorizedError());
    }

    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return next(ApiError.UnauthorizedError());
    }

    req.user = userData;
    return next();
  } catch (error) {
    console.log(error);
    return next(ApiError.UnauthorizedError());
  }
}