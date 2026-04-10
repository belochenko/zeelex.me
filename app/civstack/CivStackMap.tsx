'use client';

import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import * as d3Force from 'd3-force';
import stackData from '../../public/stack.json';

// ══════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════
interface NodeData extends d3Force.SimulationNodeDatum {
  id: string;
  type: string;
  name: string;
  sub?: string;
  chapter: string;
  tags?: string[];
  trl?: number;
  confirmed?: boolean; // milestones only: true = achieved, false = hypothetical
  horizon?: string;
  bottleneck?: boolean;
  gravity_manual?: number | null;
  voice?: {
    take?: string;
    confidence?: string;
    concern?: string | null;
    watch?: string;
    updated?: string;
  };
  companies?: Array<{ name: string; role?: string; type?: string }>;
  links?: Array<{ label: string; url: string; type?: string }>;
  history?: Array<{ date: string; trl_from?: number; trl_to?: number; note?: string }>;
  position?: { x: number | null; y: number | null; pinned: boolean };
  // computed
  gravity: number;
  nodeR: number;
  gx: number;
  gy: number;
  // d3 simulation fields
  fx?: number | null;
  fy?: number | null;
}

interface EdgeData {
  id: string;
  from: string;
  to: string;
  type: string;
  strength?: string;
  rationale?: string; // REQUIRED for risks edges
  severity?: string;
}

// ══════════════════════════════════════════════════
// CONSTANTS
// ══════════════════════════════════════════════════
const TRL_COLOR: Record<number, string> = {
  0: '#2a2a3a', 1: '#3a3a5a', 2: '#3a4a6a', 3: '#3a5a7a',
  4: '#3a7a7a', 5: '#4a8a5a', 6: '#7a8a3a',
  7: '#9a7a2a', 8: '#b4642a', 9: '#8ab46a'
};

const TRL_LABELS: Record<number, string> = {
  0: 'Hypothesis', 1: 'Concept', 2: 'Formulated', 3: 'Proof',
  4: 'Validated', 5: 'Demo', 6: 'Prototype',
  7: 'Pilot', 8: 'Scaling', 9: 'Proven'
};

const CHAPTER_COLOR: Record<string, string> = {
  survive: '#d4724a',
  expand: '#4a8cd4',
  connect: '#6ab07a',
};

const CHAPTER_LABEL: Record<string, string> = {
  survive: '⚠ SURVIVE',
  expand: '↗ EXPAND',
  connect: '◈ CONNECT',
};

// ══════════════════════════════════════════════════
// DATA PROCESSING
// ══════════════════════════════════════════════════
function processData() {
  const raw = stackData as typeof stackData;
  const capMap: Record<string, NodeData> = {};

  // Build nodes
  const nodes: NodeData[] = raw.nodes.map((n) => {
    const nd: NodeData = {
      ...n,
      chapter: n.chapter,
      gravity: 0,
      nodeR: 30,
      gx: n.position?.x ?? 400,
      gy: n.position?.y ?? 300,
    };
    capMap[nd.id] = nd;
    return nd;
  });

  // Compute gravity from requires edges
  raw.edges.forEach((e) => {
    if (e.type === 'requires' && capMap[e.to]) {
      capMap[e.to].gravity += 1;
    }
  });

  // Compute nodeR = base + gravity * 6
  nodes.forEach((n) => {
    n.nodeR = 30 + n.gravity * 8;
  });

  // Build ALL edge types
  const edges: EdgeData[] = raw.edges.map((e) => ({
    ...e,
  }));

  // Collect all unique tags
  const allTags = [...new Set(nodes.flatMap(n => n.tags ?? []))];

  return {
    nodes, edges, capMap, meta: raw.meta,
    clusters: raw.clusters, horizons: raw.horizons,
    changelog: (raw as Record<string, unknown>).changelog as Array<{ date: string; type: string; node?: string; note: string; trl_from?: number; trl_to?: number }> ?? [],
    allTags,
  };
}

function edgeTRL(e: EdgeData, capMap: Record<string, NodeData>) {
  const f = capMap[e.from], t = capMap[e.to];
  return Math.min(f?.trl ?? 0, t?.trl ?? 0);
}

function edgeStyle(trl: number, type: string) {
  // risks edges
  if (type === 'risks') {
    return { color: '#4a1a1a', width: 1.5, dash: '8,4,2,4', marker: 'arr-risk' };
  }
  // accelerates edges
  if (type === 'accelerates') {
    if (trl >= 7) return { color: '#3a3a6a', width: 1.8, dash: '4,6', marker: 'arr5' };
    if (trl >= 4) return { color: '#2e2e4a', width: 1.4, dash: '4,6', marker: 'arr1' };
    return { color: '#1e1e3a', width: 1.0, dash: '4,6', marker: 'arr0' };
  }
  // requires edges
  if (trl >= 7) return { color: '#6a8a4a', width: 2.5, dash: null, marker: 'arr9' };
  if (trl >= 4) return { color: '#5a6a3a', width: 1.8, dash: null, marker: 'arr5' };
  return { color: '#2a3a4a', width: 1.2, dash: '4,4', marker: 'arr1' };
}

// ══════════════════════════════════════════════════
// HORIZON ZONE X TARGETS (for soft x-boundaries)
// ══════════════════════════════════════════════════
const HORIZON_CENTER: Record<string, number> = {
  near: 0.2,
  far: 0.5,
  open: 0.8,
};

// Chapter Y targets — separate clusters vertically
const CHAPTER_Y_CENTER: Record<string, number> = {
  survive: 0.22,
  expand: 0.52,
  connect: 0.82,
};

// ══════════════════════════════════════════════════
// CONVEX HULL
// ══════════════════════════════════════════════════
function convexHull(points: { x: number; y: number }[]): { x: number; y: number }[] {
  if (points.length < 3) return points;
  const sorted = [...points].sort((a, b) => a.x - b.x || a.y - b.y);
  const cross = (O: { x: number; y: number }, A: { x: number; y: number }, B: { x: number; y: number }) =>
    (A.x - O.x) * (B.y - O.y) - (A.y - O.y) * (B.x - O.x);
  const lower: { x: number; y: number }[] = [];
  for (const p of sorted) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop();
    lower.push(p);
  }
  const upper: { x: number; y: number }[] = [];
  for (const p of sorted.reverse()) {
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop();
    upper.push(p);
  }
  upper.pop(); lower.pop();
  return lower.concat(upper);
}

function expandHull(hull: { x: number; y: number }[], pad: number): string {
  if (hull.length === 0) return '';
  // Compute centroid
  const cx = hull.reduce((s, p) => s + p.x, 0) / hull.length;
  const cy = hull.reduce((s, p) => s + p.y, 0) / hull.length;
  // Expand points outward from centroid
  const expanded = hull.map(p => {
    const dx = p.x - cx, dy = p.y - cy;
    const d = Math.sqrt(dx * dx + dy * dy) || 1;
    return { x: p.x + (dx / d) * pad, y: p.y + (dy / d) * pad };
  });
  // Generate smooth closed cubic bezier path
  if (expanded.length < 3) {
    return expanded.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z';
  }
  const n = expanded.length;
  let d = `M${expanded[0].x},${expanded[0].y}`;
  for (let i = 0; i < n; i++) {
    const p0 = expanded[(i - 1 + n) % n];
    const p1 = expanded[i];
    const p2 = expanded[(i + 1) % n];
    const p3 = expanded[(i + 2) % n];
    // Catmull-Rom to cubic bezier control points (tension=0.5)
    const t = 0.5;
    const cp1x = p1.x + (p2.x - p0.x) * t / 3;
    const cp1y = p1.y + (p2.y - p0.y) * t / 3;
    const cp2x = p2.x - (p3.x - p1.x) * t / 3;
    const cp2y = p2.y - (p3.y - p1.y) * t / 3;
    d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }
  return d + 'Z';
}

// ══════════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════════
export default function CivStackClient() {
  const dataRef = useRef(processData());
  const { nodes, edges, capMap, meta, clusters, changelog, allTags } = dataRef.current;

  const [activeId, setActiveId] = useState<string | null>(null);
  const [showLabels, setShowLabels] = useState(true);
  const [showDeps, setShowDeps] = useState(true);
  const [domainFilter, setDomainFilter] = useState('all');
  const [narOpen, setNarOpen] = useState(false);

  // Simulation tick counter — increment to trigger re-render
  const [simTick, setSimTick] = useState(0);

  // 2.5 Filter bar state
  const [filterOpen, setFilterOpen] = useState(false);
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [horizonFilter, setHorizonFilter] = useState<string | null>(null);
  const [trlRange, setTrlRange] = useState<[number, number]>([0, 9]);

  // 2.6 Search
  const [searchQuery, setSearchQuery] = useState('');

  // 2.9 Changelog panel
  const [changelogOpen, setChangelogOpen] = useState(false);

  // Tooltip
  const [tip, setTip] = useState({ text: '', x: 0, y: 0, visible: false, nodeId: null as string | null });

  // Crosshairs & Mouse tracking
  const [mousePos, setMousePos] = useState<{x: number; y: number} | null>(null);

  useEffect(() => {
    const updateMouse = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', updateMouse);
    return () => window.removeEventListener('mousemove', updateMouse);
  }, []);

  // Pan/Zoom state
  const [gTx, setGTx] = useState({ x: 0, y: 0, s: 1 });
  const gDragRef = useRef(false);
  const gDsRef = useRef({ x: 0, y: 0 });
  const gT0Ref = useRef({ x: 0, y: 0, s: 1 });

  const svgRef = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const simRef = useRef<d3Force.Simulation<NodeData, undefined> | null>(null);

  // ── NODE DRAG STATE ──
  const nodeDragRef = useRef<{ node: NodeData; startX: number; startY: number; origGx: number; origGy: number } | null>(null);

  // ══════════════════════════════════════════════════
  // D3-FORCE SIMULATION
  // ══════════════════════════════════════════════════
  useEffect(() => {
    // Build link edges: only requires + accelerates (risks don't attract)
    interface SimLink extends d3Force.SimulationLinkDatum<NodeData> {
      edgeType: string;
    }
    const simLinks: SimLink[] = edges
      .filter(e => e.type === 'requires' || e.type === 'accelerates')
      .map(e => ({
        source: e.from,
        target: e.to,
        edgeType: e.type,
      }));

    // Viewport size for horizon x targets
    const W = 2400; // virtual coordinate space width
    const H = 1200;

    // Pin nodes that already have positions from JSON
    nodes.forEach(n => {
      if (n.position?.pinned && n.position.x != null && n.position.y != null) {
        n.fx = n.position.x;
        n.fy = n.position.y;
        n.gx = n.position.x;
        n.gy = n.position.y;
      } else {
        // Use JSON position as initial hint, unpinned
        n.x = n.gx;
        n.y = n.gy;
        n.fx = null;
        n.fy = null;
      }
    });

    // Cache node degrees to normalize link strength and bias gravity
    const degreeCache: Record<string, number> = {};
    nodes.forEach(n => degreeCache[n.id] = 0);
    simLinks.forEach(l => {
      degreeCache[typeof l.source === 'string' ? l.source : (l.source as NodeData).id] = (degreeCache[typeof l.source === 'string' ? l.source : (l.source as NodeData).id] || 0) + 1;
      degreeCache[typeof l.target === 'string' ? l.target : (l.target as NodeData).id] = (degreeCache[typeof l.target === 'string' ? l.target : (l.target as NodeData).id] || 0) + 1;
    });

    const sim = d3Force.forceSimulation<NodeData>(nodes)
      // 1. Repulsion ∝ radius²
      .force('charge', d3Force.forceManyBody<NodeData>()
        .strength((d) => -(d.nodeR * d.nodeR) * 0.7)
      )
      // 2. Link attraction: requires = strong, accelerates = weaker
      .force('link', d3Force.forceLink<NodeData, SimLink>(simLinks)
        .id(d => d.id)
        .distance(d => d.edgeType === 'requires' ? 200 : 320)
        .strength(d => {
          const srcDeg = degreeCache[typeof d.source === 'string' ? d.source : d.source.id] || 1;
          const tgtDeg = degreeCache[typeof d.target === 'string' ? d.target : d.target.id] || 1;
          const degFactor = 1 / Math.min(srcDeg, tgtDeg);
          const raw = d.edgeType === 'requires' ? 0.35 : 0.06;
          return raw * degFactor;
        })
      )
      // 3. Collision based on node radius
      .force('collide', d3Force.forceCollide<NodeData>()
        .radius(d => d.nodeR + 35)
        .iterations(3)
      )
      // 4. Horizon zones as soft x-boundaries — spread horizontally
      .force('horizonX', d3Force.forceX<NodeData>()
        .x(d => {
          const hz = HORIZON_CENTER[d.horizon ?? 'near'] ?? 0.2;
          return W * hz;
        })
        .strength(d => {
          const deg = degreeCache[d.id] || 0;
          return Math.max(0.04, 0.2 - deg * 0.015);
        })
      )
      // 5. Chapter-based Y separation — survive top, expand mid, connect bottom
      .force('chapterY', d3Force.forceY<NodeData>()
        .y(d => {
          const cy = CHAPTER_Y_CENTER[d.chapter] ?? 0.5;
          return H * cy;
        })
        .strength(d => {
          const deg = degreeCache[d.id] || 0;
          return Math.max(0.04, 0.16 - deg * 0.015);
        })
      )
      .alpha(1)
      .alphaDecay(0.02)
      .velocityDecay(0.45)
      .on('tick', () => {
        // Sync simulation x/y → gx/gy for rendering
        nodes.forEach(n => {
          n.gx = n.x ?? n.gx;
          n.gy = n.y ?? n.gy;
        });
        setSimTick(t => t + 1);
      });

    simRef.current = sim;

    return () => {
      sim.stop();
      simRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── NODE DRAG HANDLERS (drag → pin) ──
  const distDraggedRef = useRef(0);
  const handleNodeMouseDown = useCallback((e: React.MouseEvent, node: NodeData) => {
    e.stopPropagation(); // don't trigger pan
    distDraggedRef.current = 0;
    nodeDragRef.current = {
      node,
      startX: e.clientX,
      startY: e.clientY,
      origGx: node.gx,
      origGy: node.gy,
    };
    // Reheat simulation
    if (simRef.current) {
      simRef.current.alphaTarget(0.3).restart();
    }
  }, []);

  useEffect(() => {
    const handleNodeDragMove = (e: MouseEvent) => {
      const drag = nodeDragRef.current;
      if (!drag) return;
      const dx = (e.clientX - drag.startX);
      const dy = (e.clientY - drag.startY);
      distDraggedRef.current += Math.abs(dx) + Math.abs(dy);

      const dxS = dx / gTx.s;
      const dyS = dy / gTx.s;
      const newX = drag.origGx + dxS;
      const newY = drag.origGy + dyS;
      drag.node.fx = newX;
      drag.node.fy = newY;
      drag.node.gx = newX;
      drag.node.gy = newY;
    };

    const handleNodeDragEnd = () => {
      const drag = nodeDragRef.current;
      if (!drag) return;
      // Pin the node at its new position
      // (fx/fy remain set — node is now pinned)
      nodeDragRef.current = null;
      if (simRef.current) {
        simRef.current.alphaTarget(0).restart();
      }
    };

    window.addEventListener('mousemove', handleNodeDragMove);
    window.addEventListener('mouseup', handleNodeDragEnd);
    return () => {
      window.removeEventListener('mousemove', handleNodeDragMove);
      window.removeEventListener('mouseup', handleNodeDragEnd);
    };
  }, [gTx.s]);

  // ── URL STATE ──
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nodeParam = params.get('node');
    const chapterParam = params.get('chapter');
    const tagParam = params.get('tag');
    if (nodeParam && capMap[nodeParam]) {
      setActiveId(nodeParam);
    }
    if (chapterParam && ['survive', 'expand', 'connect'].includes(chapterParam)) {
      setDomainFilter(chapterParam);
    }
    if (tagParam) {
      setTagFilter(tagParam);
      setFilterOpen(true);
    }
  }, []);

  // Sync URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (activeId) params.set('node', activeId);
    if (domainFilter !== 'all') params.set('chapter', domainFilter);
    if (tagFilter) params.set('tag', tagFilter);
    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;
    window.history.replaceState(null, '', newUrl);
  }, [activeId, domainFilter, tagFilter]);

  // ── FILTERED DATA (chapter + tag + horizon + TRL range) ──
  const visibleNodes = useMemo(() => nodes.filter(n => {
    if (domainFilter !== 'all' && n.chapter !== domainFilter) return false;
    if (tagFilter && !(n.tags ?? []).includes(tagFilter)) return false;
    if (horizonFilter && n.horizon !== horizonFilter) return false;
    // TRL filter only applies to non-milestones (milestones have confirmed, not TRL)
    if (n.type !== 'milestone') {
      const trl = n.trl ?? 0;
      if (trl < trlRange[0] || trl > trlRange[1]) return false;
    }
    return true;
  }), [nodes, domainFilter, tagFilter, horizonFilter, trlRange]);
  const visibleIds = new Set(visibleNodes.map(n => n.id));
  const visibleEdges = edges.filter(e => visibleIds.has(e.from) && visibleIds.has(e.to));

  // ── SEARCH ──
  const searchLower = searchQuery.toLowerCase().trim();
  const searchMatches = searchLower
    ? new Set(nodes.filter(n =>
      n.name.toLowerCase().includes(searchLower) ||
      (n.sub ?? '').toLowerCase().includes(searchLower) ||
      (n.tags ?? []).some(t => t.includes(searchLower))
    ).map(n => n.id))
    : null;

  // ── CONVEX HULLS ──
  const clusterHulls = clusters.map(ch => {
    const chNodes = visibleNodes.filter(n => n.chapter === ch.id);
    const points = chNodes.map(n => ({ x: n.gx, y: n.gy }));
    const hull = convexHull(points);
    const path = expandHull(hull, 80);
    return { ...ch, path, visible: chNodes.length >= 3 };
  });

  // ── MINIMAP BOUNDS ──
  const mmBounds = (() => {
    if (!nodes.length) return { minX: 0, minY: 0, maxX: 1, maxY: 1 };
    const pad = 60;
    return {
      minX: Math.min(...nodes.map(n => n.gx)) - pad,
      minY: Math.min(...nodes.map(n => n.gy)) - pad,
      maxX: Math.max(...nodes.map(n => n.gx)) + pad,
      maxY: Math.max(...nodes.map(n => n.gy)) + pad,
    };
  })();

  // ── HIGHLIGHT ──
  const relNodes = new Set<string>();
  const relEdges = new Set<string>();
  if (activeId) {
    relNodes.add(activeId);
    // Find connected
    edges.forEach(e => {
      if (e.from === activeId) { relNodes.add(e.to); relEdges.add(`${e.from}-${e.to}`); }
      if (e.to === activeId) { relNodes.add(e.from); relEdges.add(`${e.from}-${e.to}`); }
    });
  }

  // ── FIT GRAPH ──
  const fitGraph = useCallback(() => {
    const caps = visibleNodes;
    if (!caps.length || !wrapRef.current) return;
    const xs = caps.map(c => c.gx), ys = caps.map(c => c.gy);
    const pad = 80;
    const minX = Math.min(...xs) - pad, maxX = Math.max(...xs) + pad;
    const minY = Math.min(...ys) - pad, maxY = Math.max(...ys) + pad;
    const W = wrapRef.current.clientWidth, H = wrapRef.current.clientHeight;
    const s = Math.min(W / (maxX - minX), H / (maxY - minY), 1.5) * 0.9;
    setGTx({
      s,
      x: W / 2 - s * (minX + maxX) / 2,
      y: H / 2 - s * (minY + maxY) / 2,
    });
  }, [visibleNodes]);

  // Fit on mount (delayed for simulation settle) and domain change
  useEffect(() => {
    // Wait for simulation to settle before fitting
    const delay = simTick < 5 ? 1200 : 60;
    const timer = setTimeout(fitGraph, delay);
    return () => clearTimeout(timer);
  }, [domainFilter, fitGraph, simTick < 5]);

  // ── PAN + click-to-dismiss ──
  const panMovedRef = useRef(false);
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as Element).closest('.g-node')) return;
    gDragRef.current = true;
    panMovedRef.current = false;
    gDsRef.current = { x: e.clientX, y: e.clientY };
    gT0Ref.current = { ...gTx };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (gDragRef.current) {
        panMovedRef.current = true;
        setGTx({
          x: gT0Ref.current.x + e.clientX - gDsRef.current.x,
          y: gT0Ref.current.y + e.clientY - gDsRef.current.y,
          s: gT0Ref.current.s,
        });
      }
      if (tip.visible) {
        setTip(t => ({ ...t, x: e.clientX + 14, y: e.clientY - 30 }));
      }
    };
    const handleMouseUp = () => {
      // If user clicked empty space without dragging → close panel
      if (gDragRef.current && !panMovedRef.current) {
        setActiveId(null);
      }
      gDragRef.current = false;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [tip.visible]);

  // ── ZOOM ──
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const f = e.deltaY < 0 ? 1.12 : 0.89;
    const wrap = wrapRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    setGTx(prev => ({
      x: mx - f * (mx - prev.x),
      y: my - f * (my - prev.y),
      s: prev.s * f,
    }));
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    wrap.addEventListener('wheel', handleWheel, { passive: false });
    return () => wrap.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  // ── SET ACTIVE ──
  const setActive = (id: string | null) => {
    setActiveId(id);
    // Scroll narrative card into view if narrative is open
    if (id && narOpen) {
      setTimeout(() => {
        const el = document.getElementById(`nc-${id}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  };

  // ── BUILD SVG EDGE PATH (quadratic bezier like reference) ──
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _simTick = simTick; // ensure re-render on sim tick
  function edgePath(e: EdgeData) {
    const from = capMap[e.from], to = capMap[e.to];
    if (!from || !to) return '';
    const dx = to.gx - from.gx, dy = to.gy - from.gy;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d === 0) return '';
    const nx = dx / d, ny = dy / d;
    const fr = from.nodeR, tr = to.nodeR;
    // quadratic control point — perpendicular offset
    const cx = (from.gx + to.gx) / 2 - ny * 50;
    const cy = (from.gy + to.gy) / 2 + nx * 50;
    return `M ${from.gx + nx * fr} ${from.gy + ny * fr} Q ${cx} ${cy} ${to.gx - nx * tr} ${to.gy - ny * tr}`;
  }

  // Active node
  const activeNode = activeId ? capMap[activeId] : null;

  // Requires / Enables for panel
  const requires = activeId ? edges.filter(e => e.to === activeId && e.type === 'requires').map(e => capMap[e.from]).filter(Boolean) : [];
  const enables = activeId ? edges.filter(e => e.from === activeId && e.type === 'requires').map(e => capMap[e.to]).filter(Boolean) : [];

  return (
    <>
      {/* ══ CROSSHAIRS ══ */}
      {mousePos && (() => {
        let cx = mousePos.x;
        let cy = mousePos.y;
        let isLocked = false;
        let rMask = 0;

        if (tip.visible && tip.nodeId && capMap[tip.nodeId]) {
          const node = capMap[tip.nodeId];
          let offX = 0, offY = 42; // default topbar
          if (wrapRef.current) {
            const rect = wrapRef.current.getBoundingClientRect();
            offX = rect.left;
            offY = rect.top;
          }
          cx = node.gx * gTx.s + gTx.x + offX;
          cy = node.gy * gTx.s + gTx.y + offY;
          rMask = (node.nodeR + 12) * gTx.s;
          isLocked = true;
        }

        const maskStyle = isLocked
          ? { WebkitMaskImage: `radial-gradient(circle at ${cx}px ${cy}px, transparent ${rMask}px, black ${rMask}px)` }
          : {};

        return (
          <div className="cs-crosshair-layer" style={maskStyle}>
            <div className="cs-crosshair-x" style={{ top: cy }} />
            <div className="cs-crosshair-y" style={{ left: cx }} />
          </div>
        );
      })()}

      {/* ══ TOPBAR ══ */}
      <div className="cs-topbar">
        <div className="cs-tb-logo">
          <span className="cs-tb-title">{meta.title}</span>
          <span className="cs-tb-slash" style={{ margin: '0 4px', opacity: 0.5 }}>|</span>
          <a
            href="https://zeelex.me"
            className="cs-tb-sub cs-tb-sub-link"
          >
            zeelex.me
            <span className="cs-tb-popup">Subsidiary project of zeelex.me</span>
          </a>
        </div>
        <div className="cs-tb-domains">
          {[
            { id: 'all', color: '#7a7268', label: 'All' },
            ...clusters.map(c => ({ id: c.id, color: c.color, label: c.label }))
          ].map(d => (
            <button
              key={d.id}
              className={`cs-dom-pill${domainFilter === d.id ? ' active' : ''}`}
              style={{ '--dc': d.color } as React.CSSProperties}
              onClick={() => { setDomainFilter(d.id); setActive(null); }}
            >
              <span className="cs-dom-dot" />
              {d.label}
            </button>
          ))}
        </div>
        <div className="cs-tb-right">
          <div className="cs-search-wrap">
            <input
              className="cs-search-input"
              type="text"
              placeholder="Search nodes..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="cs-search-clear" onClick={() => setSearchQuery('')}>×</button>
            )}
          </div>
          <button
            className={`cs-tb-btn${filterOpen ? ' active' : ''}`}
            onClick={() => setFilterOpen(!filterOpen)}
          >
            FILTER
          </button>
          <button
            className={`cs-tb-btn${showLabels ? ' active' : ''}`}
            onClick={() => setShowLabels(!showLabels)}
          >
            LABELS
          </button>
          <button
            className={`cs-tb-btn${showDeps ? ' active' : ''}`}
            onClick={() => setShowDeps(!showDeps)}
          >
            DEPS
          </button>
          <button
            className={`cs-tb-btn${changelogOpen ? ' active' : ''}`}
            onClick={() => { setChangelogOpen(!changelogOpen); setActiveId(null); }}
          >
            LOG
          </button>
          <button
            className={`cs-tb-btn${narOpen ? ' active' : ''}`}
            onClick={() => setNarOpen(!narOpen)}
          >
            NARRATIVE
          </button>
        </div>
      </div>

      {/* ══ FILTER BAR ══ */}
      <div className={`cs-filter-bar${filterOpen ? ' open' : ''}`}>
        <span className="cs-filter-label">Tag</span>
        <div className="cs-filter-pills">
          <button
            className={`cs-filter-pill${tagFilter === null ? ' active' : ''}`}
            onClick={() => setTagFilter(null)}
          >All</button>
          {allTags.map(t => (
            <button
              key={t}
              className={`cs-filter-pill${tagFilter === t ? ' active' : ''}`}
              onClick={() => setTagFilter(tagFilter === t ? null : t)}
            >{t}</button>
          ))}
        </div>

        <div className="cs-filter-sep" />

        <span className="cs-filter-label">Horizon</span>
        <div className="cs-filter-pills">
          <button
            className={`cs-filter-pill${horizonFilter === null ? ' active' : ''}`}
            onClick={() => setHorizonFilter(null)}
          >All</button>
          {['near', 'far', 'open'].map(h => (
            <button
              key={h}
              className={`cs-filter-pill${horizonFilter === h ? ' active' : ''}`}
              onClick={() => setHorizonFilter(horizonFilter === h ? null : h)}
            >{h}</button>
          ))}
        </div>

        <div className="cs-filter-sep" />

        <div className="cs-trl-range">
          <span className="cs-filter-label">TRL</span>
          <input
            className="cs-trl-slider"
            type="range" min={0} max={9}
            value={trlRange[0]}
            onChange={e => setTrlRange([+e.target.value, trlRange[1]])}
          />
          <span className="cs-trl-val">{trlRange[0]}–{trlRange[1]}</span>
          <input
            className="cs-trl-slider"
            type="range" min={0} max={9}
            value={trlRange[1]}
            onChange={e => setTrlRange([trlRange[0], +e.target.value])}
          />
        </div>
      </div>

      {/* ══ GRAPH LAYER ══ */}
      <div className={`cs-graph-layer${narOpen ? ' narrative-open' : ''}${filterOpen ? ' filter-open' : ''}`}>
        <div className="cs-graph-wrap" ref={wrapRef}>
          <div className="cs-dot-grid" />

          <svg
            ref={svgRef}
            className="cs-svg"
            onMouseDown={handleMouseDown}
          >
            <defs>
              <marker id="arr0" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="4" markerHeight="4" orient="auto">
                <path d="M0,1 L7,4 L0,7Z" fill="#222220" />
              </marker>
              <marker id="arr1" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="4" markerHeight="4" orient="auto">
                <path d="M0,1 L7,4 L0,7Z" fill="#3a4a6a" />
              </marker>
              <marker id="arr5" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="4" markerHeight="4" orient="auto">
                <path d="M0,1 L7,4 L0,7Z" fill="#7a8a3a" />
              </marker>
              <marker id="arr9" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="4" markerHeight="4" orient="auto">
                <path d="M0,1 L7,4 L0,7Z" fill="#8ab46a" />
              </marker>
              <marker id="arr-hi" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto">
                <path d="M0,1 L7,4 L0,7Z" fill="rgba(200,196,188,0.7)" />
              </marker>
              <marker id="arr-risk" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="6" markerHeight="6" orient="auto">
                <circle cx="6" cy="6" r="5" fill="none" stroke="#4a1a1a" strokeWidth="1.5" />
                <path d="M3.5,3.5 L8.5,8.5 M8.5,3.5 L3.5,8.5" stroke="#4a1a1a" strokeWidth="1.5" />
              </marker>
            </defs>

            <g transform={`translate(${gTx.x},${gTx.y}) scale(${gTx.s})`}>
              {/* ── HORIZON ZONE BANDS ── */}
              {(() => {
                const ZW = 2400;
                const ZH = 1200;
                const bands = [
                  { x0: 0, x1: ZW * 0.33 },
                  { x0: ZW * 0.33, x1: ZW * 0.66 },
                  { x0: ZW * 0.66, x1: ZW * 1.0 },
                ];
                return bands.map((b, i) => (
                  <g key={i}>
                    <rect
                      x={b.x0} y={-400} width={b.x1 - b.x0} height={ZH + 800}
                      fill={i % 2 === 0 ? 'rgba(255,255,255,0.012)' : 'transparent'}
                    />
                    {i > 0 && (
                      <line
                        x1={b.x0} y1={-400} x2={b.x0} y2={ZH + 400}
                        stroke="var(--rule-mid)" strokeWidth="1" strokeDasharray="6,8"
                      />
                    )}
                  </g>
                ));
              })()}

              {/* ── CONVEX HULLS + CHAPTER LABELS ── */}
              <g>
                {clusterHulls.map(ch => {
                  if (!ch.visible) return null;
                  const chPts = visibleNodes.filter(n => n.chapter === ch.id);
                  const cx = chPts.reduce((s, n) => s + n.gx, 0) / chPts.length;
                  const cy = Math.min(...chPts.map(n => n.gy)) - 55;
                  return (
                    <g key={ch.id}>
                      <path
                        d={ch.path}
                        fill={ch.color}
                        fillOpacity={0.06}
                        stroke={ch.color}
                        strokeOpacity={0.2}
                        strokeWidth={1.5}
                        strokeDasharray="6,4"
                      />
                      <text
                        x={cx} y={cy}
                        fontFamily="'JetBrains Mono', monospace"
                        fontSize="10" fontWeight="700" letterSpacing="0.25em"
                        fill={ch.color} textAnchor="middle"
                        opacity={0.5}
                      >
                        {ch.label.toUpperCase()}
                      </text>
                    </g>
                  );
                })}
              </g>

              {/* ── EDGES ── */}
              <g style={{ opacity: showDeps ? 1 : 0, transition: 'opacity 0.3s' }}>
                {visibleEdges.map((e) => {
                  const trl = edgeTRL(e, capMap);
                  const st = edgeStyle(trl, e.type);
                  const path = edgePath(e);
                  const eid = `${e.from}-${e.to}`;
                  const isHi = activeId && relEdges.has(eid);
                  const isDimmed = activeId && !relEdges.has(eid);

                  return (
                    <g key={e.id}>
                      <path
                        d={path}
                        className={`g-edge${isDimmed ? ' dimmed' : ''}${isHi ? ' hi' : ''}`}
                        stroke={isHi ? 'rgba(200,196,188,0.5)' : st.color}
                        strokeWidth={isHi ? 2 : st.width}
                        strokeDasharray={isHi ? undefined : (st.dash ?? undefined)}
                        markerEnd={`url(#${isHi ? 'arr-hi' : st.marker})`}
                      />
                      {/* Particle animation for requires edges */}
                      {e.type === 'requires' && !isDimmed && (
                        <circle r={1.5} fill={isHi ? 'rgba(200,196,188,0.6)' : (st.color)} opacity={0.6}>
                          <animateMotion
                            dur={`${4 - trl * 0.3}s`}
                            repeatCount="indefinite"
                            path={path}
                          />
                        </circle>
                      )}
                    </g>
                  );
                })}
              </g>

              {/* ── NODES ── */}
              <g>
                {visibleNodes.map((c) => {
                  const isMilestone = c.type === 'milestone';
                  const nc = isMilestone
                    ? (c.confirmed ? '#c8a84a' : '#48443e') // gold = confirmed, dim = hypothetical
                    : (TRL_COLOR[c.trl ?? 0] || '#3a4a6a');
                  const r = c.nodeR;
                  const isSelected = activeId === c.id;
                  const isDimmed = activeId ? !relNodes.has(c.id) : false;
                  const chColor = CHAPTER_COLOR[c.chapter] || '#7a7268';

                  // Setup labels
                  const words = c.name.split(' ');
                  const mid = Math.ceil(words.length / 2);
                  const l1 = words.slice(0, mid).join(' ');
                  const l2 = words.slice(mid).join(' ');
                  const fs = r >= 36 ? 11 : 10;

                  // Node shape
                  let shapeEl: React.ReactNode;
                  if (c.type === 'milestone') {
                    // hexagon: equalize area to circle (R * 1.1)
                    const rh = r * 1.1;
                    const pts = Array.from({ length: 6 }, (_, i) => {
                      const angle = (Math.PI / 3) * i - Math.PI / 6;
                      return `${rh * Math.cos(angle)},${rh * Math.sin(angle)}`;
                    }).join(' ');
                    shapeEl = (
                      <polygon
                        className="main"
                        points={pts}
                        fill="#0c0c0c"
                        stroke={nc}
                        strokeWidth="1.5"
                      />
                    );
                  } else if (c.type === 'actor') {
                    // square: equalize area to circle (half-side = r * 0.886)
                    const hs = r * 0.886;
                    shapeEl = (
                      <rect
                        className="main"
                        x={-hs} y={-hs} width={hs * 2} height={hs * 2}
                        fill="#0c0c0c"
                        stroke={nc}
                        strokeWidth="1.5"
                      />
                    );
                  } else {
                    shapeEl = (
                      <circle
                        className="main"
                        r={r}
                        fill="#0c0c0c"
                        stroke={nc}
                        strokeWidth="1.5"
                      />
                    );
                  }

                  // LOD fade label (threshold 0.55 zooming)
                  const isLodLevel = gTx.s < 0.55;

                  return (
                    <g
                      key={c.id}
                      className={`g-node${isSelected ? ' selected' : ''}${isDimmed ? ' dimmed' : ''}${searchMatches && searchMatches.has(c.id) ? ' search-match' : ''}${searchMatches && !searchMatches.has(c.id) ? ' search-dim' : ''}`}
                      transform={`translate(${c.gx},${c.gy})`}
                      style={{ '--nc': nc } as React.CSSProperties}
                      onMouseDown={(e) => handleNodeMouseDown(e, c)}
                      onClick={() => {
                        // Drag vs Click resolution — ignore if dragged
                        if (distDraggedRef.current > 5) return;
                        setActive(isSelected ? null : c.id);
                      }}
                      onMouseEnter={(e) => {
                        const chName = (clusters.find(cl => cl.id === c.chapter)?.label ?? c.chapter).toUpperCase();
                        const hzName = (c.horizon ?? 'near').toUpperCase();
                        let html = `<span class="tt-name">${c.name}</span>`;
                        if (isMilestone) {
                          html += `<span class="tt-row">STATUS <span class="tt-val">${c.confirmed ? '✓ CONFIRMED' : '○ HYPOTHETICAL'}</span></span>`;
                        } else {
                          const trlLabel = TRL_LABELS[c.trl ?? 0] ?? '';
                          html += `<span class="tt-row">TRL <span class="tt-val">${c.trl ?? '?'}/9 — ${trlLabel}</span></span>`;
                        }
                        html += `<span class="tt-row">CHAPTER <span class="tt-val">${chName}</span></span>`;
                        html += `<span class="tt-row">HORIZON <span class="tt-val">${hzName}</span></span>`;
                        if (c.bottleneck) html += `<span class="tt-warn">⚠ BOTTLENECK — BLOCKS PROGRESS</span>`;
                        setTip({ text: html, x: e.clientX + 14, y: e.clientY - 30, visible: true, nodeId: c.id });
                      }}
                      onMouseMove={(e) => {
                        setTip(t => t.visible ? { ...t, x: e.clientX + 14, y: e.clientY - 30 } : t);
                      }}
                      onMouseLeave={() => setTip(t => ({ ...t, visible: false }))}
                    >
                      {/* Active Node Glow */}
                      {isSelected && (
                        <circle
                          className="active-glow"
                          r={r}
                          fill="none"
                          stroke={nc}
                          pointerEvents="none"
                        />
                      )}
                      
                      {/* Main shape */}
                      {shapeEl}
                      {/* Milestone confirmed ring */}
                      {isMilestone && c.confirmed && (
                        <circle
                          r={r + 4}
                          fill="none"
                          stroke="#c8a84a"
                          strokeWidth="2"
                          opacity="0.8"
                        />
                      )}
                      {/* Bottleneck badge */}
                      {c.bottleneck && (
                        <g transform={`translate(${r - 2},${-(r + 2)})`}>
                          <rect
                            x="-3" y="-8" width="50" height="12" rx="1"
                            fill="#d4724a" opacity="0.9"
                          />
                          <text
                            x="22" y="1"
                            textAnchor="middle"
                            fontFamily="'JetBrains Mono', monospace"
                            fontSize="7" fontWeight="700" letterSpacing="0.1em"
                            fill="#080808"
                          >BOTTLENECK</text>
                        </g>
                      )}
                      {/* Labels */}
                      {showLabels && (
                        <>
                          {l2 ? (
                            <>
                              <text className={`g-label ${isLodLevel ? 'lod-hide' : ''}`} y={-4} fontSize={fs}>{l1}</text>
                              <text className={`g-label ${isLodLevel ? 'lod-hide' : ''}`} y={7} fontSize={fs}>{l2}</text>
                            </>
                          ) : (
                            <text className={`g-label ${isLodLevel ? 'lod-hide' : ''}`} y={3} fontSize={fs}>{l1}</text>
                          )}
                          <text className={`g-sub-label ${isLodLevel ? 'lod-hide' : ''}`} y={r + 20} fontSize={8}>
                            {isMilestone
                              ? (c.confirmed ? '✓ CONFIRMED' : '○ HYPOTHETICAL')
                              : `TRL ${c.trl ?? '?'} · ${(TRL_LABELS[c.trl ?? 0] ?? '').toUpperCase()}`
                            }
                          </text>
                        </>
                      )}
                    </g>
                  );
                })}
              </g>
            </g>
          </svg>
        </div>
      </div>

      {/* ══ FIXED HORIZON LABELS ══ */}
      <div className="cs-horizon-labels" style={{
        position: 'fixed', top: '42px', left: 0, right: 0,
        height: '28px', zIndex: 90,
        display: 'flex', pointerEvents: 'none',
        borderBottom: '1px solid var(--rule)',
        background: 'rgba(8,8,8,0.85)',
      }}>
        {[
          { label: 'NEAR', sub: '≤15 yr', x0: 0, x1: 0.33 },
          { label: 'FAR', sub: 'breakthrough', x0: 0.33, x1: 0.66 },
          { label: 'OPEN', sub: 'unknown', x0: 0.66, x1: 1.0 },
        ].map((band) => {
          const ZW = 2400;
          const leftPx = band.x0 * ZW * gTx.s + gTx.x;
          const rightPx = band.x1 * ZW * gTx.s + gTx.x;
          const widthPx = rightPx - leftPx;
          return (
            <div key={band.label} style={{
              position: 'absolute',
              left: `${leftPx}px`,
              width: `${widthPx}px`,
              height: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '8px',
              borderRight: '1px solid var(--rule)',
              overflow: 'hidden',
            }}>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '9px', fontWeight: 700,
                letterSpacing: '0.25em',
                color: 'var(--ink-mid)',
              }}>{band.label}</span>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '7px',
                letterSpacing: '0.06em',
                color: 'var(--ink-ghost)',
              }}>{band.sub}</span>
            </div>
          );
        })}
      </div>

      {/* ══ PANEL ══ */}
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

      {/* ══ NARRATIVE DRAWER ══ */}
      <div className={`cs-nar-drawer${narOpen ? ' open' : ''}`}>
        <div className="cs-nar-handle">
          <div className="nar-handle-label">
            ☰ Narrative — <span>{meta.description}</span>
          </div>
          <button className="nar-handle-close" onClick={() => setNarOpen(false)}>×</button>
        </div>
        <div className="cs-nar-body">
          <div className="nar-intro">
            <div className="nar-intro-title">
              What we need<br /><em>to survive and grow</em>
            </div>
            <p className="nar-intro-text">
              This is not a roadmap — roadmaps have dates, and dates lie. This is an argument about
              dependencies: what must exist before other things can exist, what is already here,
              what is missing. Two questions: what could end us, and what opens the next order of magnitude.
              TRL 0–9 replaces timelines. Node size reflects how much depends on it.
            </p>
          </div>

          {clusters.map(ch => {
            const chNodes = nodes.filter(n => n.chapter === ch.id);
            if (chNodes.length === 0) return null;
            return (
              <div key={ch.id} className="nar-section">
                <div className="nar-section-label" style={{ color: ch.color }}>
                  <div className="nar-section-dot" style={{ background: ch.color }} />
                  {ch.label} — {ch.description}
                </div>
                {chNodes.map(c => {
                  const isMilestone = c.type === 'milestone';
                  const nc = isMilestone
                    ? (c.confirmed ? '#c8a84a' : '#48443e')
                    : TRL_COLOR[c.trl ?? 0];
                  const isActive = activeId === c.id;
                  return (
                    <div
                      key={c.id}
                      id={`nc-${c.id}`}
                      className={`nar-card ${c.chapter}-card${isActive ? ' active' : ''}`}
                      onClick={() => setActive(isActive ? null : c.id)}
                    >
                      <div className="nar-card-row">
                        <div>
                          <div className="nar-card-name">{c.name}</div>
                          <div className="nar-card-sub">{c.sub}</div>
                        </div>
                        <div className="nar-card-badges">
                          <span className="badge" style={{ borderColor: nc, color: nc }}>
                            {isMilestone
                              ? (c.confirmed ? '✓' : '○')
                              : `TRL ${c.trl ?? '?'}`
                            }
                          </span>
                          {c.bottleneck && <span className="badge badge-bn">BN</span>}
                        </div>
                      </div>
                      <div className="nar-take">{c.voice?.take}</div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* ══ REV STAMP ══ */}
      <div style={{
        position: 'fixed', bottom: narOpen ? 'calc(48vh + 12px)' : '12px',
        right: '12px', zIndex: 100,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '7px', letterSpacing: '0.12em',
        color: 'var(--ink-ghost)', textAlign: 'right',
        lineHeight: '1.6',
        transition: 'bottom 0.4s cubic-bezier(0.4,0,0.2,1)',
      }}>
        REV {meta.version} · {meta.updated}<br />
        {nodes.length} NODES · {edges.length} EDGES<br />
        BY {meta.author.toUpperCase()}
      </div>

      {/* ══ BOTTOM CONTROLS ══ */}
      <div className={`cs-graph-controls${narOpen ? ' raised' : ''}`}>
        <button className="gc-btn" onClick={() => setGTx(prev => ({ ...prev, s: prev.s * 1.2 }))}>+</button>
        <button className="gc-btn" onClick={fitGraph}>⊡</button>
        <button className="gc-btn" onClick={() => setGTx(prev => ({ ...prev, s: prev.s * 0.8 }))}>−</button>
      </div>

      {/* ══ MINIMAP ══ */}
      <div className={`cs-minimap${narOpen ? ' raised' : ''}`}>
        <svg viewBox={`${mmBounds.minX} ${mmBounds.minY} ${mmBounds.maxX - mmBounds.minX} ${mmBounds.maxY - mmBounds.minY}`}>
          {/* Cluster regions */}
          {clusterHulls.map(ch => ch.visible && (
            <path
              key={ch.id}
              d={ch.path}
              fill={ch.color}
              fillOpacity={0.06}
              stroke="none"
            />
          ))}
          {/* Edges */}
          {visibleEdges.map(e => {
            const from = capMap[e.from], to = capMap[e.to];
            if (!from || !to) return null;
            return (
              <line
                key={e.id}
                x1={from.gx} y1={from.gy}
                x2={to.gx} y2={to.gy}
                stroke="var(--rule-hi)" strokeWidth={1}
              />
            );
          })}
          {/* Nodes */}
          {visibleNodes.map(n => (
            <circle
              key={n.id}
              cx={n.gx} cy={n.gy}
              r={n.nodeR * 0.5}
              fill={TRL_COLOR[n.trl ?? 0]}
              opacity={activeId === n.id ? 1 : 0.5}
              stroke={activeId === n.id ? 'var(--ink-bright)' : 'none'}
              strokeWidth={2}
              style={{ cursor: 'pointer' }}
              onClick={() => setActive(n.id)}
            />
          ))}
          {/* Viewport indicator */}
          {wrapRef.current && (() => {
            const W = wrapRef.current!.clientWidth;
            const H = wrapRef.current!.clientHeight;
            const vx = -gTx.x / gTx.s;
            const vy = -gTx.y / gTx.s;
            const vw = W / gTx.s;
            const vh = H / gTx.s;
            return (
              <rect
                className="cs-minimap-viewport"
                x={vx} y={vy}
                width={vw} height={vh}
                rx={4}
              />
            );
          })()}
        </svg>
      </div>

      {/* ══ LEGEND ══ */}
      <div className={`cs-legend${activeNode || changelogOpen ? ' panel-open' : ''}${narOpen ? ' raised' : ''}`}>
        <div className="leg-title">Legend</div>
        <div className="leg-row">
          <div className="leg-col">
            <div className="leg-item"><div className="leg-dot" style={{ background: '#3a5a7a' }} />TRL 0–3 · Concept</div>
            <div className="leg-item"><div className="leg-dot" style={{ background: '#7a8a3a' }} />TRL 4–6 · Demo</div>
            <div className="leg-item"><div className="leg-dot" style={{ background: '#8ab46a' }} />TRL 7–9 · Proven</div>
          </div>
          <div className="leg-col">
            <div className="leg-item"><div className="leg-line" style={{ background: '#222', border: '1px dashed #444', height: 0, borderWidth: '1px 0' }} />Weak link</div>
            <div className="leg-item"><div className="leg-line" style={{ background: '#7a8a3a' }} />Maturing link</div>
            <div className="leg-item"><div className="leg-line" style={{ background: '#8ab46a', height: 3 }} />Strong link</div>
          </div>
          <div className="leg-col">
            <div className="leg-item"><div className="leg-dot" style={{ background: '#d4724a' }} />Survive</div>
            <div className="leg-item"><div className="leg-dot" style={{ background: '#4a8cd4' }} />Expand</div>
            <div className="leg-item"><div className="leg-dot" style={{ background: '#6ab07a' }} />Connect</div>
          </div>
        </div>
      </div>



      {/* ══ CHANGELOG PANEL ══ */}
      <div className={`cs-changelog${changelogOpen ? ' open' : ''}`}>
        <div className="cs-changelog-header">
          <span className="cs-changelog-title">Changelog</span>
          <button className="p-close" onClick={() => setChangelogOpen(false)}>×</button>
        </div>
        <div className="cs-changelog-scroll">
          {changelog.map((entry, i) => (
            <div key={i} className="cs-cl-entry">
              <div className="cs-cl-date">{entry.date}</div>
              <span className="cs-cl-type">{entry.type.replace('_', ' ')}</span>
              <div className="cs-cl-note">{entry.note}</div>
              {entry.node && (
                <button
                  className="cs-filter-pill"
                  style={{ width: 'fit-content', marginTop: '4px', cursor: 'pointer' }}
                  onClick={() => {
                    setActive(entry.node!);
                    setChangelogOpen(false);
                  }}
                >
                  → {capMap[entry.node]?.name || entry.node}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ══ TOOLTIP ══ */}
      <div
        className="cs-tooltip"
        style={{
          left: tip.x,
          top: tip.y,
          opacity: tip.visible ? 1 : 0,
        }}
        dangerouslySetInnerHTML={{ __html: tip.text }}
      />
    </>
  );
}
