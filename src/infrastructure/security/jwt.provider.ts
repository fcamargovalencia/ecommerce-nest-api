import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface JwtPayload {
  sub: string;   // email
  userId: number;
  role: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtProvider {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(userId: number, email: string, role: string): string {
    const payload: JwtPayload = { sub: email, userId, role };
    return this.jwtService.sign(payload);
  }

  validateToken(token: string): JwtPayload | null {
    try {
      return this.jwtService.verify<JwtPayload>(token);
    } catch {
      return null;
    }
  }

  decodeToken(token: string): JwtPayload | null {
    return this.jwtService.decode<JwtPayload>(token);
  }
}
