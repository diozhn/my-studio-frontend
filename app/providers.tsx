"use client";

import React from "react";
import { AuthProvider } from "@/app/context/auth-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}


