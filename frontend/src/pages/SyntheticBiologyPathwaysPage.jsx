import { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import AppShell from '../components/AppShell.jsx';
import SyntheticBiologyNav from '../components/SyntheticBiologyNav.jsx';

export default function SyntheticBiologyPathwaysPage() {
  const nodes = useMemo(
    () => [
      { id: '1', position: { x: 20, y: 80 }, data: { label: 'Glucose' }, style: greenNode },
      { id: '2', position: { x: 180, y: 80 }, data: { label: 'Pyruvate' }, style: greenNode },
      { id: '3', position: { x: 340, y: 80 }, data: { label: 'Acetyl-CoA' }, style: greenNode },
      { id: '4', position: { x: 500, y: 80 }, data: { label: 'Mevalonate' }, style: greenNode },
      { id: '5', position: { x: 660, y: 80 }, data: { label: 'SAF precursor' }, style: greenNode },
      { id: '6', position: { x: 340, y: 200 }, data: { label: 'Bottleneck: PDC' }, style: bottleneckNode },
    ],
    []
  );
  const edges = useMemo(
    () => [
      { id: 'e1-2', source: '1', target: '2', animated: true, label: 'glycolysis' },
      { id: 'e2-3', source: '2', target: '3', animated: true, label: 'decarboxylation' },
      { id: 'e3-4', source: '3', target: '4', animated: true, label: 'MVA module' },
      { id: 'e4-5', source: '4', target: '5', animated: true, label: 'terminal conversion' },
      { id: 'e2-6', source: '2', target: '6', animated: true, label: 'flux loss', style: { stroke: '#f97316' } },
    ],
    []
  );

  return (
    <AppShell title="Synthetic Biology · Pathways">
      <div className="space-y-4">
        <SyntheticBiologyNav />
        <div className="rounded-xl border border-emerald-100 bg-white p-4 h-[520px]">
          <ReactFlow nodes={nodes} edges={edges} fitView>
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
        </div>
      </div>
    </AppShell>
  );
}

const greenNode = {
  border: '1px solid #86efac',
  borderRadius: 10,
  background: '#ecfdf5',
  fontSize: 11,
  padding: 6,
};

const bottleneckNode = {
  border: '1px solid #fdba74',
  borderRadius: 10,
  background: '#fff7ed',
  fontSize: 11,
  padding: 6,
};
