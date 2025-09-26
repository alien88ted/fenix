import { toast } from 'sonner';

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleError(error: unknown): string {
  console.error('Error occurred:', error);
  
  if (error instanceof AppError) {
    toast.error(error.message);
    return error.message;
  }
  
  if (error instanceof Error) {
    // Network errors
    if (error.message.includes('fetch')) {
      toast.error('Network error. Please check your connection.');
      return 'Network error';
    }
    
    // Prisma errors
    if (error.message.includes('Prisma')) {
      toast.error('Database error. Please try again.');
      return 'Database error';
    }
    
    // Privy errors
    if (error.message.includes('Privy') || error.message.includes('auth')) {
      toast.error('Authentication error. Please login again.');
      return 'Authentication error';
    }
    
    toast.error(error.message);
    return error.message;
  }
  
  toast.error('An unexpected error occurred');
  return 'Unknown error';
}

export function handleSuccess(message: string) {
  toast.success(message);
}

export function handleInfo(message: string) {
  toast.info(message);
}

export function handleWarning(message: string) {
  toast.warning(message);
}
