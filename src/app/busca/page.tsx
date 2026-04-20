"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function BuscaConteudo() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [resultados, setResultados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) { setLoading(false); return; }
    setLoading(true);
    supabase.from("restaurantes").select("*")
      .ilike("nome", `%${query}%`)
      .then(({ data }) => {
        setResultados(data || []);
        setLoading(false);
      });
  }, [query]);

  return (
    <main style={{ backgroundColor: "#f2f2f2", minHeight: "100vh", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>

      <style>{`
        .nav-link { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; text-decoration: none; color: #1f2937; font-size: 14px; font-weight: 500; padding: 6px 10px; border-radius: 6px; transition: background-color 0.2s, color 0.2s; }
        .nav-link:hover { background-color: #1f2937; color: white; }
        .rest-card { background: white; border-radius: 16px; overflow: hidden; display: flex; box-shadow: 0 1px 4px rgba(0,0,0,0.06); transition: box-shadow 0.3s ease; text-decoration: none; color: inherit; }
        .rest-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.12); }
      `}</style>

      {/* HEADER */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, backgroundColor: "white", borderBottom: "1px solid #e5e7eb", height: "60px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <div style={{ width: "70%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/home" style={{ textDecoration: "none", fontSize: "20px", fontWeight: "800", color: "#111", letterSpacing: "-0.5px" }}>Destino Garopaba</a>
          <nav style={{ display: "flex", gap: "4px" }}>
            {[
              { label: "Garopaba", href: "/home" },
              { label: "Nossas Praias", href: "/home" },
              { label: "Atrativos Turísticos", href: "/home" },
              { label: "Hospedagens", href: "/home" },
              { label: "Gastronomia", href: "/gastronomia" },
              { label: "Fale Conosco", href: "/home" },
            ].map((item) => (
              <a key={item.label} href={item.href} className="nav-link">{item.label}</a>
            ))}
          </nav>
        </div>
      </header>

      <div style={{ height: "60px" }} />

      {/* HERO */}
      <section style={{ backgroundColor: "#111", padding: "48px 0" }}>
        <div style={{ width: "70%", margin: "0 auto" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "900", color: "white", margin: "0 0 8px" }}>
            {query ? `Resultados para "${query}"` : "Busca"}
          </h1>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.7)", margin: 0 }}>
            {loading ? "Buscando..." : `${resultados.length} resultado(s) encontrado(s)`}
          </p>
        </div>
      </section>

      {/* RESULTADOS */}
      <section style={{ width: "70%", margin: "0 auto", padding: "32px 0 64px" }}>
        {loading ? (
          <p style={{ color: "#6b7280", textAlign: "center", padding: "60px 0" }}>Buscando...</p>
        ) : resultados.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ fontSize: "18px", color: "#6b7280", marginBottom: "16px" }}>Nenhum resultado encontrado para "{query}".</p>
            <a href="/home" style={{ color: "#111", fontWeight: "600", textDecoration: "none" }}>← Voltar para o início</a>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {resultados.map((rest) => (
              <a key={rest.id} href={`/gastronomia/${rest.slug}`} className="rest-card">
                <div style={{ width: "220px", height: "160px", flexShrink: 0, overflow: "hidden" }}>
                  <img src={rest.foto_url} alt={rest.nome} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
                <div style={{ padding: "20px 24px", flex: 1 }}>
                  <span style={{ fontSize: "11px", color: "#6b7280", backgroundColor: "#f3f4f6", padding: "3px 10px", borderRadius: "999px", fontWeight: "500" }}>{rest.tipo}</span>
                  <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#111", margin: "8px 0 4px" }}>{rest.nome}</h2>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "8px" }}>
                    <span style={{ color: "#fbbf24" }}>★</span>
                    <span style={{ fontSize: "15px", fontWeight: "700", color: "#111" }}>{rest.nota}</span>
                  </div>
                  {rest.descricao && (
                    <p style={{ fontSize: "14px", color: "#6b7280", margin: 0, lineHeight: "1.5", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {rest.descricao}
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      <footer style={{ backgroundColor: "#1f2937", color: "#9ca3af", padding: "32px 0", textAlign: "center" }}>
        <p style={{ color: "white", fontWeight: "700", fontSize: "16px", margin: "0 0 4px" }}>Destino Garopaba</p>
        <p style={{ fontSize: "13px", margin: 0 }}>O guia definitivo de Garopaba, SC</p>
      </footer>

    </main>
  );
}

export default function BuscaPage() {
  return (
    <Suspense>
      <BuscaConteudo />
    </Suspense>
  );
}