"use client";
import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function gerarUsername(nome: string): string {
  return nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

export default function AuthCallback() {
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { window.location.href = "/login"; return; }

      const { data: perfil } = await supabase.from("perfis").select("username").eq("id", data.user.id).single();

      if (perfil?.username) {
        window.location.href = `/u/${perfil.username}`;
        return;
      }

      // Usuário novo — cria perfil com username automático
      const nomeCompleto = data.user.user_metadata?.name || data.user.email?.split("@")[0] || "usuario";
      let username = gerarUsername(nomeCompleto);

      // Verifica se username já existe e adiciona número sequencial
      let usernameBase = username;
      let contador = 1;
      while (true) {
        const { data: existente } = await supabase.from("perfis").select("username").eq("username", username).single();
        if (!existente) break;
        username = `${usernameBase}${contador}`;
        contador++;
      }

      await supabase.from("perfis").upsert({
        id: data.user.id,
        nome: data.user.user_metadata?.name || "",
        email: data.user.email || "",
        avatar_url: data.user.user_metadata?.avatar_url || "",
        username,
      });

      window.location.href = `/u/${username}`;
    });
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      <p style={{ color: "#6b7280" }}>Configurando seu perfil...</p>
    </div>
  );
}