"use client";

import { useEffect, useState } from "react";

export type SearchType =
  | "name"
  | "email"
  | "memberNumber"
  | "studentNumber"
  | "phoneNumber"
  | "year";

type SearchOption = {
  value: SearchType;
  label: string;
  placeholder: string;
};

const searchOptions: SearchOption[] = [
  {
    value: "name",
    label: "Nome",
    placeholder: "Pesquisar por nome. Ex: Alan Turing",
  },
  {
    value: "email",
    label: "Email",
    placeholder: "Pesquisar por email. Ex: turing@uminho.pt",
  },
  {
    value: "memberNumber",
    label: "N.º de sócio",
    placeholder: "Pesquisar por n.º de sócio. Ex: 123",
  },
  {
    value: "studentNumber",
    label: "N.º de aluno",
    placeholder: "Pesquisar por n.º de aluno. Ex: A123 ou PG123 ou E123",
  },
  {
    value: "phoneNumber",
    label: "Telemóvel",
    placeholder: "Pesquisar por telemóvel. Ex: 912345678",
  },
  {
    value: "year",
    label: "Ano de inscrição",
    placeholder: "Introduzir ano. Ex: 2027",
  },
];

type UserSearchProps = {
  onSearch: (type: SearchType, value: string) => void;
};

export default function UserSearch({ onSearch }: UserSearchProps) {
  const [searchType, setSearchType] = useState<SearchType>("name");
  const [search, setSearch] = useState("");

  const selectedSearchOption = searchOptions.find(
    (option) => option.value === searchType,
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      const value = search.trim();

      if (!value) {
        onSearch(searchType, "");
        return;
      }

      if (searchType === "year" && !/^\d{4}$/.test(value)) {
        return;
      }

      onSearch(searchType, value);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, searchType, onSearch]);

  function handleSearchTypeChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setSearchType(event.target.value as SearchType);
    setSearch("");
  }

  return (
    <div className="mb-6 flex flex-col gap-2 sm:flex-row">
      <select
        value={searchType}
        onChange={handleSearchTypeChange}
        className="cursor-pointer rounded-lg border border-white/10 bg-[#202A3D] px-4 py-3 text-sm text-white outline-none focus:border-[#3B9EFF]"
      >
        {searchOptions.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-[#202A3D] text-white"
          >
            {option.label}
          </option>
        ))}
      </select>

      <input
        type="text"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder={selectedSearchOption?.placeholder}
        className="min-w-0 flex-1 rounded-lg border border-white/10 bg-[#202A3D] px-4 py-3 text-sm text-white outline-none placeholder:text-[#92B4D4]/50 focus:border-[#3B9EFF]"
      />
    </div>
  );
}
