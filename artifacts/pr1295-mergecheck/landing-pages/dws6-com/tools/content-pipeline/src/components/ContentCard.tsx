import type { ContentItem } from '../types';

const PRIORITY_DOT: Record<string, string> = {
  low: 'bg-gray-500',
  medium: 'bg-blue-500',
  high: 'bg-amber-500',
  urgent: 'bg-red-500',
};

const TYPE_BADGE: Record<string, string> = {
  blog: 'bg-blue-500/20 text-blue-300',
  social: 'bg-pink-500/20 text-pink-300',
  video: 'bg-red-500/20 text-red-300',
  email: 'bg-green-500/20 text-green-300',
  newsletter: 'bg-teal-500/20 text-teal-300',
  whitepaper: 'bg-purple-500/20 text-purple-300',
  presentation: 'bg-amber-500/20 text-amber-300',
  podcast: 'bg-orange-500/20 text-orange-300',
  'case-study': 'bg-cyan-500/20 text-cyan-300',
};

interface ContentCardProps {
  item: ContentItem;
  selected: boolean;
  onSelect: (id: string) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
}

export default function ContentCard({ item, selected, onSelect, onDragStart }: ContentCardProps) {
  const mediaCount = item.media.length;
  const hasScript = item.script.length > 0;
  const researchCount = item.researchNotes.length;
  const reviewCount = item.reviewNotes.length;

  return (
    <div
      className={`content-card ${selected ? 'selected' : ''}`}
      draggable
      onDragStart={(e) => onDragStart(e, item.id)}
      onClick={() => onSelect(item.id)}
    >
      {/* Header: priority dot + type badge */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${PRIORITY_DOT[item.priority]}`} />
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${TYPE_BADGE[item.type]}`}>
            {item.type}
          </span>
        </div>
        {item.assignee && (
          <span className="text-[10px] text-gray-500 truncate max-w-[80px]">{item.assignee}</span>
        )}
      </div>

      {/* Title */}
      <h4 className="text-sm font-medium text-gray-100 mb-1 line-clamp-2">{item.title}</h4>

      {/* Idea preview */}
      {item.idea && (
        <p className="text-xs text-gray-500 mb-2 line-clamp-2">{item.idea}</p>
      )}

      {/* Tags */}
      {item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {item.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="tag-chip text-[10px]">
              {tag}
            </span>
          ))}
          {item.tags.length > 3 && (
            <span className="tag-chip text-[10px]">+{item.tags.length - 3}</span>
          )}
        </div>
      )}

      {/* Status indicators */}
      <div className="flex items-center gap-3 text-[10px] text-gray-500">
        {researchCount > 0 && <span>🔍 {researchCount}</span>}
        {hasScript && <span>✏️ draft</span>}
        {mediaCount > 0 && <span>🖼️ {mediaCount}</span>}
        {reviewCount > 0 && <span>💬 {reviewCount}</span>}
        {item.platforms.length > 0 && <span>📢 {item.platforms.length}</span>}
      </div>
    </div>
  );
}
