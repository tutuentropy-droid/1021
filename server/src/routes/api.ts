import { Router, Request, Response } from 'express';
import { dynasties, schools, painters, paintings, theories, flashcards } from '../data';

const router = Router();

interface TreeNode {
  id: string;
  name: string;
  type: 'dynasty' | 'school' | 'painter' | 'painting';
  children?: TreeNode[];
}

router.get('/dynasties', (req: Request, res: Response) => {
  res.json(dynasties);
});

router.get('/dynasties/:id', (req: Request, res: Response) => {
  const dynasty = dynasties.find(d => d.id === req.params.id);
  if (!dynasty) {
    res.status(404).json({ error: '朝代不存在' });
    return;
  }
  res.json(dynasty);
});

router.get('/schools', (req: Request, res: Response) => {
  const { dynastyId } = req.query;
  if (dynastyId) {
    res.json(schools.filter(s => s.dynastyId === dynastyId));
  } else {
    res.json(schools);
  }
});

router.get('/schools/:id', (req: Request, res: Response) => {
  const school = schools.find(s => s.id === req.params.id);
  if (!school) {
    res.status(404).json({ error: '画派不存在' });
    return;
  }
  res.json(school);
});

router.get('/painters', (req: Request, res: Response) => {
  const { dynastyId, schoolId } = req.query;
  let result = painters;
  if (dynastyId) {
    result = result.filter(p => p.dynastyId === dynastyId);
  }
  if (schoolId) {
    result = result.filter(p => p.schoolIds.includes(schoolId as string));
  }
  res.json(result);
});

router.get('/painters/:id', (req: Request, res: Response) => {
  const painter = painters.find(p => p.id === req.params.id);
  if (!painter) {
    res.status(404).json({ error: '画家不存在' });
    return;
  }
  const painterPaintings = paintings.filter(p => p.painterId === painter.id);
  res.json({ ...painter, paintings: painterPaintings });
});

router.get('/paintings', (req: Request, res: Response) => {
  const { dynastyId, painterId, schoolId, theme } = req.query;
  let result = paintings;
  if (dynastyId) {
    result = result.filter(p => p.dynastyId === dynastyId);
  }
  if (painterId) {
    result = result.filter(p => p.painterId === painterId);
  }
  if (schoolId) {
    result = result.filter(p => p.schoolIds.includes(schoolId as string));
  }
  if (theme) {
    result = result.filter(p => p.theme === theme);
  }
  res.json(result);
});

router.get('/paintings/:id', (req: Request, res: Response) => {
  const painting = paintings.find(p => p.id === req.params.id);
  if (!painting) {
    res.status(404).json({ error: '画作不存在' });
    return;
  }
  const painter = painters.find(p => p.id === painting.painterId);
  const dynasty = dynasties.find(d => d.id === painting.dynastyId);
  res.json({ ...painting, painter, dynasty });
});

router.get('/theories', (req: Request, res: Response) => {
  const { dynastyId } = req.query;
  if (dynastyId) {
    res.json(theories.filter(t => t.dynastyId === dynastyId));
  } else {
    res.json(theories);
  }
});

router.get('/theories/:id', (req: Request, res: Response) => {
  const theory = theories.find(t => t.id === req.params.id);
  if (!theory) {
    res.status(404).json({ error: '画论不存在' });
    return;
  }
  res.json(theory);
});

router.get('/flashcards', (req: Request, res: Response) => {
  const { type, limit, random } = req.query;
  let result = flashcards;
  if (type) {
    result = result.filter(f => f.type === type);
  }
  if (random === 'true') {
    result = [...result].sort(() => Math.random() - 0.5);
  }
  if (limit) {
    result = result.slice(0, parseInt(limit as string));
  }
  res.json(result);
});

router.get('/flashcards/:id', (req: Request, res: Response) => {
  const flashcard = flashcards.find(f => f.id === req.params.id);
  if (!flashcard) {
    res.status(404).json({ error: '抽认卡不存在' });
    return;
  }
  res.json(flashcard);
});

router.get('/knowledge-tree', (req: Request, res: Response) => {
  const tree: TreeNode[] = dynasties.map(dynasty => ({
    id: dynasty.id,
    name: dynasty.name,
    type: 'dynasty' as const,
    children: [
      ...schools
        .filter(s => s.dynastyId === dynasty.id)
        .map(school => ({
          id: school.id,
          name: school.name,
          type: 'school' as const,
          children: painters
            .filter(p => p.schoolIds.includes(school.id))
            .map(painter => ({
              id: painter.id,
              name: painter.name,
              type: 'painter' as const,
              children: paintings
                .filter(p => p.painterId === painter.id)
                .map(painting => ({
                  id: painting.id,
                  name: painting.title,
                  type: 'painting' as const
                }))
            }))
        })),
      ...painters
        .filter(p => p.dynastyId === dynasty.id && p.schoolIds.length === 0)
        .map(painter => ({
          id: painter.id,
          name: painter.name,
          type: 'painter' as const,
          children: paintings
            .filter(p => p.painterId === painter.id)
            .map(painting => ({
              id: painting.id,
              name: painting.title,
              type: 'painting' as const
            }))
        }))
    ]
  }));

  res.json(tree);
});

router.get('/stats', (req: Request, res: Response) => {
  res.json({
    dynasties: dynasties.length,
    schools: schools.length,
    painters: painters.length,
    paintings: paintings.length,
    theories: theories.length,
    flashcards: flashcards.length
  });
});

router.get('/search', (req: Request, res: Response) => {
  const { q } = req.query;
  if (!q) {
    res.json([]);
    return;
  }
  const query = (q as string).toLowerCase();
  const results = {
    dynasties: dynasties.filter(d =>
      d.name.toLowerCase().includes(query) ||
      d.description.toLowerCase().includes(query)
    ),
    schools: schools.filter(s =>
      s.name.toLowerCase().includes(query) ||
      s.description.toLowerCase().includes(query)
    ),
    painters: painters.filter(p =>
      p.name.toLowerCase().includes(query) ||
      (p.artName && p.artName.toLowerCase().includes(query)) ||
      p.biography.toLowerCase().includes(query)
    ),
    paintings: paintings.filter(p =>
      p.title.toLowerCase().includes(query) ||
      p.analysis.overallImpression.toLowerCase().includes(query)
    ),
    theories: theories.filter(t =>
      t.title.toLowerCase().includes(query) ||
      t.summary.toLowerCase().includes(query)
    )
  };
  res.json(results);
});

export default router;
