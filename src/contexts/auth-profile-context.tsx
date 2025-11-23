"use client";

import { createContext, useContext } from "react";
import type { AuthProfile } from "@/utils/access-core";

const AuthProfileContext = createContext<AuthProfile | null>(null);

type AuthProfileProviderProps = {
  profile: AuthProfile;
  children: React.ReactNode;
};

export function AuthProfileProvider({ profile, children }: AuthProfileProviderProps) {
  return (
    <AuthProfileContext.Provider value={profile}>
      {children}
    </AuthProfileContext.Provider>
  );
}

export function useAuthProfile() {
  return useContext(AuthProfileContext);
}
