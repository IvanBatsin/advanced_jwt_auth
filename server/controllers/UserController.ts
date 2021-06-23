import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/userService';
import { validationResult } from 'express-validator';
import { ApiError } from '../exeptions/apiError';

class UserController {
  async registration(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw ApiError.BadRequest(errors.array()[0].msg);
      }
      
      const {email, password} = req.body;
      const userData = await userService.registration(email, password);
      res.cookie('refreshToken', userData!.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true});
      res.json(userData);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {email, password} = req.body;
      const userData = await userService.login(email, password);

      res.cookie('refreshToken', userData!.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true});
      res.json(userData);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {refreshToken} = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie('refreshToken');
      res.json(token);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async activate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const activationLink = req.params.link;
      await userService.activateAccount(activationLink);
      // res.redirect(process.env.CLIENT_URL!);
      res.send('Account is active');
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {refreshToken} = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie('refreshToken', userData!.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true});
      res.json(userData);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

const userController = new UserController();
export { userController };