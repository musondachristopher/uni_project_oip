import { createContext, useContext } from "react"

export const userContext = createContext()


export function useUser() {
  const context = useContext(userContext);

  if (!context) {
    throw new Error('useUser must be used within a UserContextProvider');
  }

  const { user, setUser } = context;
  return { user, setUser };
}