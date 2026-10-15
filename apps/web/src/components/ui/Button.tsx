import type { ComponentProps } from "react";

export const Button = ({ className = "", type = "button", ...props }: ComponentProps<"button">) => (
  <button
    type={type}
    className={`rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);
