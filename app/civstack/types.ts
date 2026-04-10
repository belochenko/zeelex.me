import * as d3Force from 'd3-force';

export interface NodeData extends d3Force.SimulationNodeDatum {
  id: string;
  type: string;
  name: string;
  sub?: string;
  chapter: string;
  tags?: string[];
  trl?: number;
  confirmed?: boolean;
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
  gravity: number;
  nodeR: number;
  gx: number;
  gy: number;
  fx?: number | null;
  fy?: number | null;
}

export interface EdgeData {
  id: string;
  from: string;
  to: string;
  type: string;
  strength?: string;
  rationale?: string;
  severity?: string;
}

export interface ChangelogEntry {
  date: string;
  type: string;
  node?: string;
  note: string;
  trl_from?: number;
  trl_to?: number;
}
