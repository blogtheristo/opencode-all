import { useCallback } from 'react';
import type { ContentItem, PipelineStage } from '../types';
import { STAGES } from '../types';
import StageColumn from './StageColumn';

interface PipelineBoardProps {
  items: ContentItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDrop: (id: string, stage: PipelineStage) => void;
  onAddNew: (stage: PipelineStage) => void;
}

export default function PipelineBoard({
  items,
  selectedId,
  onSelect,
  onDrop,
  onAddNew,
}: PipelineBoardProps) {
  const handleDragStart = useCallback((e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 px-4 flex-1 min-h-0">
      {STAGES.map((stage) => {
        const stageItems = items.filter((i) => i.stage === stage.id);
        return (
          <StageColumn
            key={stage.id}
            stage={stage}
            items={stageItems}
            selectedId={selectedId}
            onSelect={onSelect}
            onDrop={onDrop}
            onDragStart={handleDragStart}
            onAddNew={onAddNew}
          />
        );
      })}
    </div>
  );
}
