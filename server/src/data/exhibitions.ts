import { v4 as uuidv4 } from 'uuid';
import type { 
  Exhibition, 
  ExhibitionSection, 
  ExhibitionItem, 
  AISuggestion, 
  ThemeSuggestion,
  ExhibitionCreateRequest,
  ExhibitionPreview
} from '../types';
import { paintings, painters, dynasties } from './index';

let exhibitions: Exhibition[] = [];

const THEME_SUGGESTIONS: ThemeSuggestion[] = [
  {
    id: 'theme-yuyin',
    title: '渔隐的变迁',
    description: '从五代到元明，探索"渔隐"主题如何从政治避世的象征，演变为文人精神寄托的视觉符号，展现中国山水画中"隐"的文化内涵。',
    keywords: ['渔隐', '山水画', '隐逸文化', '文人精神', '渔樵问答'],
    relatedPaintingIds: ['fuchun-shanju-tu', 'xishan-xinglu-tu', 'he-shui-yu-tu'],
    curatorialApproach: '按时间顺序展开展线，从五代的《渔父图》到元代《富春山居图》，再到明末清初的遗民绘画，探讨"渔隐"主题在不同时代背景下的意义变迁。',
    estimatedWorkCount: 5
  },
  {
    id: 'theme-shanshui',
    title: '山水之变——从写实到写意',
    description: '梳理从北宋"三家山水"的写实主义顶峰，到元四家的写意变革，再到明清的个性化表达，展现中国山水画千年演变的内在逻辑。',
    keywords: ['山水画', '写实', '写意', '北宋三家', '元四家', '南北宗'],
    relatedPaintingIds: ['xishan-xinglu-tu', 'zaochun-tu', 'fuchun-shanju-tu', 'he-shui-yu-tu'],
    curatorialApproach: '以风格演变为展线，对比不同时代的代表作品，让观者理解"以形写神"到"逸笔草草"的转变过程及其历史动因。',
    estimatedWorkCount: 6
  },
  {
    id: 'theme-huanniao',
    title: '一花一世界——花鸟画的精神维度',
    description: '从唐代畜兽画的写实传统，到明代徐渭的大写意，再到八大山人的冷峻孤傲，探索花鸟画如何成为文人抒发心性的载体。',
    keywords: ['花鸟画', '大写意', '徐渭', '八大山人', '托物言志'],
    relatedPaintingIds: ['wuniu-tu', 'zhu-shi-tu', 'he-shui-yu-tu'],
    curatorialApproach: '以"从写实到写意"为线索，展示花鸟画如何从单纯的描绘物象，升华为表达画家情感与人格的艺术形式。',
    estimatedWorkCount: 4
  },
  {
    id: 'theme-renwu',
    title: '人间百态——人物画的社会视野',
    description: '从顾恺之的贵族人物，到张择端的市井风情，再到顾闳中的宫廷夜宴，观察中国人物画如何记录不同阶层的生活状态与时代精神。',
    keywords: ['人物画', '风俗画', '社会生活', '韩熙载夜宴图', '清明上河图', '洛神赋图'],
    relatedPaintingIds: ['luoshen-fu-tu', 'hanxizai-yeyan-tu', 'qingming-shanghe-tu'],
    curatorialApproach: '以"从神到人"为展线，从神话人物、贵族生活到市井小民，展现人物画视野的下沉过程及其社会史价值。',
    estimatedWorkCount: 4
  },
  {
    id: 'theme-qinglu',
    title: '金碧与水墨——色彩观念的演变',
    description: '从王希孟《千里江山图》的大青绿辉煌，到范宽、郭熙的水墨至上，探索中国画色彩观念的转变及其背后的美学追求。',
    keywords: ['青绿山水', '水墨山水', '色彩', '墨分五彩', '浅绛山水'],
    relatedPaintingIds: ['qianli-jiangshan-tu', 'xishan-xinglu-tu', 'zaochun-tu', 'fuchun-shanju-tu'],
    curatorialApproach: '对比青绿与水墨两大传统，探讨"以素为绚"的文人审美如何逐渐取代"错彩镂金"的院体传统，以及这种转变的文化意义。',
    estimatedWorkCount: 5
  },
  {
    id: 'theme-song-yuan',
    title: '宋韵与逸格——宋元之变的艺术转捩',
    description: '聚焦北宋到元代的关键转折期，对比宋代院体的精工写实与元代文人的逸笔草草，理解"宋元之变"如何重塑了中国绘画的发展方向。',
    keywords: ['宋元之变', '院体画', '文人画', '逸品', '赵孟頫', '元四家'],
    relatedPaintingIds: ['xishan-xinglu-tu', 'zaochun-tu', 'qianli-jiangshan-tu', 'qingming-shanghe-tu', 'fuchun-shanju-tu'],
    curatorialApproach: '以"逸格的崛起"为核心命题，通过北宋与元代代表作品的并置对比，让观者直观感受这场影响深远的艺术变革。',
    estimatedWorkCount: 6
  },
  {
    id: 'theme-yimin',
    title: '残山剩水——遗民画家的家国情怀',
    description: '聚焦明末清初的"四僧"等遗民画家，探讨在改朝换代之际，画家如何以笔墨寄托亡国之痛与坚守气节。',
    keywords: ['遗民', '四僧', '八大山人', '石涛', '明清易代', '气节'],
    relatedPaintingIds: ['he-shui-yu-tu', 'zhu-shi-tu'],
    curatorialApproach: '以"亡国之痛与艺术表达"为主题，展示遗民画家如何将个人遭遇与民族情感融入笔墨，创造出独特的艺术风格。',
    estimatedWorkCount: 3
  },
  {
    id: 'theme-shiwen',
    title: '诗画一律——题画诗与文人画的融合',
    description: '探索"诗书画印"四位一体的文人画传统，理解苏轼"诗画本一律"的美学主张如何在后世作品中得到实践。',
    keywords: ['诗画一律', '题画诗', '文人画', '书法', '印章', '苏轼'],
    relatedPaintingIds: ['zhu-shi-tu', 'fuchun-shanju-tu', 'he-shui-yu-tu'],
    curatorialApproach: '以"题画诗"为切入点，分析画作上的题跋如何与画面形成对话，构建"诗中有画、画中有诗"的艺术境界。',
    estimatedWorkCount: 4
  }
];

const generateAISuggestions = (
  sections: ExhibitionSection[],
  title: string,
  introduction: string
): AISuggestion[] => {
  const suggestions: AISuggestion[] = [];
  let suggestionId = 0;
  
  const allItems = sections.flatMap(s => s.items);
  const usedPaintingIds = new Set(allItems.map(item => item.paintingId));
  
  if (sections.length === 0) {
    suggestions.push({
      id: `suggestion-${suggestionId++}`,
      type: 'selection',
      severity: 'warning',
      title: '展览结构待完善',
      description: '当前展览还没有添加任何展线单元。一个完整的展览通常需要2-4个单元来层层递进地呈现主题。',
      suggestion: '建议至少创建2-3个展线单元，每个单元围绕一个子主题展开，形成完整的叙事脉络。'
    });
  }
  
  if (sections.length === 1) {
    suggestions.push({
      id: `suggestion-${suggestionId++}`,
      type: 'sequence',
      severity: 'info',
      title: '展线层次可丰富',
      description: '目前只有1个展线单元。对于主题展览来说，多个单元的设置能更好地展现主题的不同侧面。',
      suggestion: '可以考虑按时间顺序（如"源起-发展-流变"）或主题角度（如"技法-内涵-影响"）来设置多个单元。'
    });
  }
  
  if (allItems.length < 3) {
    suggestions.push({
      id: `suggestion-${suggestionId++}`,
      type: 'selection',
      severity: 'warning',
      title: '作品数量偏少',
      description: `当前展览仅选入${allItems.length}幅作品。一个充实的小型展览通常需要4-8幅作品来支撑主题。`,
      suggestion: '建议从已有名画资源中再挑选2-5幅与主题相关的作品。可以参考推荐主题中的相关作品列表。'
    });
  }
  
  if (allItems.length > 12) {
    suggestions.push({
      id: `suggestion-${suggestionId++}`,
      type: 'selection',
      severity: 'info',
      title: '作品数量较多',
      description: `已选入${allItems.length}幅作品。过多的作品可能导致展览重点不够突出，观众容易产生审美疲劳。`,
      suggestion: '考虑精简至8-10幅最具代表性的作品，让每一件展品都有充分的观赏空间。'
    });
  }
  
  if (!title || title.length < 4) {
    suggestions.push({
      id: `suggestion-${suggestionId++}`,
      type: 'theme',
      severity: 'error',
      title: '展览标题待完善',
      description: '一个好的展览标题应该既点明主题，又具有吸引力。',
      suggestion: '建议标题在6-15字之间，可采用"主标题+副标题"的形式，如"渔隐的变迁——山水画中的隐逸精神"。'
    });
  }
  
  if (!introduction || introduction.length < 50) {
    suggestions.push({
      id: `suggestion-${suggestionId++}`,
      type: 'theme',
      severity: 'warning',
      title: '展览导言需充实',
      description: '导言是观众理解展览主题的入口，需要清晰说明展览的学术定位、叙事结构和观看方式。',
      suggestion: '导言建议包含三部分内容：①为什么选择这个主题？②展览准备如何展开？③观众可以获得什么？字数建议在200-500字。'
    });
  }
  
  for (const section of sections) {
    if (!section.title || section.title.length < 2) {
      suggestions.push({
        id: `suggestion-${suggestionId++}`,
        type: 'narration',
        severity: 'error',
        title: `单元标题缺失`,
        description: `第${section.displayOrder + 1}个展线单元还没有标题。`,
        suggestion: '每个单元都应该有一个清晰的小标题，概括该单元的核心内容。',
        sectionId: section.id
      });
    }
    
    if (!section.description || section.description.length < 20) {
      suggestions.push({
        id: `suggestion-${suggestionId++}`,
        type: 'narration',
        severity: 'warning',
        title: `单元说明待完善`,
        description: `单元"${section.title}"的说明文字较少。`,
        suggestion: '单元说明应阐述该单元在整个展览叙事中的作用，以及作品之间的相互关系。建议80-150字。',
        sectionId: section.id
      });
    }
    
    for (const item of section.items) {
      const painting = paintings.find(p => p.id === item.paintingId);
      if (!painting) continue;
      
      if (!item.label || item.label.length < 5) {
        suggestions.push({
          id: `suggestion-${suggestionId++}`,
          type: 'label',
          severity: 'error',
          title: `作品展签待撰写`,
          description: `《${painting.title}》的展签标题还没有填写。`,
          suggestion: '展签标题应简洁有力地概括该作品在本次展览中的定位，而非仅仅重复画名。',
          paintingId: item.paintingId,
          sectionId: section.id
        });
      }
      
      if (!item.narration || item.narration.length < 30) {
        suggestions.push({
          id: `suggestion-${suggestionId++}`,
          type: 'narration',
          severity: 'warning',
          title: `作品导览词待充实`,
          description: `《${painting.title}》的导览词较短。`,
          suggestion: '导览词应从展览主题的角度解读这件作品，说明它为什么出现在这里、它与主题的关系、与前后作品的联系。建议100-200字。',
          paintingId: item.paintingId,
          sectionId: section.id
        });
      }
      
      const painter = painters.find(p => p.id === painting.painterId);
      const dynasty = dynasties.find(d => d.id === painting.dynastyId);
      
      if (item.label && item.label.includes(painter?.name || '') && Math.random() > 0.5) {
        const painterYears = painter?.years || '';
        suggestions.push({
          id: `suggestion-${suggestionId++}`,
          type: 'fact-check',
          severity: 'info',
          title: `画史信息核对：${painter?.name || '画家'}`,
          description: `在撰写${painting.title}相关内容时，可以参考以下史实：${painter?.name || '这位画家'}活动于${dynasty?.name || ''}时期${painterYears ? `（${painterYears}）` : ''}，${painter?.style || '风格独特'}。`,
          suggestion: `可参考其${painter?.famousWorks?.length || 0}幅代表作品及相关画论进行深入解读。`,
          paintingId: item.paintingId,
          sectionId: section.id,
          reference: {
            type: 'painter',
            id: painting.painterId,
            name: painter?.name || '佚名'
          }
        });
      }
    }
  }
  
  const chronologicalOrder = checkChronologicalOrder(allItems);
  if (!chronologicalOrder.isValid && allItems.length >= 3) {
    suggestions.push({
      id: `suggestion-${suggestionId++}`,
      type: 'sequence',
      severity: 'info',
      title: '展线时序建议',
      description: `检测到展线中作品的年代顺序可能存在跳跃：${chronologicalOrder.message}`,
      suggestion: '如果展览是按时间顺序叙事，建议调整作品顺序以保持时序的连贯性。如果是主题式结构，则无需调整。'
    });
  }
  
  const themes = new Set(allItems.map(item => {
    const p = paintings.find(p => p.id === item.paintingId);
    return p?.theme;
  }).filter(Boolean));
  
  if (themes.size >= 3) {
    suggestions.push({
      id: `suggestion-${suggestionId++}`,
      type: 'theme',
      severity: 'info',
      title: '多题材融合提示',
      description: `展览涵盖了${Array.from(themes).join('、')}等多个题材，内容跨度较大。`,
      suggestion: '建议在导言和单元说明中明确说明不同题材作品如何服务于同一个展览主题，帮助观众建立观看线索。'
    });
  }
  
  if (usedPaintingIds.has('fuchun-shanju-tu') && usedPaintingIds.has('he-shui-yu-tu') && Math.random() > 0.3) {
    suggestions.push({
      id: `suggestion-${suggestionId++}`,
      type: 'fact-check',
      severity: 'info',
      title: '画史脉络提示：隐逸传统的传承',
      description: '您同时选择了《富春山居图》和《荷石水禽图》。这两幅作品虽然相隔三百多年，但都与中国文化中的"隐逸"传统深度相关。',
      suggestion: '可以在导览中建立两者的对话：黄公望的"隐"是主动的精神超越，八大山人的"隐"是被迫的亡国之痛。这种对比能极大地深化展览主题。',
      reference: {
        type: 'painting',
        id: 'fuchun-shanju-tu',
        name: '富春山居图'
      }
    });
  }
  
  if (usedPaintingIds.has('qingming-shanghe-tu') && usedPaintingIds.has('hanxizai-yeyan-tu') && Math.random() > 0.3) {
    suggestions.push({
      id: `suggestion-${suggestionId++}`,
      type: 'fact-check',
      severity: 'info',
      title: '画史脉络提示：人物画的两种传统',
      description: '《清明上河图》与《韩熙载夜宴图》代表了中国古代人物画的两大传统——风俗画与贵族人物画。',
      suggestion: '可以在导览中对比分析：张择端关注市井小民的生活百态，顾闳中聚焦贵族阶层的私密空间，两者共同构成了宋代人物画的完整图景。',
      reference: {
        type: 'painting',
        id: 'qingming-shanghe-tu',
        name: '清明上河图'
      }
    });
  }
  
  if (usedPaintingIds.has('qianli-jiangshan-tu') && usedPaintingIds.has('fuchun-shanju-tu') && Math.random() > 0.3) {
    suggestions.push({
      id: `suggestion-${suggestionId++}`,
      type: 'fact-check',
      severity: 'info',
      title: '画史脉络提示：色彩的退隐',
      description: '从《千里江山图》的金碧辉煌到《富春山居图》的水墨淡远，两百年间中国山水画完成了从"以色造型"到"以墨代色"的重要转变。',
      suggestion: '这是"宋元之变"的重要标志之一。建议在导览中引导观众对比思考：为什么水墨取代了青绿成为中国山水画的主流？这种转变反映了怎样的文化心理变化？',
      reference: {
        type: 'painting',
        id: 'qianli-jiangshan-tu',
        name: '千里江山图'
      }
    });
  }
  
  return suggestions;
};

const checkChronologicalOrder = (items: ExhibitionItem[]): { isValid: boolean; message: string } => {
  const paintingYears: { id: string; year: number; title: string }[] = items.map(item => {
    const painting = paintings.find(p => p.id === item.paintingId);
    const dynasty = painting ? dynasties.find(d => d.id === painting.dynastyId) : null;
    let year = 1000;
    
    if (painting?.dynastyId === 'wei-jin') year = 400;
    else if (painting?.dynastyId === 'tang') year = 700;
    else if (painting?.dynastyId === 'wu-dai') year = 950;
    else if (painting?.dynastyId === 'song') year = 1100;
    else if (painting?.dynastyId === 'yuan') year = 1350;
    else if (painting?.dynastyId === 'ming') year = 1550;
    else if (painting?.dynastyId === 'qing') year = 1700;
    
    return {
      id: item.paintingId,
      year,
      title: painting?.title || ''
    };
  });
  
  for (let i = 1; i < paintingYears.length; i++) {
    if (paintingYears[i].year < paintingYears[i - 1].year) {
      return {
        isValid: false,
        message: `《${paintingYears[i - 1].title}》（${paintingYears[i - 1].year}年左右）之后是《${paintingYears[i].title}》（${paintingYears[i].year}年左右），年代有所倒退。`
      };
    }
  }
  
  return { isValid: true, message: '时序连贯' };
};

const getThemeSuggestions = (): ThemeSuggestion[] => {
  return THEME_SUGGESTIONS;
};

const createExhibition = (request: ExhibitionCreateRequest): Exhibition => {
  const now = Date.now();
  const exhibition: Exhibition = {
    id: uuidv4(),
    ...request,
    sections: request.sections.map(s => ({
      ...s,
      items: s.items.map((item, idx) => ({
        ...item,
        displayOrder: idx
      }))
    })).sort((a, b) => a.displayOrder - b.displayOrder),
    createdAt: now,
    updatedAt: now,
    isPublished: false,
    viewCount: 0
  };
  
  exhibitions.push(exhibition);
  return exhibition;
};

const updateExhibition = (id: string, request: Partial<ExhibitionCreateRequest>): Exhibition | null => {
  const index = exhibitions.findIndex(e => e.id === id);
  if (index === -1) return null;
  
  const updated: Exhibition = {
    ...exhibitions[index],
    ...request,
    updatedAt: Date.now(),
    sections: request.sections 
      ? request.sections.map(s => ({
          ...s,
          items: s.items.map((item, idx) => ({
            ...item,
            displayOrder: idx
          }))
        })).sort((a, b) => a.displayOrder - b.displayOrder)
      : exhibitions[index].sections
  };
  
  exhibitions[index] = updated;
  return updated;
};

const getExhibition = (id: string): Exhibition | null => {
  const exhibition = exhibitions.find(e => e.id === id);
  if (exhibition) {
    exhibition.viewCount++;
  }
  return exhibition || null;
};

const getExhibitionWithPaintings = (id: string): (Exhibition & { 
  sections: (ExhibitionSection & {
    items: (ExhibitionItem & { painting: any })[]
  })[]
}) | null => {
  const exhibition = getExhibition(id);
  if (!exhibition) return null;
  
  const sections = exhibition.sections.map(section => ({
    ...section,
    items: section.items.map(item => ({
      ...item,
      painting: paintings.find(p => p.id === item.paintingId)
    }))
  }));
  
  return {
    ...exhibition,
    sections
  };
};

const getExhibitionList = (): ExhibitionPreview[] => {
  return exhibitions.map(exhibition => {
    const allItems = exhibition.sections.flatMap(s => s.items);
    const coverPainting = exhibition.coverPaintingId 
      ? paintings.find(p => p.id === exhibition.coverPaintingId)
      : paintings.find(p => p.id === allItems[0]?.paintingId);
    
    return {
      id: exhibition.id,
      title: exhibition.title,
      theme: exhibition.theme,
      curatorName: exhibition.curatorName,
      introduction: exhibition.introduction.slice(0, 100) + (exhibition.introduction.length > 100 ? '...' : ''),
      coverPaintingId: exhibition.coverPaintingId || allItems[0]?.paintingId,
      coverImageUrl: coverPainting?.imageUrl,
      artworkCount: allItems.length,
      sectionCount: exhibition.sections.length,
      createdAt: exhibition.createdAt,
      isPublished: exhibition.isPublished,
      viewCount: exhibition.viewCount
    };
  }).sort((a, b) => b.createdAt - a.createdAt);
};

const deleteExhibition = (id: string): boolean => {
  const index = exhibitions.findIndex(e => e.id === id);
  if (index === -1) return false;
  exhibitions.splice(index, 1);
  return true;
};

const publishExhibition = (id: string): Exhibition | null => {
  const exhibition = exhibitions.find(e => e.id === id);
  if (!exhibition) return null;
  
  exhibition.isPublished = true;
  exhibition.shareCode = uuidv4().slice(0, 8).toUpperCase();
  exhibition.updatedAt = Date.now();
  
  return exhibition;
};

const getExhibitionByShareCode = (shareCode: string): Exhibition | null => {
  return exhibitions.find(e => e.shareCode === shareCode.toUpperCase()) || null;
};

const getAISuggestions = (
  sections: ExhibitionSection[],
  title: string,
  introduction: string
): AISuggestion[] => {
  return generateAISuggestions(sections, title, introduction);
};

export {
  getThemeSuggestions,
  createExhibition,
  updateExhibition,
  getExhibition,
  getExhibitionWithPaintings,
  getExhibitionList,
  deleteExhibition,
  publishExhibition,
  getExhibitionByShareCode,
  getAISuggestions,
  exhibitions
};
