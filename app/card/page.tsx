import { auth, signOut } from "@/auth";

function formatStudentNumber(studentNumber?: string | null) {
  if (!studentNumber) {
    return "A------";
  }

  return studentNumber.replace(/^[a-z]+/i, (letters) => letters.toUpperCase());
}

export default async function CardPage() {
  const session = await auth();

  return (
    <main className="flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-[#161E2E] px-4 py-6">
      <div className="relative w-full max-w-105">
        <div className="absolute -inset-12 rounded-full bg-[#3B9EFF]/20 blur-3xl" />
        <div className="relative aspect-[1.6/1] w-full overflow-hidden rounded-2xl bg-linear-to-br from-[#5C8DFF] to-[#6B5BF9] p-5 text-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-transform duration-300 hover:scale-110 sm:p-6">
          <div className="relative flex h-full flex-col justify-between">
            <div className="flex items-start justify-between">
              <span className="text-2xl font-bold sm:text-3xl">
                NECC
              </span>

              <div className="text-right">
                <p className="text-sm font-medium tracking-wider text-white sm:text-base">
                  Sócio Nr: {session?.user?.memberNumber || "---"}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-white sm:text-base">
                {formatStudentNumber(session?.user?.studentNumber)}
              </p>

              <p className="mt-1 truncate text-xl font-medium text-white sm:text-2xl">
                {session?.user?.name || "Nome Completo do Sócio"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <form
        action={async () => {
          "use server";

          await signOut({
            redirectTo: "/",
          });
        }}
        className="relative z-10 mt-8 sm:mt-10"
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