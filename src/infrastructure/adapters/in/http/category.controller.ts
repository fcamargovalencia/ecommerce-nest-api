import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CategoryService } from '../../../../application/services/category.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../../../../application/dto/category';
import { JwtAuthGuard } from '../../../security/jwt-auth.guard';
import { RolesGuard } from '../../../security/roles.guard';
import { Roles } from '../../../security/roles.guard';
import { Role } from '../../../../domain/enums/role.enum';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  getAll() {
    return this.categoryService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.getById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new category' })
  create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update category' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoryDto) {
    return this.categoryService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deactivate category' })
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.deactivate(id);
  }
}
