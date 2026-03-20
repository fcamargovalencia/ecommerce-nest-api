/**
 * Database Seed File
 *
 * TEST CREDENTIALS:
 * Admin User:  admin@ecommerce.com / Admin123!
 * Seller User: seller@ecommerce.com / Seller123!
 * Buyer User 1: buyer1@ecommerce.com / Buyer123!
 * Buyer User 2: buyer2@ecommerce.com / Buyer456!
 *
 * Passwords are encrypted using AES-256-CBC (compatible with Spring Boot implementation)
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // ============= CATEGORIES =============
  const electronicaCategory = await prisma.category.upsert({
    where: { name: 'Electrónica' },
    update: {},
    create: {
      name: 'Electrónica',
      description: 'Dispositivos electrónicos y accesorios',
      active: true,
    },
  });

  const ropaCategory = await prisma.category.upsert({
    where: { name: 'Ropa' },
    update: {},
    create: {
      name: 'Ropa',
      description: 'Prendas de vestir para hombres y mujeres',
      active: true,
    },
  });

  const mueblesCategory = await prisma.category.upsert({
    where: { name: 'Muebles' },
    update: {},
    create: {
      name: 'Muebles',
      description: 'Muebles para el hogar y oficina',
      active: true,
    },
  });

  const deportesCategory = await prisma.category.upsert({
    where: { name: 'Deportes' },
    update: {},
    create: {
      name: 'Deportes',
      description: 'Artículos y equipos deportivos',
      active: true,
    },
  });

  console.log('✓ Categories created');

  // ============= USERS =============
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@ecommerce.com' },
    update: {},
    create: {
      identificationNumber: 'ADMIN001',
      email: 'admin@ecommerce.com',
      password: '+rz+UN+Z4eHwyLLs5RXkLg==',
      role: 'ADMIN',
      active: true,
      personalInfo: {
        create: {
          firstName: 'Admin',
          lastName: 'User',
          phoneNumber: '+34-123456789',
          dateOfBirth: new Date('1980-01-01'),
        },
      },
    },
  });

  const sellerUser = await prisma.user.upsert({
    where: { email: 'seller@ecommerce.com' },
    update: {},
    create: {
      identificationNumber: 'SELLER001',
      email: 'seller@ecommerce.com',
      password: '6CUlktMuoc0Te4Rp0fL7ZQ==',
      role: 'SELLER',
      active: true,
      personalInfo: {
        create: {
          firstName: 'Seller',
          lastName: 'User',
          phoneNumber: '+34-987654321',
          dateOfBirth: new Date('1985-05-15'),
        },
      },
    },
  });

  const buyer1User = await prisma.user.upsert({
    where: { email: 'buyer1@ecommerce.com' },
    update: {},
    create: {
      identificationNumber: 'BUYER001',
      email: 'buyer1@ecommerce.com',
      password: 'WjtozI6MB75seMgpx3Mjfg==',
      role: 'BUYER',
      active: true,
      personalInfo: {
        create: {
          firstName: 'Juan',
          lastName: 'Pérez',
          phoneNumber: '+34-555111222',
          dateOfBirth: new Date('1990-03-10'),
        },
      },
    },
  });

  const buyer2User = await prisma.user.upsert({
    where: { email: 'buyer2@ecommerce.com' },
    update: {},
    create: {
      identificationNumber: 'BUYER002',
      email: 'buyer2@ecommerce.com',
      password: 'N2Xwq4WX0/jJmTp+aHlatg==',
      role: 'BUYER',
      active: true,
      personalInfo: {
        create: {
          firstName: 'María',
          lastName: 'García',
          phoneNumber: '+34-555333444',
          dateOfBirth: new Date('1992-07-20'),
        },
      },
    },
  });

  console.log('✓ Users created');

  // ============= ADDRESSES =============
  await prisma.address.upsert({
    where: { id: 1 },
    update: {},
    create: {
      userId: buyer1User.id,
      street: 'Calle Principal 123',
      city: 'Madrid',
      state: 'Madrid',
      zipCode: '28001',
      country: 'España',
      isDefault: true,
    },
  });

  await prisma.address.upsert({
    where: { id: 2 },
    update: {},
    create: {
      userId: buyer2User.id,
      street: 'Avenida Secundaria 456',
      city: 'Barcelona',
      state: 'Cataluña',
      zipCode: '08002',
      country: 'España',
      isDefault: true,
    },
  });

  console.log('✓ Addresses created');

  // ============= PRODUCTS WITH DETAILS =============
  const product1 = await prisma.product.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Laptop Dell XPS 13',
      categoryId: electronicaCategory.id,
      sellerId: sellerUser.id,
      price: 999.99,
      stock: 50,
      imageUrl: 'https://example.com/images/laptop-dell-xps-13.jpg',
      active: true,
      detail: {
        create: {
          description: 'Laptop ultraportátil de alta performance con procesador Intel Core i7',
          brand: 'Dell',
          model: 'XPS 13',
          weight: 1.2,
          color: 'Plata',
        },
      },
    },
  });

  const product2 = await prisma.product.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'iPhone 15 Pro',
      categoryId: electronicaCategory.id,
      sellerId: sellerUser.id,
      price: 1099.99,
      stock: 30,
      imageUrl: 'https://example.com/images/iphone-15-pro.jpg',
      active: true,
      detail: {
        create: {
          description: 'Smartphone premium con pantalla OLED y cámara de 48MP',
          brand: 'Apple',
          model: 'iPhone 15 Pro',
          weight: 0.187,
          color: 'Negro',
        },
      },
    },
  });

  const product3 = await prisma.product.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'Camiseta Premium',
      categoryId: ropaCategory.id,
      sellerId: sellerUser.id,
      price: 29.99,
      stock: 100,
      imageUrl: 'https://example.com/images/camiseta-premium.jpg',
      active: true,
      detail: {
        create: {
          description: 'Camiseta de algodón 100% de alta calidad con diseño moderno',
          brand: 'Premium Wear',
          model: 'Classic T-Shirt',
          weight: 0.2,
          color: 'Blanco',
        },
      },
    },
  });

  const product4 = await prisma.product.upsert({
    where: { id: 4 },
    update: {},
    create: {
      name: 'Pantalón Vaquero',
      categoryId: ropaCategory.id,
      sellerId: sellerUser.id,
      price: 59.99,
      stock: 75,
      imageUrl: 'https://example.com/images/pantalon-vaquero.jpg',
      active: true,
      detail: {
        create: {
          description: 'Pantalón vaquero de corte clásico con material duradero',
          brand: 'Denim Co',
          model: 'Classic Fit',
          weight: 0.6,
          color: 'Azul',
        },
      },
    },
  });

  const product5 = await prisma.product.upsert({
    where: { id: 5 },
    update: {},
    create: {
      name: 'Escritorio de Oficina',
      categoryId: mueblesCategory.id,
      sellerId: sellerUser.id,
      price: 299.99,
      stock: 20,
      imageUrl: 'https://example.com/images/escritorio-oficina.jpg',
      active: true,
      detail: {
        create: {
          description: 'Escritorio de madera maciza con diseño ergonómico',
          brand: 'Furniture Plus',
          model: 'Executive Desk',
          weight: 25.0,
          color: 'Marrón',
        },
      },
    },
  });

  const product6 = await prisma.product.upsert({
    where: { id: 6 },
    update: {},
    create: {
      name: 'Pelota de Fútbol',
      categoryId: deportesCategory.id,
      sellerId: sellerUser.id,
      price: 34.99,
      stock: 200,
      imageUrl: 'https://example.com/images/pelota-futbol.jpg',
      active: true,
      detail: {
        create: {
          description: 'Pelota de fútbol profesional con cubierta de cuero sintético',
          brand: 'Sports Pro',
          model: 'Championship Ball',
          weight: 0.43,
          color: 'Blanco',
        },
      },
    },
  });

  console.log('✓ Products created');

  console.log('✅ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
