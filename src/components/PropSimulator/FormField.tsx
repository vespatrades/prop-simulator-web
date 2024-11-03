import type { FormFieldProps } from './types';

export function FormField({ 
  label, 
  name, 
  type, 
  defaultValue,
  ...props 
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        className="w-full p-2 border rounded bg-white text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500 [&::-webkit-inner-spin-button]:opacity-25 [&::-webkit-outer-spin-button]:opacity-25"
        {...props}
      />
    </div>
  );
}
