export interface Dynasty {
  id: string;
  name: string;
  period: string;
  years: string;
  description: string;
  characteristics: string[];
  schoolIds: string[];
  painterIds: string[];
}

export interface School {
  id: string;
  name: string;
  dynastyId: string;
  description: string;
  tenets: string[];
  representativePainters: string[];
  influence: string;
}

export interface Painter {
  id: string;
  name: string;
  courtesyName?: string;
  artName?: string;
  dynastyId: string;
  schoolIds: string[];
  years: string;
  biography: string;
  style: string;
  famousWorks: string[];
  anecdotes?: string[];
  paintings?: Painting[];
  teacherIds?: string[];
  studentIds?: string[];
  influencedPainterIds?: string[];
}

export interface Painting {
  id: string;
  title: string;
  painterId: string;
  dynastyId: string;
  schoolIds: string[];
  year?: string;
  format: string;
  dimensions?: string;
  collection: string;
  imageUrl: string;
  imagePrompt: string;
  theme: string;
  analysis: PaintingAnalysis;
  painter?: Painter;
  dynasty?: Dynasty;
}

export interface PaintingAnalysis {
  overallImpression: string;
  composition: string;
  brushwork: string;
  inkUse: string;
  colorUse: string;
  culturalContext: string;
  artisticAchievement: string;
  funFacts?: string[];
  socraticQuestions: string[];
  sealsAndInscriptions?: SealInscription[];
  brushworkQuality?: string;
  spatialLayout?: string;
  transmissionHistory?: string;
  scholarlyAppreciation?: string;
}

export interface SealInscription {
  type: 'seal' | 'inscription';
  owner: string;
  content: string;
  meaning?: string;
  position?: string;
  dynasty?: string;
}

export interface KnowledgeGraphNode {
  id: string;
  type: 'painter' | 'school' | 'painting' | 'dynasty';
  name: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface KnowledgeGraphEdge {
  id: string;
  source: string;
  target: string;
  type: 'teacher' | 'student' | 'influenced' | 'belongsTo' | 'created' | 'inherits' | 'successor';
  label: string;
}

export interface KnowledgeGraph {
  nodes: KnowledgeGraphNode[];
  edges: KnowledgeGraphEdge[];
}

export interface Theory {
  id: string;
  title: string;
  authorId: string;
  authorName: string;
  dynastyId: string;
  quotes: TheoryQuote[];
  summary: string;
  influence: string;
}

export interface TheoryQuote {
  text: string;
  explanation: string;
}

export interface Flashcard {
  id: string;
  type: 'painter' | 'painting' | 'school' | 'dynasty' | 'theory';
  front: string;
  back: string;
  relatedIds: string[];
}

export interface TreeNode {
  id: string;
  name: string;
  type: 'dynasty' | 'school' | 'painter' | 'painting';
  children?: TreeNode[];
}

export interface Stats {
  dynasties: number;
  schools: number;
  painters: number;
  paintings: number;
  theories: number;
  flashcards: number;
  literaryWorks: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  options?: ChatOption[];
}

export interface ChatOption {
  label: string;
  value: string;
}

export interface RoleplayScenario {
  id: string;
  title: string;
  dynasty: string;
  era: string;
  persona: Persona;
  historicalContext: string;
  openingNarrative: string;
  initialChoiceId: string;
  choices: RoleplayChoice[];
  consequences: RoleplayConsequence[];
}

export interface Persona {
  name: string;
  identity: string;
  background: string;
  constraints: string[];
  motivations: string[];
}

export interface RoleplayChoice {
  id: string;
  question: string;
  context: string;
  options: RoleplayOption[];
}

export interface RoleplayOption {
  id: string;
  label: string;
  description: string;
  consequenceId: string;
}

export interface RoleplayConsequence {
  id: string;
  scenarioId: string;
  title: string;
  immediateImpact: string;
  schoolTrajectory: string;
  criticalReception: CriticalReception;
  historicalWhatIf: string;
  actualHistory: string;
  relatedPainters: string[];
  relatedSchools: string[];
  nextChoiceId?: string;
}

export interface CriticalReception {
  contemporary: string;
  mingDynasty: string;
  qingDynasty: string;
  modern: string;
}

export interface RoleplayState {
  scenarioId: string;
  currentChoiceId: string;
  history: { choiceId: string; optionId: string; consequence: RoleplayConsequence }[];
}

export interface RoleplayResult {
  scenarioId: string;
  path: { choiceId: string; optionId: string }[];
  finalAssessment: FinalAssessment;
}

export interface FinalAssessment {
  styleLabel: string;
  schoolAffinity: string;
  historicalPosition: string;
  overallRating: 'master' | 'excellent' | 'good' | 'mediocre' | 'obscure';
  summary: string;
}

export type ReadingCategory = 'classic' | 'academic' | 'documentary' | 'exhibition';

export interface ReadingItem {
  id: string;
  title: string;
  author?: string;
  category: ReadingCategory;
  dynasty?: string;
  relatedPainterIds?: string[];
  relatedDynastyIds?: string[];
  relatedSchoolIds?: string[];
  description: string;
  whyRead: string;
  coverEmoji: string;
  sourceUrl?: string;
}

export type LiteraryWorkType = 'poem' | 'colophon' | 'note' | 'letter' | 'theory_excerpt' | 'appreciation';

export interface LiteraryWork {
  id: string;
  type: LiteraryWorkType;
  title: string;
  author: string;
  authorId?: string;
  dynastyId: string;
  year?: string;
  content: string;
  translation?: string;
  background?: string;
  appreciation?: string;
  relatedPaintingIds: string[];
  relatedPainterIds?: string[];
  source?: string;
}

export interface ReadingRecommendation {
  contextType: 'dynasty' | 'school' | 'painter' | 'painting' | 'general';
  contextName: string;
  items: ReadingItem[];
  intro: string;
}

export type TimelineEventType =
  | 'painter_birth'
  | 'painter_death'
  | 'painting_created'
  | 'school_founded'
  | 'theory_published'
  | 'literary_work'
  | 'friendship'
  | 'historical_event'
  | 'philosophy_event';

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  year: number;
  yearDisplay: string;
  title: string;
  description: string;
  dynastyId: string;
  relatedPainterIds?: string[];
  relatedPaintingIds?: string[];
  relatedSchoolIds?: string[];
  relatedTheoryIds?: string[];
  location?: {
    name: string;
    x: number;
    y: number;
  };
  metadata?: Record<string, any>;
}

export interface TimelineRegion {
  id: string;
  name: string;
  startYear: number;
  endYear: number;
  color: string;
  description?: string;
  events: TimelineEvent[];
}

export interface TimelineData {
  regions: TimelineRegion[];
  allEvents: TimelineEvent[];
  minYear: number;
  maxYear: number;
}
