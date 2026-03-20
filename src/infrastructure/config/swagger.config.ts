import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('E-Commerce API (NestJS)')
    .setDescription(
      'A comprehensive E-Commerce REST API built with NestJS and Prisma. ' +
      'Supports user authentication, product management, shopping carts, orders, and reviews. ' +
      'Use Bearer token authentication for protected endpoints.',
    )
    .setVersion('1.0.0')
    .addServer(process.env.API_URL || 'http://localhost:3000', 'Local Server')
    .addServer('https://api.ecommerce.example.com', 'Production Server')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token',
      },
      'BearerAuth',
    )
    .addTag('Auth', 'Authentication and authorization endpoints')
    .addTag('Users', 'User management endpoints')
    .addTag('Products', 'Product catalog endpoints')
    .addTag('Categories', 'Product category endpoints')
    .addTag('Cart', 'Shopping cart endpoints')
    .addTag('Orders', 'Order management endpoints')
    .addTag('Reviews', 'Product review endpoints')
    .addTag('Health', 'Application health check endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
