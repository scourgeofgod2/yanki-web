import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      credits: number;
      plan: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    credits: number;
    plan: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    credits: number;
    plan: string;
  }
}