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
    const { error } = await supabase.from("newsletter").insert([{ email }]);
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
      width: "100%",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    }}>
      <div style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: "url('/destinogaropaba.JPG')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        zIndex: 0,
      }} />
      <div style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.55)",
        zIndex: 1,
      }} />
      <div style={{
        position: "relative",
        zIndex: 2,
        textAlign: "center",
        maxWidth: "580px",
        padding: "0 24px",
        color: "white",
      }}>
        <p style={{
          fontSize: "13px", fontWeight: "600", color: "rgba(255,255,255,0.7)",
          letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "20px",
        }}>
          Garopaba · SC · Brasil
        </p>
        <h1 style={{
          fontSize: "64px", fontWeight: "900", color: "white",
          margin: "0 0 12px", lineHeight: "1",
          textShadow: "0 2px 20px rgba(0,0,0,0.3)",
        }}>
          Destino Garopaba
        </h1>
        <p style={{
          fontSize: "18px", fontWeight: "400", color: "rgba(255,255,255,0.8)",
          margin: "0 0 16px", letterSpacing: "0.05em",
        }}>
          Em breve
        </p>
        <div style={{
          width: "48px", height: "2px",
          backgroundColor: "rgba(255,255,255,0.5)",
          margin: "0 auto 32px",
        }} />
        <p style={{
          fontSize: "17px", color: "rgba(255,255,255,0.85)",
          lineHeight: "1.7", margin: "0 0 40px",
        }}>
          O guia definitivo de Garopaba está chegando. Praias, trilhas, gastronomia, hospedagens e muito mais em um só lugar.
        </p>
        {!enviado ? (
          <>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", marginBottom: "16px" }}>
              Cadastre seu email e seja o primeiro a saber quando lançarmos.
            </p>
            <div style={{
              display: "flex",
              backgroundColor: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              borderRadius: "999px",
              padding: "6px 6px 6px 20px",
              border: "1px solid rgba(255,255,255,0.3)",
              gap: "8px",
            }}>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                style={{
                  flex: 1, border: "none", background: "none", outline: "none",
                  fontSize: "15px", color: "white",
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                }}
              />
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  backgroundColor: "white", color: "#111", border: "none",
                  borderRadius: "999px", padding: "12px 24px",
                  fontSize: "14px", fontWeight: "700",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  whiteSpace: "nowrap", opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Enviando..." : "Quero saber"}
              </button>
            </div>
            {erro && (
              <p style={{ fontSize: "14px", color: "#fca5a5", marginTop: "12px" }}>{erro}</p>
            )}
          </>
        ) : (
          <div style={{
            backgroundColor: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: "16px", padding: "24px",
          }}>
            <p style={{ fontSize: "24px", margin: "0 0 8px" }}>✅</p>
            <p style={{ fontSize: "16px", fontWeight: "600", color: "white", margin: "0 0 4px" }}>
              Cadastro realizado!
            </p>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", margin: 0 }}>
              Avisaremos você assim que o Destino Garopaba estiver no ar.
            </p>
          </div>
        )}
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "24px" }}>
          © 2026 Destino Garopaba · Todos os direitos reservados
        </p>
      </div>
    </main>
  );
}