import { useState } from 'react'
import { generate, vote } from '../api'

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [responses, setResponses] = useState(null)
  const [loading, setLoading] = useState(false)
  const [voting, setVoting] = useState(false)
  const [reason, setReason] = useState('')
  const [voted, setVoted] = useState(false)
  const [votedFor, setVotedFor] = useState(null)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    setResponses(null)
    setVoted(false)
    setVotedFor(null)
    setReason('')
    setError(null)
    setSelected(null)
    try {
      const { data } = await generate(prompt)
      setResponses(data)
    } catch (e) {
      setError('Failed to generate responses. Make sure the backend is running.')
    }
    setLoading(false)
  }

  const handleVote = async (winner) => {
    setVoting(true)
    setError(null)
    try {
      await vote({
        prompt,
        response_a: responses.response_a,
        response_b: responses.response_b,
        winner,
        reason: reason.trim() || null
      })
      setVotedFor(winner)
      setVoted(true)
    } catch (e) {
      setError('Failed to save vote. Please try again.')
    }
    setVoting(false)
  }

  const handleReset = () => {
    setPrompt('')
    setResponses(null)
    setVoted(false)
    setVotedFor(null)
    setReason('')
    setError(null)
    setSelected(null)
  }

  const winnerLabel = { A: 'Response A', B: 'Response B', tie: 'Tie' }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-body)', padding: '2.5rem 1.5rem' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 8px var(--accent)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Annotation Session</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--text)', margin: 0, lineHeight: 1.1 }}>
            Human Preference Lab
          </h1>
          <p style={{ color: 'var(--muted)', marginTop: '0.4rem', fontSize: '0.875rem', margin: '0.4rem 0 0' }}>
            Generate two responses, judge which is better, build the dataset.
          </p>
        </div>

        {error && (
          <div style={{ marginBottom: '1.25rem', padding: '0.75rem 1rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#f87171', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
            ⚠ {error}
          </div>
        )}

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Prompt
          </label>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <textarea
              style={{
                flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10,
                padding: '0.875rem 1rem', color: 'var(--text)', fontSize: '0.9rem', resize: 'none',
                fontFamily: 'var(--font-body)', outline: 'none', lineHeight: 1.6, transition: 'border-color 0.2s',
              }}
              rows={3}
              placeholder="Ask anything — compare how two model personalities respond..."
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
              onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) handleGenerate() }}
            />
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              style={{
                padding: '0.875rem 1.5rem', background: loading ? 'var(--surface)' : 'var(--accent)',
                color: loading ? 'var(--muted)' : '#000', border: '1px solid', borderColor: loading ? 'var(--border)' : 'var(--accent)',
                borderRadius: 10, fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 600,
                cursor: loading || !prompt.trim() ? 'not-allowed' : 'pointer',
                letterSpacing: '0.05em', whiteSpace: 'nowrap', opacity: !prompt.trim() ? 0.4 : 1, transition: 'all 0.2s',
              }}
            >
              {loading ? 'Generating...' : 'Generate'}
            </button>
          </div>
          <p style={{ marginTop: '0.4rem', fontSize: '0.72rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
            Ctrl+Enter to submit
          </p>
        </div>

        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[0, 1].map(i => (
              <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.25rem' }}>
                <div style={{ height: 10, background: 'var(--border)', borderRadius: 4, width: '30%', marginBottom: '1rem' }} />
                {[100, 85, 70, 90, 55].map((w, j) => (
                  <div key={j} style={{ height: 8, background: 'var(--border)', borderRadius: 4, width: w + '%', marginBottom: '0.5rem', opacity: 0.5 }} />
                ))}
              </div>
            ))}
          </div>
        )}

        {responses && !voted && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              {[
                { key: 'response_a', label: 'A', tag: 'Concise · temp 0.3' },
                { key: 'response_b', label: 'B', tag: 'Exploratory · temp 0.9' }
              ].map(({ key, label, tag }) => (
                <div
                  key={key}
                  onClick={() => setSelected(label)}
                  style={{
                    background: selected === label ? 'rgba(99,255,180,0.04)' : 'var(--surface)',
                    border: selected === label ? '1px solid var(--accent)' : '1px solid var(--border)',
                    borderRadius: 12, padding: '1.25rem', cursor: 'pointer', transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700,
                        background: selected === label ? 'var(--accent)' : 'var(--border)',
                        color: selected === label ? '#000' : 'var(--muted)',
                        padding: '0.2rem 0.5rem', borderRadius: 4, letterSpacing: '0.1em'
                      }}>{label}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)' }}>{tag}</span>
                    </div>
                    {selected === label && (
                      <span style={{ color: 'var(--accent)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>Selected ✓</span>
                    )}
                  </div>
                  <p style={{ color: 'var(--text)', fontSize: '0.875rem', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>
                    {responses[key]}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.25rem' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 0.875rem' }}>
                Your verdict
              </p>
              <textarea
                style={{
                  width: '100%', background: 'var(--bg)', border: '1px solid var(--border)',
                  borderRadius: 8, padding: '0.75rem', color: 'var(--text)', fontSize: '0.85rem',
                  resize: 'none', fontFamily: 'var(--font-body)', outline: 'none',
                  marginBottom: '0.875rem', boxSizing: 'border-box', lineHeight: 1.5, transition: 'border-color 0.2s',
                }}
                rows={2}
                placeholder="Optional: explain your reasoning — this helps train better models..."
                value={reason}
                onChange={e => setReason(e.target.value)}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
              <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
                {['A', 'B', 'tie'].map(w => (
                  <button
                    key={w}
                    onClick={() => handleVote(w)}
                    disabled={voting}
                    style={{
                      padding: '0.625rem 1.25rem',
                      background: w === selected ? 'var(--accent)' : 'transparent',
                      color: w === selected ? '#000' : 'var(--text)',
                      border: '1px solid', borderColor: w === selected ? 'var(--accent)' : 'var(--border)',
                      borderRadius: 8, fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
                      fontWeight: 600, cursor: voting ? 'not-allowed' : 'pointer',
                      opacity: voting ? 0.5 : 1, transition: 'all 0.15s', letterSpacing: '0.05em'
                    }}
                  >
                    {voting ? 'Saving...' : w === 'tie' ? 'Tie' : 'Response ' + w + ' is better'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {voted && (
          <div style={{
            background: 'var(--surface)', border: '1px solid rgba(99,255,180,0.25)',
            borderRadius: 12, padding: '3rem 2rem', textAlign: 'center',
            boxShadow: '0 0 60px rgba(99,255,180,0.04)'
          }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(99,255,180,0.1)', border: '1px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '1.25rem' }}>✓</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--text)', margin: '0 0 0.5rem' }}>Annotation saved</h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.875rem', margin: '0 0 0.25rem' }}>
              Preferred: <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{winnerLabel[votedFor]}</span>
            </p>
            {reason.trim() && (
              <p style={{ color: 'var(--muted)', fontSize: '0.825rem', fontStyle: 'italic', margin: '0.25rem 0 0' }}>"{reason.trim()}"</p>
            )}
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', margin: '1rem 0 1.75rem', opacity: 0.5 }}>
              Added to training dataset
            </p>
            <button
              onClick={handleReset}
              style={{
                padding: '0.75rem 2rem', background: 'var(--accent)', color: '#000',
                border: 'none', borderRadius: 8, fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.05em'
              }}
            >
              Next annotation
            </button>
          </div>
        )}
      </div>
    </div>
  )
}