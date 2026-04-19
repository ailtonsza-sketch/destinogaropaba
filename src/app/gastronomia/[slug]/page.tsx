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

export default function RestaurantePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [restaurante, setRestaurante] = useState<any>(null);
  const [avaliacoes, setAvaliacoes] = useState<any[]>([]);
  const [nome, setNome] = useState("");
  const [nota, setNota] = useState(5);
  const [comentario, setComentario] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState("visao-geral");

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
    if (!nome || !comentario) return;
    setLoading(true);
    const { error } = await supabase.from("avaliacoes").insert([{
      restaurante_id: restaurante.id, nome, nota, comentario,
    }]);
    setLoading(false);
    if (!error) {
      setEnviado(true);
      setAvaliacoes([{ nome, nota, comentario, criado_em: new Date() }, ...avaliacoes]);
    }
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

  return (
    <main style={{ backgroundColor: "#f2f2f2", minHeight: "100vh", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>

      <style>{`
        .nav-link-rest { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; text-decoration: none; color: #1f2937; font-size: 14px; font-weight: 500; padding: 6px 10px; border-radius: 6px; transition: background-color 0.2s, color 0.2s; }
        .nav-link-rest:hover { background-color: #f3f4f6; color: #111; }
        .aba-rest { background: none; border: none; border-bottom: 3px solid transparent; padding: 16px 4px; font-size: 14px; font-weight: 600; color: #6b7280; cursor: pointer; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; transition: color 0.2s, border-bottom 0.2s; }
        .aba-rest:hover { color: #111; }
        .aba-rest.ativa { color: #111; border-bottom: 3px solid #111; }
      `}</style>

      {/* HEADER */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, backgroundColor: "white", borderBottom: "1px solid #e5e7eb", height: "60px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <div style={{ width: "70%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/home" style={{ textDecoration: "none", fontSize: "20px", fontWeight: "800", color: "#111", letterSpacing: "-0.5px" }}>Destino Garopaba</a>
          <nav style={{ display: "flex", gap: "4px" }}>
            {["Garopaba","Nossas Praias","Atrativos Turísticos","Hospedagens","Gastronomia","Fale Conosco"].map((label) => (
              <a key={label} href="/home" className="nav-link-rest">{label}</a>
            ))}
          </nav>
        </div>
      </header>

      <div style={{ height: "60px" }} />

      {/* BREADCRUMB */}
      <div style={{ backgroundColor: "white", padding: "10px 0", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ width: "70%", margin: "0 auto", fontSize: "13px", color: "#9ca3af" }}>
          <a href="/home" style={{ color: "#9ca3af", textDecoration: "none" }}>Garopaba</a>
          <span style={{ margin: "0 6px" }}>›</span>
          <a href="/home" style={{ color: "#9ca3af", textDecoration: "none" }}>Restaurantes</a>
          <span style={{ margin: "0 6px" }}>›</span>
          <span style={{ color: "#111" }}>{restaurante.nome}</span>
        </div>
      </div>

      {/* FOTO HERO */}
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

      {/* ABAS */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #e5e7eb", position: "sticky", top: "60px", zIndex: 90 }}>
        <div style={{ width: "70%", margin: "0 auto", display: "flex", gap: "32px" }}>
          {[
            { id: "visao-geral", label: "Visão geral" },
            { id: "avaliacoes", label: `Avaliações (${avaliacoes.length})` },
            { id: "localizacao", label: "Localização" },
          ].map((aba) => (
            <button key={aba.id} className={`aba-rest ${abaAtiva === aba.id ? "ativa" : ""}`} onClick={() => setAbaAtiva(aba.id)}>
              {aba.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTEÚDO */}
      <div style={{ width: "70%", margin: "0 auto", padding: "32px 0 64px", display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px" }}>

        {/* COLUNA ESQUERDA */}
        <div>

          {/* VISÃO GERAL */}
          {abaAtiva === "visao-geral" && (
            <>
              {/* SOBRE */}
              {restaurante.descricao && (
                <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "24px", marginBottom: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                  <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111", margin: "0 0 12px" }}>Sobre</h2>
                  {restaurante.descricao.split('\n\n').map((paragrafo: string, i: number) => (
                    <p key={i} style={{ fontSize: "15px", color: "#4b5563", lineHeight: "1.7", margin: "0 0 16px", textAlign: "justify" }}>{paragrafo}</p>
                  ))}
                </div>
              )}

              {/* AVALIAÇÕES RESUMO */}
              <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "24px", marginBottom: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111", margin: "0 0 20px" }}>
                  Avaliações {avaliacoes.length > 0 && `(${avaliacoes.length})`}
                </h2>
                {avaliacoes.length === 0 && (
                  <p style={{ color: "#6b7280", fontSize: "14px" }}>Seja o primeiro a avaliar!</p>
                )}
                {avaliacoes.slice(0, 3).map((av, i) => (
                  <div key={i} style={{ borderBottom: i < Math.min(avaliacoes.length, 3) - 1 ? "1px solid #f3f4f6" : "none", paddingBottom: "16px", marginBottom: "16px" }}>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: "700", color: "#6b7280", flexShrink: 0 }}>
                        {av.nome.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <span style={{ fontWeight: "700", fontSize: "14px", color: "#111" }}>{av.nome}</span>
                          <div style={{ display: "flex", gap: "2px" }}>
                            {[1,2,3,4,5].map((s) => (
                              <span key={s} style={{ color: s <= av.nota ? "#fbbf24" : "#e5e7eb", fontSize: "13px" }}>★</span>
                            ))}
                          </div>
                        </div>
                        <p style={{ fontSize: "14px", color: "#4b5563", margin: 0, lineHeight: "1.5" }}>{av.comentario}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {avaliacoes.length > 3 && (
                  <button onClick={() => setAbaAtiva("avaliacoes")} style={{ background: "none", border: "1px solid #e5e7eb", borderRadius: "999px", padding: "8px 20px", fontSize: "14px", fontWeight: "600", color: "#111", cursor: "pointer" }}>
                    Ver todas as avaliações →
                  </button>
                )}
              </div>

              {/* MAPA */}
              <div style={{ backgroundColor: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <div style={{ padding: "20px 24px 0" }}>
                  <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111", margin: "0 0 16px" }}>Localização</h2>
                </div>
                <iframe
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(restaurante.nome + " Garopaba SC")}&output=embed`}
                  width="100%" height="300"
                  style={{ border: "none", display: "block" }}
                  loading="lazy"
                />
              </div>
            </>
          )}

          {/* AVALIAÇÕES COMPLETAS */}
          {abaAtiva === "avaliacoes" && (
            <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111", margin: "0 0 24px" }}>
                Avaliações {avaliacoes.length > 0 && `(${avaliacoes.length})`}
              </h2>
              {avaliacoes.length === 0 && (
                <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "24px" }}>Seja o primeiro a avaliar!</p>
              )}
              {avaliacoes.map((av, i) => (
                <div key={i} style={{ borderBottom: i < avaliacoes.length - 1 ? "1px solid #f3f4f6" : "none", paddingBottom: "20px", marginBottom: "20px" }}>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <div style={{ width: "44px", height: "44px", borderRadius: "50%", backgroundColor: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "700", color: "#6b7280", flexShrink: 0 }}>
                      {av.nome.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ fontWeight: "700", fontSize: "15px", color: "#111" }}>{av.nome}</span>
                        <div style={{ display: "flex", gap: "2px" }}>
                          {[1,2,3,4,5].map((s) => (
                            <span key={s} style={{ color: s <= av.nota ? "#fbbf24" : "#e5e7eb", fontSize: "14px" }}>★</span>
                          ))}
                        </div>
                      </div>
                      <p style={{ fontSize: "14px", color: "#4b5563", margin: 0, lineHeight: "1.6" }}>{av.comentario}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: "32px", paddingTop: "24px", borderTop: "1px solid #f3f4f6" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111", margin: "0 0 16px" }}>Escrever uma avaliação</h3>
                {!enviado ? (
                  <>
                    <input type="text" placeholder="Seu nome" value={nome} onChange={(e) => setNome(e.target.value)}
                      style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "14px", marginBottom: "12px", boxSizing: "border-box", outline: "none" }} />
                    <div style={{ marginBottom: "12px" }}>
                      <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 8px" }}>Sua nota:</p>
                      <div style={{ display: "flex", gap: "8px" }}>
                        {[1,2,3,4,5].map((s) => (
                          <span key={s} onClick={() => setNota(s)} style={{ fontSize: "28px", cursor: "pointer", color: s <= nota ? "#fbbf24" : "#e5e7eb" }}>★</span>
                        ))}
                      </div>
                    </div>
                    <textarea placeholder="Conte sua experiência..." value={comentario} onChange={(e) => setComentario(e.target.value)} rows={4}
                      style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "14px", marginBottom: "16px", boxSizing: "border-box", outline: "none", resize: "none" }} />
                    <button onClick={handleAvaliar} disabled={loading} style={{ backgroundColor: "#111", color: "white", border: "none", borderRadius: "999px", padding: "14px 32px", fontSize: "15px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
                      {loading ? "Enviando..." : "Publicar avaliação"}
                    </button>
                  </>
                ) : (
                  <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
                    <p style={{ fontSize: "16px", fontWeight: "600", color: "#111", margin: 0 }}>✅ Avaliação publicada!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* LOCALIZAÇÃO */}
          {abaAtiva === "localizacao" && (
            <div style={{ backgroundColor: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(restaurante.nome + " Garopaba SC")}&output=embed`}
                width="100%" height="480"
                style={{ border: "none", display: "block" }}
                loading="lazy"
              />
            </div>
          )}

        </div>

        {/* COLUNA DIREITA */}
        <div>
          <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", position: "sticky", top: "120px" }}>

            {/* STATUS */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", padding: "14px 16px", backgroundColor: status.aberto ? "#f0fdf4" : "#fef2f2", borderRadius: "12px", border: `1px solid ${status.aberto ? "#bbf7d0" : "#fecaca"}` }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: status.aberto ? "#22c55e" : "#ef4444", flexShrink: 0 }} />
              <span style={{ fontSize: "14px", fontWeight: "700", color: status.aberto ? "#15803d" : "#dc2626" }}>{status.texto}</span>
            </div>

            {/* HORÁRIOS */}
            {restaurante.horarios && (
              <>
                <h2 style={{ fontSize: "15px", fontWeight: "700", color: "#111", margin: "0 0 12px" }}>Horário de funcionamento</h2>
                {diasSemana.map((dia) => {
                  const h = restaurante.horarios[dia.key];
                  return (
                    <div key={dia.key} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #f3f4f6" }}>
                      <span style={{ fontSize: "13px", color: "#4b5563" }}>{dia.label}</span>
                      <span style={{ fontSize: "13px", color: h ? "#111" : "#9ca3af", fontWeight: h ? "600" : "400" }}>
                        {h ? `${h.abre} – ${h.fecha}` : "Fechado"}
                      </span>
                    </div>
                  );
                })}
              </>
            )}

            {/* COMO CHEGAR */}
            {restaurante.maps_url && (
              <a href={restaurante.maps_url} target="_blank" style={{ display: "block", textAlign: "center", backgroundColor: "#111", color: "white", textDecoration: "none", padding: "12px", borderRadius: "10px", fontSize: "14px", fontWeight: "600", marginTop: "20px" }}>
                Como chegar →
              </a>
            )}

            {/* REDES SOCIAIS */}
            {(restaurante.instagram || restaurante.facebook) && (
              <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid #f3f4f6" }}>
                <p style={{ fontSize: "13px", fontWeight: "600", color: "#6b7280", margin: "0 0 12px" }}>Redes sociais</p>
                <div style={{ display: "flex", gap: "10px" }}>
                  {restaurante.instagram && (
                    <a href={restaurante.instagram} target="_blank" style={{
                      display: "flex", alignItems: "center", gap: "8px",
                      textDecoration: "none", backgroundColor: "#f3f4f6",
                      padding: "10px 16px", borderRadius: "10px", flex: 1,
                      justifyContent: "center", transition: "background 0.2s",
                    }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="2" width="20" height="20" rx="5" stroke="#E1306C" strokeWidth="2"/>
                        <circle cx="12" cy="12" r="4" stroke="#E1306C" strokeWidth="2"/>
                        <circle cx="17.5" cy="6.5" r="1" fill="#E1306C"/>
                      </svg>
                      <span style={{ fontSize: "13px", fontWeight: "600", color: "#E1306C" }}>Instagram</span>
                    </a>
                  )}
                  {restaurante.facebook && (
                    <a href={restaurante.facebook} target="_blank" style={{
                      display: "flex", alignItems: "center", gap: "8px",
                      textDecoration: "none", backgroundColor: "#f3f4f6",
                      padding: "10px 16px", borderRadius: "10px", flex: 1,
                      justifyContent: "center", transition: "background 0.2s",
                    }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="2" width="20" height="20" rx="5" fill="#1877F2"/>
                        <path d="M13 21V13h2.5l.5-3H13V8.5C13 7.67 13.33 7 14.5 7H16V4.5S15 4 13.5 4C11 4 10 5.5 10 7.5V10H7.5v3H10v8" fill="white"/>
                      </svg>
                      <span style={{ fontSize: "13px", fontWeight: "600", color: "#1877F2" }}>Facebook</span>
                    </a>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* FOOTER */}
      <footer style={{ backgroundColor: "#1f2937", color: "#9ca3af", padding: "32px 0", textAlign: "center" }}>
        <p style={{ color: "white", fontWeight: "700", fontSize: "16px", margin: "0 0 4px" }}>Destino Garopaba</p>
        <p style={{ fontSize: "13px", margin: 0 }}>O guia definitivo de Garopaba, SC</p>
      </footer>

    </main>
  );
}