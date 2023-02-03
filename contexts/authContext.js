import { createContext, useState } from "react";

export const AuthContext = createContext();

// TODO: Persist login state
export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (newUser) => {
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
