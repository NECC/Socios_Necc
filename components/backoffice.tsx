"use client";

import axios from "axios";
import { useEffect, useState } from "react";

type User = {
  id: string;
  name: string;
  email: string | null;
  studentNumber: string | null;
  phoneNumber: string | null;
  since: string | null;
  memberNumber: number;
};

type UserForm = {
  name: string;
  email: string;
  studentNumber: string;
  phoneNumber: string;
};

const emptyForm: UserForm = {
  name: "",
  email: "",
  studentNumber: "",
  phoneNumber: "",
};

export default function Backoffice() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState<UserForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  async function loadUsers(searchValue = "") {
    setLoading(true);

    try {
      const response = await axios.get<User[]>("/api/users", {
        params: {
          search: searchValue,
        },
      });

      setUsers(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadUsers(search);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  function openCreateModal() {
    setEditingUser(null);
    setForm(emptyForm);
    setShowModal(true);
  }

  function openEditModal(user: User) {
    setEditingUser(user);

    setForm({
      name: user.name,
      email: user.email ?? "",
      studentNumber: user.studentNumber ?? "",
      phoneNumber: user.phoneNumber ?? "",
    });

    setShowModal(true);
  }

  function closeModal() {
    if (saving) {
      return;
    }

    setShowModal(false);
    setEditingUser(null);
    setForm(emptyForm);
  }

  function updateForm(field: keyof UserForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function saveUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim()) {
      alert("O nome é obrigatório.");
      return;
    }

    setSaving(true);

    const data = {
      name: form.name.trim(),
      email: form.email.trim() || null,
      studentNumber: form.studentNumber.trim() || null,
      phoneNumber: form.phoneNumber.trim() || null,
    };

    try {
      if (editingUser) {
        const response = await axios.patch<User>(
          `/api/users/${editingUser.id}`,
          data,
        );

        setUsers((current) =>
          current.map((user) =>
            user.id === editingUser.id ? response.data : user,
          ),
        );
      } else {
        const response = await axios.post<User>("/api/users", data);

        setUsers((current) =>
          [...current, response.data].sort(
            (a, b) => a.memberNumber - b.memberNumber,
          ),
        );
      }

      closeModal();
    } catch (error) {
      console.error(error);

      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message ?? "Erro ao guardar sócio.");
      } else {
        alert("Erro ao guardar sócio.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function deleteUser(id: string) {
    const confirmed = window.confirm(
      "Tens a certeza que queres apagar este sócio?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(`/api/users/${id}`);

      setUsers((current) => current.filter((user) => user.id !== id));
    } catch (error) {
      console.error(error);
      alert("Erro ao apagar sócio");
    }
  }

  return (
    <>
      <section className="mx-auto w-full max-w-7xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Sócios</h2>

            <p className="mt-1 text-sm text-[#92B4D4]">
              Gerir os membros do NECC
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="cursor-pointer rounded-lg bg-[#3B9EFF] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#2D8FEF]"
          >
            Novo sócio
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Pesquisar por nome ou email..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-lg border border-white/10 bg-[#202A3D] px-4 py-3 text-sm text-white outline-none placeholder:text-[#92B4D4]/50 focus:border-[#3B9EFF]"
          />
        </div>

        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#202A3D]">
          <div className="max-h-[calc(100dvh-260px)] overflow-auto">
            <table className="w-full">
              <thead className="border-b border-white/10">
                <tr className="text-left text-sm text-[#92B4D4]">
                  <th className="px-5 py-4">Sócio</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">N.º Sócio</th>
                  <th className="px-5 py-4">Curso</th>
                  <th className="px-5 py-4 text-right">Ações</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-8 text-center text-sm text-[#92B4D4]"
                    >
                      A carregar...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-8 text-center text-sm text-[#92B4D4]"
                    >
                      Nenhum sócio encontrado.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-white/5 text-sm last:border-0"
                    >
                      <td className="px-5 py-4 font-medium text-white">
                        {user.name}
                      </td>

                      <td className="px-5 py-4 text-[#92B4D4]">
                        {user.email ?? "-"}
                      </td>

                      <td className="px-5 py-4 text-[#92B4D4]">
                        #{user.memberNumber}
                      </td>

                      <td className="px-5 py-4 text-[#92B4D4]">
                        {user.studentNumber ?? "-"}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(user)}
                            className="cursor-pointer rounded-md px-3 py-1.5 text-xs text-[#92B4D4] hover:bg-white/5 hover:text-white"
                          >
                            Editar
                          </button>

                          <button
                            onClick={() => deleteUser(user.id)}
                            className="cursor-pointer rounded-md px-3 py-1.5 text-xs text-red-400 hover:bg-red-400/10"
                          >
                            Apagar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {showModal && (
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
                onClick={closeModal}
                disabled={saving}
                className="cursor-pointer rounded-md px-2 py-1 text-xl text-[#92B4D4] hover:bg-white/5 hover:text-white disabled:opacity-50"
              >
                ×
              </button>
            </div>

            <form onSubmit={saveUser}>
              <div className="space-y-4 px-6 py-6">
                <div>
                  <label className="mb-2 block text-sm text-[#92B4D4]">
                    Nome
                  </label>

                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) => updateForm("name", event.target.value)}
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
                    onChange={(event) =>
                      updateForm("email", event.target.value)
                    }
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
                      updateForm("studentNumber", event.target.value)
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
                      updateForm("phoneNumber", event.target.value)
                    }
                    className="w-full rounded-lg border border-white/10 bg-[#161E2E] px-4 py-3 text-sm text-white outline-none placeholder:text-[#92B4D4]/50 focus:border-[#3B9EFF]"
                    placeholder="912345678"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-white/10 px-6 py-4">
                <button
                  type="button"
                  onClick={closeModal}
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
      )}
    </>
  );
}
