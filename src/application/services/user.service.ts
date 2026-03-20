import {
  Injectable,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { PersonalInfoDto, AddressDto } from '../dto/user';
import {
  UserRepositoryPort,
  USER_REPOSITORY,
} from '../../domain/ports/out/user.repository.port';
import {
  PersonalInfoRepositoryPort,
  PERSONAL_INFO_REPOSITORY,
} from '../../domain/ports/out/personal-info.repository.port';
import {
  AddressRepositoryPort,
  ADDRESS_REPOSITORY,
} from '../../domain/ports/out/address.repository.port';
import { PersonalInfo } from '../../domain/entities/personal-info.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(PERSONAL_INFO_REPOSITORY)
    private readonly personalInfoRepository: PersonalInfoRepositoryPort,
    @Inject(ADDRESS_REPOSITORY)
    private readonly addressRepository: AddressRepositoryPort,
  ) {}

  async getProfile(userId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user || !user.active) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getPersonalInfo(userId: number) {
    const personalInfo = await this.personalInfoRepository.findByUserId(
      userId,
    );
    if (!personalInfo) {
      throw new NotFoundException('Personal information not found');
    }
    return personalInfo;
  }

  async updatePersonalInfo(userId: number, dto: PersonalInfoDto) {
    const data: Partial<PersonalInfo> = {
      firstName: dto.firstName,
      lastName: dto.lastName,
      phoneNumber: dto.phoneNumber,
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
    };
    return this.personalInfoRepository.upsert(userId, data);
  }

  async getAddresses(userId: number) {
    return this.addressRepository.findByUserId(userId);
  }

  async addAddress(userId: number, dto: AddressDto) {
    return this.addressRepository.save({
      ...dto,
      userId,
    });
  }

  async updateAddress(userId: number, addressId: number, dto: AddressDto) {
    const address = await this.addressRepository.findById(addressId);
    if (!address || address.userId !== userId) {
      throw new NotFoundException('Address not found');
    }
    return this.addressRepository.update(addressId, dto);
  }

  async deleteAddress(userId: number, addressId: number) {
    const address = await this.addressRepository.findById(addressId);
    if (!address || address.userId !== userId) {
      throw new NotFoundException('Address not found');
    }
    await this.addressRepository.delete(addressId);
  }

  async deactivateAccount(userId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.deactivate(userId);
  }
}
