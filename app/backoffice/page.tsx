import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Backoffice from "@/components/backoffice";

export default async function BackofficePage() {
  const session = await auth();

  if (!session) {
    redirect("/");
  } else if (session.user.role === "MEMBER") {
    redirect("/card");
  }
  return (
    <main className="min-h-dvh bg-[#161E2E]">
      <header className="flex h-16 items-center justify-between border-b border-white/10 px-6">
        <h1 className="text-lg font-semibold text-white">Gestão de Sócios</h1>

        <form
          action={async () => {
            "use server";

            await signOut({
              redirectTo: "/",
            });
          }}
        >
          <button
            type="submit"
            className="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-[#92B4D4] transition-colors hover:bg-white/5 hover:text-white"
          >
            Terminar sessão
          </button>
        </form>
      </header>

      <Backoffice />
    </main>
  );
}
