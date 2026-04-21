export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#1f2937", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>

      {/* LINKS */}
      <div style={{ width: "70%", margin: "0 auto", padding: "48px 0 32px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "32px" }}>

        <div>
          <h3 style={{ fontSize: "13px", fontWeight: "700", color: "white", margin: "0 0 16px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Sobre nós</h3>
          {[
            { label: "Quem somos", href: "/quem-somos" },
            { label: "Como funciona", href: "/como-funciona" },
            { label: "Fale conosco", href: "/fale-conosco" },
            { label: "Política de privacidade", href: "/politica-de-privacidade" },
            { label: "Termos de uso", href: "/termos-de-uso" },
          ].map((item) => (
            <a key={item.label} href={item.href} style={{ display: "block", fontSize: "14px", color: "#9ca3af", textDecoration: "none", marginBottom: "10px", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}>
              {item.label}
            </a>
          ))}
        </div>

        <div>
          <h3 style={{ fontSize: "13px", fontWeight: "700", color: "white", margin: "0 0 16px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Explore Garopaba</h3>
          {[
            { label: "Nossas Praias", href: "/nossas-praias" },
            { label: "Gastronomia", href: "/gastronomia" },
            { label: "Hospedagens", href: "/hospedagens" },
            { label: "Atrativos Turísticos", href: "/atrativos-turisticos" },
            { label: "Eventos", href: "/eventos" },
          ].map((item) => (
            <a key={item.label} href={item.href} style={{ display: "block", fontSize: "14px", color: "#9ca3af", textDecoration: "none", marginBottom: "10px", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}>
              {item.label}
            </a>
          ))}
        </div>

        <div>
          <h3 style={{ fontSize: "13px", fontWeight: "700", color: "white", margin: "0 0 16px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Para estabelecimentos</h3>
          {[
            { label: "Cadastre seu negócio", href: "/cadastre-seu-negocio" },
            { label: "Anuncie no portal", href: "/anuncie-no-portal" },
            { label: "Atualize suas informações", href: "/atualize-suas-informacoes" },
            { label: "Responda avaliações", href: "/responda-avaliacoes" },
          ].map((item) => (
            <a key={item.label} href={item.href} style={{ display: "block", fontSize: "14px", color: "#9ca3af", textDecoration: "none", marginBottom: "10px", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}>
              {item.label}
            </a>
          ))}
        </div>

        <div>
          <h3 style={{ fontSize: "13px", fontWeight: "700", color: "white", margin: "0 0 16px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Comunidade</h3>
          {[
            { label: "Faça uma avaliação", href: "/gastronomia" },
            { label: "Adicione um local", href: "/adicione-um-local" },
            { label: "Crie sua conta", href: "/login" },
            { label: "Central de ajuda", href: "/central-de-ajuda" },
          ].map((item) => (
            <a key={item.label} href={item.href} style={{ display: "block", fontSize: "14px", color: "#9ca3af", textDecoration: "none", marginBottom: "10px", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}>
              {item.label}
            </a>
          ))}

          {/* REDES SOCIAIS */}
          <h3 style={{ fontSize: "13px", fontWeight: "700", color: "white", margin: "24px 0 14px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Redes sociais</h3>
          <div style={{ display: "flex", gap: "12px" }}>
            {[
              { href: "https://instagram.com/destinogaropaba", icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" stroke="#9ca3af" strokeWidth="2"/><circle cx="12" cy="12" r="4" stroke="#9ca3af" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1" fill="#9ca3af"/></svg>
              )},
              { href: "https://facebook.com/destinogaropaba", icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="#9ca3af"/><path d="M13 21V13h2.5l.5-3H13V8.5C13 7.67 13.33 7 14.5 7H16V4.5S15 4 13.5 4C11 4 10 5.5 10 7.5V10H7.5v3H10v8" fill="#1f2937"/></svg>
              )},
            ].map((social, i) => (
              <a key={i} href={social.href} target="_blank" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.05)", transition: "background-color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)")}>
                {social.icon}
              </a>
            ))}
          </div>
        </div>

      </div>

      {/* DIVIDER */}
      <div style={{ width: "70%", margin: "0 auto", borderTop: "1px solid rgba(255,255,255,0.08)" }} />

      {/* BOTTOM */}
      <div style={{ width: "70%", margin: "0 auto", padding: "24px 0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "20px", fontWeight: "800", color: "white", letterSpacing: "-0.5px" }}>Destino Garopaba</span>
          <span style={{ fontSize: "13px", color: "#6b7280" }}>© 2026 Todos os direitos reservados.</span>
        </div>
        <div style={{ display: "flex", gap: "20px" }}>
          {[
            { label: "Termos de uso", href: "/termos-de-uso" },
            { label: "Privacidade", href: "/privacidade" },
            { label: "Cookies", href: "/cookies" },
            { label: "Acessibilidade", href: "/acessibilidade" },
          ].map((item) => (
            <a key={item.label} href={item.href} style={{ fontSize: "13px", color: "#6b7280", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#9ca3af")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}>
              {item.label}
            </a>
          ))}
        </div>
      </div>

    </footer>
  );
}