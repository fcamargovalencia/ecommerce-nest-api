import { User } from '../../entities/user.entity';

export interface UserRepositoryPort {
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  existsByEmail(email: string): Promise<boolean>;
  existsByIdentificationNumber(idNumber: string): Promise<boolean>;
  save(user: Partial<User>): Promise<User>;
  update(id: number, data: Partial<User>): Promise<User>;
  deactivate(id: number): Promise<void>;
}

export const USER_REPOSITORY = 'USER_REPOSITORY';
