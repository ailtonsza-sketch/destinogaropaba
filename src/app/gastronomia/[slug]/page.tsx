"use client";
import { useState, useEffect, use } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function verificarAberto(horarios: any): { aberto: boolean; texto: string } {
  if (!horarios) return { aberto: false, texto: "Horário não disponível" };
  const agora = new Date();
  const dias = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"];
  const diaAtual = dias[agora.getDay()];
  const horarioDia = horarios[diaAtual];
  if (!horarioDia) return { aberto: false, texto: "Fechado hoje" };
  const [horaAbre, minAbre] = horarioDia.abre.split(":").map(Number);
  const [horaFecha, minFecha] = horarioDia.fecha.split(":").map(Number);
  const totalAtual = agora.getHours() * 60 + agora.getMinutes();
  const totalAbre = horaAbre * 60 + minAbre;
  const totalFecha = horaFecha * 60 + minFecha;
  const aberto = totalAtual >= totalAbre && totalAtual < totalFecha;
  return {
    aberto,
    texto: aberto ? `Aberto · Fecha às ${horarioDia.fecha}` : `Fechado · Abre às ${horarioDia.abre}`,
  };
}

function AvaliacaoCard({ av, ultimo }: { av: any; ultimo: boolean }) {
  const [curtidas, setCurtidas] = useState(0);
  const [curtiu, setCurtiu] = useState(false);
  const [contribuicoes, setContribuicoes] = useState(1);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    // Buscar curtidas
    supabase.from("curtidas").select("id, user_id").eq("avaliacao_id", av.id)
      .then(({ data: c }) => {
        if (c) setCurtidas(c.length);
      });

    // Verificar se usuário atual já curtiu
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        supabase.from("curtidas").select("id")
          .eq("avaliacao_id", av.id)
          .eq("user_id", data.user.id)
          .single()
          .then(({ data: c }) => { if (c) setCurtiu(true); });
      }
    });

    // Buscar contribuições e avatar do usuário
    if (av.user_id) {
      supabase.from("avaliacoes").select("id").eq("user_id", av.user_id)
        .then(({ data: avs }) => { if (avs) setContribuicoes(avs.length); });
      supabase.from("perfis").select("avatar_url").eq("id", av.user_id).single()
        .then(({ data: p }) => { if (p?.avatar_url) setAvatarUrl(p.avatar_url); });
    }
  }, [av.id, av.user_id]);

  const handleCurtir = async () => {
    if (curtiu) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.href = "/login"; return; }
    await supabase.from("curtidas").insert({ avaliacao_id: av.id, user_id: user.id });
    setCurtidas((prev) => prev + 1);
    setCurtiu(true);
  };

  return (
    <div style={{ borderBottom: ultimo ? "none" : "1px solid #f3f4f6", paddingBottom: "24px", marginBottom: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "50%", overflow: "hidden", backgroundColor: "#f3f4f6", flexShrink: 0 }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt={av.nome} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "700", color: "#6b7280" }}>
                {av.nome.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <span style={{ fontWeight: "700", fontSize: "15px", color: "#111", display: "block" }}>{av.nome}</span>
            <span style={{ fontSize: "12px", color: "#9ca3af" }}>
              {contribuicoes} {contribuicoes === 1 ? "contribuição" : "contribuições"}
            </span>
          </div>
        </div>
        <button onClick={handleCurtir} style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: `1px solid ${curtiu ? "#111" : "#e5e7eb"}`, borderRadius: "999px", padding: "6px 14px", cursor: curtiu ? "default" : "pointer", fontSize: "13px", fontWeight: "600", color: curtiu ? "#111" : "#6b7280" }}>
          👍 {curtidas}
        </button>
      </div>
      <div style={{ display: "flex", gap: "2px", marginBottom: "8px" }}>
        {[1,2,3,4,5].map((s) => (
          <span key={s} style={{ color: s <= av.nota ? "#fbbf24" : "#e5e7eb", fontSize: "16px" }}>★</span>
        ))}
      </div>
      {av.titulo && <p style={{ fontSize: "15px", fontWeight: "700", color: "#111", margin: "0 0 6px" }}>{av.titulo}</p>}
      <p style={{ fontSize: "14px", color: "#4b5563", margin: "0 0 10px", lineHeight: "1.6" }}>{av.comentario}</p>
      <p style={{ fontSize: "12px", color: "#9ca3af", margin: "0 0 6px" }}>
        Feita em {new Date(av.criado_em).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}
      </p>
      <p style={{ fontSize: "11px", color: "#d1d5db", margin: 0, lineHeight: "1.5" }}>
        Esta avaliação representa a opinião pessoal de um visitante do Destino Garopaba e não reflete a posição editorial do portal.
      </p>
    </div>
  );
}

function FormularioAvaliacao({ usuario, nome, nota, setNota, comentario, setComentario, titulo, setTitulo, loading, enviado, handleAvaliar }: any) {
  if (!usuario) return (
    <div style={{ backgroundColor: "#f9fafb", borderRadius: "12px", padding: "20px", textAlign: "center", border: "1px solid #e5e7eb" }}>
      <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 12px" }}>Você precisa estar logado para avaliar.</p>
      <a href="/login" style={{ backgroundColor: "#111", color: "white", textDecoration: "none", padding: "10px 24px", borderRadius: "999px", fontSize: "14px", fontWeight: "600" }}>Entrar / Cadastrar</a>
    </div>
  );

  if (enviado) return (
    <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
      <p style={{ fontSize: "16px", fontWeight: "600", color: "#111", margin: 0 }}>✅ Avaliação publicada!</p>
    </div>
  );

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px", padding: "12px 16px", backgroundColor: "#f9fafb", borderRadius: "10px", border: "1px solid #f3f4f6" }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "700", color: "#6b7280", flexShrink: 0 }}>
          {nome.charAt(0).toUpperCase()}
        </div>
        <span style={{ fontSize: "14px", fontWeight: "600", color: "#111" }}>{nome}</span>
      </div>
      <div style={{ marginBottom: "12px" }}>
        <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 8px" }}>Sua nota:</p>
        <div style={{ display: "flex", gap: "8px" }}>
          {[1,2,3,4,5].map((s) => (
            <span key={s} onClick={() => setNota(s)} style={{ fontSize: "28px", cursor: "pointer", color: s <= nota ? "#fbbf24" : "#e5e7eb" }}>★</span>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: "12px" }}>
        <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 8px" }}>Título da avaliação:</p>
        <input type="text" placeholder="Título da sua experiência..." value={titulo} onChange={(e) => setTitulo(e.target.value)}
          style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "14px", boxSizing: "border-box", outline: "none" }} />
      </div>
      <textarea placeholder="Conte sua experiência..." value={comentario} onChange={(e) => setComentario(e.target.value)} rows={4}
        style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "14px", marginBottom: "16px", boxSizing: "border-box", outline: "none", resize: "none" }} />
      <button onClick={handleAvaliar} disabled={loading} style={{ backgroundColor: "#111", color: "white", border: "none", borderRadius: "999px", padding: "14px 32px", fontSize: "15px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
        {loading ? "Enviando..." : "Publicar avaliação"}
      </button>
    </>
  );
}

export default function RestaurantePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [restaurante, setRestaurante] = useState<any>(null);
  const [avaliacoes, setAvaliacoes] = useState<any[]>([]);
  const [nome, setNome] = useState("");
  const [nota, setNota] = useState(5);
  const [titulo, setTitulo] = useState("");
  const [comentario, setComentario] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState("visao-geral");
  const [mostrarCorrecao, setMostrarCorrecao] = useState(false);
  const [correcaoNome, setCorrecaoNome] = useState("");
  const [correcaoTel, setCorrecaoTel] = useState("");
  const [correcaoEmail, setCorrecaoEmail] = useState("");
  const [correcaoMsg, setCorrecaoMsg] = useState("");
  const [correcaoEnviada, setCorrecaoEnviada] = useState(false);
  const [correcaoLoading, setCorrecaoLoading] = useState(false);
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUsuario(data.user);
        setNome(data.user.user_metadata?.name || data.user.email || "");
      }
    });
  }, []);

  useEffect(() => {
    supabase.from("restaurantes").select("*").eq("slug", slug).single()
      .then(({ data }) => { if (data) setRestaurante(data); });
  }, [slug]);

  useEffect(() => {
    if (!restaurante) return;
    supabase.from("avaliacoes").select("*").eq("restaurante_id", restaurante.id)
      .order("criado_em", { ascending: false })
      .then(({ data }) => { if (data) setAvaliacoes(data); });
  }, [restaurante]);

  const handleAvaliar = async () => {
    if (!comentario) return;
    setLoading(true);
    const { error } = await supabase.from("avaliacoes").insert([{
      restaurante_id: restaurante.id, nome, nota, comentario, titulo,
      user_id: usuario?.id,
    }]);
    setLoading(false);
    if (!error) {
      setEnviado(true);
      setAvaliacoes([{ nome, nota, comentario, titulo, criado_em: new Date(), curtidas: 0, user_id: usuario?.id }, ...avaliacoes]);
    }
  };

  const handleCorrecao = async () => {
    if (!correcaoNome || !correcaoTel || !correcaoEmail || !correcaoMsg) return;
    setCorrecaoLoading(true);
    const res = await fetch("/api/correcao", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: correcaoNome, telefone: correcaoTel, email: correcaoEmail, mensagem: correcaoMsg, estabelecimento: restaurante.nome }),
    });
    setCorrecaoLoading(false);
    if (res.ok) setCorrecaoEnviada(true);
  };

  if (!restaurante) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      <p style={{ color: "#6b7280" }}>Carregando...</p>
    </div>
  );

  const notaMedia = avaliacoes.length > 0
    ? (avaliacoes.reduce((sum, av) => sum + av.nota, 0) / avaliacoes.length).toFixed(1)
    : restaurante.nota;

  const status = verificarAberto(restaurante.horarios);

  const diasSemana = [
    { key: "segunda", label: "Segunda-feira" },
    { key: "terca", label: "Terça-feira" },
    { key: "quarta", label: "Quarta-feira" },
    { key: "quinta", label: "Quinta-feira" },
    { key: "sexta", label: "Sexta-feira" },
    { key: "sabado", label: "Sábado" },
    { key: "domingo", label: "Domingo" },
  ];

  const formularioProps = { usuario, nome, nota, setNota, comentario, setComentario, titulo, setTitulo, loading, enviado, handleAvaliar };

  return (
    <main style={{ backgroundColor: "#f2f2f2", minHeight: "100vh", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      <style>{`
        .nav-link-rest { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; text-decoration: none; color: #1f2937; font-size: 14px; font-weight: 500; padding: 6px 10px; border-radius: 6px; transition: background-color 0.2s, color 0.2s; }
        .nav-link-rest:hover { background-color: #f3f4f6; color: #111; }
        .aba-rest { background: none; border: none; border-bottom: 3px solid transparent; padding: 16px 4px; font-size: 14px; font-weight: 600; color: #6b7280; cursor: pointer; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; transition: color 0.2s, border-bottom 0.2s; }
        .aba-rest:hover { color: #111; }
        .aba-rest.ativa { color: #111; border-bottom: 3px solid #111; }
      `}</style>

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
              <a key={item.label} href={item.href} className="nav-link-rest">{item.label}</a>
            ))}
            {usuario ? (
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "12px" }}>
                <a href="/perfil" style={{ fontSize: "14px", fontWeight: "600", color: "#111", textDecoration: "none" }}>
                  {usuario.user_metadata?.name || usuario.email}
                </a>
                <button onClick={async () => { await supabase.auth.signOut(); setUsuario(null); window.location.reload(); }} style={{ backgroundColor: "#f3f4f6", color: "#111", border: "none", padding: "8px 16px", borderRadius: "999px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                  Sair
                </button>
              </div>
            ) : (
              <a href="/login" style={{ textDecoration: "none", backgroundColor: "#111", color: "white", padding: "8px 20px", borderRadius: "999px", fontSize: "14px", fontWeight: "600", marginLeft: "12px" }}>
                Entrar
              </a>
            )}
          </nav>
        </div>
      </header>

      <div style={{ height: "60px" }} />

      <div style={{ backgroundColor: "white", padding: "10px 0", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ width: "70%", margin: "0 auto", fontSize: "13px", color: "#9ca3af" }}>
          <a href="/home" style={{ color: "#9ca3af", textDecoration: "none" }}>Início</a>
          <span style={{ margin: "0 6px" }}>›</span>
          <a href="/gastronomia" style={{ color: "#9ca3af", textDecoration: "none" }}>Gastronomia</a>
          <span style={{ margin: "0 6px" }}>›</span>
          <span style={{ color: "#111" }}>{restaurante.nome}</span>
        </div>
      </div>

      <div style={{ position: "relative", height: "420px", overflow: "hidden" }}>
        <img src={restaurante.foto_url} alt={restaurante.nome} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)" }} />
        <div style={{ position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)", width: "70%" }}>
          <h1 style={{ fontSize: "36px", fontWeight: "900", color: "white", margin: "0 0 8px", textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>{restaurante.nome}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ display: "flex", gap: "3px" }}>
              {[1,2,3,4,5].map((s) => (
                <span key={s} style={{ color: s <= Math.round(Number(notaMedia)) ? "#fbbf24" : "rgba(255,255,255,0.3)", fontSize: "18px" }}>★</span>
              ))}
            </div>
            <span style={{ fontSize: "16px", fontWeight: "700", color: "white" }}>{notaMedia}</span>
            <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>({avaliacoes.length} avaliações)</span>
            <div style={{ width: "1px", height: "16px", backgroundColor: "rgba(255,255,255,0.3)" }} />
            <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.9)", backgroundColor: "rgba(0,0,0,0.3)", padding: "4px 12px", borderRadius: "999px" }}>{restaurante.tipo}</span>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: "white", borderBottom: "1px solid #e5e7eb", position: "sticky", top: "60px", zIndex: 90 }}>
        <div style={{ width: "70%", margin: "0 auto", display: "flex", gap: "32px" }}>
          {[
            { id: "visao-geral", label: "Visão geral" },
            { id: "avaliacoes", label: `Avaliações (${avaliacoes.length})` },
            ...(restaurante.cardapio ? [{ id: "cardapio", label: "Cardápio" }] : []),
            { id: "localizacao", label: "Localização" },
          ].map((aba) => (
            <button key={aba.id} className={`aba-rest ${abaAtiva === aba.id ? "ativa" : ""}`} onClick={() => setAbaAtiva(aba.id)}>
              {aba.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ width: "70%", margin: "0 auto", padding: "32px 0 64px", display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px" }}>
        <div>
          {abaAtiva === "visao-geral" && (
            <>
              {restaurante.descricao && (
                <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "24px", marginBottom: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                  <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111", margin: "0 0 12px" }}>Sobre</h2>
                  {restaurante.descricao.split('\n\n').map((paragrafo: string, i: number) => (
                    <p key={i} style={{ fontSize: "15px", color: "#4b5563", lineHeight: "1.7", margin: "0 0 16px", textAlign: "justify" }}>{paragrafo}</p>
                  ))}
                </div>
              )}
              {restaurante.sobre && (
                <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "24px", marginBottom: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                  <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111", margin: "0 0 20px" }}>Informações</h2>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                    {[
                      { key: "destaques", label: "✨ Destaques" },
                      { key: "servicos", label: "🛎️ Opções de serviço" },
                      { key: "menu", label: "🍽️ Opções no menu" },
                      { key: "ambiente", label: "🌿 Ambiente" },
                      { key: "bom_para", label: "👍 Bom para" },
                      { key: "publico", label: "👥 Público" },
                      { key: "pagamentos", label: "💳 Pagamentos" },
                      { key: "acessibilidade", label: "♿ Acessibilidade" },
                      { key: "criancas", label: "👶 Crianças" },
                      { key: "estacionamento", label: "🚗 Estacionamento" },
                      { key: "animais", label: "🐾 Animais de estimação" },
                    ].filter((cat) => restaurante.sobre[cat.key]?.length > 0).map((cat) => (
                      <div key={cat.key}>
                        <p style={{ fontSize: "13px", fontWeight: "700", color: "#111", margin: "0 0 8px" }}>{cat.label}</p>
                        <ul style={{ margin: 0, padding: "0 0 0 16px" }}>
                          {restaurante.sobre[cat.key].map((item: string, i: number) => (
                            <li key={i} style={{ fontSize: "13px", color: "#4b5563", marginBottom: "4px", lineHeight: "1.5" }}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "24px", marginBottom: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111", margin: "0 0 20px" }}>
                  Avaliações {avaliacoes.length > 0 && `(${avaliacoes.length})`}
                </h2>
                {avaliacoes.length === 0 && <p style={{ color: "#6b7280", fontSize: "14px" }}>Seja o primeiro a avaliar!</p>}
                {avaliacoes.slice(0, 3).map((av, i) => (
                  <AvaliacaoCard key={av.id || i} av={av} ultimo={i === Math.min(avaliacoes.length, 3) - 1} />
                ))}
                {avaliacoes.length > 3 && (
                  <button onClick={() => setAbaAtiva("avaliacoes")} style={{ background: "none", border: "1px solid #e5e7eb", borderRadius: "999px", padding: "8px 20px", fontSize: "14px", fontWeight: "600", color: "#111", cursor: "pointer", marginBottom: "24px" }}>
                    Ver todas as avaliações →
                  </button>
                )}
                <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid #f3f4f6" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111", margin: "0 0 16px" }}>Escrever uma avaliação</h3>
                  <FormularioAvaliacao {...formularioProps} />
                </div>
              </div>
              <div style={{ backgroundColor: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <div style={{ padding: "20px 24px 0" }}>
                  <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111", margin: "0 0 16px" }}>Localização</h2>
                </div>
                <iframe src={`https://maps.google.com/maps?q=${encodeURIComponent(restaurante.nome + " Garopaba SC")}&output=embed`} width="100%" height="300" style={{ border: "none", display: "block" }} loading="lazy" />
              </div>
            </>
          )}

          {abaAtiva === "avaliacoes" && (
            <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111", margin: "0 0 24px" }}>
                Avaliações {avaliacoes.length > 0 && `(${avaliacoes.length})`}
              </h2>
              {avaliacoes.length === 0 && <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "24px" }}>Seja o primeiro a avaliar!</p>}
              {avaliacoes.map((av, i) => (
                <AvaliacaoCard key={av.id || i} av={av} ultimo={i === avaliacoes.length - 1} />
              ))}
              <div style={{ marginTop: "32px", paddingTop: "24px", borderTop: "1px solid #f3f4f6" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111", margin: "0 0 16px" }}>Escrever uma avaliação</h3>
                <FormularioAvaliacao {...formularioProps} />
              </div>
            </div>
          )}

          {abaAtiva === "cardapio" && restaurante.cardapio && (
            <div style={{ backgroundColor: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <iframe src={restaurante.cardapio} width="100%" height="800" style={{ border: "none", display: "block" }} />
            </div>
          )}

          {abaAtiva === "localizacao" && (
            <div style={{ backgroundColor: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <iframe src={`https://maps.google.com/maps?q=${encodeURIComponent(restaurante.nome + " Garopaba SC")}&output=embed`} width="100%" height="480" style={{ border: "none", display: "block" }} loading="lazy" />
            </div>
          )}
        </div>

        <div>
          <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", position: "sticky", top: "120px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", padding: "14px 16px", backgroundColor: status.aberto ? "#f0fdf4" : "#fef2f2", borderRadius: "12px", border: `1px solid ${status.aberto ? "#bbf7d0" : "#fecaca"}` }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: status.aberto ? "#22c55e" : "#ef4444", flexShrink: 0 }} />
              <span style={{ fontSize: "14px", fontWeight: "700", color: status.aberto ? "#15803d" : "#dc2626" }}>{status.texto}</span>
            </div>
            {restaurante.horarios && (
              <>
                <h2 style={{ fontSize: "15px", fontWeight: "700", color: "#111", margin: "0 0 12px" }}>Horário de funcionamento</h2>
                {diasSemana.map((dia) => {
                  const h = restaurante.horarios[dia.key];
                  return (
                    <div key={dia.key} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #f3f4f6" }}>
                      <span style={{ fontSize: "13px", color: "#4b5563" }}>{dia.label}</span>
                      <div style={{ textAlign: "right" }}>
                        {h ? (
                          h.intervalo ? (
                            <>
                              <span style={{ fontSize: "13px", color: "#111", fontWeight: "600", display: "block" }}>{h.abre} – {h.intervalo.split(' - ')[0]}</span>
                              <span style={{ fontSize: "11px", color: "#9ca3af", display: "block", margin: "2px 0" }}>intervalo</span>
                              <span style={{ fontSize: "13px", color: "#111", fontWeight: "600", display: "block" }}>{h.intervalo.split(' - ')[1]} – {h.fecha}</span>
                            </>
                          ) : (
                            <span style={{ fontSize: "13px", color: "#111", fontWeight: "600" }}>{h.abre} – {h.fecha}</span>
                          )
                        ) : (
                          <span style={{ fontSize: "13px", color: "#9ca3af" }}>Fechado</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
            {restaurante.maps_url && (
              <a href={restaurante.maps_url} target="_blank" style={{ display: "block", textAlign: "center", backgroundColor: "#111", color: "white", textDecoration: "none", padding: "12px", borderRadius: "10px", fontSize: "14px", fontWeight: "600", marginTop: "20px" }}>
                Como chegar →
              </a>
            )}
            {restaurante.delivery_url && (
              <a href={restaurante.delivery_url} target="_blank" style={{ display: "block", textAlign: "center", backgroundColor: "#ea1d2c", color: "white", textDecoration: "none", padding: "12px", borderRadius: "10px", fontSize: "14px", fontWeight: "600", marginTop: "10px" }}>
                🛵 Pedir pelo iFood
              </a>
            )}
            {restaurante.whatsapp && (
              <a href={`https://wa.me/${restaurante.whatsapp.replace(/\D/g, '')}`} target="_blank" style={{ display: "block", textAlign: "center", backgroundColor: "#25D366", color: "white", textDecoration: "none", padding: "12px", borderRadius: "10px", fontSize: "14px", fontWeight: "600", marginTop: "10px" }}>
                💬 Falar no WhatsApp
              </a>
            )}
            {(restaurante.instagram || restaurante.facebook) && (
              <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid #f3f4f6" }}>
                <p style={{ fontSize: "13px", fontWeight: "600", color: "#6b7280", margin: "0 0 12px" }}>Redes sociais</p>
                <div style={{ display: "flex", gap: "10px" }}>
                  {restaurante.instagram && (
                    <a href={restaurante.instagram} target="_blank" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", backgroundColor: "#f3f4f6", padding: "10px 16px", borderRadius: "10px", flex: 1, justifyContent: "center" }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" stroke="#E1306C" strokeWidth="2"/><circle cx="12" cy="12" r="4" stroke="#E1306C" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1" fill="#E1306C"/></svg>
                      <span style={{ fontSize: "13px", fontWeight: "600", color: "#E1306C" }}>Instagram</span>
                    </a>
                  )}
                  {restaurante.facebook && (
                    <a href={restaurante.facebook} target="_blank" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", backgroundColor: "#f3f4f6", padding: "10px 16px", borderRadius: "10px", flex: 1, justifyContent: "center" }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="#1877F2"/><path d="M13 21V13h2.5l.5-3H13V8.5C13 7.67 13.33 7 14.5 7H16V4.5S15 4 13.5 4C11 4 10 5.5 10 7.5V10H7.5v3H10v8" fill="white"/></svg>
                      <span style={{ fontSize: "13px", fontWeight: "600", color: "#1877F2" }}>Facebook</span>
                    </a>
                  )}
                </div>
              </div>
            )}
            <button onClick={() => setMostrarCorrecao(true)} style={{ display: "block", width: "100%", textAlign: "center", backgroundColor: "#6b7280", color: "white", border: "none", padding: "12px", borderRadius: "10px", fontSize: "14px", fontWeight: "600", marginTop: "10px", cursor: "pointer", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
              ✏️ Sugerir correção
            </button>
          </div>
        </div>
      </div>

      <footer style={{ backgroundColor: "#1f2937", color: "#9ca3af", padding: "32px 0", textAlign: "center" }}>
        <p style={{ color: "white", fontWeight: "700", fontSize: "16px", margin: "0 0 4px" }}>Destino Garopaba</p>
        <p style={{ fontSize: "13px", margin: 0 }}>O guia definitivo de Garopaba, SC</p>
      </footer>

      {mostrarCorrecao && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "32px", maxWidth: "480px", width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            {!correcaoEnviada ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                  <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111", margin: 0 }}>Sugerir correção</h2>
                  <button onClick={() => setMostrarCorrecao(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", color: "#6b7280" }}>✕</button>
                </div>
                <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "20px" }}>
                  Encontrou alguma informação incorreta sobre <strong>{restaurante.nome}</strong>? Nos informe e corrigiremos o mais breve possível.
                </p>
                {[
                  { label: "Nome", value: correcaoNome, set: setCorrecaoNome, type: "text", placeholder: "Seu nome completo" },
                  { label: "Telefone", value: correcaoTel, set: setCorrecaoTel, type: "tel", placeholder: "(48) 99999-9999" },
                  { label: "Email", value: correcaoEmail, set: setCorrecaoEmail, type: "email", placeholder: "seu@email.com" },
                ].map((field) => (
                  <div key={field.label} style={{ marginBottom: "12px" }}>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#4b5563", display: "block", marginBottom: "6px" }}>{field.label} *</label>
                    <input type={field.type} placeholder={field.placeholder} value={field.value} onChange={(e) => field.set(e.target.value)}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
                  </div>
                ))}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "600", color: "#4b5563", display: "block", marginBottom: "6px" }}>Correção *</label>
                  <textarea placeholder="Descreva o que precisa ser corrigido..." value={correcaoMsg} onChange={(e) => setCorrecaoMsg(e.target.value)} rows={4}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "14px", outline: "none", resize: "none", boxSizing: "border-box" }} />
                </div>
                <button onClick={handleCorrecao} disabled={correcaoLoading} style={{ width: "100%", backgroundColor: "#111", color: "white", border: "none", borderRadius: "10px", padding: "14px", fontSize: "15px", fontWeight: "600", cursor: correcaoLoading ? "not-allowed" : "pointer", opacity: correcaoLoading ? 0.7 : 1 }}>
                  {correcaoLoading ? "Enviando..." : "Enviar correção"}
                </button>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <p style={{ fontSize: "32px", marginBottom: "16px" }}>✅</p>
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#111", marginBottom: "8px" }}>Correção enviada!</h3>
                <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "24px" }}>Obrigado! Vamos analisar e corrigir o mais breve possível.</p>
                <button onClick={() => { setMostrarCorrecao(false); setCorrecaoEnviada(false); }} style={{ backgroundColor: "#111", color: "white", border: "none", borderRadius: "10px", padding: "12px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                  Fechar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}