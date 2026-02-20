"use client";
import React, { useEffect, useState } from "react";
import Modal from "./modal";
import { registerAuth, RegisterAuth } from "@/app/services/auth/register";

export default function Menu() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const applyTheme = (theme: "light" | "dark") => {
    if (theme === "dark") {
      document.documentElement.style.setProperty("--background", "#0a0a0a");
      document.documentElement.style.setProperty("--foreground", "#ededed");
    } else {
      document.documentElement.style.setProperty("--background", "#fdffff");
      document.documentElement.style.setProperty("--foreground", "#b10f2e");
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme(theme);
    }
    // eslint-disable-next-line
  }, []);

  const handleToggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data: RegisterAuth = {
      username: form.get("username") as string,
      email: form.get("email") as string,
      password: form.get("password") as string,
    };

    try {
      const res = await registerAuth(data);
      alert(res.message);
      setIsRegisterOpen(false);
    } catch (err) {
      console.error(err);
      alert("Erro ao registrar usuário.");
    }
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "64px",
        background: "var(--background)",
        color: "var(--foreground)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        zIndex: 1000,
      }}
    >
      <div style={{ fontWeight: "bold", fontSize: "1.5rem" }}>0076e</div>
      <input
        type="text"
        placeholder="Pesquisar..."
        style={{
          padding: "8px 16px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          width: "250px",
          marginRight: "16px",
        }}
      />
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <button
          style={{ padding: "8px 16px" }}
          onClick={() => setIsRegisterOpen(true)}
        >
          Criar conta
        </button>
        <button style={{ padding: "8px 16px" }}>Login</button>
        <button style={{ padding: "8px 16px" }} onClick={handleToggleTheme}>
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>

      {/* Modal de registro */}
      <Modal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)}>
        <form className="flex flex-col gap-3" onSubmit={handleRegister}>
          <input
            name="username"
            placeholder="Nome de usuário"
            className="border rounded p-2 placeholder:text-gray-600 border-gray-400 text-gray-800"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="border rounded p-2 placeholder:text-gray-600 border-gray-400 text-gray-800"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Senha"
            className="border rounded p-2 placeholder:text-gray-600 border-gray-400 text-gray-800"
            required
          />
          <button
            type="submit"
            className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
          >
            Sign Up
          </button>
        </form>
      </Modal>
    </nav>
  );
}
