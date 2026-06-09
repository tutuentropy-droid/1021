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
