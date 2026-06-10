import axios from 'axios';
import type {
  Dynasty, School, Painter, Painting, Theory, Flashcard, TreeNode, Stats, KnowledgeGraph,
  RoleplayScenario, RoleplayChoice, RoleplayConsequence, RoleplayResult, ReadingRecommendation,
  LiteraryWork, LiteraryWorkType
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
    api.get<KnowledgeGraph>('/knowledge-graph', { params: params || {} }).then(r => r.data),

  getRoleplayScenarios: () => api.get<any[]>('/roleplay-scenarios').then(r => r.data),
  getRoleplayScenario: (id: string) => api.get<RoleplayScenario>(`/roleplay-scenarios/${id}`).then(r => r.data),
  getRoleplayChoice: (scenarioId: string, choiceId: string) =>
    api.get<RoleplayChoice>(`/roleplay-scenarios/${scenarioId}/choices/${choiceId}`).then(r => r.data),
  getRoleplayConsequence: (scenarioId: string, consequenceId: string) =>
    api.get<RoleplayConsequence>(`/roleplay-scenarios/${scenarioId}/consequences/${consequenceId}`).then(r => r.data),
  getRoleplayResult: (scenarioId: string, path: { choiceId: string; optionId: string; consequenceId: string }[]) =>
    api.post<RoleplayResult>('/roleplay-result', { scenarioId, path }).then(r => r.data),

  getReadingRecommendations: (params?: { contextType?: 'dynasty' | 'school' | 'painter' | 'painting'; contextId?: string }) =>
    api.get<ReadingRecommendation>('/reading-recommendations', { params: params || {} }).then(r => r.data),

  getLiteraryWorks: (params?: { paintingId?: string; painterId?: string; dynastyId?: string; type?: LiteraryWorkType }) =>
    api.get<LiteraryWork[]>('/literary-works', { params: params || {} }).then(r => r.data),

  getLiteraryWork: (id: string) =>
    api.get<LiteraryWork & { relatedPaintings: Painting[]; relatedPainters: Painter[] }>(`/literary-works/${id}`).then(r => r.data),

  getPaintingLiteraryWorks: (paintingId: string) =>
    api.get<LiteraryWork[]>(`/paintings/${paintingId}/literary-works`).then(r => r.data),

  getPainterLiteraryWorks: (painterId: string) =>
    api.get<LiteraryWork[]>(`/painters/${painterId}/literary-works`).then(r => r.data)
};
