import { User, UserModelDocument } from '../models/User';

export class UserDto {
  email: string;
  id: string;
  isActicate: boolean;

  constructor(user: User) {
    this.email = user.email,
    this.id = user._id;
    this.isActicate = user.isActivate;
  }
}