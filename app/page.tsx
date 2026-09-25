import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();

  // if (session) {
  //   redirect("/card");
  // }

  return (
    <main>
      <h1>Login</h1>

      <form
        action={async (formData) => {
          "use server";

          await signIn("resend", {
            email: formData.get("email"),
            redirectTo: "/card",
          });
        }}
      >
        <input type="email" name="email" placeholder="Email" required />

        <button type="submit">Entrar</button>
      </form>
    </main>
  );
}
