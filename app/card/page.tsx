import { auth, signOut } from "@/auth";

export default async function CardPage() {
  const session = await auth();
  const studentNumber = (
    session?.user as { studentNumber?: string } | undefined
  )?.studentNumber;

  console.log("session", session);

  return (
    <main>
      <h1>Olá, {session?.user?.name}!</h1>

      <p>Parabéns por assumires que és gay e por seres sócio do NECC! 🏳️‍🌈</p>

      <p>
        Número de estudante: <strong>{studentNumber}</strong>
      </p>

      <form
        action={async () => {
          "use server";

          await signOut({
            redirectTo: "/",
          });
        }}
      >
        <button type="submit">Sair</button>
      </form>
    </main>
  );
}
