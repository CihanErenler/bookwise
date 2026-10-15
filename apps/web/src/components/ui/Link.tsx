import { Link as RouterLink, type LinkProps } from "react-router";

export const Link = ({ className = "", ...props }: LinkProps) => (
  <RouterLink
    className={`text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${className}`}
    {...props}
  />
);
