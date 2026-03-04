import type { ContentItem, PipelineStage, MediaAttachment, ResearchNote, ReviewNote } from './types';

const STORAGE_KEY = 'dws-content-pipeline';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

function loadItems(): ContentItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveItems(items: ContentItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function getItems(): ContentItem[] {
  return loadItems();
}

export function createItem(partial: Partial<ContentItem>): ContentItem {
  const now = new Date().toISOString();
  const item: ContentItem = {
    id: generateId(),
    title: partial.title || 'Untitled',
    stage: partial.stage || 'idea',
    type: partial.type || 'blog',
    priority: partial.priority || 'medium',
    idea: partial.idea || '',
    researchNotes: partial.researchNotes || [],
    outline: partial.outline || '',
    script: partial.script || '',
    media: partial.media || [],
    reviewNotes: partial.reviewNotes || [],
    tags: partial.tags || [],
    platforms: partial.platforms || [],
    scheduledDate: partial.scheduledDate || '',
    publishedDate: partial.publishedDate || '',
    publishedUrl: partial.publishedUrl || '',
    assignee: partial.assignee || '',
    createdAt: now,
    updatedAt: now,
  };
  const items = loadItems();
  items.push(item);
  saveItems(items);
  return item;
}

export function updateItem(id: string, updates: Partial<ContentItem>): ContentItem | null {
  const items = loadItems();
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
  saveItems(items);
  return items[index];
}

export function deleteItem(id: string): boolean {
  const items = loadItems();
  const filtered = items.filter((i) => i.id !== id);
  if (filtered.length === items.length) return false;
  saveItems(filtered);
  return true;
}

export function moveItem(id: string, stage: PipelineStage): ContentItem | null {
  return updateItem(id, { stage });
}

export function addResearchNote(itemId: string, content: string, source?: string): ResearchNote | null {
  const items = loadItems();
  const item = items.find((i) => i.id === itemId);
  if (!item) return null;
  const note: ResearchNote = {
    id: generateId(),
    content,
    source,
    createdAt: new Date().toISOString(),
  };
  item.researchNotes.push(note);
  item.updatedAt = new Date().toISOString();
  saveItems(items);
  return note;
}

export function removeResearchNote(itemId: string, noteId: string): boolean {
  const items = loadItems();
  const item = items.find((i) => i.id === itemId);
  if (!item) return false;
  item.researchNotes = item.researchNotes.filter((n) => n.id !== noteId);
  item.updatedAt = new Date().toISOString();
  saveItems(items);
  return true;
}

export function addReviewNote(
  itemId: string,
  content: string,
  author: string,
  status: ReviewNote['status'] = 'comment'
): ReviewNote | null {
  const items = loadItems();
  const item = items.find((i) => i.id === itemId);
  if (!item) return null;
  const note: ReviewNote = {
    id: generateId(),
    content,
    author,
    status,
    createdAt: new Date().toISOString(),
  };
  item.reviewNotes.push(note);
  item.updatedAt = new Date().toISOString();
  saveItems(items);
  return note;
}

export function removeReviewNote(itemId: string, noteId: string): boolean {
  const items = loadItems();
  const item = items.find((i) => i.id === itemId);
  if (!item) return false;
  item.reviewNotes = item.reviewNotes.filter((n) => n.id !== noteId);
  item.updatedAt = new Date().toISOString();
  saveItems(items);
  return true;
}

export function addMedia(itemId: string, attachment: Omit<MediaAttachment, 'id' | 'addedAt'>): MediaAttachment | null {
  const items = loadItems();
  const item = items.find((i) => i.id === itemId);
  if (!item) return null;
  const media: MediaAttachment = {
    ...attachment,
    id: generateId(),
    addedAt: new Date().toISOString(),
  };
  item.media.push(media);
  item.updatedAt = new Date().toISOString();
  saveItems(items);
  return media;
}

export function removeMedia(itemId: string, mediaId: string): boolean {
  const items = loadItems();
  const item = items.find((i) => i.id === itemId);
  if (!item) return false;
  item.media = item.media.filter((m) => m.id !== mediaId);
  item.updatedAt = new Date().toISOString();
  saveItems(items);
  return true;
}

export function getItemsByStage(stage: PipelineStage): ContentItem[] {
  return loadItems().filter((i) => i.stage === stage);
}

export function getItemById(id: string): ContentItem | null {
  return loadItems().find((i) => i.id === id) || null;
}

export function exportPipeline(): string {
  return JSON.stringify(loadItems(), null, 2);
}

export function importPipeline(json: string): boolean {
  try {
    const items = JSON.parse(json);
    if (!Array.isArray(items)) return false;
    saveItems(items);
    return true;
  } catch {
    return false;
  }
}
