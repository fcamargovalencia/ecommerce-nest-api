import {
  Injectable,
  Inject,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import {
  UserRepositoryPort,
  USER_REPOSITORY,
} from '../../domain/ports/out/user.repository.port';
import {
  PersonalInfoRepositoryPort,
  PERSONAL_INFO_REPOSITORY,
} from '../../domain/ports/out/personal-info.repository.port';
import { JwtProvider } from '../../infrastructure/security/jwt.provider';
import { AES256Util } from '../../infrastructure/security/aes256.util';
import { PasswordValidatorService } from '../../domain/services/password-validator.service';
import { LoginDto, RegisterDto } from '../dto/auth';
import { Role } from '../../domain/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(PERSONAL_INFO_REPOSITORY)
    private readonly personalInfoRepository: PersonalInfoRepositoryPort,
    private readonly jwtProvider: JwtProvider,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (!user.active)
      throw new UnauthorizedException('User account is deactivated');
    if (dto.encryptedPassword !== user.password)
      throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtProvider.generateToken(
      user.id,
      user.email,
      user.role,
    );
    return {
      token,
      userId: user.id.toString(),
      email: user.email,
      role: user.role,
    };
  }

  async register(dto: RegisterDto) {
    if (await this.userRepository.existsByEmail(dto.email)) {
      throw new ConflictException('Email already registered');
    }
    if (
      await this.userRepository.existsByIdentificationNumber(
        dto.identificationNumber,
      )
    ) {
      throw new ConflictException('Identification number already registered');
    }

    try {
      const decrypted = AES256Util.decrypt(dto.encryptedPassword);
      PasswordValidatorService.validate(decrypted);
    } catch (e) {
      if (e.message?.includes('Password')) {
        throw new BadRequestException(e.message);
      }
      throw new BadRequestException('Invalid encrypted password format');
    }

    const user = await this.userRepository.save({
      identificationNumber: dto.identificationNumber,
      email: dto.email,
      password: dto.encryptedPassword,
      role: dto.role as Role,
      active: true,
    });

    await this.personalInfoRepository.save({
      userId: user.id,
      firstName: dto.firstName,
      lastName: dto.lastName,
    });

    const token = this.jwtProvider.generateToken(
      user.id,
      user.email,
      user.role as string,
    );
    return {
      token,
      userId: user.id.toString(),
      email: user.email,
      role: user.role,
    };
  }
}
