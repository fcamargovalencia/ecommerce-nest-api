import { PersonalInfo } from '../../entities/personal-info.entity';

export interface PersonalInfoRepositoryPort {
  findByUserId(userId: number): Promise<PersonalInfo | null>;
  save(info: Partial<PersonalInfo>): Promise<PersonalInfo>;
  upsert(userId: number, data: Partial<PersonalInfo>): Promise<PersonalInfo>;
}

export const PERSONAL_INFO_REPOSITORY = 'PERSONAL_INFO_REPOSITORY';
