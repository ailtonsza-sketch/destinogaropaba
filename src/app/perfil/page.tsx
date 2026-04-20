"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PerfilPage() {
  const [usuario, setUsuario] = useState<any>(null);
  const [perfil, setPerfil] = useState<any>(null);
  const [editando, setEditando] = useState(false);
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
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const capaInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { window.location.href = "/login"; return; }
      setUsuario(data.user);

      const { data: p } = await supabase.from("perfis").select("*").eq("id", data.user.id).single();
      if (p) {
        setPerfil(p);
        setNome(p.nome || data.user.user_metadata?.name || "");
        setEmail(p.email || data.user.email || "");
        setTelefone(p.telefone || "");
        setEndereco(p.endereco || "");
        setBiografia(p.biografia || "");
        setAvatarUrl(p.avatar_url || data.user.user_metadata?.avatar_url || "");
        setCapaUrl(p.capa_url || "");
      } else {
        setNome(data.user.user_metadata?.name || "");
        setEmail(data.user.email || "");
        setAvatarUrl(data.user.user_metadata?.avatar_url || "");
      }

      supabase.from("avaliacoes").select("*, restaurantes(nome, slug)")
        .eq("user_id", data.user.id)
        .order("criado_em", { ascending: false })
        .then(({ data: avs }) => { if (avs) setAvaliacoes(avs); });
    });
  }, []);

  const handleSalvar = async () => {
    if (!usuario) return;
    setSalvando(true);
    await supabase.from("perfis").upsert({
      id: usuario.id,
      nome, email, telefone, endereco, biografia,
      avatar_url: avatarUrl, capa_url: capaUrl,
    });
    await supabase.auth.updateUser({ data: { name: nome, avatar_url: avatarUrl } });
    setSalvando(false);
    setSalvo(true);
    setEditando(false);
    setTimeout(() => setSalvo(false), 3000);
  };

  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !usuario) return;
    setUploadandoAvatar(true);
    const ext = file.name.split(".").pop();
    const path = `${usuario.id}.${ext}`;
    await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    setAvatarUrl(data.publicUrl);
    setUploadandoAvatar(false);
  };

  const handleUploadCapa = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !usuario) return;
    setUploadandoCapa(true);
    const ext = file.name.split(".").pop();
    const path = `${usuario.id}.${ext}`;
    await supabase.storage.from("capas").upload(path, file, { upsert: true });
    const { data } = supabase.storage.from("capas").getPublicUrl(path);
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

      <style>{`
        .nav-link-perfil { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; text-decoration: none; color: #1f2937; font-size: 14px; font-weight: 500; padding: 6px 10px; border-radius: 6px; transition: background-color 0.2s, color 0.2s; }
        .nav-link-perfil:hover { background-color: #f3f4f6; color: #111; }
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
              <a key={item.label} href={item.href} className="nav-link-perfil">{item.label}</a>
            ))}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "12px" }}>
              <a href="/perfil" style={{ fontSize: "14px", fontWeight: "600", color: "#111", textDecoration: "none" }}>{nome || usuario.email}</a>
              <button onClick={async () => { await supabase.auth.signOut(); window.location.href = "/home"; }}
                style={{ backgroundColor: "#f3f4f6", color: "#111", border: "none", padding: "8px 16px", borderRadius: "999px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                Sair
              </button>
            </div>
          </nav>
        </div>
      </header>

      <div style={{ height: "60px" }} />

      {/* CAPA */}
      <div style={{ position: "relative", height: "200px", backgroundColor: "#e5e7eb", overflow: "hidden" }}>
        {capaUrl ? (
          <img src={capaUrl} alt="Capa" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #1f2937 0%, #374151 100%)" }} />
        )}
        <button onClick={() => capaInputRef.current?.click()}
          style={{ position: "absolute", bottom: "16px", right: "16px", backgroundColor: "rgba(0,0,0,0.6)", color: "white", border: "none", borderRadius: "999px", padding: "8px 16px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
          {uploadandoCapa ? "Enviando..." : "📷 Alterar capa"}
        </button>
        <input ref={capaInputRef} type="file" accept="image/*" onChange={handleUploadCapa} style={{ display: "none" }} />
      </div>

      {/* CONTEÚDO */}
      <div style={{ width: "70%", margin: "0 auto", padding: "0 0 64px" }}>

        {/* AVATAR SOBRE A CAPA */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "32px", transform: "translateY(-40px)" }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <div style={{ width: "100px", height: "100px", borderRadius: "50%", overflow: "hidden", backgroundColor: "#f3f4f6", border: "4px solid white", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px", fontWeight: "800", color: "#6b7280" }}>
                  {(nome || usuario.email).charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <button onClick={() => avatarInputRef.current?.click()}
              style={{ position: "absolute", bottom: 0, right: 0, width: "32px", height: "32px", backgroundColor: "#111", border: "none", borderRadius: "50%", cursor: "pointer", fontSize: "14px" }}>
              📷
            </button>
            <input ref={avatarInputRef} type="file" accept="image/*" onChange={handleUploadAvatar} style={{ display: "none" }} />
          </div>
          {uploadandoAvatar && <p style={{ fontSize: "13px", color: "#6b7280" }}>Enviando foto...</p>}
          <button onClick={() => setEditando(!editando)}
            style={{ backgroundColor: editando ? "#f3f4f6" : "#111", color: editando ? "#111" : "white", border: "none", borderRadius: "999px", padding: "10px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", marginBottom: "4px" }}>
            {editando ? "Cancelar" : "✏️ Editar perfil"}
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginTop: "-24px" }}>

          {/* COLUNA ESQUERDA */}
          <div>
            {/* INFO */}
            <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "24px", marginBottom: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              {!editando ? (
                <>
                  <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#111", margin: "0 0 4px" }}>{nome || "Sem nome"}</h2>
                  <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 16px" }}>{email}</p>
                  {biografia && <p style={{ fontSize: "14px", color: "#4b5563", lineHeight: "1.6", margin: "0 0 16px", borderTop: "1px solid #f3f4f6", paddingTop: "16px" }}>{biografia}</p>}
                  {telefone && (
                    <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                      <span>📞</span><span style={{ fontSize: "14px", color: "#4b5563" }}>{telefone}</span>
                    </div>
                  )}
                  {endereco && (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <span>📍</span><span style={{ fontSize: "14px", color: "#4b5563" }}>{endereco}</span>
                    </div>
                  )}
                  {salvo && <p style={{ fontSize: "13px", color: "#22c55e", marginTop: "12px" }}>✅ Perfil atualizado!</p>}
                </>
              ) : (
                <>
                  <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111", margin: "0 0 16px" }}>Editar perfil</h3>
                  {[
                    { label: "Nome", value: nome, set: setNome, type: "text", placeholder: "Seu nome" },
                    { label: "Email", value: email, set: setEmail, type: "email", placeholder: "seu@email.com" },
                    { label: "Telefone", value: telefone, set: setTelefone, type: "tel", placeholder: "(48) 99999-9999" },
                    { label: "Endereço", value: endereco, set: setEndereco, type: "text", placeholder: "Sua cidade, estado" },
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
                    style={{ width: "100%", backgroundColor: "#111", color: "white", border: "none", borderRadius: "10px", padding: "12px", fontSize: "14px", fontWeight: "600", cursor: salvando ? "not-allowed" : "pointer", opacity: salvando ? 0.7 : 1 }}>
                    {salvando ? "Salvando..." : "Salvar alterações"}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* COLUNA DIREITA — AVALIAÇÕES */}
          <div>
            <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111", margin: "0 0 20px" }}>
                Minhas avaliações {avaliacoes.length > 0 && `(${avaliacoes.length})`}
              </h2>
              {avaliacoes.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <p style={{ fontSize: "32px", marginBottom: "12px" }}>⭐</p>
                  <p style={{ fontSize: "15px", color: "#6b7280", marginBottom: "16px" }}>Você ainda não fez nenhuma avaliação.</p>
                  <a href="/gastronomia" style={{ backgroundColor: "#111", color: "white", textDecoration: "none", padding: "10px 24px", borderRadius: "999px", fontSize: "14px", fontWeight: "600" }}>
                    Explorar restaurantes
                  </a>
                </div>
              ) : (
                avaliacoes.map((av, i) => (
                  <div key={i} style={{ borderBottom: i < avaliacoes.length - 1 ? "1px solid #f3f4f6" : "none", paddingBottom: "20px", marginBottom: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <div>
                        <a href={`/gastronomia/${av.restaurantes?.slug}`} style={{ fontSize: "15px", fontWeight: "700", color: "#111", textDecoration: "none" }}>
                          {av.restaurantes?.nome || "Restaurante"}
                        </a>
                        <p style={{ fontSize: "12px", color: "#9ca3af", margin: "2px 0 0" }}>
                          {new Date(av.criado_em).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <div style={{ display: "flex", gap: "2px" }}>
                        {[1,2,3,4,5].map((s) => (
                          <span key={s} style={{ color: s <= av.nota ? "#fbbf24" : "#e5e7eb", fontSize: "16px" }}>★</span>
                        ))}
                      </div>
                    </div>
                    <p style={{ fontSize: "14px", color: "#4b5563", margin: 0, lineHeight: "1.6" }}>{av.comentario}</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>

      <footer style={{ backgroundColor: "#1f2937", color: "#9ca3af", padding: "32px 0", textAlign: "center" }}>
        <p style={{ color: "white", fontWeight: "700", fontSize: "16px", margin: "0 0 4px" }}>Destino Garopaba</p>
        <p style={{ fontSize: "13px", margin: 0 }}>O guia definitivo de Garopaba, SC</p>
      </footer>

    </main>
  );
}