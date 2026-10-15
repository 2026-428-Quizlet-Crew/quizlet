"use client";

// TODO: Replace with supabase logins?

import { createContext, useContext, type ReactNode } from "react";
import type { User } from "./User";

const AuthContext = createContext<User | null>(null);

/** Supplies the logged-in user. Login is not implemented, so this is always null. */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  return <AuthContext value={null}>{children}</AuthContext>;
};

export const useCurrentUser = (): User | null => useContext(AuthContext);
