"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function GastronomiaPage() {
  const [restaurantes, setRestaurantes] = useState<any[]>([]);
  const [filtrados, setFiltrados] = useState<any[]>([]);
  const [busca, setBusca] = useState("");
  const [tipoAtivo, setTipoAtivo] = useState("Todos");
  const [ordenacao, setOrdenacao] = useState("destaque");
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUsuario(data.user);
    });
  }, []);

  useEffect(() => {
    supabase.from("restaurantes").select("*").then(({ data }) => {
      if (data) {
        setRestaurantes(data);
        setFiltrados(data);
      }
    });
  }, []);

  useEffect(() => {
    let resultado = [...restaurantes];

    if (busca) {
      resultado = resultado.filter((r) =>
        r.nome.toLowerCase().includes(busca.toLowerCase())
      );
    }

    if (tipoAtivo !== "Todos") {
      resultado = resultado.filter((r) => r.tipo === tipoAtivo);
    }

    if (ordenacao === "nota") {
      resultado.sort((a, b) => b.nota - a.nota);
    } else if (ordenacao === "nome") {
      resultado.sort((a, b) => a.nome.localeCompare(b.nome));
    } else {
      resultado.sort((a, b) => (b.destaque ? 1 : 0) - (a.destaque ? 1 : 0));
    }

    setFiltrados(resultado);
  }, [busca, tipoAtivo, ordenacao, restaurantes]);

  const tipos = ["Todos", ...Array.from(new Set(restaurantes.map((r) => r.tipo).filter(Boolean)))];

  return (
    <main style={{ backgroundColor: "#f2f2f2", minHeight: "100vh", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>

      <style>{`
        .nav-link { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; text-decoration: none; color: #1f2937; font-size: 14px; font-weight: 500; padding: 6px 10px; border-radius: 6px; transition: background-color 0.2s, color 0.2s; }
        .nav-link:hover { background-color: #1f2937; color: white; }
        .tipo-btn { background: white; border: 1px solid #e5e7eb; border-radius: 999px; padding: 8px 18px; font-size: 13px; font-weight: 500; color: #4b5563; cursor: pointer; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; transition: all 0.2s; white-space: nowrap; }
        .tipo-btn:hover { border-color: #111; color: #111; }
        .tipo-btn.ativo { background: #111; color: white; border-color: #111; }
        .rest-card { background: white; border-radius: 16px; overflow: hidden; display: flex; box-shadow: 0 1px 4px rgba(0,0,0,0.06); transition: box-shadow 0.3s ease; text-decoration: none; color: inherit; }
        .rest-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.12); }
        .rest-card img { transition: transform 0.4s ease; }
        .rest-card:hover img { transform: scale(1.05); }
      `}</style>

      {/* HEADER */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, backgroundColor: "white", borderBottom: "1px solid #e5e7eb", height: "60px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <div style={{ width: "70%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/home" style={{ textDecoration: "none", fontSize: "20px", fontWeight: "800", color: "#111", letterSpacing: "-0.5px" }}>Destino Garopaba</a>
          <nav style={{ display: "flex", alignItems: "center", gap: "4px" }}>
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
            {usuario ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "12px" }}>
              <a href="/perfil" style={{ fontSize: "14px", fontWeight: "600", color: "#111", textDecoration: "none" }}>
                {usuario.user_metadata?.name || usuario.email}
              </a>
              <button onClick={async () => { await supabase.auth.signOut(); setUsuario(null); }} style={{ backgroundColor: "#f3f4f6", color: "#111", border: "none", padding: "8px 16px", borderRadius: "999px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                Sair
              </button>
            </div>
          ) : (
            <a href="/login" style={{ textDecoration: "none", backgroundColor: "#111", color: "white", padding: "8px 20px", borderRadius: "999px", fontSize: "14px", fontWeight: "600", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", marginLeft: "12px" }}>
              Entrar
            </a>
          )}
          </nav>
        </div>
      </header>

      <div style={{ height: "60px" }} />

      {/* HERO */}
      <section style={{ backgroundColor: "#111", padding: "48px 0" }}>
        <div style={{ width: "70%", margin: "0 auto" }}>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", margin: "0 0 8px" }}>
            <a href="/home" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Garopaba</a>
            <span style={{ margin: "0 8px" }}>›</span>
            <span style={{ color: "white" }}>Gastronomia</span>
          </p>
          <h1 style={{ fontSize: "32px", fontWeight: "900", color: "white", margin: "0 0 8px" }}>
            Restaurantes em Garopaba
          </h1>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.7)", margin: 0 }}>
            {restaurantes.length} estabelecimentos encontrados
          </p>
        </div>
      </section>

      {/* FILTROS */}
      <section style={{ backgroundColor: "white", borderBottom: "1px solid #e5e7eb", padding: "16px 0", position: "sticky", top: "60px", zIndex: 90 }}>
        <div style={{ width: "70%", margin: "0 auto", display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>

          {/* BUSCA */}
          <div style={{ display: "flex", alignItems: "center", backgroundColor: "#f3f4f6", borderRadius: "999px", padding: "8px 16px", gap: "8px", flex: "1", minWidth: "200px" }}>
            <span style={{ color: "#6b7280", fontSize: "16px" }}>🔍</span>
            <input
              type="text"
              placeholder="Buscar restaurante..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              style={{ border: "none", background: "none", outline: "none", fontSize: "14px", color: "#111", width: "100%", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
            />
          </div>

          {/* TIPOS */}
          <div style={{ display: "flex", gap: "8px", overflowX: "auto", scrollbarWidth: "none" }}>
            {tipos.map((tipo) => (
              <button key={tipo} className={`tipo-btn ${tipoAtivo === tipo ? "ativo" : ""}`} onClick={() => setTipoAtivo(tipo)}>
                {tipo}
              </button>
            ))}
          </div>

          {/* ORDENAÇÃO */}
          <select
            value={ordenacao}
            onChange={(e) => setOrdenacao(e.target.value)}
            style={{ border: "1px solid #e5e7eb", borderRadius: "999px", padding: "8px 16px", fontSize: "13px", fontWeight: "500", color: "#4b5563", outline: "none", cursor: "pointer", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", backgroundColor: "white" }}
          >
            <option value="destaque">Destaques primeiro</option>
            <option value="nota">Melhor avaliados</option>
            <option value="nome">A-Z</option>
          </select>

        </div>
      </section>

      {/* LISTA */}
      <section style={{ width: "70%", margin: "0 auto", padding: "32px 0 64px" }}>
        {filtrados.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ fontSize: "18px", color: "#6b7280" }}>Nenhum restaurante encontrado.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {filtrados.map((rest, index) => (
              <a key={rest.id} href={`/gastronomia/${rest.slug}`} className="rest-card">

                {/* FOTO */}
                <div style={{ width: "260px", height: "180px", flexShrink: 0, overflow: "hidden", position: "relative" }}>
                  <img
                    src={rest.foto_url}
                    alt={rest.nome}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                  {rest.destaque && (
                    <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: "#111", color: "white", fontSize: "11px", fontWeight: "700", padding: "4px 10px", borderRadius: "999px" }}>
                      ⭐ Destaque
                    </div>
                  )}
                </div>

                {/* INFOS */}
                <div style={{ padding: "20px 24px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                          <span style={{ fontSize: "11px", color: "#6b7280", backgroundColor: "#f3f4f6", padding: "3px 10px", borderRadius: "999px", fontWeight: "500" }}>{rest.tipo}</span>
                          {index < 3 && (
                            <span style={{ fontSize: "11px", color: "#059669", backgroundColor: "#f0fdf4", padding: "3px 10px", borderRadius: "999px", fontWeight: "600" }}>
                              #{index + 1} em Garopaba
                            </span>
                          )}
                        </div>
                        <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#111", margin: 0 }}>{rest.nome}</h2>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", justifyContent: "flex-end" }}>
                          <span style={{ color: "#fbbf24", fontSize: "16px" }}>★</span>
                          <span style={{ fontSize: "18px", fontWeight: "800", color: "#111" }}>{rest.nota}</span>
                        </div>
                        <span style={{ fontSize: "12px", color: "#6b7280" }}>de 5</span>
                      </div>
                    </div>

                    {rest.descricao && (
                      <p style={{ fontSize: "14px", color: "#6b7280", margin: "8px 0 0", lineHeight: "1.5", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {rest.descricao}
                      </p>
                    )}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "16px" }}>
                    {rest.endereco && (
                      <span style={{ fontSize: "13px", color: "#9ca3af", display: "flex", alignItems: "center", gap: "4px" }}>
                        📍 {rest.endereco}
                      </span>
                    )}
                    <span style={{ fontSize: "13px", color: "#111", fontWeight: "600", marginLeft: "auto" }}>
                      Ver mais →
                    </span>
                  </div>
                </div>

              </a>
            ))}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: "#1f2937", color: "#9ca3af", padding: "32px 0", textAlign: "center" }}>
        <p style={{ color: "white", fontWeight: "700", fontSize: "16px", margin: "0 0 4px" }}>Destino Garopaba</p>
        <p style={{ fontSize: "13px", margin: 0 }}>O guia definitivo de Garopaba, SC</p>
      </footer>

    </main>
  );
}