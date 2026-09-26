import { auth, signOut } from "@/auth";

export default async function CardPage() {
  const session = await auth();

  const studentNumber = (session?.user as NonNullable<typeof session>["user"] & {
    studentNumber?: string;
  })?.studentNumber;
  const memberNumber = (session?.user as NonNullable<typeof session>["user"] & {
    memberNumber?: string;
  })?.memberNumber;

  return (
    <main>
      <h1>Olá, {session?.user?.name}!</h1>

      <p>Obrigado por seres sócio do NECC! 🎉</p>

      <p>
        Número de estudante: <strong>{studentNumber}</strong>
      </p>
      <p>
        Número de sócio: <strong>{memberNumber}</strong>
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