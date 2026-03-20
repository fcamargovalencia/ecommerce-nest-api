import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UserRepositoryPort } from '../../../../domain/ports/out/user.repository.port';
import { User } from '../../../../domain/entities/user.entity';

@Injectable()
export class UserPrismaRepository implements UserRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<User | null> {
    const result = await this.prisma.user.findUnique({
      where: { id },
    });
    return result ? (result as unknown as User) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.prisma.user.findUnique({
      where: { email },
    });
    return result ? (result as unknown as User) : null;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email },
    });
    return count > 0;
  }

  async existsByIdentificationNumber(idNumber: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { identificationNumber: idNumber },
    });
    return count > 0;
  }

  async save(user: Partial<User>): Promise<User> {
    const result = await this.prisma.user.create({
      data: user as any,
    });
    return result as unknown as User;
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    const result = await this.prisma.user.update({
      where: { id },
      data: data as any,
    });
    return result as unknown as User;
  }

  async deactivate(id: number): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { active: false },
    });
  }
}
