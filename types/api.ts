export type ApiResponse<T> = {
  status: "success";
  data: T;
};

export type ApiError = {
  status: "error";
  message: string;
};
