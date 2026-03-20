import { Module, Controller, Get } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth.module';
import { ProductModule } from './modules/product.module';
import { CategoryModule } from './modules/category.module';
import { OrderModule } from './modules/order.module';
import { ReviewModule } from './modules/review.module';
import { UserModule } from './modules/user.module';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    ProductModule,
    CategoryModule,
    OrderModule,
    ReviewModule,
    UserModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
