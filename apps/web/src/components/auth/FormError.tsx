export const FormError = ({ message }: { message?: string }) =>
  message ? (
    <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
      {message}
    </p>
  ) : null;
