import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from '../../../../application/services/user.service';
import { PersonalInfoDto, AddressDto } from '../../../../application/dto/user';
import { JwtAuthGuard } from '../../../security/jwt-auth.guard';
import { GetUser } from '../../../../common/decorators/get-user.decorator';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get user profile' })
  getProfile(@GetUser('userId') userId: number) {
    return this.userService.getProfile(userId);
  }

  @Get('me/personal-info')
  @ApiOperation({ summary: 'Get user personal information' })
  getPersonalInfo(@GetUser('userId') userId: number) {
    return this.userService.getPersonalInfo(userId);
  }

  @Put('me/personal-info')
  @ApiOperation({ summary: 'Update user personal information' })
  updatePersonalInfo(@GetUser('userId') userId: number, @Body() dto: PersonalInfoDto) {
    return this.userService.updatePersonalInfo(userId, dto);
  }

  @Get('me/addresses')
  @ApiOperation({ summary: 'Get user addresses' })
  getAddresses(@GetUser('userId') userId: number) {
    return this.userService.getAddresses(userId);
  }

  @Post('me/addresses')
  @ApiOperation({ summary: 'Add new address' })
  addAddress(@GetUser('userId') userId: number, @Body() dto: AddressDto) {
    return this.userService.addAddress(userId, dto);
  }

  @Put('me/addresses/:addressId')
  @ApiOperation({ summary: 'Update address' })
  updateAddress(
    @GetUser('userId') userId: number,
    @Param('addressId', ParseIntPipe) addressId: number,
    @Body() dto: AddressDto,
  ) {
    return this.userService.updateAddress(userId, addressId, dto);
  }

  @Delete('me/addresses/:addressId')
  @ApiOperation({ summary: 'Delete address' })
  deleteAddress(@GetUser('userId') userId: number, @Param('addressId', ParseIntPipe) addressId: number) {
    return this.userService.deleteAddress(userId, addressId);
  }

  @Delete('me')
  @ApiOperation({ summary: 'Deactivate account' })
  deactivateAccount(@GetUser('userId') userId: number) {
    return this.userService.deactivateAccount(userId);
  }
}
