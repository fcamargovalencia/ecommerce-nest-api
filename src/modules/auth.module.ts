import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from '../infrastructure/adapters/in/http/auth.controller';
import { AuthService } from '../application/services/auth.service';
import { JwtProvider } from '../infrastructure/security/jwt.provider';
import { AES256Util } from '../infrastructure/security/aes256.util';
import { JwtStrategy } from '../infrastructure/security/jwt.strategy';
import {
  USER_REPOSITORY,
  PERSONAL_INFO_REPOSITORY,
} from '../domain/ports/out/repository.tokens';
import { UserPrismaRepository } from '../infrastructure/adapters/out/persistence/user.prisma.repository';
import { PersonalInfoPrismaRepository } from '../infrastructure/adapters/out/persistence/personal-info.prisma.repository';
import { PrismaService } from '../infrastructure/adapters/out/persistence/prisma/prisma.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: parseInt(config.get<string>('JWT_EXPIRATION', '86400000')) / 1000 + 's',
        },
      }),
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtProvider,
    AES256Util,
    JwtStrategy,
    {
      provide: USER_REPOSITORY,
      useClass: UserPrismaRepository,
    },
    {
      provide: PERSONAL_INFO_REPOSITORY,
      useClass: PersonalInfoPrismaRepository,
    },
    PrismaService,
  ],
  exports: [JwtProvider, AES256Util, JwtModule],
})
export class AuthModule {}
