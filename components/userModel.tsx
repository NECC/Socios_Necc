"use client";

import type { FormEvent } from "react";
import type { User, UserForm } from "@/types/user";

type UserModalProps = {
  show: boolean;
  editingUser: User | null;
  form: UserForm;
  saving: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onChange: (field: keyof UserForm, value: string) => void;
};

export default function UserModal({
  show,
  editingUser,
  form,
  saving,
  onClose,
  onSubmit,
  onChange,
}: UserModalProps) {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl border border-white/10 bg-[#202A3D] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <h3 className="text-lg font-semibold text-white">
              {editingUser ? "Editar sócio" : "Novo sócio"}
            </h3>

            <p className="mt-1 text-sm text-[#92B4D4]">
              {editingUser
                ? "Alterar os dados deste sócio."
                : "Adicionar um novo sócio ao NECC."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="cursor-pointer rounded-md px-2 py-1 text-xl text-[#92B4D4] hover:bg-white/5 hover:text-white disabled:opacity-50"
          >
            ×
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="space-y-4 px-6 py-6">
            <div>
              <label className="mb-2 block text-sm text-[#92B4D4]">
                Nome
              </label>

              <input
                type="text"
                value={form.name}
                onChange={(event) => onChange("name", event.target.value)}
                required
                className="w-full rounded-lg border border-white/10 bg-[#161E2E] px-4 py-3 text-sm text-white outline-none placeholder:text-[#92B4D4]/50 focus:border-[#3B9EFF]"
                placeholder="Nome completo"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-[#92B4D4]">
                Email
              </label>

              <input
                type="email"
                value={form.email}
                onChange={(event) => onChange("email", event.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#161E2E] px-4 py-3 text-sm text-white outline-none placeholder:text-[#92B4D4]/50 focus:border-[#3B9EFF]"
                placeholder="email@exemplo.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-[#92B4D4]">
                N.º Estudante
              </label>

              <input
                type="text"
                value={form.studentNumber}
                onChange={(event) =>
                  onChange("studentNumber", event.target.value)
                }
                className="w-full rounded-lg border border-white/10 bg-[#161E2E] px-4 py-3 text-sm text-white outline-none placeholder:text-[#92B4D4]/50 focus:border-[#3B9EFF]"
                placeholder="PG-59783"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-[#92B4D4]">
                Telefone
              </label>

              <input
                type="tel"
                value={form.phoneNumber}
                onChange={(event) =>
                  onChange("phoneNumber", event.target.value)
                }
                className="w-full rounded-lg border border-white/10 bg-[#161E2E] px-4 py-3 text-sm text-white outline-none placeholder:text-[#92B4D4]/50 focus:border-[#3B9EFF]"
                placeholder="912345678"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-white/10 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="cursor-pointer rounded-lg px-4 py-2.5 text-sm font-medium text-[#92B4D4] transition hover:bg-white/5 hover:text-white disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="cursor-pointer rounded-lg bg-[#3B9EFF] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#2D8FEF] disabled:opacity-50"
            >
              {saving
                ? "A guardar..."
                : editingUser
                  ? "Guardar alterações"
                  : "Criar sócio"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}