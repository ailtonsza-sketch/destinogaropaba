"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function EmBreve() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) return;
    setLoading(true);
    setErro("");

    const { error } = await supabase
      .from("newsletter")
      .insert([{ email }]);

    setLoading(false);

    if (error) {
      if (error.code === "23505") {
        setErro("Este email já está cadastrado!");
      } else {
        setErro("Erro ao cadastrar. Tente novamente.");
      }
    } else {
      setEnviado(true);
    }
  };

  return (
    <main style={{
      minHeight: "100vh",
      backgroundColor: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    }}>
      <div style={{ textAlign: "center", maxWidth: "520px", padding: "0 24px" }}>

        <p style={{ fontSize: "14px", fontWeight: "600", color: "#6b7280", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "24px" }}>
          Garopaba · SC · Brasil
        </p>

        <h1 style={{ fontSize: "48px", fontWeight: "900", color: "#111", margin: "0 0 8px", lineHeight: "1.1" }}>
          Destino Garopaba
        </h1>

        <p style={{ fontSize: "18px", fontWeight: "500", color: "#6b7280", margin: "0 0 16px" }}>
          Em breve
        </p>

        <div style={{ width: "48px", height: "3px", backgroundColor: "#111", margin: "0 auto 32px" }} />

        <p style={{ fontSize: "16px", color: "#4b5563", lineHeight: "1.7", margin: "0 0 40px" }}>
          O guia definitivo de Garopaba está chegando. Praias, trilhas, gastronomia, hospedagens e muito mais em um só lugar.
        </p>

        {!enviado ? (
          <>
            <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "16px" }}>
              Cadastre seu email e seja o primeiro a saber quando lançarmos.
            </p>
            <div style={{
              display: "flex",
              backgroundColor: "#f5f5f5",
              borderRadius: "999px",
              padding: "6px 6px 6px 20px",
              border: "1px solid #e5e7eb",
              gap: "8px",
            }}>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                style={{
                  flex: 1,
                  border: "none",
                  background: "none",
                  outline: "none",
                  fontSize: "15px",
                  color: "#111",
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                }}
              />
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  backgroundColor: "#111",
                  color: "white",
                  border: "none",
                  borderRadius: "999px",
                  padding: "12px 24px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  whiteSpace: "nowrap",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Enviando..." : "Quero saber"}
              </button>
            </div>
            {erro && (
              <p style={{ fontSize: "14px", color: "#dc2626", marginTop: "12px" }}>
                {erro}
              </p>
            )}
          </>
        ) : (
          <div style={{
            backgroundColor: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "16px",
            padding: "24px",
          }}>
            <p style={{ fontSize: "24px", margin: "0 0 8px" }}>✅</p>
            <p style={{ fontSize: "16px", fontWeight: "600", color: "#111", margin: "0 0 4px" }}>
              Cadastro realizado!
            </p>
            <p style={{ fontSize: "14px", color: "#4b5563", margin: 0 }}>
              Avisaremos você assim que o Destino Garopaba estiver no ar.
            </p>
          </div>
        )}

        <p style={{ fontSize: "13px", color: "#9ca3af", marginTop: "48px" }}>
          © 2025 Destino Garopaba · Todos os direitos reservados
        </p>

      </div>
    </main>
  );
}