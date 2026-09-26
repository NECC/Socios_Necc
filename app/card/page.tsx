import { auth, signOut } from "@/auth";

export default async function CardPage() {
  const session = await auth();

  return (
    <main>
      <h1>Olá, {session?.user.name}!</h1>

      <p>Obrigado por seres sócio do NECC! 🎉</p>

      <p>
        Número de estudante: <strong>{session?.user?.studentNumber}</strong>
      </p>
      <p>
        Número de sócio: <strong>{session?.user?.memberNumber}</strong>
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