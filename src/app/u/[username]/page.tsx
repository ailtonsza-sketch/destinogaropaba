"use client";
import { useState, useEffect, use } from "react";
import { createClient } from "@supabase/supabase-js";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PerfilPublicoPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const [perfil, setPerfil] = useState<any>(null);
  const [avaliacoes, setAvaliacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [usuarioLogado, setUsuarioLogado] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUsuarioLogado(data.user);
    });
  }, []);

  useEffect(() => {
    supabase.from("perfis").select("*").eq("username", username).single()
      .then(async ({ data: p }) => {
        if (!p) { setLoading(false); return; }
        setPerfil(p);
        const { data: avs } = await supabase.from("avaliacoes")
          .select("*, restaurantes(nome, slug, foto_url)")
          .eq("user_id", p.id)
          .order("criado_em", { ascending: false });
        if (avs) setAvaliacoes(avs);
        setLoading(false);
      });
  }, [username]);

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <p style={{ color: "#6b7280" }}>Carregando...</p>
    </div>
  );

  if (!perfil) return (
    <main style={{ backgroundColor: "#f2f2f2", minHeight: "100vh", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      <Header />
      <div style={{ height: "60px" }} />
      <div style={{ textAlign: "center", padding: "80px 0" }}>
        <p style={{ fontSize: "24px", fontWeight: "700", color: "#111", marginBottom: "8px" }}>Perfil não encontrado</p>
        <p style={{ fontSize: "15px", color: "#6b7280", marginBottom: "24px" }}>O usuário @{username} não existe.</p>
        <a href="/home" style={{ backgroundColor: "#111", color: "white", textDecoration: "none", padding: "12px 28px", borderRadius: "999px", fontSize: "14px", fontWeight: "600" }}>
          Voltar ao início
        </a>
      </div>
      <Footer />
    </main>
  );

  return (
    <main style={{ backgroundColor: "#f2f2f2", minHeight: "100vh", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      <Header />
      <div style={{ height: "60px" }} />

      {/* CAPA */}
      <div style={{ position: "relative", height: "350px", overflow: "hidden" }}>
        {perfil.capa_url ? (
          <img src={perfil.capa_url} alt="Capa" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #1f2937 0%, #374151 100%)" }} />
        )}
      </div>

      {/* BARRA BRANCA */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #e5e7eb", marginTop: "-60px", position: "relative", zIndex: 10 }}>
        <div style={{ width: "70%", margin: "0 auto", padding: "24px 0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <div style={{ width: "110px", height: "110px", borderRadius: "50%", overflow: "hidden", backgroundColor: "#f3f4f6", border: "5px solid white", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", marginTop: "-50px" }}>
                {perfil.avatar_url ? (
                  <img src={perfil.avatar_url} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px", fontWeight: "800", color: "#6b7280" }}>
                    {(perfil.nome || "?").charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#111", margin: "0 0 4px" }}>{perfil.nome || "Sem nome"}</h1>
                {perfil.endereco && <p style={{ fontSize: "13px", color: "#9ca3af", margin: "0 0 2px" }}>📍 {perfil.endereco}</p>}
                <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
                  <strong style={{ color: "#111" }}>{avaliacoes.length}</strong> {avaliacoes.length === 1 ? "contribuição" : "contribuições"}
                </p>
              </div>
            </div>
            {usuarioLogado?.id === perfil?.id && (
              <a href="/perfil" style={{ backgroundColor: "white", color: "#111", border: "1px solid #e5e7eb", borderRadius: "999px", padding: "10px 24px", fontSize: "14px", fontWeight: "600", textDecoration: "none" }}>
                ✏️ Editar perfil
              </a>
            )}
          </div>
        </div>
      </div>

      {/* CONTEÚDO */}
      <div style={{ width: "70%", margin: "32px auto 64px", display: "grid", gridTemplateColumns: "280px 1fr", gap: "24px" }}>

        {/* INTRODUÇÃO */}
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111", margin: "0 0 16px" }}>Introdução</h2>
          <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            {perfil.biografia && <p style={{ fontSize: "14px", color: "#4b5563", lineHeight: "1.6", margin: "0 0 16px" }}>{perfil.biografia}</p>}
            {perfil.endereco && <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}><span>📍</span><span style={{ fontSize: "14px", color: "#4b5563" }}>{perfil.endereco}</span></div>}
            {perfil.telefone && <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}><span>📞</span><span style={{ fontSize: "14px", color: "#4b5563" }}>{perfil.telefone}</span></div>}
          </div>
        </div>

        {/* ATIVIDADES */}
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111", margin: "0 0 20px" }}>
            Atividades {avaliacoes.length > 0 && `(${avaliacoes.length})`}
          </h2>
          {avaliacoes.length === 0 ? (
            <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "48px 24px", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <p style={{ fontSize: "15px", color: "#6b7280" }}>Nenhuma avaliação ainda.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {avaliacoes.map((av, i) => (
                <div key={i} style={{ backgroundColor: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                  <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ width: "44px", height: "44px", borderRadius: "50%", overflow: "hidden", backgroundColor: "#f3f4f6", flexShrink: 0 }}>
                      {perfil.avatar_url ? (
                        <img src={perfil.avatar_url} alt={perfil.nome} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "700", color: "#6b7280" }}>
                          {(perfil.nome || "?").charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <p style={{ fontSize: "14px", margin: 0 }}>
                        <strong>{perfil.nome}</strong> <span style={{ color: "#6b7280" }}>escreveu uma avaliação</span>
                      </p>
                      <p style={{ fontSize: "12px", color: "#9ca3af", margin: "2px 0 0" }}>
                        {new Date(av.criado_em).toLocaleDateString("pt-BR", { month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "2px", marginBottom: "8px" }}>
                    {[1,2,3,4,5].map((s) => (
                      <span key={s} style={{ color: s <= av.nota ? "#fbbf24" : "#e5e7eb", fontSize: "18px" }}>★</span>
                    ))}
                  </div>
                  {av.titulo && <p style={{ fontSize: "15px", fontWeight: "700", color: "#111", margin: "0 0 6px" }}>{av.titulo}</p>}
                  <p style={{ fontSize: "14px", color: "#4b5563", margin: "0 0 16px", lineHeight: "1.6" }}>{av.comentario}</p>
                  {av.restaurantes && (
                    <a href={`/gastronomia/${av.restaurantes.slug}`} style={{ textDecoration: "none", display: "flex", gap: "12px", alignItems: "center", backgroundColor: "#f9fafb", borderRadius: "12px", padding: "12px", border: "1px solid #f3f4f6" }}>
                      {av.restaurantes.foto_url && (
                        <img src={av.restaurantes.foto_url} alt={av.restaurantes.nome} style={{ width: "60px", height: "60px", borderRadius: "8px", objectFit: "cover", flexShrink: 0 }} />
                      )}
                      <div>
                        <p style={{ fontSize: "14px", fontWeight: "700", color: "#111", margin: "0 0 2px" }}>{av.restaurantes.nome}</p>
                        <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>📍 Garopaba, SC</p>
                      </div>
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}