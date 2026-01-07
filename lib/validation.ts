import { z } from 'zod';

// Common validation patterns
const phoneRegex = /^05[0-9]{8}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

// User schemas
export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, 'البريد الإلكتروني أو رقم الجوال مطلوب')
    .refine(
      (value) => emailRegex.test(value) || phoneRegex.test(value),
      'البريد الإلكتروني أو رقم الجوال غير صالح'
    ),
  password: z
    .string()
    .min(1, 'كلمة المرور مطلوبة'),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'الاسم يجب أن يكون حرفين على الأقل')
    .max(50, 'الاسم يجب أن لا يتجاوز 50 حرفاً')
    .trim(),
  email: z
    .string()
    .email('البريد الإلكتروني غير صالح')
    .trim(),
  password: z
    .string()
    .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل')
    .regex(passwordRegex, 'كلمة المرور يجب أن تحتوي على حرف كبير وحرف صغير ورقم'),
  confirmPassword: z
    .string()
    .min(1, 'تأكيد كلمة المرور مطلوب'),
  phone: z
    .string()
    .regex(phoneRegex, 'رقم الجوال يجب أن يبدأ ب 05 ويحتوي على 10 أرقام')
    .optional(),
  address: z
    .string()
    .min(5, 'العنوان يجب أن يكون 5 أحرف على الأقل')
    .max(200, 'العنوان يجب أن لا يتجاوز 200 حرف')
    .optional(),
  role: z
    .enum(['customer', 'seller'], {
      required_error: 'نوع الحساب مطلوب',
    }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'كلمتا المرور غير متطابقتين',
  path: ['confirmPassword'],
});

export const buyerRegisterSchema = z.object({
  firstName: z
    .string()
    .min(2, 'الاسم الأول يجب أن يكون حرفين على الأقل')
    .max(25, 'الاسم الأول يجب أن لا يتجاوز 25 حرفاً')
    .trim(),
  lastName: z
    .string()
    .min(2, 'الاسم الأخير يجب أن يكون حرفين على الأقل')
    .max(25, 'الاسم الأخير يجب أن لا يتجاوز 25 حرفاً')
    .trim(),
  email: z
    .string()
    .email('البريد الإلكتروني غير صالح')
    .trim(),
  password: z
    .string()
    .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل')
    .regex(passwordRegex, 'كلمة المرور يجب أن تحتوي على حرف كبير وحرف صغير ورقم'),
  confirmPassword: z
    .string()
    .min(1, 'تأكيد كلمة المرور مطلوب'),
  phone: z
    .string()
    .regex(phoneRegex, 'رقم الجوال يجب أن يبدأ ب 05 ويحتوي على 10 أرقام')
    .optional(),
  address: z
    .string()
    .min(5, 'العنوان يجب أن يكون 5 أحرف على الأقل')
    .max(200, 'العنوان يجب أن لا يتجاوز 200 حرف')
    .optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'كلمتا المرور غير متطابقتين',
  path: ['confirmPassword'],
});

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'الاسم يجب أن يكون حرفين على الأقل')
    .max(50, 'الاسم يجب أن لا يتجاوز 50 حرفاً')
    .trim()
    .optional(),
  email: z
    .string()
    .email('البريد الإلكتروني غير صالح')
    .trim()
    .optional(),
  phone: z
    .string()
    .regex(phoneRegex, 'رقم الجوال يجب أن يبدأ ب 05 ويحتوي على 10 أرقام')
    .optional(),
  address: z
    .string()
    .min(5, 'العنوان يجب أن يكون 5 أحرف على الأقل')
    .max(200, 'العنوان يجب أن لا يتجاوز 200 حرف')
    .optional(),
});

export const shippingMethodSchema = z.object({
  shippingMethod: z
    .enum(['standard', 'express', 'same-day'], {
      required_error: 'طريقة الشحن مطلوبة',
    }),
});

// Product schemas
export const productSchema = z.object({
  name: z
    .string()
    .min(2, 'اسم المنتج مطلوب')
    .max(100, 'اسم المنتج يجب أن لا يتجاوز 100 حرف')
    .trim(),
  description: z
    .string()
    .min(10, 'الوصف يجب أن يكون 10 أحرف على الأقل')
    .max(1000, 'الوصف يجب أن لا يتجاوز 1000 حرف')
    .trim(),
  price: z
    .string()
    .min(1, 'السعر مطلوب')
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: 'السعر يجب أن يكون رقماً موجباً',
    }),
  stock: z
    .string()
    .min(1, 'المخزون مطلوب')
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number.isInteger(Number(val)), {
      message: 'المخزون يجب أن يكون رقماً صحيحاً موجباً',
    }),
  category: z
    .enum(['cement', 'steel', 'wood', 'paint', 'tools', 'electrical', 'plumbing', 'other'], {
      required_error: 'الفئة مطلوبة',
    }),
  shippingCost: z
    .string()
    .optional()
    .refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0), {
      message: 'تكلفة الشحن يجب أن تكون رقماً موجباً',
    }),
});

export const updateProductSchema = productSchema.partial();

// Order schemas
export const orderItemSchema = z.object({
  product: z
    .string()
    .min(1, 'معرف المنتج مطلوب'),
  quantity: z
    .string()
    .min(1, 'الكمية مطلوبة')
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 1 && Number.isInteger(Number(val)), {
      message: 'الكمية يجب أن تكون رقماً صحيحاً موجباً',
    }),
});

export const orderSchema = z.object({
  items: z
    .array(orderItemSchema)
    .min(1, 'يجب أن يحتوي الطلب على عنصر واحد على الأقل'),
  shippingAddress: z
    .string()
    .min(10, 'عنوان الشحن يجب أن يكون 10 أحرف على الأقل')
    .max(300, 'عنوان الشحن يجب أن لا يتجاوز 300 حرف')
    .trim(),
  phone: z
    .string()
    .regex(phoneRegex, 'رقم الجوال يجب أن يبدأ ب 05 ويحتوي على 10 أرقام'),
});

// Search schemas
export const productSearchSchema = z.object({
  q: z
    .string()
    .min(1, 'كلمة البحث مطلوبة')
    .max(100, 'كلمة البحث يجب أن لا تتجاوز 100 حرف')
    .optional(),
  category: z
    .enum(['cement', 'steel', 'wood', 'paint', 'tools', 'electrical', 'plumbing', 'other'])
    .optional(),
  minPrice: z
    .string()
    .optional()
    .refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0), {
      message: 'الحد الأدنى للسعر يجب أن يكون رقماً موجباً',
    }),
  maxPrice: z
    .string()
    .optional()
    .refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0), {
      message: 'الحد الأقصى للسعر يجب أن يكون رقماً موجباً',
    }),
}).refine((data) => {
  if (data.minPrice && data.maxPrice) {
    return Number(data.maxPrice) >= Number(data.minPrice);
  }
  return true;
}, {
  message: 'الحد الأقصى للسعر يجب أن يكون أكبر من أو يساوي الحد الأدنى',
  path: ['maxPrice'],
});

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type BuyerRegisterFormData = z.infer<typeof buyerRegisterSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type ShippingMethodFormData = z.infer<typeof shippingMethodSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type UpdateProductFormData = z.infer<typeof updateProductSchema>;
export type OrderFormData = z.infer<typeof orderSchema>;
export type ProductSearchFormData = z.infer<typeof productSearchSchema>;
