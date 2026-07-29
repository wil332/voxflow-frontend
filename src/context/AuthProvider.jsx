import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

/**

 * Later ganti fungsi "login" di bawah supaya call API backend
 * (misal POST /api/auth/login), lalu simpan token asli dari situ.
 */

// Kredensial dummy — sementara sebelum backend auth siap
const DUMMY_USER = {
  email: "demo@VoxFlow.ai",
  password: "VoxFlow123",
  name: "Wilbert",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cek localStorage saat pertama kali app dibuka, biar user tetap login walau refresh
  useEffect(() => {
    const savedUser = localStorage.getItem("VoxFlow_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  function login(email, password) {
    // HARI 2/3: ganti ini dengan fetch ke API backend asli
    if (email === DUMMY_USER.email && password === DUMMY_USER.password) {
      const loggedInUser = { email: DUMMY_USER.email, name: DUMMY_USER.name };
      setUser(loggedInUser);
      localStorage.setItem("VoxFlow_user", JSON.stringify(loggedInUser));
      return { success: true };
    }
    return { success: false, message: "Email atau password salah." };
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("VoxFlow_user");
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}