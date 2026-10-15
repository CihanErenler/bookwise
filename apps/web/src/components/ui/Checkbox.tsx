import { useId, type ComponentProps } from "react";

type CheckboxProps = Omit<ComponentProps<"input">, "id" | "type"> & {
  label: string;
};

export const Checkbox = ({ label, className = "", ...props }: CheckboxProps) => {
  const id = useId();

  return (
    <div className="flex items-center gap-2">
      <input
        id={id}
        type="checkbox"
        className={`h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 ${className}`}
        {...props}
      />
      <label htmlFor={id} className="text-sm text-gray-700">
        {label}
      </label>
    </div>
  );
};
