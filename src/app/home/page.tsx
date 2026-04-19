"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [abaAtiva, setAbaAtiva] = useState(0);
  const [restaurantes, setRestaurantes] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("restaurantes").select("*").order("destaque", { ascending: false }).then(({ data }) => {
      if (data) setRestaurantes(data);
    });
  }, []);

  const abas = [
    { label: "Pesquisar tudo", titulo: "O que você procura em Garopaba?", placeholder: "Praias, trilhas, atrativos..." },
    { label: "Hospedagens", titulo: "Onde ficar em Garopaba?", placeholder: "Pousadas, hotéis, camping..." },
    { label: "Atrativos Turísticos", titulo: "O que fazer em Garopaba?", placeholder: "Trilhas, mirantes, lagoas..." },
    { label: "Gastronomia", titulo: "Onde comer em Garopaba?", placeholder: "Pizzaria, sushi, hamburgueria..." },
  ];

  const praias = [
    { nome: "Praia do Centro", foto: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/2a/40/3b/visao-do-alto-do-morro.jpg" },
    { nome: "Praia do Silveira", foto: "https://static.ndmais.com.br/2023/08/praia-do-siriu-garopaba-3-800x599.jpeg" },
    { nome: "Praia da Ferrugem", foto: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600" },
    { nome: "Praia da Vigia", foto: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600" },
    { nome: "Praia do Siriú", foto: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=600" },
    { nome: "Praia da Gamboa", foto: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=600" },
    { nome: "Praia da Barra", foto: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600" },
    { nome: "Praia do Ouvidor", foto: "https://images.unsplash.com/photo-1484821582734-6692f9447dde?w=600" },
  ];

  return (
    <main style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
      <style>{`
        .nav-link { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; text-decoration: none; color: #1f2937; font-size: 14px; font-weight: 500; padding: 6px 10px; border-radius: 6px; transition: background-color 0.2s, color 0.2s; }
        .nav-link:hover { background-color: #1f2937; color: white; }
        .aba { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background: none; border: none; border-bottom: 2px solid transparent; padding: 8px 2px; font-size: 15px; font-weight: 500; color: #6b7280; cursor: pointer; transition: color 0.2s, border-bottom 0.2s; }
        .aba:hover { color: #111; }
        .aba.ativa { color: #111; border-bottom: 2px solid #111; }
        .cat-card { text-decoration: none; position: relative; border-radius: 16px; overflow: hidden; height: 280px; display: block; background-color: #e5e7eb; box-shadow: 0 2px 8px rgba(0,0,0,0.08); transition: box-shadow 0.3s ease; }
        .cat-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
        .cat-card img { transition: transform 0.4s ease; }
        .cat-card:hover img { transform: scale(1.08); }
        .blog-card img { transition: transform 0.4s ease; }
        .blog-card:hover img { transform: scale(1.08); }
        .praia-card { text-decoration: none; flex: 0 0 calc(25% - 12px); border-radius: 16px; overflow: hidden; position: relative; height: 280px; display: block; background-color: #e5e7eb; box-shadow: 0 2px 8px rgba(0,0,0,0.08); transition: box-shadow 0.3s ease; }
        .praia-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
        .praia-card img { transition: transform 0.4s ease; width: 100%; height: 100%; object-fit: cover; display: block; }
        .praia-card:hover img { transform: scale(1.08); }
        .seta-btn { position: absolute; top: 50%; transform: translateY(-50%); width: 40px; height: 40px; background: white; border: none; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.2); font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 10; transition: box-shadow 0.2s; }
        .seta-btn:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.25); }
        #praias-scroll::-webkit-scrollbar { display: none; }
        #restaurantes-scroll::-webkit-scrollbar { display: none; }
      `}</style>

      {/* HEADER */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, backgroundColor: "white", borderBottom: "1px solid #e5e7eb", height: "60px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <div style={{ width: "60%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/home" style={{ textDecoration: "none", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontSize: "20px", fontWeight: "800", color: "#111", letterSpacing: "-0.5px" }}>Destino Garopaba</a>
          <nav>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              {[
                { label: "Garopaba", href: "#" },
                { label: "Nossas Praias", href: "#" },
                { label: "Atrativos Turísticos", href: "#" },
                { label: "Hospedagens", href: "#" },
                { label: "Gastronomia", href: "#" },
                { label: "Fale Conosco", href: "#" },
              ].map((item) => (
                <a key={item.label} href={item.href} className="nav-link">{item.label}</a>
              ))}
            </div>
          </nav>
        </div>
      </header>

      <div style={{ height: "60px" }} />

      {/* BUSCA */}
      <section style={{ backgroundColor: "#f2f2f2", height: "335px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "60%", display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
          <h1 style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontSize: "42px", fontWeight: "800", color: "#111", textAlign: "center", margin: 0 }}>
            {abas[abaAtiva].titulo}
          </h1>
          <div style={{ display: "flex", gap: "24px" }}>
            {abas.map((aba, index) => (
              <button key={aba.label} className={`aba ${abaAtiva === index ? "ativa" : ""}`} onClick={() => setAbaAtiva(index)}>{aba.label}</button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", backgroundColor: "white", borderRadius: "14px", padding: "6px 6px 6px 20px", width: "100%", border: "1px solid #e5e7eb", boxSizing: "border-box", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <span style={{ fontSize: "18px", marginRight: "10px", color: "#6b7280" }}>🔍</span>
            <input type="text" placeholder={abas[abaAtiva].placeholder} style={{ flex: 1, border: "none", background: "none", outline: "none", fontSize: "15px", color: "#111", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }} />
            <button style={{ backgroundColor: "#111", color: "white", border: "none", borderRadius: "14px", padding: "12px 28px", fontSize: "15px", fontWeight: "600", cursor: "pointer", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>Buscar</button>
          </div>
        </div>
      </section>

      {/* BANNER */}
      <section style={{ display: "flex", justifyContent: "center", padding: "40px 0", backgroundColor: "#ffffff" }}>
        <div style={{ width: "60%", height: "460px", backgroundColor: "#ffcc00", borderRadius: "10px", display: "flex", overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
          <div style={{ width: "55%", padding: "0px", position: "relative", flexShrink: 0 }}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/46/0_04192022IMG_024626487.jpg" alt="Atividades em Garopaba" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" }} />
            <div style={{ position: "absolute", bottom: "36px", left: "36px", backgroundColor: "white", color: "#111", fontSize: "13px", fontWeight: "600", padding: "6px 14px", borderRadius: "14px", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>© AILTON SOUZA</div>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 48px 48px 32px", gap: "20px" }}>
            <h2 style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontSize: "44px", fontWeight: "900", color: "#111", margin: 0, lineHeight: "1.1" }}>Encontre atividades para tudo que você curte</h2>
            <p style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontSize: "16px", color: "#4b5563", margin: 0, lineHeight: "1.6" }}>Explore as melhores experiências em Garopaba e reserve com a gente.</p>
            <button style={{ backgroundColor: "#111", color: "white", border: "none", borderRadius: "14px", padding: "16px 32px", fontSize: "15px", fontWeight: "600", cursor: "pointer", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", alignSelf: "flex-start" }}>Explorar agora</button>
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0 0 60px", backgroundColor: "#ffffff" }}>
        <div style={{ width: "60%", marginBottom: "16px" }}>
          <h2 style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontSize: "22px", fontWeight: "700", color: "#111", margin: "0 0 2px" }}>O que fazer em Garopaba</h2>
          <p style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontSize: "14px", color: "#6b7280", margin: 0 }}>Você encontra tudo do que gosta aqui</p>
        </div>
        <div style={{ width: "60%", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
          {[
            { label: "Atrativos Turísticos", foto: "https://static.ndmais.com.br/2023/08/praia-do-siriu-garopaba-3-800x599.jpeg" },
            { label: "Nossas Praias", foto: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/2a/40/3b/visao-do-alto-do-morro.jpg" },
            { label: "Hospedagens", foto: "https://www.passaromarron.com.br/wp-content/uploads/2023/12/dicas-para-hospedagem.jpg" },
            { label: "Gastronomia", foto: "https://img.freepik.com/fotos-gratis/uma-variedade-plana-com-deliciosa-comida-brasileira_23-2148739179.jpg" },
          ].map((cat) => (
            <a key={cat.label} href="#" className="cat-card">
              <img src={cat.foto} alt={cat.label} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "48px 16px 16px", background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)" }}>
                <span style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontSize: "18px", fontWeight: "700", color: "white" }}>{cat.label}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* BLOG */}
      <section style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 0 60px", backgroundColor: "#ffcc00" }}>
        <div style={{ width: "60%", marginBottom: "20px" }}>
          <h2 style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontSize: "22px", fontWeight: "700", color: "#111", margin: 0 }}>Confira as novidades sobre Garopaba</h2>
        </div>
        <div style={{ width: "60%", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
          {[
            { foto: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600", titulo: "As praias mais bonitas de Garopaba para você conhecer" },
            { foto: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600", titulo: "Os melhores restaurantes e experiências gastronômicas da cidade" },
            { foto: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600", titulo: "Trilhas e aventuras imperdíveis ao redor de Garopaba" },
          ].map((post, index) => (
            <a key={index} href="#" className="blog-card" style={{ textDecoration: "none", display: "block", position: "relative", borderRadius: "14px", overflow: "hidden", height: "280px", backgroundColor: "#ffffff" }}>
              <img src={post.foto} alt={post.titulo} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "60px 20px 20px", background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }}>
                <p style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontSize: "16px", fontWeight: "700", color: "white", margin: 0, lineHeight: "1.4" }}>{post.titulo}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* PRAIAS */}
      <section style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 0 60px", backgroundColor: "#f5f5f5" }}>
        <div style={{ width: "60%", marginBottom: "20px" }}>
          <h2 style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontSize: "22px", fontWeight: "700", color: "#111", margin: 0 }}>Conheça nossas praias</h2>
        </div>
        <div style={{ width: "60%", position: "relative" }}>
          <button className="seta-btn" style={{ left: "-20px" }} onClick={() => { const el = document.getElementById("praias-scroll"); if (el) el.scrollLeft -= 320; }}>←</button>
          <div id="praias-scroll" style={{ display: "flex", gap: "16px", overflowX: "auto", scrollBehavior: "smooth", cursor: "grab", scrollbarWidth: "none" }}>
            {praias.map((praia) => (
              <a key={praia.nome} href="#" className="praia-card">
                <img src={praia.foto} alt={praia.nome} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "48px 16px 16px", background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)" }}>
                  <span style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontSize: "18px", fontWeight: "700", color: "white" }}>{praia.nome}</span>
                </div>
              </a>
            ))}
          </div>
          <button className="seta-btn" style={{ right: "-20px" }} onClick={() => { const el = document.getElementById("praias-scroll"); if (el) el.scrollLeft += 320; }}>→</button>
        </div>
      </section>

      {/* RESTAURANTES */}
      <section style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 0 60px", backgroundColor: "#ffffff" }}>
        <div style={{ width: "60%", marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontSize: "22px", fontWeight: "700", color: "#111", margin: 0 }}>Onde comer em Garopaba?</h2>
          <a href="#" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontSize: "14px", fontWeight: "600", color: "#111", textDecoration: "none", border: "1px solid #111", padding: "8px 20px", borderRadius: "999px" }}>Ver mais</a>
        </div>
        <div style={{ width: "60%", position: "relative" }}>
          <button className="seta-btn" style={{ left: "-20px" }} onClick={() => { const el = document.getElementById("restaurantes-scroll"); if (el) el.scrollLeft -= 320; }}>←</button>
          <div id="restaurantes-scroll" style={{ display: "flex", gap: "16px", overflowX: "auto", scrollBehavior: "smooth", cursor: "grab", scrollbarWidth: "none" }}>
            {restaurantes.length === 0 ? (
              <p style={{ color: "#6b7280", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>Carregando restaurantes...</p>
            ) : (
              restaurantes.map((rest) => (
                <a key={rest.id} href={`/gastronomia/${rest.slug}`} style={{ textDecoration: "none", flex: "0 0 calc(25% - 12px)", borderRadius: "16px", overflow: "hidden", position: "relative", height: "280px", display: "block", backgroundColor: "#e5e7eb", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", transition: "box-shadow 0.3s ease" }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)"; const img = e.currentTarget.querySelector("img") as HTMLImageElement; if (img) img.style.transform = "scale(1.08)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)"; const img = e.currentTarget.querySelector("img") as HTMLImageElement; if (img) img.style.transform = "scale(1)"; }}>
                  <img src={rest.foto_url} alt={rest.nome} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.4s ease" }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "48px 16px 16px", background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }}>
                    <span style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontSize: "16px", fontWeight: "700", color: "white", display: "block" }}>{rest.nome}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
                      <span style={{ color: "#fbbf24", fontSize: "12px" }}>★</span>
                      <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.9)", fontWeight: "600" }}>{rest.nota}</span>
                      <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>· {rest.tipo}</span>
                    </div>
                  </div>
                </a>
              ))
            )}
          </div>
          <button className="seta-btn" style={{ right: "-20px" }} onClick={() => { const el = document.getElementById("restaurantes-scroll"); if (el) el.scrollLeft += 320; }}>→</button>
        </div>
      </section>

    </main>
  );
}