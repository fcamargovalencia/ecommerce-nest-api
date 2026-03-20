import { Role } from '../enums/role.enum';

export class User {
  id: number;
  identificationNumber: string;
  email: string;
  password: string;
  role: Role;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
