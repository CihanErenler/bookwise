import { useLogout } from "../auth/hooks";
import { useAuthStore } from "../auth/store";
import { VerificationBanner } from "../components/auth/VerificationBanner";
import { Button, Link } from "../components/ui";

const LandingPage = () => {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  return (
    <>
      <VerificationBanner />
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Bookwise</h1>
        <p className="max-w-md text-gray-600">
          Schedule, manage and keep track of every appointment in one place.
        </p>
        {user ? (
          <>
            <p className="text-gray-600">Signed in as {user.name}</p>
            <Button onClick={() => logout.mutate()} disabled={logout.isPending}>
              Log out
            </Button>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              to="/signup"
              className="rounded-lg bg-indigo-600 px-4 py-2 !text-white hover:bg-indigo-700 hover:no-underline"
            >
              Try the demo
            </Link>
            <Link to="/login">Log in</Link>
          </div>
        )}
      </main>
    </>
  );
};

export default LandingPage;
