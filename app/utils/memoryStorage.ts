import { AnalyzedPost } from '../types';

const STORAGE_KEY = 'inside_out_memories';

export const saveMemories = (posts: AnalyzedPost[]) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    } catch (e) {
        console.error('Failed to save memories:', e);
    }
};

export const loadMemories = (): AnalyzedPost[] => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Failed to load memories:', e);
        return [];
    }
};

export const clearMemories = () => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
        console.error('Failed to clear memories:', e);
    }
};

export const deleteMemory = (id: string) => {
    const current = loadMemories();
    const updated = current.filter(p => p.id !== id);
    saveMemories(updated);
    return updated;
};
