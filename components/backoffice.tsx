"use client";

import axios from "axios";
import { useCallback, useState } from "react";
import type { User, UserForm } from "@/types/user";
import type { ApiResponse } from "@/types/api";
import { getApiErrorMessage } from "@/lib/apiError";
import UserModal from "./userModel";
import UserSearch, { type SearchType } from "./userSearch";

const emptyForm: UserForm = {
  name: "",
  email: "",
  studentNumber: "",
  phoneNumber: "",
};

export default function Backoffice() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearch, setHasSearch] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState<UserForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadUsers = useCallback(
    async (searchType: SearchType, searchValue: string) => {
      const value = searchValue.trim();

      if (!value) {
        setUsers([]);
        setHasSearch(false);
        setLoading(false);
        return;
      }

      setHasSearch(true);
      setLoading(true);

      try {
        const response = await axios.get<ApiResponse<User[]>>("/api/users", {
          params: {
            type: searchType,
            value,
          },
        });

        setUsers(response.data.data);
      } catch (error) {
        alert(getApiErrorMessage(error));
      } finally {
        setLoading(false);
      }
    },
    [],
  );

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
        const response = await axios.patch<ApiResponse<User>>(
          `/api/users/${editingUser.id}`,
          data,
        );

        setUsers((current) =>
          current.map((user) =>
            user.id === editingUser.id ? response.data.data : user,
          ),
        );
      } else {
        const response = await axios.post<ApiResponse<User>>(
          "/api/users",
          data,
        );

        setUsers((current) =>
          [...current, response.data.data].sort(
            (a, b) => a.memberNumber - b.memberNumber,
          ),
        );
      }

      closeModal();
    } catch (error) {
      alert(getApiErrorMessage(error));
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
      await axios.delete<ApiResponse<null>>(`/api/users/${id}`);

      setUsers((current) => current.filter((user) => user.id !== id));
    } catch (error) {
      alert(getApiErrorMessage(error));
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

        <UserSearch onSearch={loadUsers} />

        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#202A3D]">
          <div className="max-h-[calc(100dvh-260px)] overflow-auto">
            <table className="w-full">
              <thead className="border-b border-white/10">
                <tr className="text-left text-sm text-[#92B4D4]">
                  <th className="px-5 py-4">Sócio</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">N.º Sócio</th>
                  <th className="px-5 py-4">N.º Aluno</th>
                  <th className="px-5 py-4">Telemóvel</th>
                  <th className="px-5 py-4 text-right">Ações</th>
                </tr>
              </thead>

              <tbody>
                {!hasSearch ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center text-sm text-[#92B4D4]"
                    >
                      Adiciona um filtro para veres sócios
                    </td>
                  </tr>
                ) : loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-8 text-center text-sm text-[#92B4D4]"
                    >
                      A carregar...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-8 text-center text-sm text-[#92B4D4]"
                    >
                      Nenhum sócio encontrado
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

                      <td className="px-5 py-4 text-[#92B4D4]">
                        {user.phoneNumber ?? "-"}
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
        <UserModal
          show={showModal}
          editingUser={editingUser}
          form={form}
          saving={saving}
          onClose={closeModal}
          onSubmit={saveUser}
          onChange={updateForm}
        />
      )}
    </>
  );
}
