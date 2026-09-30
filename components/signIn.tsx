"use client";

import { useState } from "react";
import axios from "axios";
import { signIn } from "next-auth/react";
import { showToast } from "nextjs-toast-notify";
import type { ApiResponse } from "@/types/api";
import { getApiErrorMessage } from "@/lib/apiError";

type CheckUserResponse = {
  exists: boolean;
};

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      const response = await axios.post<ApiResponse<CheckUserResponse>>(
        "/api/checkUser",
        {
          email: normalizedEmail,
        },
      );

      if (!response.data.data.exists) {
        showToast.error("Email não registado", {
          duration: 4000,
          progress: false,
          position: "top-right",
          transition: "swingInverted",
          icon: "",
          sound: false,
        });

        return;
      }

      await signIn("resend", {
        email: normalizedEmail,
        redirect: false,
        redirectTo: "/card",
      });

      setEmailSent(true);
    } catch (error) {
      showToast.error(getApiErrorMessage(error), {
        duration: 4000,
        progress: false,
        position: "top-right",
        transition: "swingInverted",
        icon: "",
        sound: false,
      });
    } finally {
      setLoading(false);
    }
  }

  if (emailSent) {
    return (
      <div className="rounded-xl border border-[#3B9EFF]/20 bg-[#3B9EFF]/5 p-5">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3B9EFF]/10 text-xl">
            ✉️
          </div>

          <h2 className="font-medium text-white">Email enviado!</h2>
        </div>

        <p className="text-sm leading-6 text-[#92B4D4]">
          Enviámos um link de acesso para:
        </p>

        <p className="mt-1 break-all font-medium text-white">{email}</p>

        <p className="mt-3 text-sm leading-6 text-[#92B4D4]">
          Verifica a tua caixa de entrada e clica no link para continuar.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-[#92B4D4]"
        >
          Email
        </label>

        <input
          id="email"
          type="email"
          name="email"
          placeholder="nome@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          className="w-full rounded-xl border border-[#92B4D4]/20 bg-white/4 px-4 py-3.5 text-white outline-none transition placeholder:text-[#92B4D4]/40 focus:border-[#3B9EFF] focus:ring-2 focus:ring-[#3B9EFF]/20 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full cursor-pointer rounded-xl bg-[#3B9EFF] px-4 py-3.5 font-medium text-white transition hover:bg-[#3B9EFF]/85 focus:outline-none focus:ring-2 focus:ring-[#3B9EFF] focus:ring-offset-2 focus:ring-offset-[#161E2E] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "A verificar..." : "Entrar"}
      </button>
    </form>
  );
}
