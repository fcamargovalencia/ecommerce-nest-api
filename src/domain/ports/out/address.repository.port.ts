import { Address } from '../../entities/address.entity';

export interface AddressRepositoryPort {
  findByUserId(userId: number): Promise<Address[]>;
  findById(id: number): Promise<Address | null>;
  save(data: Partial<Address>): Promise<Address>;
  update(id: number, data: Partial<Address>): Promise<Address>;
  delete(id: number): Promise<void>;
}

export const ADDRESS_REPOSITORY = 'ADDRESS_REPOSITORY';
