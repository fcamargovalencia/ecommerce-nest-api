import { Module } from '@nestjs/common';
import { UserController } from '../infrastructure/adapters/in/http/user.controller';
import { UserService } from '../application/services/user.service';
import {
  USER_REPOSITORY,
  PERSONAL_INFO_REPOSITORY,
  ADDRESS_REPOSITORY,
} from '../domain/ports/out/repository.tokens';
import { UserPrismaRepository } from '../infrastructure/adapters/out/persistence/user.prisma.repository';
import { PersonalInfoPrismaRepository } from '../infrastructure/adapters/out/persistence/personal-info.prisma.repository';
import { AddressPrismaRepository } from '../infrastructure/adapters/out/persistence/address.prisma.repository';
import { PrismaService } from '../infrastructure/adapters/out/persistence/prisma/prisma.service';
import { AuthModule } from './auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: USER_REPOSITORY,
      useClass: UserPrismaRepository,
    },
    {
      provide: PERSONAL_INFO_REPOSITORY,
      useClass: PersonalInfoPrismaRepository,
    },
    {
      provide: ADDRESS_REPOSITORY,
      useClass: AddressPrismaRepository,
    },
    PrismaService,
  ],
})
export class UserModule {}
