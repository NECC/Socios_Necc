import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

export default async function CardPage() {
  const session = await auth();

  if (!session) {
    redirect("/");
  } else if (session.user.role === "ADMIN") {
    redirect("/backoffice");
  }

  const { memberNumber, studentNumber, name } = session.user;

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 overflow-hidden bg-[#161E2E] p-4">
      <div className="relative w-full max-w-105">
        <div className="absolute -inset-12 rounded-full bg-[#3B9EFF]/20 blur-3xl" />

        <div className="relative flex aspect-[1.6/1] flex-col justify-between rounded-2xl bg-linear-to-br from-[#5C8DFF] to-[#6B5BF9] p-5 text-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-transform duration-300 hover:scale-110 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <span className="text-2xl font-bold sm:text-3xl">NECC</span>
            <p className="text-sm font-medium tracking-wider sm:text-base">
              Sócio Nr: {memberNumber || "---"}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium sm:text-base">
              {studentNumber ?? "A------"}
            </p>
            <p className="mt-1 text-xl font-medium leading-tight sm:text-2xl">
              {name || "Nome Completo do Sócio"}
            </p>
          </div>
        </div>
      </div>

      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <button
          type="submit"
          className="cursor-pointer rounded-lg px-5 py-2.5 text-sm font-medium text-[#92B4D4]/60 transition-colors hover:bg-white/5 hover:text-white"
        >
          Terminar sessão
        </button>
      </form>
    </main>
  );
}
