import React from 'react';
import { NodeData } from '../types';
import { TRL_COLOR, TRL_LABELS, CHAPTER_COLOR, CHAPTER_LABEL } from '../constants';

interface Props {
  activeId: string | null;
  activeNode: NodeData | null;
  requires: NodeData[];
  enables: NodeData[];
  setActive: (id: string | null) => void;
  setNarOpen: (v: boolean) => void;
}

export function CivStackSidePanel({ activeId, activeNode, requires, enables, setActive, setNarOpen }: Props) {
  return (
    <div className={`cs-panel${activeNode ? ' open' : ''}`}>
      <button className="p-close" onClick={() => setActive(null)}>×</button>
      {activeNode && (
        <div className="cs-panel-scroll">
          <div className="p-header">
            <div className="p-chapter" style={{ color: CHAPTER_COLOR[activeNode.chapter] }}>
              <div className="p-chapter-dot" style={{ background: CHAPTER_COLOR[activeNode.chapter] }} />
              {CHAPTER_LABEL[activeNode.chapter]}
            </div>
            <div className="p-title">{activeNode.name}</div>
            <div className="p-sub">{activeNode.sub}</div>
          </div>

          {/* TRL (capabilities only) */}
          {activeNode.type !== 'milestone' && (
            <div className="p-sec">
              <div className="p-sec-title">TRL — Technology Readiness</div>
              <div className="trl-track">
                {Array.from({ length: 10 }, (_, i) => (
                  <div
                    key={i}
                    className="trl-seg"
                    style={i <= (activeNode.trl ?? 0) ? { background: TRL_COLOR[i] } : undefined}
                  />
                ))}
              </div>
              <div className="trl-labels">
                <span>0 {TRL_LABELS[0]}</span>
                <span>5 {TRL_LABELS[5]}</span>
                <span>9 {TRL_LABELS[9]}</span>
              </div>
            </div>
          )}

          {/* Status */}
          <div className="p-sec">
            <div className="p-sec-title">Status</div>
            <div className="badge-row">
              {activeNode.type === 'milestone' ? (
                <span className="badge" style={{
                  borderColor: activeNode.confirmed ? '#c8a84a' : '#48443e',
                  color: activeNode.confirmed ? '#c8a84a' : '#48443e',
                }}>
                  {activeNode.confirmed ? '✓ CONFIRMED' : '○ HYPOTHETICAL'}
                </span>
              ) : (
                <span className="badge" style={{
                  borderColor: TRL_COLOR[activeNode.trl ?? 0],
                  color: TRL_COLOR[activeNode.trl ?? 0],
                }}>
                  TRL {activeNode.trl ?? '?'}/9 · {TRL_LABELS[activeNode.trl ?? 0]}
                </span>
              )}
              {activeNode.bottleneck && <span className="badge badge-bn">BOTTLENECK</span>}
              {activeNode.type === 'milestone' && (
                <span className="badge" style={{ borderColor: '#7a7268', color: '#7a7268' }}>MILESTONE</span>
              )}
            </div>
          </div>

          {/* Watch */}
          {activeNode.voice?.watch && (
            <div className="p-sec">
              <div className="p-sec-title">Watch for</div>
              <div style={{ fontSize: '10px', color: 'var(--ink-mid)', borderLeft: '2px solid var(--rule-hi)', paddingLeft: '10px' }}>
                {activeNode.voice.watch}
              </div>
            </div>
          )}

          {/* Take */}
          {activeNode.voice?.take && (
            <div className="p-sec">
              <div className="p-sec-title">My take</div>
              <div className="p-take">{activeNode.voice.take}</div>
            </div>
          )}

          {/* Companies */}
          {activeNode.companies && activeNode.companies.length > 0 && (
            <div className="p-sec">
              <div className="p-sec-title">Key players</div>
              <div className="co-list">
                {activeNode.companies.map((co, i) => (
                  <div key={i} className="co-item">
                    <div>
                      <div className="co-name">{co.name}</div>
                      <div className="co-role">{co.role}</div>
                    </div>
                    <div className={`co-tag ${co.type}`}>{(co.type ?? 'private').toUpperCase()}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Requires */}
          {requires.length > 0 && (
            <div className="p-sec">
              <div className="p-sec-title">Requires →</div>
              <div className="link-list">
                {requires.map(r => (
                  <div
                    key={r.id}
                    className="link-item"
                    style={{ borderLeftColor: TRL_COLOR[r.trl ?? 0] }}
                    onClick={() => setActive(r.id)}
                  >
                    <span className="link-arr">←</span>
                    {r.name}
                    <span style={{ color: 'var(--ink-dim)', fontSize: '9px', marginLeft: 'auto' }}>TRL {r.trl ?? '?'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Enables */}
          {enables.length > 0 && (
            <div className="p-sec">
              <div className="p-sec-title">Enables →</div>
              <div className="link-list">
                {enables.map(e2 => (
                  <div
                    key={e2.id}
                    className="link-item"
                    style={{ borderLeftColor: TRL_COLOR[e2.trl ?? 0] }}
                    onClick={() => setActive(e2.id)}
                  >
                    <span className="link-arr">→</span>
                    {e2.name}
                    <span style={{ color: 'var(--ink-dim)', fontSize: '9px', marginLeft: 'auto' }}>TRL {e2.trl ?? '?'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* History + TRL Mini-Chart */}
          {activeNode.history && activeNode.history.length > 0 && (
            <div className="p-sec">
              <div className="p-sec-title">TRL History</div>
              {/* Mini-chart */}
              <div className="p-trl-chart">
                <svg viewBox="0 0 336 60" preserveAspectRatio="xMidYMid meet">
                  {(() => {
                    const hist = activeNode.history!;
                    const chartH = 44;
                    const chartY0 = 52; // bottom of chart area
                    const pts = hist
                      .filter(h => h.trl_to !== undefined)
                      .map((h, i) => ({
                        x: (i / Math.max(hist.length, 1)) * 290 + 30,
                        y: chartY0 - (h.trl_to! / 9) * chartH,
                        trl: h.trl_to!,
                        date: h.date,
                      }));
                    if (pts.length === 0) return null;
                    // Add current TRL as last point
                    pts.push({
                      x: 320,
                      y: chartY0 - ((activeNode.trl ?? 0) / 9) * chartH,
                      trl: activeNode.trl ?? 0,
                      date: 'NOW',
                    });
                    // Step-line path (horizontal then vertical)
                    let stepPath = `M${pts[0].x},${pts[0].y}`;
                    for (let i = 1; i < pts.length; i++) {
                      stepPath += ` L${pts[i].x},${pts[i - 1].y} L${pts[i].x},${pts[i].y}`;
                    }
                    return (
                      <>
                        {/* Y-axis TRL labels */}
                        {[0, 3, 6, 9].map(t => (
                          <g key={t}>
                            <line x1={26} y1={chartY0 - (t / 9) * chartH} x2={324} y2={chartY0 - (t / 9) * chartH}
                              stroke="var(--rule)" strokeWidth={0.5} />
                            <text x={22} y={chartY0 - (t / 9) * chartH + 3}
                              fontFamily="'JetBrains Mono', monospace"
                              fontSize="6" fill="var(--ink-dim)" textAnchor="end"
                            >{t}</text>
                          </g>
                        ))}
                        {/* Step line */}
                        <path d={stepPath} fill="none" stroke={TRL_COLOR[activeNode.trl ?? 0]}
                          strokeWidth={1.5} strokeLinejoin="bevel" />
                        {/* Dots + date labels */}
                        {pts.map((p, i) => (
                          <g key={i}>
                            <circle cx={p.x} cy={p.y} r={3}
                              fill={TRL_COLOR[p.trl]} stroke="#080808" strokeWidth={1} />
                            <text
                              x={p.x} y={chartY0 + 8}
                              fontFamily="'JetBrains Mono', monospace"
                              fontSize="5" fill="var(--ink-dim)" textAnchor="middle"
                              letterSpacing="0.03em"
                            >{p.date}</text>
                          </g>
                        ))}
                      </>
                    );
                  })()}
                </svg>
              </div>
              <div className="link-list" style={{ marginTop: '8px' }}>
                {activeNode.history.map((h, i) => (
                  <div key={i} className="link-item" style={{ borderLeftColor: TRL_COLOR[h.trl_to ?? 0] }}>
                    <span style={{ color: 'var(--ink-dim)', fontSize: '9px' }}>{h.date}</span>
                    {h.trl_from !== undefined && h.trl_to !== undefined && (
                      <span className="badge" style={{
                        borderColor: TRL_COLOR[h.trl_to],
                        color: TRL_COLOR[h.trl_to],
                        fontSize: '7px', padding: '1px 4px',
                      }}>
                        TRL {h.trl_from} → {h.trl_to}
                      </span>
                    )}
                    <span style={{ fontSize: '9px' }}>{h.note}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Read in narrative */}
          <button className="p-nar-btn" onClick={() => {
            setNarOpen(true);
            if (activeId) setTimeout(() => {
              const el = document.getElementById(`nc-${activeId}`);
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 450);
          }}>
            ☰ Read in narrative
          </button>
        </div>
      )}
    </div>
  );
}
