import { ReadingItem } from '../types';

export const readings: ReadingItem[] = [
  {
    id: 'linquan-gaozhi',
    title: '《林泉高致》',
    author: '郭熙',
    category: 'classic',
    dynasty: '北宋',
    relatedPainterIds: ['guo-xi'],
    relatedDynastyIds: ['song'],
    relatedSchoolIds: ['northern-song-landscape'],
    coverEmoji: '📜',
    description: '北宋山水画大师郭熙的山水画理论集大成之作，由其子郭思整理。全书共六节，系统阐述了山水画的创作原则、构图方法、笔墨技法与学习路径。',
    whyRead: '你正在深入北宋山水画的世界，郭熙不仅是那个时代最伟大的山水画家之一，更是第一位系统阐释"山水何以动人"的理论家。读完此书，你再看范宽、李成的作品时，将不再只是"看山是山"。'
  },
  {
    id: 'kugua-heshang-huayulu',
    title: '《苦瓜和尚画语录》',
    author: '石涛',
    category: 'classic',
    dynasty: '清',
    relatedPainterIds: ['shi-tao'],
    relatedDynastyIds: ['qing'],
    relatedSchoolIds: ['qing-early-innovators'],
    coverEmoji: '🥒',
    description: '清初四僧之一石涛的绘画理论著作，又名《画谱》。全书十八章，以"一画论"为核心，主张"我自用我法"、"笔墨当随时代"，是中国古代最具哲学深度与革新精神的画论。',
    whyRead: '如果你在四王的摹古风气中感到一丝窒息，石涛的这本书会像一道闪电划破夜空。他告诉你：古人的成法不是枷锁，天地才是真正的老师。读完你会明白，为什么近现代的大师们几乎人手一本。'
  },
  {
    id: 'xiehe-huapin',
    title: '《画品》（古画品录）',
    author: '谢赫',
    category: 'classic',
    dynasty: '南朝齐梁',
    relatedDynastyIds: ['wei-jin'],
    coverEmoji: '📖',
    description: '南朝齐梁间谢赫所著，中国现存最早的绘画品评著作。提出了著名的"六法论"——气韵生动、骨法用笔、应物象形、随类赋彩、经营位置、传移模写，奠定了中国传统绘画批评的基本框架。',
    whyRead: '"气韵生动"这四个字，你会在几乎每一本中国画论著中反复看到。它的源头就在这里。谢赫用短短一卷书，为后世一千五百年的中国画确立了审美标准，这个源头你不可不读。'
  },
  {
    id: 'lidai-minghuaji',
    title: '《历代名画记》',
    author: '张彦远',
    category: 'classic',
    dynasty: '唐',
    relatedDynastyIds: ['tang'],
    coverEmoji: '📚',
    description: '唐代张彦远所著，中国第一部系统完整的绘画通史。全书十卷，记述了从传说时代到晚唐的画家与作品，兼及绘画理论、鉴藏、装裱等，被誉为"画史之祖"。',
    whyRead: '你想了解阎立本、吴道子这些唐代大师的真实面目吗？张彦远距离他们的时代最近，他的记载最可信。更重要的是，他第一次提出了"书画同源"——这个理解中国画的钥匙。'
  },
  {
    id: 'bifa-ji',
    title: '《笔法记》',
    author: '荆浩',
    category: 'classic',
    dynasty: '五代',
    relatedPainterIds: ['jing-hao'],
    relatedDynastyIds: ['wu-dai'],
    relatedSchoolIds: ['northern-song-landscape'],
    coverEmoji: '🖌️',
    description: '五代画家荆浩的山水画理论著作，以对话体形式阐述山水画创作的"六要"（气、韵、思、景、笔、墨），是中国第一部系统的山水画理论著作。',
    whyRead: '北宋山水画的巍峨高峰，不是凭空出现的。荆浩在太行山中隐居写生，为范宽、郭熙们铺好了路。他的"图真"说——画山水要"气质俱盛"，是理解宋代写实精神的关键。'
  },
  {
    id: 'dong-qichang-nanbeizong-lun',
    title: '《画禅室随笔》（南北宗论）',
    author: '董其昌',
    category: 'classic',
    dynasty: '明',
    relatedPainterIds: ['dong-qichang'],
    relatedDynastyIds: ['ming'],
    relatedSchoolIds: ['songjiang'],
    coverEmoji: '🧘',
    description: '明代书画家董其昌的书画理论笔记，其中提出的"南北宗论"借用禅宗分派之说，将山水画分为"南宗"（文人画）与"北宗"（院体画）两大系统，影响明末至清代三百年画坛走向。',
    whyRead: '你是否困惑过：为什么同样是山水，有的画"逸笔草草"，有的却"精工细写"？董其昌用一个简单但影响深远的分类回答了这个问题。无论你是否同意他的观点，不理解南北宗论，就看不懂明清绘画。'
  },
  {
    id: 'huashanshui-xu',
    title: '《画山水序》',
    author: '宗炳',
    category: 'classic',
    dynasty: '南朝宋',
    relatedPainterIds: ['zong-bing'],
    relatedDynastyIds: ['wei-jin'],
    coverEmoji: '🏔️',
    description: '南朝宋宗炳所著，中国第一篇山水画论。提出了"澄怀味象"、"畅神"说，认为山水画的功能不在于描绘地理形貌，而在于使观者精神愉悦、心灵超越。',
    whyRead: '当你站在一幅山水画前，你是在"看风景"还是在"神游"？宗炳在一千六百年前就给出了答案：山水画是为了"畅神"——让你的精神在画中自由遨游。这是理解中国山水画独特魅力的起点。'
  },
  {
    id: 'zhongguo-huashi',
    title: '《中国绘画史》',
    author: '潘天寿',
    category: 'academic',
    coverEmoji: '📘',
    description: '现代国画大师潘天寿撰写的中国绘画通史教材。全书系统梳理了从远古至清末的中国绘画发展脉络，史料翔实，观点精当，是学习中国绘画史的经典入门读物。',
    whyRead: '你已经在知识树中认识了不少画家和作品，现在需要一条线把它们串起来。潘天寿既是大画家又是大学者，他写的历史不只是罗列史实，更有一双"内行的眼睛"。'
  },
  {
    id: 'zhongguo-yishu-jingshen',
    title: '《中国艺术精神》',
    author: '徐复观',
    category: 'academic',
    coverEmoji: '🧠',
    description: '新儒家代表人物徐复观的代表作。全书从庄子哲学出发，深入探讨中国艺术的精神内核，尤其对山水画的"虚静"境界有极为深刻的阐释，是融合哲学与艺术史的经典之作。',
    whyRead: '你是否好奇：为什么中国画家那么爱画"空山无人"？为什么留白比填满更难？徐复观从庄子的"心斋"、"坐忘"讲起，帮你读懂那些山水背后的哲学——中国画画的从来不是风景，而是心灵的境界。'
  },
  {
    id: 'ci-shi-hua',
    title: '《宋词与中国画》',
    author: '扬之水',
    category: 'academic',
    coverEmoji: '🎋',
    description: '著名文物研究学者扬之水的著作，从宋词的意境出发，探讨宋代绘画与文学的互动关系，图文并茂，展现了宋代士大夫的审美世界。',
    whyRead: '你已经知道苏轼说"诗画本一律"，但诗与画到底是怎样"一律"的？当你把柳永的"杨柳岸，晓风残月"和马远的"一角"山水并置，你就懂了什么是"宋人意境"。这本书会帮你打开这扇门。'
  },
  {
    id: 'shanshuihua-qiyuan',
    title: '《山水画的起源》',
    author: '方闻',
    category: 'academic',
    coverEmoji: '🌲',
    description: '著名美术史家方闻先生的代表作。运用"风格分析"方法，系统论述了中国山水画从魏晋到北宋的发展历程，是海外中国美术史研究的经典之作。',
    whyRead: '你有没有想过：为什么中国人最早画的不是山水，而是人物和神仙？山水画是如何从背景变成主角的？方闻先生用考古材料和传世文献双重证据，带你穿越回那个山水意识觉醒的伟大时代。'
  },
  {
    id: 'siguan-yishu',
    title: '《四僧绘画研究》',
    author: '高居翰',
    category: 'academic',
    relatedDynastyIds: ['qing'],
    relatedPainterIds: ['shi-tao', 'ba-da-shan-ren', 'kun-can', 'hong-ren'],
    coverEmoji: '🔬',
    description: '美国著名汉学家高居翰（James Cahill）的著作，深入研究了清初"四僧"（八大山人、石涛、髡残、弘仁）的生平与艺术，分析了他们在明清易代之际的独特选择。',
    whyRead: '四僧的画为什么那么"怪"？八大山人的鸟为什么总是翻着白眼？石涛为什么说"我自用我法"？不了解"明朝遗民"这个身份，你就永远读不懂清初画坛的那股悲凉与倔强。'
  },
  {
    id: 'dang-zizhen-zhuan',
    title: '《董其昌传》',
    author: '颜晓军',
    category: 'academic',
    relatedPainterIds: ['dong-qichang'],
    relatedDynastyIds: ['ming'],
    coverEmoji: '👓',
    description: '系统研究明代书画家董其昌的生平、交游、艺术与理论的学术传记，全面展现了这位影响深远但也争议颇多的人物的复杂面貌。',
    whyRead: '董其昌是中国绘画史上最有影响力也最有争议的人物之一。他的"南北宗论"塑造了此后三百年的画坛格局，但他的人品却屡遭诟病。要理解晚明绘画，必先理解这个复杂的人。'
  },
  {
    id: 'gongbi-xieyi-lun',
    title: '《工笔与写意：中国画的两种语言》',
    author: '薛永年',
    category: 'academic',
    coverEmoji: '🎨',
    description: '著名美术史论家薛永年先生的论文集，深入探讨了中国画中"工笔"与"写意"两大传统的对立、交融与辩证关系。',
    whyRead: '你可能会觉得"工笔"就是画得细、"写意"就是画得粗，其实远不止于此。这背后是两种完全不同的创作哲学、两种观看世界的方式。读懂它们的张力，你才算真正入门。'
  },
  {
    id: 'doc-gugong-shanshui',
    title: '纪录片《故宫藏画·山水篇》',
    category: 'documentary',
    coverEmoji: '🎬',
    description: '故宫博物院出品的大型纪录片，以故宫藏历代山水画精品为主线，结合画家生平、历史背景与画作细节，全方位展现中国山水画的千年之美。',
    whyRead: '再好的文字描述，也不如亲眼看到原画的细节。当你在高清镜头下看到范宽《溪山行旅图》中隐匿的签名、看到黄公望《富春山居图》的笔墨层次，你才会明白什么叫"咫尺有千里之趣"。'
  },
  {
    id: 'doc-huashi-renwu',
    title: '纪录片《中国绘画大师》',
    category: 'documentary',
    coverEmoji: '📽️',
    description: '中央电视台出品的系列人物纪录片，每集聚焦一位中国绘画史上的大师，再现其生平故事，解读其代表作品。',
    whyRead: '画家不是一串名字和生卒年。顾恺之的"痴"、徐渭的"狂"、八大山人的"冷"——只有把画和人放在一起看，你才能读懂那些笔墨背后的温度。'
  },
  {
    id: 'doc-song-dynasty-painting',
    title: '纪录片《宋之韵·绘画篇》',
    category: 'documentary',
    relatedDynastyIds: ['song'],
    coverEmoji: '🎞️',
    description: '以宋代绘画为主题的纪录片，从宫廷画院到文人墨戏，从山水花鸟到人物风俗，全景式展现宋代绘画的辉煌成就与审美精神。',
    whyRead: '你已在知识树中徜徉于宋代画坛的群星璀璨，但宋代为什么会成为中国绘画的巅峰？这部片子会带你回到那个"郁郁乎文哉"的时代，去感受那种对细节、对自然、对意境的极致追求。'
  },
  {
    id: 'doc-yuan-dynasty-painting',
    title: '纪录片《元代文人画的世界》',
    category: 'documentary',
    relatedDynastyIds: ['yuan'],
    coverEmoji: '🎦',
    description: '探讨元代文人画兴起的历史背景、艺术特色与代表人物，解读"元四家"如何在异族统治下以笔墨寄托情志、开创文人画的新时代。',
    whyRead: '为什么宋代山水那么写实，到了元代突然"逸笔草草"了？为什么元四家的画里总有一种"淡"与"远"？不理解元代文人的处境，你就读不懂倪瓒的"逸笔"里到底藏着什么。'
  },
  {
    id: 'exh-gugong-digital',
    title: '故宫博物院数字文物库',
    category: 'exhibition',
    coverEmoji: '🏛️',
    description: '故宫博物院官方推出的线上数字展览平台，免费提供超过8万件文物的高清影像，其中历代绘画藏品尤为丰富，支持超高清放大浏览细节。',
    whyRead: '不必飞北京，你就可以在屏幕上把《千里江山图》的每一根线条看得清清楚楚。当你把画面放大到能看见绢布的纹理时，那种和七百多年前的王希孟"对视"的感觉，是任何画册都给不了的。',
    sourceUrl: 'https://digicol.dpm.org.cn'
  },
  {
    id: 'exh-taipei-gugong',
    title: '台北故宫博物院Open Data平台',
    category: 'exhibition',
    coverEmoji: '🏯',
    description: '台北故宫博物院开放数据平台，提供大量高清藏品影像与线上展览，其中范宽《溪山行旅图》、郭熙《早春图》、黄公望《富春山居图》（无用师卷）等镇馆之宝都有数字资源。',
    whyRead: '北宋山水画的巅峰之作《溪山行旅图》藏在台北，原迹很难一见。但在数字平台上，你可以仔细端详那座主峰的每一块皴法、每一粒"雨点"，理解为什么徐悲鸿说它是"中国所有之宝，吾所最倾倒者"。',
    sourceUrl: 'https://data.npm.gov.tw'
  },
  {
    id: 'exh-met-chinese',
    title: '大都会艺术博物馆·中国书画数字展厅',
    category: 'exhibition',
    coverEmoji: '🗽',
    description: '美国大都会艺术博物馆的中国书画收藏在线展厅，拥有除中国本土外最精的中国书画收藏之一，其高清图像资源免费开放。',
    whyRead: '你知道吗？许多珍贵的中国古画如今藏在海外。大都会的收藏中有不少在国内难得一见的精品，看完这个展览，你会对"全球视野下的中国艺术"有更深的体会。',
    sourceUrl: 'https://www.metmuseum.org'
  },
  {
    id: 'exh-shanghai-museum',
    title: '上海博物馆·中国历代绘画馆线上展',
    category: 'exhibition',
    coverEmoji: '🏙️',
    description: '上海博物馆中国历代绘画常设展览的线上版本，按时代顺序展示从战国到清代的绘画精品，配有详细的文字解说。',
    whyRead: '上海博物馆的绘画收藏体系完整、精品荟萃，是了解中国绘画发展脉络的最佳去处之一。配合你正在学习的知识树，在这里可以找到许多你已"认识"的画家的原作。',
    sourceUrl: 'https://www.shanghaimuseum.net'
  },
  {
    id: 'exh-dunhuang',
    title: '数字敦煌',
    category: 'exhibition',
    coverEmoji: '🎭',
    description: '敦煌研究院打造的线上敦煌石窟参观平台，提供30个洞窟的360°全景漫游与高清壁画图像，是了解中国早期绘画与佛教艺术的珍贵资源。',
    whyRead: '如果说水墨山水是士大夫的精神家园，那么敦煌壁画就是中古时代的"民间美术馆"。从十六国到元代，跨越千年的色彩与线条，会让你看到中国画的另一个传统——绚烂、热烈、充满生命力。',
    sourceUrl: 'https://www.e-dunhuang.com'
  },
  {
    id: 'su-shi-lunhua-complete',
    title: '《苏轼论画》',
    author: '苏轼',
    category: 'classic',
    dynasty: '北宋',
    relatedPainterIds: ['su-shi'],
    relatedDynastyIds: ['song'],
    coverEmoji: '🖋️',
    description: '苏轼虽然不是职业画家，但他的画论散见于其诗文题跋之中，经后人辑录而成。"论画以形似，见与儿童邻"、"诗中有画，画中有诗"等著名观点均出自于此。',
    whyRead: '文人画传统的真正奠基人不是赵孟頫，而是苏轼。他用一首诗、几句话，就把中国画从"画得像"的追求中解放了出来。如果你想理解为什么中国画家那么看重"士气"，这本书是钥匙。'
  },
  {
    id: 'zhao-mengfu-lunhua',
    title: '《松雪斋题画诗》',
    author: '赵孟頫',
    category: 'classic',
    dynasty: '元',
    relatedPainterIds: ['zhao-mengfu'],
    relatedDynastyIds: ['yuan'],
    coverEmoji: '🖊️',
    description: '元代大画家赵孟頫的题画诗集。其中"石如飞白木如籀，写竹还应八法通"等诗句，集中体现了他"以书入画"、"书画同源"的艺术主张。',
    whyRead: '你已经看到赵孟頫在知识树中是连接宋元和开启文人画正脉的关键人物。他的题画诗不是附庸风雅，而是在宣告一种全新的绘画美学——从此，画画和写字变成了同一件事。'
  },
  {
    id: 'xu-huayulu',
    title: '《叙画》',
    author: '王微',
    category: 'classic',
    dynasty: '南朝宋',
    relatedPainterIds: ['wang-wei-liu-chao'],
    relatedDynastyIds: ['wei-jin'],
    coverEmoji: '🌊',
    description: '南朝宋画家王微的山水画论，与宗炳《画山水序》同为中国最早的山水画理论文献。主张山水画要"本乎形者融灵，而动变者心也"。',
    whyRead: '宗炳说山水画要"畅神"，王微则说要"望秋云，神飞扬，临春风，思浩荡"。两个人的话放在一起读，你就会明白：为什么中国人看山水，从来不是在看风景，而是在和天地精神相往来。'
  },
  {
    id: 'doc-ming-four',
    title: '纪录片《明四家：吴门画派的艺术》',
    category: 'documentary',
    relatedDynastyIds: ['ming'],
    relatedSchoolIds: ['wumen'],
    coverEmoji: '🎥',
    description: '聚焦明代"吴门四家"——沈周、文徵明、唐寅、仇英的纪录片，展现了十五六世纪苏州繁华的文化生态与画家们的风雅生活。',
    whyRead: '当你在知识树中看到"明四家"时，可曾想象过五百年前的苏州是什么样子？文徵明的庭院、唐寅的桃花坞、沈周的东庄——这部片子会带你穿越回那个中国文人艺术的黄金时代。'
  },
  {
    id: 'doc-qing-four-monks',
    title: '纪录片《清初四僧：乱世中的画魂》',
    category: 'documentary',
    relatedDynastyIds: ['qing'],
    relatedPainterIds: ['shi-tao', 'ba-da-shan-ren', 'kun-can', 'hong-ren'],
    coverEmoji: '🎬',
    description: '讲述清初"四僧"——八大山人、石涛、髡残、弘仁故事的纪录片，深入解读他们在明亡清兴的大变局中如何以笔墨为武器、以绘画为归宿。',
    whyRead: '你在知识树中看到的只是生卒年和风格关键词，而这部片子会告诉你：八大山人为什么总画翻白眼的鸟？石涛为什么说"墨海中立定精神"？这四个和尚的画里，藏着一个朝代的泪。'
  },
  {
    id: 'exh-nanjing-museum',
    title: '南京博物院·中国古代绘画数字展',
    category: 'exhibition',
    coverEmoji: '🏛️',
    description: '南京博物院藏中国古代绘画线上展览，其"傅抱石金刚坡时期"专题与明清绘画收藏独具特色。',
    whyRead: '南京博物院的明清绘画收藏是国内翘楚，尤其"四王吴恽"和"四僧"的作品系统而精彩。配合你正在学习的清代画派脉络，这个展览可以让你直观对比正统派与革新派的笔墨差异。',
    sourceUrl: 'https://www.njmuseum.com'
  },
  {
    id: 'exh-british-museum',
    title: '大英博物馆·中国绘画在线收藏',
    category: 'exhibition',
    coverEmoji: '🎡',
    description: '大英博物馆的中国绘画在线藏品数据库，其中顾恺之《女史箴图》（唐摹本）是最重要的早期人物画遗存。',
    whyRead: '顾恺之《女史箴图》的唐摹本藏于大英博物馆，这是我们能看到的最接近"春蚕吐丝"描法的实物。当你在知识树中读到顾恺之的名字时，不妨在这里看看那根线条究竟有多美。',
    sourceUrl: 'https://www.britishmuseum.org'
  },
  {
    id: 'zhongguo-shanshuihua-tongshi',
    title: '《中国山水画通史》',
    author: '陈传席',
    category: 'academic',
    coverEmoji: '📕',
    description: '美术史学者陈传席教授的代表作，系统论述了中国山水画从魏晋到近现代的发展历程，史料丰富，观点鲜明。',
    whyRead: '你在知识树中浏览的是山水画的"骨架"，而这本书会给它填上血肉。每个画家的师承关系、每派风格的演变脉络、每次画风变革的社会原因——读完你会发现，山水画史本身就是一部中国知识分子的心灵史。'
  },
  {
    id: 'wenrenhua-jingshen',
    title: '《文人画的美学》',
    author: '伍蠡甫',
    category: 'academic',
    coverEmoji: '🌸',
    description: '著名美学家伍蠡甫先生的论文集，从美学角度深入探讨文人画的形成、特征与精神内涵，是理解文人画传统的经典著作。',
    whyRead: '"文人画"三个字你听过无数次，但到底什么是"文人画"？是画得"简"？是画上题字？伍蠡甫先生会告诉你：文人画的本质不是一种技法，而是一种生命态度——一种拒绝"为画而画"的自由精神。'
  }
];
