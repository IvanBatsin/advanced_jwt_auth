import { Schema, Document, model } from 'mongoose';

export interface User {
  _id: string,
  email: string,
  password: string,
  isActivate: boolean,
  activationLink: string
}

type UserModelDocument = User & Document;

const UserSchema = new Schema<UserModelDocument>({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isActivate: {
    type: Boolean,
    default: false
  },
  activationLink: {
    type: String
  }
});

const UserModel = model<UserModelDocument>('User', UserSchema);
export { UserModel, UserModelDocument };