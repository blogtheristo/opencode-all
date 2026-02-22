import { useState, useCallback } from 'react';
import type { ContentItem, PipelineStage } from '../types';
import * as store from '../store';

export function usePipeline() {
  const [items, setItems] = useState<ContentItem[]>(() => store.getItems());
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setItems(store.getItems());
  }, []);

  const createItem = useCallback((partial: Partial<ContentItem>) => {
    const item = store.createItem(partial);
    setItems(store.getItems());
    return item;
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<ContentItem>) => {
    const item = store.updateItem(id, updates);
    setItems(store.getItems());
    return item;
  }, []);

  const deleteItem = useCallback((id: string) => {
    const result = store.deleteItem(id);
    setItems(store.getItems());
    if (selectedId === id) setSelectedId(null);
    return result;
  }, [selectedId]);

  const moveItem = useCallback((id: string, stage: PipelineStage) => {
    const item = store.moveItem(id, stage);
    setItems(store.getItems());
    return item;
  }, []);

  const selectedItem = items.find((i) => i.id === selectedId) || null;

  return {
    items,
    selectedItem,
    selectedId,
    setSelectedId,
    createItem,
    updateItem,
    deleteItem,
    moveItem,
    refresh,
  };
}
