import { Router, Request, Response } from 'express';
import { dynasties, schools, painters, paintings, theories, flashcards, scenarios, readings } from '../data';
import type { KnowledgeGraph, KnowledgeGraphNode, KnowledgeGraphEdge, ReadingRecommendation, ReadingItem } from '../types';

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

router.get('/paintings/:id/deep-analysis', (req: Request, res: Response) => {
  const painting = paintings.find(p => p.id === req.params.id);
  if (!painting) {
    res.status(404).json({ error: '画作不存在' });
    return;
  }
  const painter = painters.find(p => p.id === painting.painterId);
  const dynasty = dynasties.find(d => d.id === painting.dynastyId);
  res.json({
    ...painting,
    painter,
    dynasty,
    deepAnalysis: {
      ...painting.analysis,
      spatialLayout: painting.analysis.spatialLayout || generateSpatialLayout(painting),
      brushworkQuality: painting.analysis.brushworkQuality || generateBrushworkQuality(painting),
      sealsAndInscriptions: painting.analysis.sealsAndInscriptions || generateSealsAndInscriptions(painting),
      transmissionHistory: painting.analysis.transmissionHistory || generateTransmissionHistory(painting),
      scholarlyAppreciation: painting.analysis.scholarlyAppreciation || generateScholarlyAppreciation(painting)
    }
  });
});

router.get('/knowledge-graph', (req: Request, res: Response) => {
  const { painterId, schoolId, paintingId, depth } = req.query;
  const graphDepth = parseInt((depth as string) || '2');
  const nodes: Map<string, KnowledgeGraphNode> = new Map();
  const edges: KnowledgeGraphEdge[] = [];

  const addPainterNode = (painterId: string) => {
    if (nodes.has(painterId)) return;
    const painter = painters.find(p => p.id === painterId);
    if (painter) {
      nodes.set(painterId, {
        id: painterId,
        type: 'painter',
        name: painter.name,
        description: painter.style,
        metadata: { years: painter.years, artName: painter.artName }
      });
    }
  };

  const addSchoolNode = (schoolId: string) => {
    if (nodes.has(schoolId)) return;
    const school = schools.find(s => s.id === schoolId);
    if (school) {
      nodes.set(schoolId, {
        id: schoolId,
        type: 'school',
        name: school.name,
        description: school.description
      });
    }
  };

  const addPaintingNode = (paintingId: string) => {
    if (nodes.has(paintingId)) return;
    const painting = paintings.find(p => p.id === paintingId);
    if (painting) {
      nodes.set(paintingId, {
        id: paintingId,
        type: 'painting',
        name: painting.title,
        description: painting.theme
      });
    }
  };

  const addDynastyNode = (dynastyId: string) => {
    if (nodes.has(dynastyId)) return;
    const dynasty = dynasties.find(d => d.id === dynastyId);
    if (dynasty) {
      nodes.set(dynastyId, {
        id: dynastyId,
        type: 'dynasty',
        name: dynasty.name,
        description: dynasty.period
      });
    }
  };

  const buildFromPainter = (pid: string, currentDepth: number) => {
    if (currentDepth > graphDepth) return;
    const painter = painters.find(p => p.id === pid);
    if (!painter) return;
    addPainterNode(pid);
    addDynastyNode(painter.dynastyId);
    edges.push({
      id: `painter-dynasty-${pid}-${painter.dynastyId}`,
      source: pid,
      target: painter.dynastyId,
      type: 'belongsTo',
      label: '所属朝代'
    });
    painter.schoolIds.forEach(sid => {
      addSchoolNode(sid);
      edges.push({
        id: `painter-school-${pid}-${sid}`,
        source: pid,
        target: sid,
        type: 'belongsTo',
        label: '所属画派'
      });
    });
    painter.teacherIds?.forEach(tid => {
      addPainterNode(tid);
      edges.push({
        id: `teacher-${tid}-${pid}`,
        source: tid,
        target: pid,
        type: 'teacher',
        label: '师承'
      });
      if (currentDepth < graphDepth) buildFromPainter(tid, currentDepth + 1);
    });
    painter.studentIds?.forEach(sid => {
      addPainterNode(sid);
      edges.push({
        id: `student-${pid}-${sid}`,
        source: pid,
        target: sid,
        type: 'student',
        label: '传予'
      });
      if (currentDepth < graphDepth) buildFromPainter(sid, currentDepth + 1);
    });
    painter.influencedPainterIds?.forEach(iid => {
      addPainterNode(iid);
      edges.push({
        id: `influenced-${pid}-${iid}`,
        source: pid,
        target: iid,
        type: 'influenced',
        label: '影响'
      });
    });
    paintings.filter(p => p.painterId === pid).forEach(p => {
      addPaintingNode(p.id);
      edges.push({
        id: `created-${pid}-${p.id}`,
        source: pid,
        target: p.id,
        type: 'created',
        label: '创作'
      });
    });
  };

  const buildFromSchool = (sid: string) => {
    const school = schools.find(s => s.id === sid);
    if (!school) return;
    addSchoolNode(sid);
    addDynastyNode(school.dynastyId);
    edges.push({
      id: `school-dynasty-${sid}-${school.dynastyId}`,
      source: sid,
      target: school.dynastyId,
      type: 'belongsTo',
      label: '兴盛于'
    });
    painters.filter(p => p.schoolIds.includes(sid)).forEach(p => {
      addPainterNode(p.id);
      edges.push({
        id: `school-painter-${sid}-${p.id}`,
        source: sid,
        target: p.id,
        type: 'belongsTo',
        label: '代表画家'
      });
    });
  };

  const buildFromPainting = (pid: string) => {
    const painting = paintings.find(p => p.id === pid);
    if (!painting) return;
    addPaintingNode(pid);
    addPainterNode(painting.painterId);
    addDynastyNode(painting.dynastyId);
    edges.push({
      id: `painting-painter-${pid}-${painting.painterId}`,
      source: pid,
      target: painting.painterId,
      type: 'created',
      label: '作者'
    });
    edges.push({
      id: `painting-dynasty-${pid}-${painting.dynastyId}`,
      source: pid,
      target: painting.dynastyId,
      type: 'belongsTo',
      label: '创作年代'
    });
    painting.schoolIds.forEach(sid => {
      addSchoolNode(sid);
      edges.push({
        id: `painting-school-${pid}-${sid}`,
        source: pid,
        target: sid,
        type: 'belongsTo',
        label: '风格归属'
      });
    });
    const painter = painters.find(p => p.id === painting.painterId);
    if (painter) buildFromPainter(painter.id, 1);
  };

  if (painterId) {
    buildFromPainter(painterId as string, 0);
  } else if (schoolId) {
    buildFromSchool(schoolId as string);
  } else if (paintingId) {
    buildFromPainting(paintingId as string);
  } else {
    painters.forEach(p => {
      if (p.teacherIds?.length || p.studentIds?.length || p.influencedPainterIds?.length) {
        buildFromPainter(p.id, 0);
      }
    });
    schools.forEach(s => buildFromSchool(s.id));
  }

  res.json({
    nodes: Array.from(nodes.values()),
    edges
  });
});

function generateSpatialLayout(painting: any): string {
  const templates: Record<string, string> = {
    'fuchun-shanju-tu': '画面采用"三远"并用的散点透视法。开篇以平远之景铺陈江面，随后山势渐起，以高远之法营造主峰耸峙之势，山间路径蜿蜒通向深处，复现深远之境。整幅长卷如行云流水，时而开阔，时而幽深，开合有度，虚实相生。其"一河两岸"式的构图范式，成为后世文人山水画的典范。',
    'qingming-shanghe-tu': '采用散点透视的全景式构图，全长528厘米的画卷如电影长镜头徐徐展开。开篇郊野宁静，中段虹桥为全画高潮——人流攒动、漕船穿梭，紧张而热闹；末段街市繁华，店铺林立。全图疏密有致，节奏分明，从静到动再到静，张弛有度，是中国古代构图艺术的巅峰之作。',
    'xishan-xinglu-tu': '采用"高远"构图法，主峰巍然居中，占据画面三分之二，顶天立地，气势逼人。山涧瀑布飞流直下，在画面中轴形成纵向气脉。人物与商旅置于右下角，比例极小，反衬出山川的雄伟壮阔。这种"主山堂堂"的构图，是北宋山水画"以小观大"审美理想的完美体现。',
    'hanxizai-yeyan-tu': '以屏风为隔断，采用连环画式的分段构图。全卷共五段——听乐、观舞、休憩、清吹、送别，每段既可独立成画，又通过屏风的掩映自然衔接。韩熙载作为中心人物，在五段中反复出现，其沉郁的神情贯穿始终。这种"时空并置"的构图方式，前无古人，开创了中国叙事绘画的新形式。',
    'qianli-jiangshan-tu': '采用长卷散点透视，将千里江山浓缩于11米长卷之中。全卷大致分为六段，每段以江水、山坳、桥梁为过渡，连贯一气。山势起伏跌宕，或高耸入云，或平缓铺陈；江河索回曲折，烟波浩渺。构图疏密相间，"咫尺有千里之趣"，是中国青绿山水构图的集大成之作。'
  };
  return templates[painting.id] || `此画在构图上独具匠心，采用中国传统绘画特有的空间处理方式，远近层次分明，虚实相生，体现了中国画"以大观小"的空间智慧。画面布局疏密得当，节奏张弛有度，气脉贯通，展现出画家高超的构图能力。`;
}

function generateBrushworkQuality(painting: any): string {
  const templates: Record<string, string> = {
    'fuchun-shanju-tu': '黄公望以松秀之笔写天下名山。其用笔"干而不枯，湿而不滑"，披麻皴松灵淡雅，如绵里裹针。山石轮廓以淡墨干笔勾勒，反复皴擦，层层积染，由淡入浓。画树笔法简练，"介字点"、"个字点"错落有致。整体笔墨品格"逸迈超尘"，平淡天真中见深淳，如幽人韵士，不染尘俗。董其昌评其"峰峦浑厚，草木华滋"，诚为至论。',
    'xishan-xinglu-tu': '范宽用笔"抢笔俱均"，刚劲有力。其独创的"雨点皴"以密集短促的笔触凿出山石的坚硬质感，如铁锤钉钉，力透纸背。山石轮廓以浓墨粗笔写出，笔力雄健，骨法洞达。画树笔法苍老，树干虬曲如铁，针叶以浓墨点簇，精神抖擞。其笔墨品格"雄强浑厚"，如关西大汉，执铜琵琶，唱大江东去，充满阳刚之气。',
    'zhu-shi-tu': '徐渭用笔狂放不羁，如草书般飞舞。藤条以干笔焦墨写出，盘曲扭转，力可扛鼎。葡萄叶以泼墨法大笔挥写，墨色淋漓，元气磅礴。葡萄以细笔圈点，浓淡相间，晶莹剔透。其笔墨品格"狂放恣肆"，是胸中郁结的喷发，是生命激情的宣泄。郑板桥所谓"掀天揭地之文，震电惊雷之字，呵神骂鬼之谈，无古无今之画"，正是徐渭笔墨品格的最好写照。'
  };
  return templates[painting.id] || '此画笔法精妙，墨色运用自如。线条遒劲有力，顿挫转折富有节奏感；墨色浓淡干湿变化丰富，"运墨而五色具"。整体笔墨格调高雅，形神兼备，体现了中国画独特的笔墨审美价值。';
}

function generateSealsAndInscriptions(painting: any): any[] {
  const templates: Record<string, any[]> = {
    'fuchun-shanju-tu': [
      { type: 'inscription' as const, owner: '黄公望', content: '至正七年，仆归富春山居，无用师偕往。暇日于南楼援笔写成此卷，兴之所至，不觉亹亹布置如许，逐旋填札，阅三四载未得完备，盖因留在山中，而云游在外故尔。今特取回行李中，早晚得暇，当为着笔。无用过虑有巧取豪敚者，俾先识卷末，庶使知其成就之难也。十年，青龙在庚寅，歜节前一日，大痴学人书于云间夏氏知止堂。', meaning: '黄公望自题创作始末，说明此画是为友人无用师所作', position: '卷尾', dynasty: '元' },
      { type: 'seal' as const, owner: '黄公望', content: '黄氏子久', meaning: '作者名号章', position: '卷尾题跋处', dynasty: '元' },
      { type: 'seal' as const, owner: '黄公望', content: '一峰道人', meaning: '作者别号章', position: '卷尾', dynasty: '元' },
      { type: 'inscription' as const, owner: '沈周', content: '今观黄子久《富春山居图》，笔墨浑厚，丘壑幽邃，峰峦起伏，云山烟树，沙汀村舍，一一具于目前。诚为画中兰亭，信不虚矣。', meaning: '沈周跋语，盛赞此画为"画中兰亭"', position: '卷尾', dynasty: '明' },
      { type: 'seal' as const, owner: '乾隆', content: '乾隆御览之宝', meaning: '乾隆帝鉴藏玺印', position: '卷首', dynasty: '清' },
      { type: 'seal' as const, owner: '乾隆', content: '石渠宝笈', meaning: '内府收藏著录章', position: '卷中', dynasty: '清' },
      { type: 'seal' as const, owner: '吴湖帆', content: '吴湖帆珍藏', meaning: '近代收藏家吴湖帆鉴藏印', position: '"剩山图"段', dynasty: '近现代' }
    ],
    'qingming-shanghe-tu': [
      { type: 'inscription' as const, owner: '李东阳', content: '宋家汴都全盛时，万方玉帛梯航随。清明上河俗所尚，倾城仕女携童儿。...', meaning: '明代李东阳题跋，咏叹汴京繁华', position: '卷尾', dynasty: '明' },
      { type: 'seal' as const, owner: '宣和', content: '宣和中秘', meaning: '宋徽宗朝内府收藏印', position: '卷首', dynasty: '北宋' },
      { type: 'seal' as const, owner: '项元汴', content: '天籁阁', meaning: '明代大收藏家项元汴鉴藏印', position: '卷中多处', dynasty: '明' },
      { type: 'seal' as const, owner: '毕沅', content: '毕沅审定', meaning: '清代毕沅、毕泷兄弟收藏印', position: '卷尾', dynasty: '清' },
      { type: 'seal' as const, owner: '溥仪', content: '宣统御览之宝', meaning: '宣统帝溥仪钤印，此画曾被溥仪携出宫外', position: '卷尾', dynasty: '清' }
    ]
  };
  return templates[painting.id] || [
    { type: 'inscription' as const, owner: '作者自题', content: '画家自题款识与创作年月', meaning: '作者署名及创作信息', position: '边角处', dynasty: '本朝' },
    { type: 'seal' as const, owner: '作者', content: '姓名章、字号章', meaning: '作者身份标识', position: '题跋下方', dynasty: '本朝' },
    { type: 'seal' as const, owner: '历代内府', content: '御览之宝、石渠宝笈等', meaning: '皇家收藏鉴藏印', position: '卷首、卷中', dynasty: '各代' },
    { type: 'seal' as const, owner: '历代收藏家', content: '各家鉴藏印', meaning: '见证画作流传经过', position: '画面各处', dynasty: '各代' }
  ];
}

function generateTransmissionHistory(painting: any): string {
  const templates: Record<string, string> = {
    'fuchun-shanju-tu': '此图元时由无用师收藏，明代先后经沈周、樊舜举、谈志伊、董其昌等递藏，明末归收藏家吴洪裕。吴洪裕临终前命人将此画火焚殉葬，被其侄吴静庵从火中抢出，然已烧成两段。前段较短，称"剩山图"；后段较长，称"无用师卷"。两段自此分离。"无用师卷"清代入内府，乾隆帝极爱之，在卷上题跋无数。后随故宫文物南迁，现藏台北故宫博物院。"剩山图"流落民间，几经辗转，1956年入藏浙江省博物馆。2011年6月，两卷在台北故宫博物院合璧展出，世称"山水合璧"。',
    'qingming-shanghe-tu': '此画北宋时藏于宣和内府，靖康之变后流落民间。南宋时入贾似道"悦生堂"，元代归"珍藏秘玩"所有，明代经大理寺卿朱鹤坡、华盖殿大学士徐溥、户部尚书李东阳、兵部尚书陆完、大收藏家项元汴等递藏。清代先后由毕沅、毕泷兄弟收藏，毕沅死后家产籍没，此画入清宫，经嘉庆、宣统递藏。溥仪逊位后，将此画以"赏赐"名义携出宫外。抗战后由东北文物管理委员会收回，现藏北京故宫博物院。',
    'xishan-xinglu-tu': '此画北宋时藏于内府，南宋归贾似道，元代经多家递藏，明代入项元汴天籁阁，清代归梁清标"秋碧堂"，后入清宫，经《石渠宝笈》著录。民国时随故宫文物南迁，现藏台北故宫博物院。'
  };
  return templates[painting.id] || '此画历经千年岁月，经众多收藏家和鉴赏家之手，每一方印章、每一段题跋都见证了它的流传经历。它从画家笔下诞生，或入内府珍藏，或在民间流转，历经朝代更迭、战乱兵燹，至今保存完好，成为中华文化传承的重要见证。其收藏史本身就是一部中国书画鉴藏史的缩影。';
}

function generateScholarlyAppreciation(painting: any): string {
  const templates: Record<string, string> = {
    'fuchun-shanju-tu': '历代学者对《富春山居图》推崇备至。明董其昌评曰："黄子久《富春山居图》，规摹董源、巨然，天真烂漫，复极精能，展之得三丈许，应接不暇。"清邹之麟称其："笔端变化鼓舞，右军之《兰亭》也，圣而神矣。"现代美术史论家俞剑华认为："《富春山居图》不只是黄公望的代表作，而且是中国文人山水画的最高典范。"徐复观在《中国艺术精神》中论述，此画体现了中国艺术"虚静之心"的最高境界——人与山水同化，物我两忘。',
    'qingming-shanghe-tu': '《清明上河图》的学术价值历来受到高度重视。明李东阳题跋曰："图与赋极描绘之巧，殆相为羽翼。"清乾隆帝赞其："绘者能品，此图尤妙。"现代学者从社会史、经济史、建筑史、交通史等多角度研究此画，使它不仅是一件艺术珍品，更是研究宋代社会的"百科全书式"图像史料。宋史专家邓广铭、漆侠等都曾利用此图考证宋代城市经济。',
    'xishan-xinglu-tu': '明董其昌见此画惊叹不已，题曰："宋画第一。"清王原祁评曰："范宽《溪山行旅图》，沉雄高古，北宋大家，巨然、范宽之外，未见其匹。"现代著名画家徐悲鸿盛赞："中国所有之宝，吾所最倾倒者，则为范中立《溪山行旅图》，大气磅礴，沉雄高古，诚辟易万人之作。"美术史家李霖灿在发现画中范宽签名后，著文考证，认为此画"为吾国山水画史上的一座巍巍丰碑"。'
  };
  return templates[painting.id] || '历代鉴赏家与学者对此画多有精到品评。明清文人题跋中屡见盛赞之词，近现代美术史论家亦从艺术风格、笔墨技法、文化内涵等多维度进行深入研究。这些学术成果不仅丰富了我们对此画的理解，也使它在艺术史中的定位更加清晰——它不仅是一件美的创造，更是中国文化精神的视觉载体。';
}

router.get('/roleplay-scenarios', (req: Request, res: Response) => {
  const result = scenarios.map(s => ({
    id: s.id,
    title: s.title,
    dynasty: s.dynasty,
    era: s.era,
    persona: {
      name: s.persona.name,
      identity: s.persona.identity,
      background: s.persona.background
    },
    historicalContext: s.historicalContext,
    openingNarrative: s.openingNarrative,
    initialChoiceId: s.initialChoiceId
  }));
  res.json(result);
});

router.get('/roleplay-scenarios/:id', (req: Request, res: Response) => {
  const scenario = scenarios.find(s => s.id === req.params.id);
  if (!scenario) {
    res.status(404).json({ error: '场景不存在' });
    return;
  }
  res.json(scenario);
});

router.get('/roleplay-scenarios/:id/choices/:choiceId', (req: Request, res: Response) => {
  const scenario = scenarios.find(s => s.id === req.params.id);
  if (!scenario) {
    res.status(404).json({ error: '场景不存在' });
    return;
  }
  const choice = scenario.choices.find(c => c.id === req.params.choiceId);
  if (!choice) {
    res.status(404).json({ error: '选择节点不存在' });
    return;
  }
  res.json(choice);
});

router.get('/roleplay-scenarios/:id/consequences/:consequenceId', (req: Request, res: Response) => {
  const scenario = scenarios.find(s => s.id === req.params.id);
  if (!scenario) {
    res.status(404).json({ error: '场景不存在' });
    return;
  }
  const consequence = scenario.consequences.find(c => c.id === req.params.consequenceId);
  if (!consequence) {
    res.status(404).json({ error: '后果节点不存在' });
    return;
  }
  res.json(consequence);
});

router.post('/roleplay-result', (req: Request, res: Response) => {
  const { scenarioId, path } = req.body;
  const scenario = scenarios.find(s => s.id === scenarioId);
  if (!scenario) {
    res.status(404).json({ error: '场景不存在' });
    return;
  }

  const lastConsequenceId = path[path.length - 1]?.consequenceId;
  const lastConsequence = scenario.consequences.find(c => c.id === lastConsequenceId);

  const consequenceIds = path.map((p: any) => p.consequenceId);
  const allConsequences = consequenceIds
    .map((cid: string) => scenario.consequences.find(c => c.id === cid))
    .filter(Boolean);

  let overallRating: 'master' | 'excellent' | 'good' | 'mediocre' | 'obscure' = 'good';
  let styleLabel = '自成一家';
  let schoolAffinity = '融合多家';
  let historicalPosition = '在画史上留下了自己的印记';
  let summary = '你在历史的十字路口做出了自己的选择。';

  if (scenarioId === 'southern-song-court') {
    const hasShiqi = consequenceIds.some((id: string) => id.includes('1-d') || id.includes('2-b') || id.includes('3-b'));
    const hasXingsi = consequenceIds.some((id: string) => id.includes('3-c'));
    const hasZhengzhi = consequenceIds.some((id: string) => id.includes('2-c'));
    if (hasShiqi && hasXingsi) {
      overallRating = 'master';
      styleLabel = '士气与精工兼备，开宗立派';
      schoolAffinity = '院体与文人画之间的桥梁人物';
      historicalPosition = '宋元之变的关键过渡人物，开元代文人画之先河';
      summary = '你在南宋院体与文人画之间找到了一条融合之路，既保有院体的精工法度，又具备文人的士气品格。你的选择为元代文人画的全面兴盛做了铺垫，在画史上具有承前启后的重要地位。';
    } else if (hasShiqi) {
      overallRating = 'excellent';
      styleLabel = '士气盎然，别开生面';
      schoolAffinity = '画院中的文人画先驱';
      historicalPosition = '院体画家中的异数，为文人画传统注入了新的活力';
      summary = '你在画院体制内坚持文人画的追求，以"士气"突破院体的束缚。这种"在朝而野"的姿态，使你成为画史上独具一格的人物。';
    } else if (hasZhengzhi) {
      overallRating = 'excellent';
      styleLabel = '寄意深远，画中良史';
      schoolAffinity = '政治寓意画的开创者';
      historicalPosition = '中国绘画爱国主义传统的奠基人';
      summary = '你将家国情怀融入山水画的创作，开辟了"政治寓意山水"这一新领域。你的作品不仅是艺术珍品，更是民族精神的图像表达，在后世危难时刻总能激发人们的爱国热情。';
    } else {
      overallRating = 'good';
      styleLabel = '恪守传统，院体正脉';
      schoolAffinity = '南宋院体画的中坚力量';
      historicalPosition = '宋代写实绘画传统的重要传承者';
      summary = '你坚守院体画的写实传统，以精湛的技法延续了宋代绘画的辉煌。虽然在文人画逐渐成为主流的历史大潮中，你的选择未必代表"正确方向"，但你对写实精神的坚守本身就具有不可替代的价值。';
    }
  } else if (scenarioId === 'yuan-recluse') {
    const hasYige = consequenceIds.some((id: string) => id.includes('3-a'));
    const hasShufa = consequenceIds.some((id: string) => id.includes('3-b'));
    const hasXiesheng = consequenceIds.some((id: string) => id.includes('3-c'));
    const hasJiecao = consequenceIds.some((id: string) => id.includes('2-b'));
    if (hasYige && hasJiecao) {
      overallRating = 'master';
      styleLabel = '逸品圣手，处士高风';
      schoolAffinity = '元四家之外的"第五人"';
      historicalPosition = '文人画"逸品"美学的系统阐释者，艺术独立精神的象征';
      summary = '你以处士的身份坚守士人气节，同时将"逸"的美学发展为系统的文人画理论。你的存在证明，艺术的独立价值不需要依附于政治或权力——真正的伟大艺术来自自由的心灵。';
    } else if (hasShufa) {
      overallRating = 'excellent';
      styleLabel = '书画同源，以书入画';
      schoolAffinity = '赵孟頫书画同源说的最重要阐发者';
      historicalPosition = '中国绘画"书画同源"理论从哲学观念到技法体系的完成者';
      summary = '你将"书画同源"从一句口号发展为可操作的完整技法体系，使中国绘画的形式语言获得了更深厚的书法根基。你的理论影响了此后数百年的画家。';
    } else if (hasXiesheng) {
      overallRating = 'excellent';
      styleLabel = '师法自然，写生正传';
      schoolAffinity = '写生传统在元代的复兴者';
      historicalPosition = '中国绘画写生传统承上启下的关键人物';
      summary = '在"摹古风"逐渐兴起的元代，你重新举起了"师法自然"的大旗。你的写生实践不仅影响了石涛等后世画家，更证明了传统山水画从未完全脱离与自然的血肉联系。';
    } else {
      overallRating = 'good';
      styleLabel = '董巨正传，元派嫡脉';
      schoolAffinity = '文人山水画主脉的重要传人';
      historicalPosition = '元四家与明吴门画派之间的桥梁人物';
      summary = '你沿着董源、巨然、赵孟頫、黄公望开辟的文人山水画正脉继续前行，笔力扎实，传派清晰。虽然你的独创性未必能与元四家比肩，但你对传统的忠实传承同样是画史不可或缺的一环。';
    }
  } else if (scenarioId === 'dong-qichang-follower') {
    const hasRonghe = consequenceIds.some((id: string) => id.includes('1-b') || id.includes('1-d') || id.includes('2-c'));
    const hasXiesheng = consequenceIds.some((id: string) => id.includes('1-c'));
    const hasJiecao = consequenceIds.some((id: string) => id.includes('3-b'));
    const hasFansi = consequenceIds.some((id: string) => id.includes('2-b'));
    if (hasRonghe && hasFansi) {
      overallRating = 'master';
      styleLabel = '南北融合，突破门户';
      schoolAffinity = '松江画派中最具独立思考精神的传人';
      historicalPosition = '"南北宗论"最早的反思者与修正者，打破门户之见的先驱';
      summary = '在董其昌"南北宗论"风靡天下、门户之见日深的晚明画坛，你保持了清醒的独立思考。你不仅在理论上反思"崇南贬北"的偏颇，更在创作实践中真正实现了南北融合。这种超越门户的眼光和胸襟，使你成为那个时代最具现代精神的画家。';
    } else if (hasXiesheng && hasJiecao) {
      overallRating = 'master';
      styleLabel = '师法造化，遗民典型';
      schoolAffinity = '写生传统与遗民绘画的双重代表';
      historicalPosition = '从传统内部走出的现代性先驱，清初遗民画坛的核心人物';
      summary = '你在摹古成风的晚明坚持"师法自然"，在明清易代之际坚守遗民气节。你的一生证明，真正的艺术家既不盲从古人，也不屈从权力——他只听从造化和良知的召唤。';
    } else if (hasXiesheng) {
      overallRating = 'excellent';
      styleLabel = '师法造化，写生开先';
      schoolAffinity = '传统写生派在晚明的复兴者';
      historicalPosition = '中国绘画从传统走向现代的先行者';
      summary = '当同时代人还在董其昌的"摹古"旗帜下亦步亦趋时，你已经走出画室，走向真山水。你对写生的重视，与三百年后西方印象派的户外写生遥相呼应，代表了中国绘画内部自发产生的现代性萌芽。';
    } else if (hasJiecao) {
      overallRating = 'excellent';
      styleLabel = '遗民宗师，气节可风';
      schoolAffinity = '清初遗民画派的领袖人物';
      historicalPosition = '明遗民精神在绘画领域的杰出代表';
      summary = '在天崩地解的易代之际，你选择了坚守。你的画不仅是笔墨的艺术，更是人格的写照——枯树残山，无不寄托着故国之思。你与"四僧"共同构成了那个黑暗时代中最耀眼的精神之光。';
    } else {
      overallRating = 'good';
      styleLabel = '松江正传，摹古大家';
      schoolAffinity = '董其昌之后松江画派的领袖';
      historicalPosition = '连接董其昌与清初"四王"的关键人物';
      summary = '你忠实继承了董其昌的画学思想，以"集古大成"为目标，摹古功夫极深。你的传派直接开启了清代"四王"的正统画派，成为中国绘画传统延续性的重要保障。虽然独创性稍显不足，但对传统的系统传承同样是画史的重要贡献。';
    }
  }

  res.json({
    scenarioId,
    path,
    finalAssessment: {
      styleLabel,
      schoolAffinity,
      historicalPosition,
      overallRating,
      summary
    }
  });
});

router.get('/reading-recommendations', (req: Request, res: Response) => {
  const { contextType, contextId } = req.query;
  let items: ReadingItem[] = [];
  let contextName = '中国画';
  let type: ReadingRecommendation['contextType'] = 'general';

  if (contextType === 'painter' && contextId) {
    const painter = painters.find(p => p.id === contextId);
    if (painter) {
      contextName = painter.name;
      type = 'painter';
      items = readings.filter(r =>
        r.relatedPainterIds?.includes(contextId as string) ||
        r.relatedDynastyIds?.includes(painter.dynastyId) ||
        painter.schoolIds.some(sid => r.relatedSchoolIds?.includes(sid))
      );
      if (items.length < 4) {
        const extra = readings.filter(r => !items.includes(r)).slice(0, 4 - items.length);
        items = [...items, ...extra];
      }
    }
  } else if (contextType === 'dynasty' && contextId) {
    const dynasty = dynasties.find(d => d.id === contextId);
    if (dynasty) {
      contextName = dynasty.name;
      type = 'dynasty';
      items = readings.filter(r => r.relatedDynastyIds?.includes(contextId as string));
      if (items.length < 4) {
        const extra = readings.filter(r => !items.includes(r)).slice(0, 4 - items.length);
        items = [...items, ...extra];
      }
    }
  } else if (contextType === 'school' && contextId) {
    const school = schools.find(s => s.id === contextId);
    if (school) {
      contextName = school.name;
      type = 'school';
      items = readings.filter(r =>
        r.relatedSchoolIds?.includes(contextId as string) ||
        r.relatedDynastyIds?.includes(school.dynastyId)
      );
      if (items.length < 4) {
        const extra = readings.filter(r => !items.includes(r)).slice(0, 4 - items.length);
        items = [...items, ...extra];
      }
    }
  } else if (contextType === 'painting' && contextId) {
    const painting = paintings.find(p => p.id === contextId);
    if (painting) {
      const painter = painters.find(p => p.id === painting.painterId);
      contextName = painting.title;
      type = 'painting';
      items = readings.filter(r =>
        r.relatedPainterIds?.includes(painting.painterId) ||
        r.relatedDynastyIds?.includes(painting.dynastyId) ||
        painting.schoolIds.some(sid => r.relatedSchoolIds?.includes(sid))
      );
      if (items.length < 4) {
        const extra = readings.filter(r => !items.includes(r)).slice(0, 4 - items.length);
        items = [...items, ...extra];
      }
    }
  }

  if (items.length === 0) {
    items = readings.slice(0, 6);
  }

  items = items.sort(() => Math.random() - 0.5).slice(0, 6);

  const introByType: Record<string, string> = {
    painter: `你正在深入了解${contextName}的艺术世界。基于你对这位画家的兴趣，我为你精选了以下延伸读物，帮助你更全面地理解他的艺术思想与历史地位。`,
    dynasty: `你正在探索${contextName}的绘画艺术。这个时代诞生了无数不朽名作与理论典籍，以下延伸阅读将带你走进那个时代的文化语境。`,
    school: `你正在研究${contextName}的艺术主张。每一个画派的背后都有深厚的理论根基与时代背景，以下读物将帮助你理解这个画派的来龙去脉。`,
    painting: `你正在欣赏《${contextName}》。一幅伟大的画作背后，往往承载着画家的思想、时代的精神与千年的传承。以下读物将带你领略画外之音。`,
    general: `中国画的世界博大精深，从经典画论到现代研究，从纪录片到线上展览，这里为你精选了最值得探索的进阶之路。`
  };

  const recommendation: ReadingRecommendation = {
    contextType: type,
    contextName,
    items,
    intro: introByType[type] || introByType.general
  };

  res.json(recommendation);
});

export default router;
