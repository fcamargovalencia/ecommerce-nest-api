import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category';
import {
  CategoryRepositoryPort,
  CATEGORY_REPOSITORY,
} from '../../domain/ports/out/category.repository.port';

@Injectable()
export class CategoryService {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepositoryPort,
  ) {}

  async getAll() {
    const categories = await this.categoryRepository.findAll();
    return categories.filter((c) => c.active);
  }

  async getById(id: number) {
    const category = await this.categoryRepository.findById(id);
    if (!category || !category.active) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async create(dto: CreateCategoryDto) {
    return this.categoryRepository.save({
      ...dto,
      active: true,
    });
  }

  async update(id: number, dto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return this.categoryRepository.update(id, dto);
  }

  async deactivate(id: number) {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    await this.categoryRepository.deactivate(id);
  }
}
