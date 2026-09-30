export type User = {
  id: string;
  name: string;
  email: string | null;
  studentNumber: string | null;
  phoneNumber: string | null;
  since: string | null;
  memberNumber: number;
};

export type UserForm = {
  name: string;
  email: string;
  studentNumber: string;
  phoneNumber: string;
};

declare module "next-auth" {
  interface User {
    role: "MEMBER" | "ADMIN";
    name: string;
    memberNumber: number;
    studentNumber: string | null;
  }

  interface Session {
    user: {
      role: "MEMBER" | "ADMIN";
      name: string;
      memberNumber: number;
      studentNumber: string | null;
    };
  }
}
