import { PrismaClient } from '@prisma/client';

// Best practice: Singleton pattern for PrismaClient to prevent multiple instances
declare global {
  var prisma: PrismaClient | undefined;
}

// Production-ready Prisma client with optimizations
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['error', 'warn'] 
      : ['error'],
    errorFormat: 'pretty',
  });
};

export const prisma = global.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Helper function to handle Prisma errors
export function handlePrismaError(error: any) {
  if (error.code === 'P2002') {
    return { error: 'A unique constraint would be violated.' };
  }
  if (error.code === 'P2025') {
    return { error: 'Record not found.' };
  }
  if (error.code === 'P2003') {
    return { error: 'Foreign key constraint failed.' };
  }
  return { error: 'Database operation failed.' };
}
