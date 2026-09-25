import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

export default async function CardPage() {
  const session = await auth();

  // if (!session) {
  //   redirect("/");
  // }

  return (
    <main>
      <h1>Cartão de Sócio</h1>
      <p>{session?.user?.email}</p>

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
