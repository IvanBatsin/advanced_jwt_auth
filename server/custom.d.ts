import { UserDto } from './dtos/userDto';

declare global{
  namespace Express {
    interface Request {
      user?: UserDto
    }
  }
}