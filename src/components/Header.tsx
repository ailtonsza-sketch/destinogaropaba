"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const navLinks = [
  { label: "Garopaba", href: "/garopaba" },
  { label: "Nossas Praias", href: "/nossas-praias" },
  { label: "Atrativos Turísticos", href: "/atrativos-turisticos" },
  { label: "Hospedagens", href: "/hospedagens" },
  { label: "Gastronomia", href: "/gastronomia" },
  { label: "Fale Conosco", href: "/home" },
];

export default function Header() {
  const [usuario, setUsuario] = useState<any>(null);
  const [menuAberto, setMenuAberto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUsuario(data.user);
    });
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuAberto(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <>
      <style>{`
        .nav-link-h { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; text-decoration: none; color: #1f2937; font-size: 14px; font-weight: 500; padding: 6px 10px; border-radius: 6px; transition: background-color 0.2s, color 0.2s; }
        .nav-link-h:hover { background-color: #f3f4f6; color: #111; }
        .menu-item-h { display: block; padding: 12px 20px; font-size: 14px; font-weight: 500; color: #111; text-decoration: none; transition: background-color 0.15s; cursor: pointer; background: none; border: none; width: 100%; text-align: left; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
        .menu-item-h:hover { background-color: #f9fafb; }
      `}</style>

      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, backgroundColor: "white", borderBottom: "1px solid #e5e7eb", height: "60px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <div style={{ width: "70%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/home" style={{ textDecoration: "none", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontSize: "20px", fontWeight: "800", color: "#111", letterSpacing: "-0.5px" }}>
            Destino Garopaba
          </a>

          <nav style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {navLinks.map((item) => (
              <a key={item.label} href={item.href} className="nav-link-h">{item.label}</a>
            ))}
          </nav>

          <div ref={menuRef} style={{ position: "relative", marginLeft: "12px" }}>
            {usuario ? (
              <>
                <button
                  onClick={() => setMenuAberto(!menuAberto)}
                  style={{ width: "38px", height: "38px", borderRadius: "50%", overflow: "hidden", border: "2px solid #e5e7eb", cursor: "pointer", padding: 0, backgroundColor: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {usuario.user_metadata?.avatar_url ? (
                    <img src={usuario.user_metadata.avatar_url} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ fontSize: "15px", fontWeight: "700", color: "#6b7280" }}>
                      {(usuario.user_metadata?.name || usuario.email).charAt(0).toUpperCase()}
                    </span>
                  )}
                </button>

                {menuAberto && (
                  <div style={{ position: "absolute", right: 0, top: "48px", backgroundColor: "white", borderRadius: "12px", boxShadow: "0 8px 32px rgba(0,0,0,0.15)", minWidth: "160px", zIndex: 200, overflow: "hidden", border: "1px solid #e5e7eb" }}>
                    <div style={{ padding: "12px 20px", borderBottom: "1px solid #f3f4f6" }}>
                      <p style={{ fontSize: "13px", fontWeight: "700", color: "#111", margin: 0 }}>{usuario.user_metadata?.name || "Usuário"}</p>
                      <p style={{ fontSize: "12px", color: "#9ca3af", margin: "2px 0 0" }}>{usuario.email}</p>
                    </div>
                    <a href="#" className="menu-item-h" onClick={async () => {
                      setMenuAberto(false);
                      const { data } = await supabase.auth.getUser();
                      if (data.user) {
                        const { data: p } = await supabase.from("perfis").select("username").eq("id", data.user.id).single();
                        window.location.href = p?.username ? `/u/${p.username}` : "/perfil";
                      }
                    }}>
                      👤 Perfil
                    </a>
                    <button
                      className="menu-item-h"
                      style={{ color: "#ef4444" }}
                      onClick={async () => {
                        await supabase.auth.signOut();
                        setUsuario(null);
                        setMenuAberto(false);
                        window.location.href = "/home";
                      }}>
                      Sair
                    </button>
                  </div>
                )}
              </>
            ) : (
              <a href="/login" style={{ textDecoration: "none", backgroundColor: "#111", color: "white", padding: "8px 20px", borderRadius: "999px", fontSize: "14px", fontWeight: "600", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                Entrar
              </a>
            )}
          </div>
        </div>
      </header>
    </>
  );
}