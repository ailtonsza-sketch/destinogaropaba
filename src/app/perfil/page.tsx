"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PerfilPage() {
  const [usuario, setUsuario] = useState<any>(null);
  const [editando, setEditando] = useState(true);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [biografia, setBiografia] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [capaUrl, setCapaUrl] = useState("");
  const [avaliacoes, setAvaliacoes] = useState<any[]>([]);
  const [salvando, setSalvando] = useState(false);
  const [salvo, setSalvo] = useState(false);
  const [uploadandoAvatar, setUploadandoAvatar] = useState(false);
  const [uploadandoCapa, setUploadandoCapa] = useState(false);
  const [username, setUsername] = useState("");
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const capaInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { window.location.href = "/login"; return; }
      setUsuario(data.user);
      const { data: p } = await supabase.from("perfis").select("*").eq("id", data.user.id).single();
      if (p) {
        setNome(p.nome || data.user.user_metadata?.name || "");
        setEmail(p.email || data.user.email || "");
        setTelefone(p.telefone || "");
        setEndereco(p.endereco || "");
        setBiografia(p.biografia || "");
        setAvatarUrl(p.avatar_url || data.user.user_metadata?.avatar_url || "");
        setCapaUrl(p.capa_url || "");
        setUsername(p.username || "");
      } else {
        setNome(data.user.user_metadata?.name || "");
        setEmail(data.user.email || "");
        setAvatarUrl(data.user.user_metadata?.avatar_url || "");
      }
      supabase.from("avaliacoes").select("*, restaurantes(nome, slug, foto_url)")
        .eq("user_id", data.user.id)
        .order("criado_em", { ascending: false })
        .then(({ data: avs }) => { if (avs) setAvaliacoes(avs); });
    });
  }, []);

  const handleSalvar = async () => {
    if (!usuario) return;
    setSalvando(true);
    await supabase.from("perfis").upsert({ id: usuario.id, nome, email, telefone, endereco, biografia, avatar_url: avatarUrl, capa_url: capaUrl, username: username.toLowerCase().replace(/[^a-z0-9_]/g, "") });
    await supabase.auth.updateUser({ data: { name: nome, avatar_url: avatarUrl } });
    setSalvando(false);
    const usernameAtual = username.toLowerCase().replace(/[^a-z0-9_]/g, "");
    window.location.href = `/u/${usernameAtual}`;
  };

  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !usuario) return;
    setUploadandoAvatar(true);
    const ext = file.name.split(".").pop();
    await supabase.storage.from("avatars").upload(`${usuario.id}.${ext}`, file, { upsert: true });
    const { data } = supabase.storage.from("avatars").getPublicUrl(`${usuario.id}.${ext}`);
    setAvatarUrl(data.publicUrl);
    setUploadandoAvatar(false);
  };

  const handleUploadCapa = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !usuario) return;
    setUploadandoCapa(true);
    const ext = file.name.split(".").pop();
    await supabase.storage.from("capas").upload(`${usuario.id}.${ext}`, file, { upsert: true });
    const { data } = supabase.storage.from("capas").getPublicUrl(`${usuario.id}.${ext}`);
    setCapaUrl(data.publicUrl);
    setUploadandoCapa(false);
  };

  if (!usuario) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <p style={{ color: "#6b7280" }}>Carregando...</p>
    </div>
  );

  return (
    <main style={{ backgroundColor: "#f2f2f2", minHeight: "100vh", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      <Header />
      <div style={{ height: "60px" }} />

      {/* CAPA */}
      <div style={{ position: "relative", height: "350px", overflow: "hidden" }}>
        {capaUrl ? (
          <img src={capaUrl} alt="Capa" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #1f2937 0%, #374151 100%)" }} />
        )}
        <button onClick={() => capaInputRef.current?.click()}
          style={{ position: "absolute", bottom: "16px", right: "16px", backgroundColor: "rgba(0,0,0,0.5)", color: "white", border: "none", borderRadius: "999px", padding: "8px 16px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
          {uploadandoCapa ? "Enviando..." : "📷 Alterar capa"}
        </button>
        <input ref={capaInputRef} type="file" accept="image/*" onChange={handleUploadCapa} style={{ display: "none" }} />
      </div>

      {/* BARRA BRANCA QUE SOBE SOBRE A CAPA */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #e5e7eb", marginTop: "-60px", position: "relative", zIndex: 10 }}>
        <div style={{ width: "70%", margin: "0 auto", padding: "24px 0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              {/* AVATAR */}
              <div style={{ position: "relative", marginTop: "0px" }}>
                <div style={{ width: "110px", height: "110px", borderRadius: "50%", overflow: "hidden", backgroundColor: "#f3f4f6", border: "5px solid white", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px", fontWeight: "800", color: "#6b7280" }}>
                      {(nome || usuario.email).charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <button onClick={() => avatarInputRef.current?.click()}
                  style={{ position: "absolute", bottom: "4px", right: "4px", width: "28px", height: "28px", backgroundColor: "#111", border: "2px solid white", borderRadius: "50%", cursor: "pointer", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  📷
                </button>
                <input ref={avatarInputRef} type="file" accept="image/*" onChange={handleUploadAvatar} style={{ display: "none" }} />
              </div>
              {/* NOME */}
              <div>
                <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#111", margin: "0 0 4px" }}>{nome || "Sem nome"}</h1>
                {endereco && <p style={{ fontSize: "13px", color: "#9ca3af", margin: "0 0 2px" }}>📍 {endereco}</p>}
                <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
                  <strong style={{ color: "#111" }}>{avaliacoes.length}</strong> {avaliacoes.length === 1 ? "contribuição" : "contribuições"}
                </p>
              </div>
            </div>
            <button onClick={() => setEditando(!editando)}
              style={{ backgroundColor: "white", color: "#111", border: "1px solid #e5e7eb", borderRadius: "999px", padding: "10px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
              {editando ? "Cancelar" : "Editar perfil"}
            </button>
          </div>
        </div>
      </div>

      {/* CONTEÚDO EM DUAS COLUNAS */}
      <div style={{ width: "70%", margin: "32px auto 64px", display: "grid", gridTemplateColumns: "280px 1fr", gap: "24px" }}>

        {/* COLUNA ESQUERDA — INTRODUÇÃO */}
        <div>
          {editando ? (
            <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111", margin: "0 0 16px" }}>Editar perfil</h2>
              {[
                { label: "Nome", value: nome, set: setNome, type: "text", placeholder: "Seu nome" },
                { label: "Email", value: email, set: setEmail, type: "email", placeholder: "seu@email.com" },
                { label: "Telefone", value: telefone, set: setTelefone, type: "tel", placeholder: "(48) 99999-9999" },
                { label: "Cidade", value: endereco, set: setEndereco, type: "text", placeholder: "Garopaba, SC" },
                { label: "Link do perfil (@username)", value: username, set: setUsername, type: "text", placeholder: "seunome" },
              ].map((field) => (
                <div key={field.label} style={{ marginBottom: "12px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "600", color: "#4b5563", display: "block", marginBottom: "6px" }}>{field.label}</label>
                  <input type={field.type} placeholder={field.placeholder} value={field.value} onChange={(e) => field.set(e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
                </div>
              ))}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#4b5563", display: "block", marginBottom: "6px" }}>
                  Biografia <span style={{ fontWeight: "400", color: "#9ca3af" }}>({biografia.length}/300)</span>
                </label>
                <textarea placeholder="Conte um pouco sobre você..." value={biografia} onChange={(e) => { if (e.target.value.length <= 300) setBiografia(e.target.value); }} rows={4}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "14px", outline: "none", resize: "none", boxSizing: "border-box" }} />
              </div>
              <button onClick={handleSalvar} disabled={salvando}
                style={{ width: "100%", backgroundColor: "#111", color: "white", border: "none", borderRadius: "10px", padding: "12px", fontSize: "14px", fontWeight: "600", cursor: salvando ? "not-allowed" : "pointer" }}>
                {salvando ? "Salvando..." : "Salvar alterações"}
              </button>
              {salvo && <p style={{ fontSize: "13px", color: "#22c55e", marginTop: "8px", textAlign: "center" }}>✅ Salvo!</p>}
            </div>
          ) : (
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111", margin: "0 0 16px 10px" }}>Introdução</h2>
              <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                {biografia && <p style={{ fontSize: "14px", color: "#4b5563", lineHeight: "1.6", margin: "0 0 16px" }}>{biografia}</p>}
                {endereco && <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}><span>📍</span><span style={{ fontSize: "14px", color: "#4b5563" }}>{endereco}</span></div>}
                {telefone && <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}><span>📞</span><span style={{ fontSize: "14px", color: "#4b5563" }}>{telefone}</span></div>}
                <div style={{ display: "flex", gap: "8px" }}>
                  <span>📅</span>
                  <span style={{ fontSize: "14px", color: "#4b5563" }}>
                    Membro desde {new Date(usuario.created_at).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
                    {username && (
                <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                  <span>🔗</span>
                  <a href={`/u/${username}`} style={{ fontSize: "14px", color: "#111", fontWeight: "600" }}>
                    destinogaropaba.com.br/u/{username}
                  </a>
                </div>
              )}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* COLUNA DIREITA — ATIVIDADES */}
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111", margin: "0 0 16px 10px" }}>
            Atividades {avaliacoes.length > 0 && `(${avaliacoes.length})`}
          </h2>
          {avaliacoes.length === 0 ? (
            <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "48px 24px", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <p style={{ fontSize: "32px", marginBottom: "12px" }}>⭐</p>
              <p style={{ fontSize: "15px", color: "#6b7280", marginBottom: "16px" }}>Você ainda não fez nenhuma avaliação.</p>
              <a href="/gastronomia" style={{ backgroundColor: "#111", color: "white", textDecoration: "none", padding: "10px 24px", borderRadius: "999px", fontSize: "14px", fontWeight: "600" }}>
                Explorar restaurantes
              </a>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {avaliacoes.map((av, i) => (
                <div key={i} style={{ backgroundColor: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                  <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ width: "44px", height: "44px", borderRadius: "50%", overflow: "hidden", backgroundColor: "#f3f4f6", flexShrink: 0 }}>
                      {avatarUrl ? (
                        <img src={avatarUrl} alt={nome} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "700", color: "#6b7280" }}>
                          {nome.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <p style={{ fontSize: "14px", margin: 0 }}>
                        <strong>{nome}</strong> <span style={{ color: "#6b7280" }}>escreveu uma avaliação</span>
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