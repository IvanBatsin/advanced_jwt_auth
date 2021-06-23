import { Schema, Document, model, Types } from 'mongoose';

export interface Token {
  _id: string,
  userId: string,
  refreshToken: string
}

type TokenModelDocument = Token & Document;

const TokenSchema = new Schema<TokenModelDocument>({
  userId: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  },
  refreshToken: {
    type: String,
    required: true
  }
});

const TokenModel = model<TokenModelDocument>('Token', TokenSchema);
export { TokenModel, TokenModelDocument };