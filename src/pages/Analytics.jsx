import { useEffect, useState } from 'react'
import { getStats, exportJsonl } from '../api'

export default function Analytics() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    getStats().then(r => setStats(r.data))
  }, [])

  if (!stats) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--muted)', letterSpacing: '0.1em' }}>
        Loading dataset...
      </div>
    </div>
  )

  const pct = (n) => stats.total ? Math.round((n / stats.total) * 100) : 0

  const statCards = [
    { label: 'Total annotations', value: stats.total, sub: 'datapoints collected' },
    { label: 'Response A wins', value: stats.a_wins, sub: pct(stats.a_wins) + '% of votes' },
    { label: 'Response B wins', value: stats.b_wins, sub: pct(stats.b_wins) + '% of votes' },
    { label: 'Ties', value: stats.ties, sub: pct(stats.ties) + '% of votes' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-body)', padding: '2.5rem 1.5rem' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 8px var(--accent)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Dataset Overview</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--text)', margin: 0, lineHeight: 1.1 }}>
              Analytics
            </h1>
            <p style={{ color: 'var(--muted)', marginTop: '0.4rem', fontSize: '0.875rem', margin: '0.4rem 0 0' }}>
              Human preference data collected so far.
            </p>
          </div>
          <a
            href={exportJsonl()}
            style={{
              padding: '0.75rem 1.25rem', background: 'transparent', color: 'var(--accent)',
              border: '1px solid var(--accent)', borderRadius: 8, fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none', letterSpacing: '0.05em',
              display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            Export JSONL
          </a>
        </div>

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.875rem', marginBottom: '2rem' }}>
          {statCards.map(s => (
            <div key={s.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.25rem' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 0.5rem' }}>{s.label}</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 700, color: 'var(--text)', margin: '0 0 0.25rem', lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent)', margin: 0 }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Win rate bar */}
        {stats.total > 0 && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.25rem', marginBottom: '2rem' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 0.875rem' }}>Win rate</p>
            <div style={{ display: 'flex', borderRadius: 6, overflow: 'hidden', height: 24, gap: 2 }}>
              {pct(stats.a_wins) > 0 && (
                <div style={{ width: pct(stats.a_wins) + '%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 700, color: '#000' }}>A {pct(stats.a_wins)}%</span>
                </div>
              )}
              {pct(stats.ties) > 0 && (
                <div style={{ width: pct(stats.ties) + '%', background: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)' }}>TIE {pct(stats.ties)}%</span>
                </div>
              )}
              {pct(stats.b_wins) > 0 && (
                <div style={{ flex: 1, background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 700, color: '#fff' }}>B {pct(stats.b_wins)}%</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Table */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Annotation log
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>
              {stats.annotations.length} records
            </span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Prompt', 'Winner', 'Reason', 'Date'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1.25rem', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.annotations.map((row, i) => (
                  <tr key={row.id} style={{ borderBottom: i < stats.annotations.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td style={{ padding: '0.875rem 1.25rem', maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.85rem', color: 'var(--text)' }}>
                      {row.prompt}
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', whiteSpace: 'nowrap' }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700,
                        padding: '0.2rem 0.6rem', borderRadius: 4,
                        background: row.winner === 'A' ? 'rgba(99,255,180,0.12)' : row.winner === 'B' ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.06)',
                        color: row.winner === 'A' ? 'var(--accent)' : row.winner === 'B' ? '#a5b4fc' : 'var(--muted)',
                        border: '1px solid',
                        borderColor: row.winner === 'A' ? 'rgba(99,255,180,0.2)' : row.winner === 'B' ? 'rgba(99,102,241,0.3)' : 'var(--border)',
                      }}>
                        {row.winner === 'tie' ? 'Tie' : row.winner}
                      </span>
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.82rem', color: 'var(--muted)', fontStyle: row.reason ? 'italic' : 'normal' }}>
                      {row.reason || '-'}
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', whiteSpace: 'nowrap', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)' }}>
                      {new Date(row.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {stats.annotations.length === 0 && (
              <div style={{ padding: '4rem', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--muted)' }}>
                No annotations yet. Start on the Annotate page.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}