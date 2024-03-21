import jwt from 'jsonwebtoken';
import CONFIG from '../config';

type PayloadToken = {
  authorId: number;
};

export const signToken = (payload: PayloadToken): string => {
  return jwt.sign(payload, CONFIG.SECRET_KEY, {
    expiresIn: '1h',
  });
};

export const decodeToken = (token: string): PayloadToken | null => {
  try {
    const payload = jwt.verify(token, CONFIG.SECRET_KEY) as PayloadToken;
    payload.authorId = Number(payload.authorId);

    return payload;
  } catch (error) {
    return null;
  }
};
