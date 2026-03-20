import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from '../dto/product';
import {
  ProductRepositoryPort,
  PRODUCT_REPOSITORY,
} from '../../domain/ports/out/product.repository.port';
import {
  ProductDetailRepositoryPort,
  PRODUCT_DETAIL_REPOSITORY,
} from '../../domain/ports/out/product-detail.repository.port';
import {
  CategoryRepositoryPort,
  CATEGORY_REPOSITORY,
} from '../../domain/ports/out/category.repository.port';
import { Role } from '../../domain/enums/role.enum';

@Injectable()
export class ProductService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepositoryPort,
    @Inject(PRODUCT_DETAIL_REPOSITORY)
    private readonly productDetailRepository: ProductDetailRepositoryPort,
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepositoryPort,
  ) {}

  async getAll() {
    const products = await this.productRepository.findAll();
    return products.filter((p) => p.active);
  }

  async getById(id: number) {
    const product = await this.productRepository.findById(id);
    if (!product || !product.active) {
      throw new NotFoundException('Product not found');
    }
    const detail = await this.productDetailRepository.findByProductId(id);
    return { ...product, detail };
  }

  async search(name: string) {
    const products = await this.productRepository.searchByName(name);
    return products.filter((p) => p.active);
  }

  async getByPriceRange(min: number, max: number) {
    const products = await this.productRepository.findByPriceRange(min, max);
    return products.filter((p) => p.active);
  }

  async getByCategory(categoryId: number) {
    const category = await this.categoryRepository.findById(categoryId);
    if (!category || !category.active) {
      throw new NotFoundException('Category not found');
    }
    const products = await this.productRepository.findByCategoryId(categoryId);
    return products.filter((p) => p.active);
  }

  async getBySeller(sellerId: number) {
    const products = await this.productRepository.findBySellerId(sellerId);
    return products.filter((p) => p.active);
  }

  async create(sellerId: number, dto: CreateProductDto) {
    const category = await this.categoryRepository.findById(dto.categoryId);
    if (!category || !category.active) {
      throw new NotFoundException('Category not found');
    }

    const product = await this.productRepository.save({
      ...dto,
      sellerId,
      active: true,
    });

    if (dto.description || dto.brand || dto.model || dto.weight || dto.color) {
      await this.productDetailRepository.save({
        productId: product.id,
        description: dto.description,
        brand: dto.brand,
        model: dto.model,
        weight: dto.weight,
        color: dto.color,
      });
    }

    return product;
  }

  async update(id: number, sellerId: number, dto: UpdateProductDto) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.sellerId !== sellerId) {
      throw new ForbiddenException('Not authorized');
    }

    if (dto.categoryId) {
      const category = await this.categoryRepository.findById(dto.categoryId);
      if (!category || !category.active) {
        throw new NotFoundException('Category not found');
      }
    }

    const updatedProduct = await this.productRepository.update(id, dto);

    if (dto.description || dto.brand || dto.model || dto.weight || dto.color) {
      await this.productDetailRepository.upsert(id, {
        productId: id,
        description: dto.description,
        brand: dto.brand,
        model: dto.model,
        weight: dto.weight,
        color: dto.color,
      });
    }

    return updatedProduct;
  }

  async deactivate(id: number, sellerId: number, role: Role) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (role !== Role.ADMIN && product.sellerId !== sellerId) {
      throw new ForbiddenException('Not authorized');
    }

    await this.productRepository.deactivate(id);
  }
}
