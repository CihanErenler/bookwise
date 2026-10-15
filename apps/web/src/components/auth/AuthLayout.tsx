import type { ReactNode } from "react";
import { Link } from "react-router";

type AuthLayoutProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

const CalendarIcon = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

const Brand = ({ light = false }: { light?: boolean }) => (
  <Link to="/" className="inline-flex items-center gap-2">
    <span
      className={`flex h-9 w-9 items-center justify-center rounded-xl ${
        light ? "bg-white/20 text-white" : "bg-indigo-600 text-white"
      }`}
    >
      <CalendarIcon className="h-5 w-5" />
    </span>
    <span className={`text-xl font-bold tracking-tight ${light ? "text-white" : "text-gray-900"}`}>
      Bookwise
    </span>
  </Link>
);

export const AuthLayout = ({ title, subtitle, children }: AuthLayoutProps) => (
  <div className="grid min-h-screen lg:grid-cols-2">
    <aside className="relative hidden flex-col justify-between overflow-hidden bg-indigo-600 p-12 text-white lg:flex">
      <div className="relative">
        <Brand light />
      </div>
      <div className="relative max-w-md">
        <h2 className="text-4xl font-bold leading-tight">Book appointments in seconds.</h2>
        <p className="mt-4 text-lg text-indigo-100">
          Schedule, manage and keep track of every appointment in one place with Bookwise.
        </p>
      </div>
      <p className="relative text-sm text-indigo-100">
        &copy; {new Date().getFullYear()} Bookwise
      </p>
    </aside>

    <main className="flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 lg:hidden">
          <Brand />
        </div>
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </main>
  </div>
);
