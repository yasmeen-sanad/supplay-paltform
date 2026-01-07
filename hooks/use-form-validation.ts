import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

interface UseFormValidationProps<T extends z.ZodSchema> {
  schema: T;
  defaultValues?: z.infer<T> | (() => Promise<z.infer<T>>);
  onSubmit?: (data: z.infer<T>) => Promise<void>;
}

export function useFormValidation<T extends z.ZodSchema>({
  schema,
  defaultValues,
  onSubmit,
}: UseFormValidationProps<T>) {
  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as any,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const handleSubmit = async (data: z.infer<T>) => {
    try {
      await onSubmit?.(data);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'حدث خطأ ما';
      toast.error(errorMessage);

      (form.setError as any)('root', { message: errorMessage });
      
      // If there are validation errors from the backend, set them
      if (error?.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        error.response.data.errors.forEach((errorMsg: string, index: number) => {
          // Try to map error messages to form fields using type assertion
          if (errorMsg.includes('البريد الإلكتروني')) {
            (form.setError as any)('email', { message: errorMsg });
          } else if (errorMsg.includes('كلمة المرور')) {
            (form.setError as any)('password', { message: errorMsg });
          } else if (errorMsg.includes('الاسم')) {
            (form.setError as any)('name', { message: errorMsg });
          } else if (errorMsg.includes('رقم الجوال')) {
            (form.setError as any)('phone', { message: errorMsg });
          } else if (errorMsg.includes('العنوان')) {
            (form.setError as any)('address', { message: errorMsg });
          } else if (errorMsg.includes('السعر')) {
            (form.setError as any)('price', { message: errorMsg });
          } else if (errorMsg.includes('المخزون')) {
            (form.setError as any)('stock', { message: errorMsg });
          } else if (errorMsg.includes('الفئة')) {
            (form.setError as any)('category', { message: errorMsg });
          } else if (errorMsg.includes('الوصف')) {
            (form.setError as any)('description', { message: errorMsg });
          } else if (errorMsg.includes('الكمية')) {
            (form.setError as any)(index === 0 ? 'items' : `items.${index}.quantity`, { message: errorMsg });
          } else if (errorMsg.includes('عنوان الشحن')) {
            (form.setError as any)('shippingAddress', { message: errorMsg });
          }
        });
      }
    }
  };

  return {
    form,
    handleSubmit: form.handleSubmit(handleSubmit),
    isSubmitting: form.formState.isSubmitting,
    errors: form.formState.errors,
    isValid: form.formState.isValid,
    isDirty: form.formState.isDirty,
  };
}
