"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import type { ApiResponse } from "@/types/api";
import { getApiErrorMessage } from "@/lib/apiError";

type YearRegistration = {
  year: number;
  total: number;
};

type UserStatisticsData = {
  totalUsers: number;
  registrationsByYear: YearRegistration[];
};

export default function UserStatistics() {
  const [statistics, setStatistics] = useState<UserStatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadStatistics() {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get<ApiResponse<UserStatisticsData>>(
          "/api/users/statistics",
        );

        if (!cancelled) {
          setStatistics(response.data.data);
        }
      } catch (error) {
        if (!cancelled) {
          setError(getApiErrorMessage(error));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadStatistics();

    return () => {
      cancelled = true;
    };
  }, []);

  const maxRegistrations = Math.max(
    1,
    ...(statistics?.registrationsByYear.map((item) => item.total) ?? []),
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white">
          Estatísticas de sócios
        </h3>

        <p className="mt-1 text-sm text-[#92B4D4]">
          Analisa a evolução das inscrições no NECC.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-white/10 bg-[#202A3D] px-5 py-12 text-center text-sm text-[#92B4D4]">
          A carregar estatísticas...
        </div>
      ) : statistics ? (
        <>
          {/* Inscrições por ano */}
          <div className="rounded-xl border border-white/10 bg-[#202A3D] p-6">
            <div className="mb-6">
              <h4 className="font-semibold text-white">Inscrições por ano</h4>

              <p className="mt-1 text-sm text-[#92B4D4]">
                Distribuição dos sócios pela respetiva data de inscrição.
              </p>
            </div>

            {statistics.registrationsByYear.length === 0 ? (
              <p className="py-8 text-center text-sm text-[#92B4D4]">
                Não existem inscrições com data registada.
              </p>
            ) : (
              <div className="space-y-5">
                {statistics.registrationsByYear.map((item) => (
                  <div key={item.year}>
                    <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                      <span className="text-[#92B4D4]">{item.year}</span>

                      <span className="font-medium text-white">
                        {item.total.toLocaleString("pt-PT")}{" "}
                        {item.total === 1 ? "sócio" : "sócios"}
                      </span>
                    </div>

                    <div className="h-2.5 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-[#3B9EFF] transition-all duration-300"
                        style={{
                          width: `${(item.total / maxRegistrations) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
