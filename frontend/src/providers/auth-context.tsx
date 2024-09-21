import { createContext, PropsWithChildren, useMemo, useState } from "react";
import { useContextWrapper } from "@frontend/utils/context";
import { getPersistedValue } from "@frontend/utils/local-storage";
import { ProfileData } from "@frontend/types/api";

export type AuthContextType = {
  user: ProfileData;
} | null;
export type AuthContextApiType = {
  setUserData: (userData: ProfileData) => void;
} | null;

const AuthContext = createContext<AuthContextType>(null);
const AuthContextApi = createContext<AuthContextApiType>(null);

export const useAuthContext = () =>
  useContextWrapper(AuthContext, "AuthContext is null");
export const useAuthContextApi = () =>
  useContextWrapper(AuthContextApi, "AuthContextApi is null");

export function AuthContextProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<ProfileData>(() => {
    const parsedValue = getPersistedValue("user");

    return parsedValue ?? undefined;
  });

  const contextValue = useMemo(
    () => ({
      user,
    }),
    [user],
  );
  const api = useMemo(() => {
    const setUserData = (userData: ProfileData) => {
      setUser(userData);
    };

    return {
      setUserData,
    };
  }, []);

  return (
    <AuthContextApi.Provider value={api}>
      <AuthContext.Provider value={contextValue}>
        {children}
      </AuthContext.Provider>
    </AuthContextApi.Provider>
  );
}
