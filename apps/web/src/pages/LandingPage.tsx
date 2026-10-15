import { useLogout } from "../auth/hooks";
import { useAuthStore } from "../auth/store";
import { Button, Link } from "../components/ui";

const LandingPage = () => {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Bookwise</h1>
      {user ? (
        <>
          <p className="text-gray-600">Signed in as {user.name}</p>
          <Button onClick={() => logout.mutate()} disabled={logout.isPending}>
            Log out
          </Button>
        </>
      ) : (
        <Link to="/login">Log in</Link>
      )}
    </main>
  );
};

export default LandingPage;
