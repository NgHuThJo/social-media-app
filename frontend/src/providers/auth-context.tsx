import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useMemo,
  useState,
} from "react";
import { useContextWrapper } from "@frontend/utils/context";
import { getPersistedValue } from "@frontend/utils/local-storage";

export type AuthContextType = {
  userId: string;
} | null;
export type AuthContextApiType = {
  setUserId: Dispatch<SetStateAction<string>>;
} | null;

const AuthContext = createContext<AuthContextType>(null);
const AuthContextApi = createContext<AuthContextApiType>(null);

export const useAuthContext = () =>
  useContextWrapper(AuthContext, "AuthContext is null");

export const useAuthContextApi = () =>
  useContextWrapper(AuthContextApi, "AuthContextApi is null");

export function AuthContextProvider({ children }: PropsWithChildren) {
  const [userId, setUserId] = useState<string>(() => {
    const parsedValue: string = getPersistedValue("userId");

    return parsedValue ?? "";
  });

  const contextValue = useMemo(
    () => ({
      userId,
    }),
    [userId],
  );
  const api = useMemo(
    () => ({
      setUserId,
    }),
    [],
  );

  return (
    <AuthContextApi.Provider value={api}>
      <AuthContext.Provider value={contextValue}>
        {children}
      </AuthContext.Provider>
    </AuthContextApi.Provider>
  );
}
