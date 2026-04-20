"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [modo, setModo] = useState<"login" | "cadastro">("login");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const handleEmailAuth = async () => {
    if (!email || !senha) { setErro("Preencha todos os campos."); return; }
    setLoading(true);
    setErro("");
    setSucesso("");

    if (modo === "cadastro") {
      const { error } = await supabase.auth.signUp({ email, password: senha });
      if (error) setErro(error.message);
      else setSucesso("Cadastro realizado! Verifique seu email para confirmar.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
      if (error) setErro("Email ou senha incorretos.");
      else window.location.href = "/home";
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/home` },
    });
  };

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#f2f2f2", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "40px", width: "100%", maxWidth: "420px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>

        {/* LOGO */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <a href="/home" style={{ textDecoration: "none", fontSize: "22px", fontWeight: "800", color: "#111", letterSpacing: "-0.5px" }}>
            Destino Garopaba
          </a>
          <p style={{ fontSize: "14px", color: "#6b7280", margin: "8px 0 0" }}>
            {modo === "login" ? "Entre na sua conta" : "Crie sua conta"}
          </p>
        </div>

        {/* GOOGLE */}
        <button onClick={handleGoogle} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", padding: "12px", borderRadius: "10px", border: "1px solid #e5e7eb", backgroundColor: "white", cursor: "pointer", fontSize: "15px", fontWeight: "600", color: "#111", marginBottom: "20px", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continuar com Google
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#e5e7eb" }} />
          <span style={{ fontSize: "13px", color: "#9ca3af" }}>ou</span>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#e5e7eb" }} />
        </div>

        {/* EMAIL E SENHA */}
        <div style={{ marginBottom: "12px" }}>
          <label style={{ fontSize: "13px", fontWeight: "600", color: "#4b5563", display: "block", marginBottom: "6px" }}>Email</label>
          <input type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "14px", outline: "none", boxSizing: "border-box", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }} />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "13px", fontWeight: "600", color: "#4b5563", display: "block", marginBottom: "6px" }}>Senha</label>
          <input type="password" placeholder="••••••••" value={senha} onChange={(e) => setSenha(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleEmailAuth(); }}
            style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "14px", outline: "none", boxSizing: "border-box", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }} />
        </div>

        {erro && <p style={{ fontSize: "13px", color: "#ef4444", marginBottom: "12px", textAlign: "center" }}>{erro}</p>}
        {sucesso && <p style={{ fontSize: "13px", color: "#22c55e", marginBottom: "12px", textAlign: "center" }}>{sucesso}</p>}

        <button onClick={handleEmailAuth} disabled={loading} style={{ width: "100%", backgroundColor: "#111", color: "white", border: "none", borderRadius: "10px", padding: "14px", fontSize: "15px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
          {loading ? "Aguarde..." : modo === "login" ? "Entrar" : "Criar conta"}
        </button>

        <p style={{ textAlign: "center", fontSize: "14px", color: "#6b7280", marginTop: "20px" }}>
          {modo === "login" ? "Não tem uma conta?" : "Já tem uma conta?"}
          <button onClick={() => { setModo(modo === "login" ? "cadastro" : "login"); setErro(""); setSucesso(""); }}
            style={{ background: "none", border: "none", color: "#111", fontWeight: "600", cursor: "pointer", marginLeft: "6px", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
            {modo === "login" ? "Cadastre-se" : "Entrar"}
          </button>
        </p>

      </div>
    </main>
  );
}