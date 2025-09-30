// contexts/UserRolesContext.tsx
"use client";

import { createContext, useContext, useState } from "react";

type UserRolesContextType = {
  roles: string[];
  setRoles: (roles: string[]) => void;
};

const UserRolesContext = createContext<UserRolesContextType | undefined>(undefined);

export function UserRolesProvider({
  children,
  initialRoles = [],
}: {
  children: React.ReactNode;
  initialRoles?: string[];
}) {
  const [roles, setRoles] = useState<string[]>(initialRoles);

  return (
    <UserRolesContext.Provider value={{ roles, setRoles }}>
      {children}
    </UserRolesContext.Provider>
  );
}

export function useUserRoles() {
  const ctx = useContext(UserRolesContext);
  if (!ctx) throw new Error("useUserRoles must be used inside UserRolesProvider");
  return ctx;
}
