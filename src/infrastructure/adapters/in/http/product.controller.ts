import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductService } from '../../../../application/services/product.service';
import { CreateProductDto, UpdateProductDto } from '../../../../application/dto/product';
import { JwtAuthGuard } from '../../../security/jwt-auth.guard';
import { RolesGuard } from '../../../security/roles.guard';
import { Roles } from '../../../security/roles.guard';
import { GetUser } from '../../../../common/decorators/get-user.decorator';
import { Role } from '../../../../domain/enums/role.enum';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  getAll() {
    return this.productService.getAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search products by name' })
  search(@Query('name') name: string) {
    return this.productService.search(name);
  }

  @Get('price')
  @ApiOperation({ summary: 'Get products by price range' })
  getByPriceRange(@Query('min') min: number, @Query('max') max: number) {
    return this.productService.getByPriceRange(min, max);
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Get products by category' })
  getByCategory(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.productService.getByCategory(categoryId);
  }

  @Get('seller/:sellerId')
  @ApiOperation({ summary: 'Get products by seller' })
  getBySeller(@Param('sellerId', ParseIntPipe) sellerId: number) {
    return this.productService.getBySeller(sellerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.productService.getById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new product' })
  create(@GetUser('userId') userId: number, @Body() dto: CreateProductDto) {
    return this.productService.create(userId, dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product' })
  update(
    @GetUser('userId') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productService.update(id, userId, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deactivate product' })
  deactivate(
    @GetUser('userId') userId: number,
    @GetUser('role') role: Role,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.productService.deactivate(id, userId, role);
  }
}
