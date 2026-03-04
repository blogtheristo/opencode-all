import { useState, useCallback } from 'react';
import type { PipelineStage, ContentType } from './types';
import { CONTENT_TYPES, STAGES } from './types';
import { usePipeline } from './hooks/usePipeline';
import { exportPipeline, importPipeline } from './store';
import PipelineBoard from './components/PipelineBoard';
import ContentEditor from './components/ContentEditor';

type ViewMode = 'board' | 'list';

function App() {
  const {
    items,
    selectedItem,
    selectedId,
    setSelectedId,
    createItem,
    updateItem,
    deleteItem,
    moveItem,
  } = usePipeline();

  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<ContentType>('blog');
  const [newStage, setNewStage] = useState<PipelineStage>('idea');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStage, setFilterStage] = useState<PipelineStage | 'all'>('all');

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.idea.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStage = filterStage === 'all' || item.stage === filterStage;
    return matchesSearch && matchesStage;
  });

  const handleAddNew = useCallback(
    (stage: PipelineStage) => {
      setNewStage(stage);
      setNewTitle('');
      setNewType('blog');
      setShowNewDialog(true);
    },
    []
  );

  const handleCreateItem = useCallback(() => {
    if (!newTitle.trim()) return;
    const item = createItem({
      title: newTitle.trim(),
      type: newType,
      stage: newStage,
    });
    setShowNewDialog(false);
    setSelectedId(item.id);
  }, [newTitle, newType, newStage, createItem, setSelectedId]);

  const handleDrop = useCallback(
    (id: string, stage: PipelineStage) => {
      moveItem(id, stage);
    },
    [moveItem]
  );

  const handleExport = useCallback(() => {
    const data = exportPipeline();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `content-pipeline-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (importPipeline(reader.result as string)) {
          window.location.reload();
        } else {
          alert('Invalid pipeline file');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, []);

  // Stats
  const totalItems = items.length;
  const stageStats = STAGES.map((s) => ({
    ...s,
    count: items.filter((i) => i.stage === s.id).length,
  }));

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-gray-100">Content Pipeline</h1>
          <span className="text-xs text-gray-500 bg-gray-800 rounded-full px-2 py-0.5">
            {totalItems} items
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input w-48 text-xs py-1.5"
            placeholder="Search content..."
          />

          {/* Stage filter (list mode) */}
          {viewMode === 'list' && (
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value as PipelineStage | 'all')}
              className="select text-xs py-1.5 w-auto"
            >
              <option value="all">All Stages</option>
              {STAGES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.icon} {s.label}
                </option>
              ))}
            </select>
          )}

          {/* View toggle */}
          <div className="flex bg-gray-800 rounded-md">
            <button
              onClick={() => setViewMode('board')}
              className={`px-2 py-1 text-xs rounded-l-md transition-colors ${
                viewMode === 'board' ? 'bg-gray-700 text-white' : 'text-gray-400'
              }`}
            >
              Board
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-2 py-1 text-xs rounded-r-md transition-colors ${
                viewMode === 'list' ? 'bg-gray-700 text-white' : 'text-gray-400'
              }`}
            >
              List
            </button>
          </div>

          {/* Actions */}
          <button onClick={() => handleAddNew('idea')} className="btn-primary text-xs">
            + New
          </button>
          <button onClick={handleExport} className="btn-ghost text-xs" title="Export pipeline">
            Export
          </button>
          <button onClick={handleImport} className="btn-ghost text-xs" title="Import pipeline">
            Import
          </button>
        </div>
      </header>

      {/* Stage summary bar */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-gray-800/50 overflow-x-auto">
        {stageStats.map((s) => (
          <div
            key={s.id}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${s.bgColor} ${s.color}`}
          >
            <span>{s.icon}</span>
            <span className="font-medium">{s.count}</span>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 flex min-h-0">
        {/* Board or List */}
        <div className={`flex-1 min-w-0 ${selectedItem ? 'hidden lg:flex lg:flex-col' : 'flex flex-col'}`}>
          {viewMode === 'board' ? (
            <div className="flex-1 overflow-x-auto overflow-y-auto pt-4">
              <PipelineBoard
                items={filteredItems}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onDrop={handleDrop}
                onAddNew={handleAddNew}
              />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500 border-b border-gray-800">
                    <th className="pb-2 pl-2">Title</th>
                    <th className="pb-2">Type</th>
                    <th className="pb-2">Stage</th>
                    <th className="pb-2">Priority</th>
                    <th className="pb-2">Tags</th>
                    <th className="pb-2">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => {
                    const stage = STAGES.find((s) => s.id === item.stage);
                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedId(item.id)}
                        className={`border-b border-gray-800/50 cursor-pointer hover:bg-gray-800/50 ${
                          item.id === selectedId ? 'bg-gray-800' : ''
                        }`}
                      >
                        <td className="py-2 pl-2 font-medium">{item.title}</td>
                        <td className="py-2 text-xs text-gray-400">{item.type}</td>
                        <td className="py-2">
                          <span className={`text-xs ${stage?.color}`}>
                            {stage?.icon} {stage?.label}
                          </span>
                        </td>
                        <td className="py-2">
                          <span
                            className={`text-xs capitalize ${
                              item.priority === 'urgent'
                                ? 'text-red-400'
                                : item.priority === 'high'
                                ? 'text-amber-400'
                                : 'text-gray-400'
                            }`}
                          >
                            {item.priority}
                          </span>
                        </td>
                        <td className="py-2">
                          <div className="flex gap-1">
                            {item.tags.slice(0, 2).map((t) => (
                              <span key={t} className="tag-chip text-[10px]">
                                {t}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-2 text-xs text-gray-500">
                          {new Date(item.updatedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                  {filteredItems.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-gray-600">
                        No content items found. Click "+ New" to create one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Editor panel */}
        {selectedItem && (
          <div className="w-full lg:w-[500px] xl:w-[600px] flex-shrink-0 border-l border-gray-800">
            <ContentEditor
              key={selectedItem.id}
              item={selectedItem}
              onUpdate={updateItem}
              onDelete={(id) => {
                deleteItem(id);
                setSelectedId(null);
              }}
              onClose={() => setSelectedId(null)}
            />
          </div>
        )}
      </div>

      {/* New item dialog */}
      {showNewDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-lg font-semibold mb-4">New Content</h2>

            <div className="space-y-4">
              <div>
                <label className="label">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateItem()}
                  className="input"
                  placeholder="What are you creating?"
                  autoFocus
                />
              </div>

              <div>
                <label className="label">Content Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as ContentType)}
                  className="select"
                >
                  {CONTENT_TYPES.map((ct) => (
                    <option key={ct.value} value={ct.value}>
                      {ct.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Starting Stage</label>
                <select
                  value={newStage}
                  onChange={(e) => setNewStage(e.target.value as PipelineStage)}
                  className="select"
                >
                  {STAGES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.icon} {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowNewDialog(false)} className="btn-secondary">
                Cancel
              </button>
              <button
                onClick={handleCreateItem}
                className="btn-primary"
                disabled={!newTitle.trim()}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
