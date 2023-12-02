import { createContext, useContext } from "react"
import { createSearchParams, useNavigate } from "react-router-dom";

export const userContext = createContext()

export function useUser() {
  const context = useContext(userContext);

  if (!context) {
    throw new Error('useUser must be used within a UserContextProvider');
  }

  const { user, setUser } = context;
  return { user, setUser };
}
