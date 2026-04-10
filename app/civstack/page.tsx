import './civstack.css';
import CivStackClient from './CivStackMap';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Civilization Stack',
  description: 'What we need to survive and grow — interactive dependency map',
};

export default function CivStackPage() {
  return (
    <div className="civstack-root">
      <CivStackClient />

      {/* Mobile wall */}
      <div className="cs-mobile-wall">
        <div style={{ fontSize: '32px', color: '#d4724a', marginBottom: '8px' }}>⚠</div>
        <h2 style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: '24px',
          color: '#ece8e0',
          fontWeight: 400,
        }}>
          Desktop required
        </h2>
        <p>
          The Civilization Stack is a dense interactive graph.
          Use a monitor or tablet in landscape mode.
        </p>
      </div>
    </div>
  );
}
