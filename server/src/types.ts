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
