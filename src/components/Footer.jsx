import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiGlobe } from 'react-icons/fi';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      background: 'var(--bg-secondary)',
      padding: '60px 24px 30px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 40,
          marginBottom: 40,
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <Logo size={28} animated={false} />
              <span style={{
                fontSize: 18,
                fontWeight: 700,
                background: 'linear-gradient(135deg, var(--accent), #a78bfa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>AuthShield</span>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-tertiary)', lineHeight: 1.7, maxWidth: 280 }}>
              Plataforma profissional de autenticação e gestão de licenças para aplicações modernas.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', marginBottom: 16 }}>Produto</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link to="/authshield-site/features" style={{ fontSize: 14, color: 'var(--text-secondary)', transition: 'color 0.2s' }}>Features</Link>
              <Link to="/authshield-site/pricing" style={{ fontSize: 14, color: 'var(--text-secondary)', transition: 'color 0.2s' }}>Pricing</Link>
              <Link to="/authshield-site/docs" style={{ fontSize: 14, color: 'var(--text-secondary)', transition: 'color 0.2s' }}>Documentation</Link>
              <Link to="/authshield-site/dashboard" style={{ fontSize: 14, color: 'var(--text-secondary)', transition: 'color 0.2s' }}>Dashboard</Link>
            </div>
          </div>

          {/* Languages */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', marginBottom: 16 }}>Linguagens</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>C / C++</span>
              <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>C# (.NET)</span>
              <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Lua</span>
              <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>JavaScript / Node.js</span>
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', marginBottom: 16 }}>Conectar</h4>
            <div style={{ display: 'flex', gap: 12 }}>
              <a href="https://github.com" target="_blank" rel="noreferrer" style={{
                width: 38, height: 38, borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--bg-tertiary)', color: 'var(--text-secondary)',
                border: '1px solid var(--border)', transition: 'all 0.2s',
              }}>
                <FiGithub size={16} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" style={{
                width: 38, height: 38, borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--bg-tertiary)', color: 'var(--text-secondary)',
                border: '1px solid var(--border)', transition: 'all 0.2s',
              }}>
                <FiTwitter size={16} />
              </a>
              <a href="#" style={{
                width: 38, height: 38, borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--bg-tertiary)', color: 'var(--text-secondary)',
                border: '1px solid var(--border)', transition: 'all 0.2s',
              }}>
                <FiGlobe size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          borderTop: '1px solid var(--border)',
          paddingTop: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
            © 2026 AuthShield. Todos os direitos reservados.
          </p>
          <div style={{ display: 'flex', gap: 20 }}>
            <a href="#" style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>Privacidade</a>
            <a href="#" style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>Termos</a>
          </div>
        </div>
      </div>
    </footer>
  );
}