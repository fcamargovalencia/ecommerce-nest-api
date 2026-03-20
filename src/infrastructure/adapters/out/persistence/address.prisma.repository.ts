import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AddressRepositoryPort } from '../../../../domain/ports/out/address.repository.port';
import { Address } from '../../../../domain/entities/address.entity';

@Injectable()
export class AddressPrismaRepository implements AddressRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: number): Promise<Address[]> {
    const results = await this.prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return results as unknown as Address[];
  }

  async findById(id: number): Promise<Address | null> {
    const result = await this.prisma.address.findUnique({
      where: { id },
    });
    return result ? (result as unknown as Address) : null;
  }

  async save(address: Partial<Address>): Promise<Address> {
    // If setting as default, reset other default addresses for this user
    if (address.isDefault && address.userId) {
      await this.prisma.address.updateMany({
        where: {
          userId: address.userId,
          isDefault: true,
        },
        data: { isDefault: false },
      });
    }

    const result = await this.prisma.address.create({
      data: address as any,
    });
    return result as unknown as Address;
  }

  async update(id: number, data: Partial<Address>): Promise<Address> {
    // If setting as default, reset other default addresses for this user
    if (data.isDefault) {
      const address = await this.prisma.address.findUnique({
        where: { id },
      });
      if (address) {
        await this.prisma.address.updateMany({
          where: {
            userId: address.userId,
            isDefault: true,
            id: { not: id },
          },
          data: { isDefault: false },
        });
      }
    }

    const result = await this.prisma.address.update({
      where: { id },
      data: data as any,
    });
    return result as unknown as Address;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.address.delete({
      where: { id },
    });
  }
}
