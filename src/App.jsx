import { useState, useEffect} from 'react'
import Home from './pages/Home'
import Analytics from './pages/Analytics'

export default function App() {
  useEffect(() => {
      fetch(import.meta.env.VITE_API_URL + '/')
  }, [])
  const [page, setPage] = useState('home')

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500&display=swap');

        :root {
          --bg:       #0a0a0f;
          --surface:  #111118;
          --border:   #1e1e2e;
          --text:     #e8e8f0;
          --muted:    #52526e;
          --accent:   #63ffb4;
          --font-display: 'Syne', sans-serif;
          --font-mono:    'JetBrains Mono', monospace;
          --font-body:    'Inter', sans-serif;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: var(--bg);
          color: var(--text);
          font-family: var(--font-body);
        }

        textarea, input {
          color: var(--text) !important;
          background: var(--surface) !important;
        }

        textarea::placeholder, input::placeholder {
          color: var(--muted) !important;
        }

        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: var(--bg); }
        ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
      `}</style>

      {/* Nav */}
      <nav style={{
        background: 'rgba(10,10,15,0.9)', borderBottom: '1px solid var(--border)',
        padding: '0 1.5rem', display: 'flex', alignItems: 'center', gap: '0',
        position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(12px)', height: 52,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginRight: '2rem' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 6px var(--accent)' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)', letterSpacing: '0.02em' }}>
            RLHF Tool
          </span>
        </div>

        {[
          { id: 'home', label: 'Annotate' },
          { id: 'analytics', label: 'Analytics' },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setPage(id)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '0 1rem', height: '100%',
              fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.05em',
              color: page === id ? 'var(--accent)' : 'var(--muted)',
              borderBottom: page === id ? '2px solid var(--accent)' : '2px solid transparent',
              transition: 'all 0.15s', fontWeight: page === id ? 600 : 400,
            }}
          >
            {label}
          </button>
        ))}

        <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.08em' }}>
          Ethara.AI · RLHF Pipeline
        </div>
      </nav>

      {page === 'home' ? <Home /> : <Analytics />}
    </>
  )
}