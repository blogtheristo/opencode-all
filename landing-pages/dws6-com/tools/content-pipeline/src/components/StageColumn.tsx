import { useState, useCallback } from 'react';
import type { ContentItem, PipelineStageConfig, PipelineStage } from '../types';
import ContentCard from './ContentCard';

interface StageColumnProps {
  stage: PipelineStageConfig;
  items: ContentItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDrop: (id: string, stage: PipelineStage) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onAddNew: (stage: PipelineStage) => void;
}

export default function StageColumn({
  stage,
  items,
  selectedId,
  onSelect,
  onDrop,
  onDragStart,
  onAddNew,
}: StageColumnProps) {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const itemId = e.dataTransfer.getData('text/plain');
      if (itemId) {
        onDrop(itemId, stage.id);
      }
    },
    [onDrop, stage.id]
  );

  return (
    <div className="pipeline-column">
      {/* Column header */}
      <div className={`flex items-center justify-between mb-3 px-1`}>
        <div className="flex items-center gap-2">
          <span className="text-base">{stage.icon}</span>
          <h3 className={`text-sm font-semibold ${stage.color}`}>{stage.label}</h3>
          <span className="text-xs text-gray-500 bg-gray-800 rounded-full px-1.5 py-0.5">
            {items.length}
          </span>
        </div>
        <button
          onClick={() => onAddNew(stage.id)}
          className="text-gray-500 hover:text-gray-300 text-lg leading-none transition-colors"
          title={`Add new item to ${stage.label}`}
        >
          +
        </button>
      </div>

      {/* Drop zone */}
      <div
        className={`flex-1 space-y-2 p-1 rounded-lg min-h-[200px] transition-all duration-150 ${
          dragOver ? 'drag-over' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {items.map((item) => (
          <ContentCard
            key={item.id}
            item={item}
            selected={item.id === selectedId}
            onSelect={onSelect}
            onDragStart={onDragStart}
          />
        ))}

        {items.length === 0 && (
          <div
            className={`border-2 border-dashed rounded-lg p-4 text-center ${stage.borderColor}`}
          >
            <p className="text-xs text-gray-600">
              Drag items here or click + to add
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
