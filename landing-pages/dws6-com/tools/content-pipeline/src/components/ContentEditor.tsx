import { useState, useCallback, useRef } from 'react';
import type { ContentItem, PipelineStage, ContentType, Priority, ReviewNote } from '../types';
import { STAGES, CONTENT_TYPES, PLATFORMS } from '../types';
import * as store from '../store';
import MediaUploader from './MediaUploader';

type Tab = 'idea' | 'research' | 'outline' | 'script' | 'media' | 'review' | 'settings';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'idea', label: 'Idea', icon: '💡' },
  { id: 'research', label: 'Research', icon: '🔍' },
  { id: 'outline', label: 'Outline', icon: '📋' },
  { id: 'script', label: 'Script', icon: '✏️' },
  { id: 'media', label: 'Media', icon: '🖼️' },
  { id: 'review', label: 'Review', icon: '👀' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

interface ContentEditorProps {
  item: ContentItem;
  onUpdate: (id: string, updates: Partial<ContentItem>) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export default function ContentEditor({ item, onUpdate, onDelete, onClose }: ContentEditorProps) {
  const [activeTab, setActiveTab] = useState<Tab>('idea');
  const [newTag, setNewTag] = useState('');
  const [newResearch, setNewResearch] = useState('');
  const [newResearchSource, setNewResearchSource] = useState('');
  const [newReviewContent, setNewReviewContent] = useState('');
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewStatus, setNewReviewStatus] = useState<ReviewNote['status']>('comment');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const scriptRef = useRef<HTMLTextAreaElement>(null);

  const update = useCallback(
    (updates: Partial<ContentItem>) => {
      onUpdate(item.id, updates);
    },
    [item.id, onUpdate]
  );

  const addTag = useCallback(() => {
    const tag = newTag.trim();
    if (tag && !item.tags.includes(tag)) {
      update({ tags: [...item.tags, tag] });
      setNewTag('');
    }
  }, [newTag, item.tags, update]);

  const removeTag = useCallback(
    (tag: string) => {
      update({ tags: item.tags.filter((t) => t !== tag) });
    },
    [item.tags, update]
  );

  const togglePlatform = useCallback(
    (platform: string) => {
      const platforms = item.platforms.includes(platform)
        ? item.platforms.filter((p) => p !== platform)
        : [...item.platforms, platform];
      update({ platforms });
    },
    [item.platforms, update]
  );

  const addResearchNote = useCallback(() => {
    if (!newResearch.trim()) return;
    store.addResearchNote(item.id, newResearch.trim(), newResearchSource.trim() || undefined);
    onUpdate(item.id, {}); // trigger refresh
    setNewResearch('');
    setNewResearchSource('');
  }, [item.id, newResearch, newResearchSource, onUpdate]);

  const addReviewNote = useCallback(() => {
    if (!newReviewContent.trim()) return;
    store.addReviewNote(item.id, newReviewContent.trim(), newReviewAuthor.trim() || 'Anonymous', newReviewStatus);
    onUpdate(item.id, {}); // trigger refresh
    setNewReviewContent('');
    setNewReviewAuthor('');
  }, [item.id, newReviewContent, newReviewAuthor, newReviewStatus, onUpdate]);

  const handleMediaAdd = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        store.addMedia(item.id, {
          name: file.name,
          dataUrl: reader.result as string,
          mimeType: file.type,
          size: file.size,
        });
        onUpdate(item.id, {}); // trigger refresh
      };
      reader.readAsDataURL(file);
    },
    [item.id, onUpdate]
  );

  const handleMediaRemove = useCallback(
    (mediaId: string) => {
      store.removeMedia(item.id, mediaId);
      onUpdate(item.id, {}); // trigger refresh
    },
    [item.id, onUpdate]
  );

  const wordCount = item.script.split(/\s+/).filter(Boolean).length;
  const charCount = item.script.length;

  return (
    <div className="flex flex-col h-full bg-gray-900 border-l border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button onClick={onClose} className="btn-ghost px-2 py-1 text-lg">
            &larr;
          </button>
          <input
            type="text"
            value={item.title}
            onChange={(e) => update({ title: e.target.value })}
            className="flex-1 bg-transparent text-lg font-semibold text-gray-100
                       border-none outline-none placeholder-gray-600"
            placeholder="Content title..."
          />
        </div>

        {/* Stage selector */}
        <div className="flex items-center gap-2 ml-4">
          <select
            value={item.stage}
            onChange={(e) => update({ stage: e.target.value as PipelineStage })}
            className="select text-xs py-1"
          >
            {STAGES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.icon} {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-gray-800 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={activeTab === tab.id ? 'tab-active' : 'tab-inactive'}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* IDEA TAB */}
        {activeTab === 'idea' && (
          <div className="space-y-4">
            <div>
              <label className="label">Content Type</label>
              <select
                value={item.type}
                onChange={(e) => update({ type: e.target.value as ContentType })}
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
              <label className="label">Priority</label>
              <div className="flex gap-2">
                {(['low', 'medium', 'high', 'urgent'] as Priority[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => update({ priority: p })}
                    className={`btn text-xs capitalize ${
                      item.priority === p ? 'btn-primary' : 'btn-secondary'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Idea / Description</label>
              <textarea
                value={item.idea}
                onChange={(e) => update({ idea: e.target.value })}
                className="editor-textarea min-h-[200px]"
                placeholder="What's the idea? What problem does this content solve? Who's the target audience?"
              />
            </div>

            <div>
              <label className="label">Tags</label>
              <div className="flex flex-wrap gap-1 mb-2">
                {item.tags.map((tag) => (
                  <span key={tag} className="tag-chip group">
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-gray-500 hover:text-red-400"
                    >
                      x
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTag()}
                  className="input flex-1"
                  placeholder="Add tag..."
                />
                <button onClick={addTag} className="btn-secondary">
                  Add
                </button>
              </div>
            </div>

            <div>
              <label className="label">Target Platforms</label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((platform) => (
                  <button
                    key={platform}
                    onClick={() => togglePlatform(platform)}
                    className={`btn text-xs ${
                      item.platforms.includes(platform) ? 'btn-primary' : 'btn-secondary'
                    }`}
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* RESEARCH TAB */}
        {activeTab === 'research' && (
          <div className="space-y-4">
            <div className="space-y-3">
              {item.researchNotes.map((note) => (
                <div
                  key={note.id}
                  className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3"
                >
                  <p className="text-sm text-gray-200 whitespace-pre-wrap">{note.content}</p>
                  {note.source && (
                    <p className="text-xs text-blue-400 mt-2 break-all">
                      Source: {note.source}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-gray-600">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => {
                        store.removeResearchNote(item.id, note.id);
                        onUpdate(item.id, {});
                      }}
                      className="text-xs text-red-400/60 hover:text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              {item.researchNotes.length === 0 && (
                <p className="text-sm text-gray-600 text-center py-8">
                  No research notes yet. Add links, quotes, and references below.
                </p>
              )}
            </div>

            <div className="border-t border-gray-800 pt-4 space-y-3">
              <textarea
                value={newResearch}
                onChange={(e) => setNewResearch(e.target.value)}
                className="editor-textarea min-h-[100px]"
                placeholder="Add a research note, quote, data point..."
              />
              <input
                type="text"
                value={newResearchSource}
                onChange={(e) => setNewResearchSource(e.target.value)}
                className="input"
                placeholder="Source URL or reference (optional)"
              />
              <button onClick={addResearchNote} className="btn-primary" disabled={!newResearch.trim()}>
                Add Research Note
              </button>
            </div>
          </div>
        )}

        {/* OUTLINE TAB */}
        {activeTab === 'outline' && (
          <div className="space-y-4">
            <p className="text-xs text-gray-500">
              Structure your content with headings, bullet points, and key messages.
            </p>
            <textarea
              value={item.outline}
              onChange={(e) => update({ outline: e.target.value })}
              className="editor-textarea min-h-[400px]"
              placeholder={`# Main Heading\n\n## Section 1\n- Key point\n- Key point\n\n## Section 2\n- Key point\n\n## Call to Action\n- What should the reader do next?`}
            />
          </div>
        )}

        {/* SCRIPT / DRAFT TAB */}
        {activeTab === 'script' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">
                Write your full content, script, or draft here.
              </p>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>{wordCount} words</span>
                <span>{charCount} chars</span>
              </div>
            </div>
            <textarea
              ref={scriptRef}
              value={item.script}
              onChange={(e) => update({ script: e.target.value })}
              className="editor-textarea min-h-[500px] leading-7"
              placeholder="Start writing your content here...

You can write blog posts, video scripts, email copy, social media posts — anything.

For video scripts, try formatting like:

[INTRO]
Hook the viewer in the first 3 seconds...

[MAIN CONTENT]
Point 1: ...
Point 2: ...

[CTA]
Subscribe, follow, visit..."
            />
            {/* Quick formatting hints */}
            <div className="flex flex-wrap gap-2 text-[10px] text-gray-600">
              <span>Tip: Use markdown-style formatting</span>
              <span>|</span>
              <span># Heading</span>
              <span>|</span>
              <span>**bold**</span>
              <span>|</span>
              <span>- bullet</span>
              <span>|</span>
              <span>[SECTION] for scripts</span>
            </div>
          </div>
        )}

        {/* MEDIA TAB */}
        {activeTab === 'media' && (
          <MediaUploader
            media={item.media}
            onAdd={handleMediaAdd}
            onRemove={handleMediaRemove}
          />
        )}

        {/* REVIEW TAB */}
        {activeTab === 'review' && (
          <div className="space-y-4">
            <div className="space-y-3">
              {item.reviewNotes.map((note) => (
                <div
                  key={note.id}
                  className={`border rounded-lg p-3 ${
                    note.status === 'approved'
                      ? 'bg-green-500/10 border-green-500/30'
                      : note.status === 'revision-needed'
                      ? 'bg-amber-500/10 border-amber-500/30'
                      : 'bg-gray-800/50 border-gray-700/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-300">{note.author}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                        note.status === 'approved'
                          ? 'bg-green-500/20 text-green-400'
                          : note.status === 'revision-needed'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-gray-700 text-gray-400'
                      }`}
                    >
                      {note.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-200 whitespace-pre-wrap">{note.content}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-gray-600">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => {
                        store.removeReviewNote(item.id, note.id);
                        onUpdate(item.id, {});
                      }}
                      className="text-xs text-red-400/60 hover:text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              {item.reviewNotes.length === 0 && (
                <p className="text-sm text-gray-600 text-center py-8">
                  No review feedback yet. Add notes, revision requests, or approvals below.
                </p>
              )}
            </div>

            <div className="border-t border-gray-800 pt-4 space-y-3">
              <textarea
                value={newReviewContent}
                onChange={(e) => setNewReviewContent(e.target.value)}
                className="editor-textarea min-h-[80px]"
                placeholder="Add review feedback..."
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  className="input flex-1"
                  placeholder="Reviewer name"
                />
                <select
                  value={newReviewStatus}
                  onChange={(e) => setNewReviewStatus(e.target.value as ReviewNote['status'])}
                  className="select w-auto"
                >
                  <option value="comment">Comment</option>
                  <option value="revision-needed">Revision Needed</option>
                  <option value="approved">Approved</option>
                </select>
              </div>
              <button
                onClick={addReviewNote}
                className="btn-primary"
                disabled={!newReviewContent.trim()}
              >
                Add Review Note
              </button>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            <div>
              <label className="label">Assignee</label>
              <input
                type="text"
                value={item.assignee}
                onChange={(e) => update({ assignee: e.target.value })}
                className="input"
                placeholder="Who's working on this?"
              />
            </div>

            <div>
              <label className="label">Scheduled Date</label>
              <input
                type="date"
                value={item.scheduledDate}
                onChange={(e) => update({ scheduledDate: e.target.value })}
                className="input"
              />
            </div>

            {item.stage === 'published' && (
              <>
                <div>
                  <label className="label">Published Date</label>
                  <input
                    type="date"
                    value={item.publishedDate}
                    onChange={(e) => update({ publishedDate: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Published URL</label>
                  <input
                    type="url"
                    value={item.publishedUrl}
                    onChange={(e) => update({ publishedUrl: e.target.value })}
                    className="input"
                    placeholder="https://..."
                  />
                </div>
              </>
            )}

            <div>
              <label className="label">Created</label>
              <p className="text-sm text-gray-400">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>

            <div>
              <label className="label">Last Updated</label>
              <p className="text-sm text-gray-400">
                {new Date(item.updatedAt).toLocaleString()}
              </p>
            </div>

            <div className="border-t border-gray-800 pt-4">
              {!confirmDelete ? (
                <button onClick={() => setConfirmDelete(true)} className="btn-danger">
                  Delete Content
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-red-400">Are you sure?</span>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="btn bg-red-600 text-white hover:bg-red-500"
                  >
                    Yes, Delete
                  </button>
                  <button onClick={() => setConfirmDelete(false)} className="btn-secondary">
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer: stage navigation */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-800">
        {(() => {
          const stageIndex = STAGES.findIndex((s) => s.id === item.stage);
          const prev = stageIndex > 0 ? STAGES[stageIndex - 1] : null;
          const next = stageIndex < STAGES.length - 1 ? STAGES[stageIndex + 1] : null;
          return (
            <>
              {prev ? (
                <button
                  onClick={() => update({ stage: prev.id })}
                  className="btn-secondary text-xs"
                >
                  &larr; {prev.icon} {prev.label}
                </button>
              ) : (
                <div />
              )}
              {next ? (
                <button
                  onClick={() => update({ stage: next.id })}
                  className="btn-primary text-xs"
                >
                  {next.icon} {next.label} &rarr;
                </button>
              ) : (
                <div />
              )}
            </>
          );
        })()}
      </div>
    </div>
  );
}
