import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PersonalInfoRepositoryPort } from '../../../../domain/ports/out/personal-info.repository.port';
import { PersonalInfo } from '../../../../domain/entities/personal-info.entity';

@Injectable()
export class PersonalInfoPrismaRepository implements PersonalInfoRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: number): Promise<PersonalInfo | null> {
    const result = await this.prisma.personalInfo.findUnique({
      where: { userId },
    });
    return result ? (result as unknown as PersonalInfo) : null;
  }

  async save(personalInfo: Partial<PersonalInfo>): Promise<PersonalInfo> {
    const result = await this.prisma.personalInfo.create({
      data: personalInfo as any,
    });
    return result as unknown as PersonalInfo;
  }

  async upsert(userId: number, data: Partial<PersonalInfo>): Promise<PersonalInfo> {
    const result = await this.prisma.personalInfo.upsert({
      where: { userId },
      create: { userId, ...data } as any,
      update: data as any,
    });
    return result as unknown as PersonalInfo;
  }
}
