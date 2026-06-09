import axios from 'axios';
import type {
  Dynasty, School, Painter, Painting, Theory, Flashcard, TreeNode, Stats, KnowledgeGraph
} from './types';

const api = axios.create({
  baseURL: '/api'
});

export const knowledgeApi = {
  getDynasties: () => api.get<Dynasty[]>('/dynasties').then(r => r.data),
  getDynasty: (id: string) => api.get<Dynasty>(`/dynasties/${id}`).then(r => r.data),

  getSchools: (dynastyId?: string) =>
    api.get<School[]>('/schools', { params: dynastyId ? { dynastyId } : {} }).then(r => r.data),
  getSchool: (id: string) => api.get<School>(`/schools/${id}`).then(r => r.data),

  getPainters: (params?: { dynastyId?: string; schoolId?: string }) =>
    api.get<Painter[]>('/painters', { params: params || {} }).then(r => r.data),
  getPainter: (id: string) => api.get<Painter>(`/painters/${id}`).then(r => r.data),

  getPaintings: (params?: { dynastyId?: string; painterId?: string; schoolId?: string; theme?: string }) =>
    api.get<Painting[]>('/paintings', { params: params || {} }).then(r => r.data),
  getPainting: (id: string) => api.get<Painting>(`/paintings/${id}`).then(r => r.data),
  getPaintingDeepAnalysis: (id: string) => api.get(`/paintings/${id}/deep-analysis`).then(r => r.data),

  getTheories: (dynastyId?: string) =>
    api.get<Theory[]>('/theories', { params: dynastyId ? { dynastyId } : {} }).then(r => r.data),
  getTheory: (id: string) => api.get<Theory>(`/theories/${id}`).then(r => r.data),

  getFlashcards: (params?: { type?: string; limit?: number; random?: boolean }) =>
    api.get<Flashcard[]>('/flashcards', { params: params || {} }).then(r => r.data),
  getFlashcard: (id: string) => api.get<Flashcard>(`/flashcards/${id}`).then(r => r.data),

  getKnowledgeTree: () => api.get<TreeNode[]>('/knowledge-tree').then(r => r.data),
  getStats: () => api.get<Stats>('/stats').then(r => r.data),
  search: (q: string) => api.get('/search', { params: { q } }).then(r => r.data),
  getKnowledgeGraph: (params?: { painterId?: string; schoolId?: string; paintingId?: string; depth?: number }) =>
    api.get<KnowledgeGraph>('/knowledge-graph', { params: params || {} }).then(r => r.data)
};
