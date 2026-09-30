import axios from "axios";
import type { ApiError } from "@/types/api";

export function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError<ApiError>(error)) {
    return error.response?.data.message ?? "An unexpected error occurred";
  }

  return "An unexpected error occurred";
}