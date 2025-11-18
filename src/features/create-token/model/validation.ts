import { z } from 'zod';

/**
 * Схема валидации формы создания токена
 * Использует Zod для type-safe валидации
 */
export const tokenFormSchema = z.object({
  // Basic data - обязательные поля
  name: z
    .string()
    .min(1, 'Name is required')
    .max(32, 'Name must be less than 32 characters'),
  
  ticker: z
    .string()
    .min(1, 'Ticker is required')
    .max(10, 'Ticker must be less than 10 characters')
    .regex(/^[A-Z0-9]+$/, 'Ticker must contain only uppercase letters and numbers'),
  
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  
  // Social links - опциональные, можно username или URL
  discord: z
    .string()
    .optional(),
  
  telegram: z
    .string()
    .optional(),
  
  twitter: z
    .string()
    .optional(),
  
  website: z
    .string()
    .optional()
    .refine((val) => !val || z.string().url().safeParse(val).success, {
      message: 'Invalid website URL',
    }),
  
  // Advanced
  buyAmount: z
    .number()
    .min(0, 'Buy amount must be positive')
    .optional(),
});

export type TokenFormValues = z.infer<typeof tokenFormSchema>;

/**
 * Валидация файла изображения
 */
export const validateImageFile = (file: File | null): string | null => {
  if (!file) {
    return 'Image is required';
  }
  
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
  if (!allowedTypes.includes(file.type)) {
    return 'Allowed file types: JPG, PNG, GIF, SVG';
  }
  
  const maxSize = 5 * 1024 * 1024; // 5 MB
  if (file.size > maxSize) {
    return 'Maximum file size: 5 MB';
  }
  
  return null;
};
