"use client";
import React, { useEffect, useState } from "react";
import { registerAuth, RegisterAuth } from "@/app/services/auth/register";
import { LoginAuth } from "@/app/services/auth/login";
import { uploadArtwork, UploadArtworkParams } from "@/app/services/artwork/artwork";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Moon, Sun, Upload, LogOut, User } from "lucide-react";
import { useAuth } from "@/app/context/auth-context";

interface User {
  email: string;
  username?: string;
}

export default function Menu() {
  const { isAuthenticated, login, logout, isSuperuser } = useAuth();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  useEffect(() => {
    // Verificar tema salvo
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      // Verificar preferência do sistema
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        setTheme("dark");
        document.documentElement.classList.add("dark");
      }
    }

    // Verificar se há usuário salvo
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (err) {
        console.error("Erro ao recuperar dados do usuário:", err);
      }
    }
    // eslint-disable-next-line
  }, []);

  const handleToggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("user");
    setUser(null);
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget;
    const form = new FormData(formElement);
    const data: RegisterAuth = {
      username: form.get("username") as string,
      email: form.get("email") as string,
      password: form.get("password") as string,
    };

    try {
      const res = await registerAuth(data);
      alert(res.message);
      setIsRegisterOpen(false);
      // Resetar formulário
      formElement.reset();
    } catch (err) {
      console.error(err);
      alert("Erro ao registrar usuário.");
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget;
    const form = new FormData(formElement);
    const data: LoginAuth = {
      email: form.get("email") as string,
      password: form.get("password") as string,
    };

    try {
      const res = await login(data);
      // Salvar informações do usuário no localStorage
      const userData: User = {
        email: data.email,
      };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      alert(res?.message ?? "Login realizado com sucesso!");
      setIsLoginOpen(false);
      // Resetar formulário
      formElement.reset();
    } catch (err) {
      console.error(err);
      alert("Erro ao fazer login.");
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploadLoading(true);
    const formElement = e.currentTarget;
    const form = new FormData(formElement);
    const title = form.get("title") as string;
    const caption = form.get("caption") as string;
    const image = form.get("image") as File;

    if (!image || !title || !caption) {
      alert("Por favor, preencha todos os campos.");
      setUploadLoading(false);
      return;
    }

    try {
      const params: UploadArtworkParams = {
        title,
        caption,
        image,
      };
      const res = await uploadArtwork(params);
      alert(res.message ?? "Arte enviada com sucesso!");
      setIsUploadOpen(false);
      // Resetar o formulário
      formElement.reset();
      // Recarregar a página para mostrar a nova arte
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar arte.");
    } finally {
      setUploadLoading(false);
    }
  };

  const getUserInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Morikawa
          </h1>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {isAuthenticated ? (
            <>
              <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-md bg-muted/50">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getUserInitials(user?.email || "")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-muted-foreground">
                  {user?.email}
                </span>
              </div>

              <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                <DialogTrigger asChild>
                  <Button variant="default" size="sm" className="gap-2" disabled={!isSuperuser} hidden={!isSuperuser}>
                    <Upload className="h-4 w-4" />
                    <span className="hidden sm:inline">Upload</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Enviar Nova Arte</DialogTitle>
                    <DialogDescription>
                      Compartilhe sua criação com a comunidade. Preencha os campos abaixo.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleUpload} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="title" className="text-sm font-medium">
                        Título
                      </label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="Digite o título da arte"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="caption" className="text-sm font-medium">
                        Legenda
                      </label>
                      <Input
                        id="caption"
                        name="caption"
                        placeholder="Digite a legenda"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="image" className="text-sm font-medium">
                        Imagem
                      </label>
                      <Input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        required
                        className="cursor-pointer"
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsUploadOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={uploadLoading}>
                        {uploadLoading ? "Enviando..." : "Enviar"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="gap-2"
                title="Sair"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Criar conta
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Criar Nova Conta</DialogTitle>
                    <DialogDescription>
                      Preencha os dados abaixo para criar sua conta.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleRegister} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="register-username" className="text-sm font-medium">
                        Nome de usuário
                      </label>
                      <Input
                        id="register-username"
                        name="username"
                        placeholder="Nome de usuário"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="register-email" className="text-sm font-medium">
                        Email
                      </label>
                      <Input
                        id="register-email"
                        type="email"
                        name="email"
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="register-password" className="text-sm font-medium">
                        Senha
                      </label>
                      <Input
                        id="register-password"
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsRegisterOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit">Criar Conta</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                <DialogTrigger asChild>
                  <Button variant="default" size="sm">
                    Login
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Entrar</DialogTitle>
                    <DialogDescription>
                      Digite suas credenciais para acessar sua conta.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="login-email" className="text-sm font-medium">
                        Email ou usuário
                      </label>
                      <Input
                        id="login-email"
                        type="email"
                        name="email"
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="login-password" className="text-sm font-medium">
                        Senha
                      </label>
                      <Input
                        id="login-password"
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsLoginOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit">Entrar</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </>
          )}

          <Separator orientation="vertical" className="h-6" />

          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleTheme}
            className="gap-2"
            title={theme === "light" ? "Modo escuro" : "Modo claro"}
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </nav>
  );
}
