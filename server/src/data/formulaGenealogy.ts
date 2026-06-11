import type { FormulaElement } from '../types';

export const formulaElements: FormulaElement[] = [
  {
    id: 'pima-cun',
    category: 'cun',
    categoryName: '皴法',
    name: '披麻皴',
    alias: ['麻皮皴', '矾头皴'],
    origin: '始创于五代董源，为江南山水画派的标志性皴法',
    definition: '以柔韧舒展的长线条披拂而下，如麻丝披散，用以表现江南丘陵土石相间、草木华滋的温润质感。其线条多圆弧弯曲，排列疏松，层层叠加，由淡入浓，干湿互用。',
    culturalContext: '披麻皴的诞生，标志着中国山水画从"勾勒填色"的青绿传统向"墨笔晕染"的文人体系的重大转折。它不仅是一种技法，更是江南文人"平淡天真"审美理想的视觉载体。',
    variants: [
      {
        id: 'pima-dongyuan',
        year: 950,
        yearDisplay: '五代南唐（约950年）',
        dynastyId: 'five-dynasties',
        painterName: '董源',
        paintingTitle: '《潇湘图》',
        name: '董源初创·古拙披麻',
        description: '董源首创披麻皴，以表现江南丘陵的浑圆与温润。线条较长，排列疏松，如麻丝下垂，笔意古拙天真。',
        techniqueDescription: '用中锋圆笔写出长线条，略带弧度，如披麻之状。线条之间互不交叉，层层叠加，先淡后浓，干笔湿笔互用。山石顶部略加矾头（碎石堆叠之状），点以浓墨苔点。',
        visualPrompt: 'Ancient Chinese landscape painting style, Dong Yuan\'s Pi Ma cun texture strokes, long soft curved lines like hemp fibers flowing down hills, sparse arrangement, light ink layers, Jiangnan rolling hills, warm and moist atmosphere',
        personalPursuit: '董源身为南唐北苑副使，却无心仕途，常游于江南山水间。他追求的不是北方山水的雄奇壮美，而是故乡金陵一带"山有棱而不锐，水有波而不险"的平淡天真之境。他说："我师造化，不师古人。"',
        eraPressure: '五代时期，画坛仍以北方荆浩、关仝的雄峻山水为正宗。江南山水因缺乏"险峻"之姿，被视为"不入画品"。董源必须在"正宗"之外，为南方山水找到属于自己的语言。',
        transformation: '从北方山水画的"刚劲斧劈"中蜕化而出，将坚硬的石纹转化为柔软的麻丝，将外露的骨力内敛为温润的气韵——这是一次从"壮美"到"优美"的审美范式革命。',
        keyFeatures: ['线条长而圆浑', '排列疏松不交叉', '先淡后浓层层叠加', '山石顶部有矾头', '苔点点缀其间']
      },
      {
        id: 'pima-juran',
        year: 980,
        yearDisplay: '北宋初年（约980年）',
        dynastyId: 'song',
        painterName: '巨然',
        paintingTitle: '《秋山问道图》',
        name: '巨然承续·淡墨披麻',
        description: '巨然作为董源的法嗣，在披麻皴中融入更多淡墨渲染，使山石更显湿润氤氲，开创"淡墨轻岚"的新境界。',
        techniqueDescription: '在董源披麻皴的基础上，增加淡墨渲染的层次。皴笔更短更密，墨色更淡，常于皴后以清水笔晕染，使线与面融为一体。山顶矾头更多更圆润，苔点改为大而圆的"弹窝点"。',
        visualPrompt: 'Juran style Chinese landscape, lighter and softer Pi Ma cun strokes, more ink wash blending, misty mountains, layered subtle ink gradients, rounder mountain tops with gravel clusters, moist atmospheric Jiangnan scenery',
        personalPursuit: '巨然是江宁开元寺僧人，一生云水为伴。他追求的是"禅境山水"——不是视觉上的逼真，而是心灵上的空寂。他说："画山不必似真山，要在似与不似之间见道心。"',
        eraPressure: '北宋初年，范宽、李成的北方雄峻山水笼罩画坛。作为南方来的僧人，巨然必须在"刚健"与"柔弱"的审美对抗中，为董源一脉争取生存空间。',
        transformation: '将董源偏于写实的皴法进一步虚化、淡化，从"状物"走向"写意"，从"江南风景"升华为"禅意境界"——这是文人画"重意轻形"的重要一步。',
        keyFeatures: ['皴笔更短更密', '淡墨渲染加重', '线与面浑然一体', '山顶矾头圆润', '弹窝大点']
      },
      {
        id: 'pima-zhaomengfu',
        year: 1300,
        yearDisplay: '元代（约1300年）',
        dynastyId: 'yuan',
        painterName: '赵孟頫',
        paintingTitle: '《鹊华秋色图》',
        name: '子昂复古·书法披麻',
        description: '赵孟頫以"书画同源"理论改造披麻皴，将书法的篆籀笔意融入皴线，使原本柔软的披麻增添了"绵里裹针"的骨力。',
        techniqueDescription: '以篆籀笔法写披麻皴，线条圆浑如"锥画沙"，用笔藏头护尾，力量内含。看似柔软，实则力透纸背。皴线之间偶见飞白，墨色干润相济，如书法之用笔。',
        visualPrompt: 'Zhao Mengfu style landscape, calligraphic Pi Ma cun texture strokes, seal script brushwork aesthetic, rounded vigorous lines hidden strength, dry brush with occasional flying white, classical archaic elegance',
        personalPursuit: '赵孟頫身为宋宗室而仕元，内心充满矛盾。他提倡"古意"，以远追唐宋为号召，实则是要在异族统治下，为汉族文人守住艺术的精神根脉。他说："作画贵有古意，若无古意，虽工无益。"',
        eraPressure: '南宋院体画"工巧有余，古意不足"的流弊已深，元代画坛急需一场"托古改制"的运动。同时，作为"贰臣"，赵孟頫的艺术主张必须披上"复古"的外衣才能获得认同。',
        transformation: '将书法的骨力注入柔婉的披麻皴，创造"绵里裹针"的新质感——外柔内刚，正是赵孟頫身处乱世的人格写照，也是"书画同源"从理论到实践的真正落地。',
        keyFeatures: ['篆籀笔法入画', '绵里裹针内含骨力', '飞白与干笔', '藏头护尾用笔', '古意盎然']
      },
      {
        id: 'pima-huanggongwang',
        year: 1350,
        yearDisplay: '元代至正年间（约1350年）',
        dynastyId: 'yuan',
        painterName: '黄公望',
        paintingTitle: '《富春山居图》',
        name: '大痴松秀·干笔披麻',
        description: '黄公望将披麻皴推向"逸品"巅峰。其干笔松秀之皴，"干而不枯，湿而不滑"，如行云流水，天真烂漫，为"文人画"的最高典范。',
        techniqueDescription: '以极干之笔写出松灵的披麻皴，线条飘逸松散，如不着力。皴笔极简，常一笔之中兼具干湿浓淡。山石轮廓与皴笔融为一体，不分彼此。所谓"峰峦浑厚，草木华滋"，全在松秀一笔之间。',
        visualPrompt: 'Huang Gongwang Fuchun Mountain style, extremely dry brush Pi Ma cun, loose elegant flowing strokes, light and airy texture, dry but not withered, spontaneous natural charm, literati painting highest aesthetic',
        personalPursuit: '黄公望中年入狱，出狱后入道，号"大痴道人"。他追求的是"逸"——一种超越世俗规范的自由。他隐居富春江畔数十年，画的不是风景，而是他那颗"与山水同化"的自由心灵。',
        eraPressure: '元代文人地位低下，"九儒十丐"。画家要么入仕受辱，要么隐居守节。黄公望必须在物质极度匮乏的条件下，用最简约的笔墨，表达最丰富的精神世界。',
        transformation: '将赵孟頫"绵里裹针"的披麻进一步松化、简化、干化，从"有法"走向"无法"，从"功夫"走向"天然"——这是"寄乐于画"的文人画理想的最终完成。',
        keyFeatures: ['干笔松秀', '线条飘逸松散', '干湿浓淡一笔中求', '皴笔极简', '逸品巅峰']
      },
      {
        id: 'pima-wangyuanqi',
        year: 1690,
        yearDisplay: '清代康熙年间（约1690年）',
        dynastyId: 'qing',
        painterName: '王原祁',
        paintingTitle: '《仿大痴山水图》',
        name: '麓台规范·结构披麻',
        description: '王原祁作为"四王"正统派的集大成者，将黄公望的披麻皴系统化、规范化、学理化，创立"龙脉"说，使披麻皴成为可传授、可复制的"金科玉律"。',
        techniqueDescription: '将披麻皴纳入"龙脉"结构体系，皴笔层层积染，由淡入浓，由疏入密，反复皴擦多遍，形成"毛、松、厚、润"的视觉效果。山石以"块"为单位组合，皴笔严格服务于结构的起承转合。',
        visualPrompt: 'Wang Yuanqi orthodox style, structured Pi Ma cun texture, systematic layered ink accumulation, dragon vein composition structure, multiple layers of rubbing strokes, scholarly academic precision, dense but breathable texture',
        personalPursuit: '王原祁身为翰林院学士、画坛领袖，追求的是"集古大成，自有我在"——既要全面继承前人传统，又要建立可供后学遵循的法度。他说："学不师古，如夜行无火。"',
        eraPressure: '清初画坛门户林立，"正统"与"野逸"之争激烈。作为"四王"的领袖和朝廷认可的画坛正宗，王原祁必须将松散的文人画传统整理为严密的体系，以确立"正统"的话语霸权。',
        transformation: '将黄公望"逸笔草草"的披麻皴转化为严密工整的"学院派"技法。自由的笔触被纳入严格的结构逻辑，天真的写意变成了可复制的程序——这是从"艺术家的创作"到"教科书的范式"的关键转变。',
        keyFeatures: ['层层积染反复皴擦', '龙脉结构章法严谨', '毛松厚润的质感', '块面组合清晰', '规范化可传授']
      },
      {
        id: 'pima-modern',
        year: 1950,
        yearDisplay: '近现代（约1950年）',
        dynastyId: 'modern',
        painterName: '黄宾虹 / 李可染',
        paintingTitle: '黄宾虹《山水图》、李可染《漓江胜境图》',
        name: '近代解构·墨色披麻',
        description: '近现代画家对披麻皴进行解构与重组。黄宾虹以"五笔七墨"将披麻融入"浑厚华滋"的积墨体系；李可染则将西画光影引入，使古老皴法焕发新生。',
        techniqueDescription: '黄宾虹：将披麻皴线条破碎为"不齐之齐"的点线面，以浓、淡、破、泼、积、焦、宿七墨层层叠加，形成"千点万点"的浑厚华滋。李可染：保留披麻皴的线条结构，但加入逆光与投影的处理，皴笔服务于光影，使传统皴法具有了现代视觉表现力。',
        visualPrompt: 'Modern Chinese landscape, deconstructed Pi Ma cun texture, Huang Binhong style thick layered ink with massive dot clusters, Li Keran style backlight shadows integrated with traditional strokes, fusion of Eastern and Western techniques',
        personalPursuit: '黄宾虹一生研究传统，追求"浑厚华滋"的民族精神；李可染则主张"用最大的功力打进去，用最大的勇气打出来"，致力于传统山水画的现代转型。',
        eraPressure: '西方绘画全面传入中国，"中国画改良论"风起云涌。传统皴法要么被视为"封建糟粕"而遭摒弃，要么被视为"僵化程式"而需改良。画家必须在"传统与现代"、"东方与西方"之间找到第三条路。',
        transformation: '从"线的披麻"走向"面的披麻"、"墨的披麻"、"光的披麻"。皴法不再是固定的程式，而是艺术家可以自由拆解、重组、融合的"基因片段"——古老的程式在解构中获得了永恒的生命力。',
        keyFeatures: ['皴线破碎重组', '积墨浑厚华滋', '光影与皴法结合', '中西技法融合', '程式的当代转化']
      }
    ],
    aiGuide: {
      opening: '你好！我是你的AI导师。今天，我们将一起追踪中国画中最著名的程式之一——"披麻皴"的千年旅程。请拖动下方的时间滑块，从董源初创的五代，一路走到现代变革的今天。在每一个历史节点，都有一位画家在等待与你对话。准备好了吗？让我们从董源开始吧～',
      questions: [
        {
          id: 'q1',
          question: '董源为什么要"发明"披麻皴？他在对抗什么？',
          hint: '想想看：北方山水的皴法是什么样子的？江南的山和北方的山有什么不同？'
        },
        {
          id: 'q2',
          question: '从巨然的"淡墨渲染"到黄公望的"干笔松秀"，墨色为什么越来越干？这背后有什么精神内涵？',
          hint: '关注两位画家的身份——一个是僧人，一个是道士。他们追求什么样的境界？'
        },
        {
          id: 'q3',
          question: '赵孟頫为什么要把"书法"融入绘画？"绵里裹针"仅仅是一个技法描述吗？',
          hint: '赵孟頫的人生处境很特殊——他是宋朝宗室，却在元朝做官。想想看，"外柔内刚"是不是也在说他自己？'
        },
        {
          id: 'q4',
          question: '王原祁把披麻皴"规范化"，你认为这是进步还是倒退？一种自由的艺术程式，是否应该被纳入"教科书"？',
          hint: '黄公望的披麻是"逸笔草草"，王原祁的披麻是"层层积染"。两种风格的差异背后，是两种不同的"画家身份"——在野的隐士 vs 在朝的官员。'
        },
        {
          id: 'q5',
          question: '近现代画家对披麻皴的"解构"，是不是意味着传统程式的"死亡"？还是说，程式只有在被打破的时候才真正活着？',
          hint: '想想"基因"这个比喻——基因会突变，会重组，会进化。程式是不是也是如此？'
        }
      ],
      conclusion: '非常好！你已经完整走过了披麻皴的千年旅程。从董源对抗北方"正宗"的勇敢创新，到黄公望"逸笔草草"的自由境界，再到王原祁集大成的规范化，最后到近现代的解构与重生——你会发现，每一次程式的微小变化，都不是技术的偶然，而是时代审美压力与画家个人追求共同作用的结果。记住：皴法从来不只是"怎么画山"的技法，它更是画家"怎么看世界"的哲学，是一个时代"怎么感知美"的集体无意识。继续探索其他程式吧，每一个程式都是一部浓缩的画史！'
    }
  },
  {
    id: 'yudian-cun',
    category: 'cun',
    categoryName: '皴法',
    name: '雨点皴',
    alias: ['芝麻皴', '豆瓣皴', '刮铁皴'],
    origin: '始创于北宋范宽，为北方山水画派的标志性皴法',
    definition: '以密集短促的笔触凿出山石的坚硬质感，如雨点敲击墙面，又如芝麻散布石上。笔触刚劲有力，方向多变，层层堆积，表现关中一带山岳浑厚雄强的阳刚之气。',
    culturalContext: '雨点皴是"宋人格物致知"精神在绘画中的极致体现——画家以近乎科学观察的精确性，研究关中石质山体的结构与质感，最终创造出这种"与山传神"的伟大程式。',
    variants: [
      {
        id: 'yudian-fankuan',
        year: 1010,
        yearDisplay: '北宋真宗年间（约1010年）',
        dynastyId: 'song',
        painterName: '范宽',
        paintingTitle: '《溪山行旅图》',
        name: '范宽初创·雄强雨点',
        description: '范宽独创雨点皴，以表现关中秦岭一带石质山岳的雄伟与坚硬。其笔触如铁锤钉钉，力透纸背，"抢笔俱均"，是"宋人格物"精神的视觉巅峰。',
        techniqueDescription: '以中锋直笔垂直点凿，笔触短而劲，如雨点之状。笔触方向略异，但整体朝向一个中心。层层叠加，先淡后浓，至最厚处以焦墨点簇。山石轮廓以浓墨粗笔写出，内廓结构以雨点皴填满，"如行夜山，秋林阴郁"。',
        visualPrompt: 'Fan Kuan style Chinese landscape painting, Yu Dian cun rain-drop texture strokes, dense short vigorous hammering dots, hard rocky Guanzhong mountain texture, massive towering cliff, Northern Song monumental landscape',
        personalPursuit: '范宽隐居终南山、太华山中，"居山林间，常危坐终日，纵目四顾，以求其趣"。他追求的不是"形似"，而是"山之骨"——他要画出的是山岳那种"天行健，君子以自强不息"的阳刚精神。他说："前人之法，未尝不近取诸物，吾与其师于人者，未若师诸物也；吾与其师于物者，未若师诸心。"',
        eraPressure: '北宋山水画坛，先有李成的"平远寒林"独步天下，后有晁补之等人对"齐鲁之士，惟摹营丘（李成）"的不满。范宽作为关中人，必须在"李派"笼罩下，为北方雄峻山水另辟蹊径。',
        transformation: '从荆浩"笔墨并重"的"小斧劈"皴中蜕变，将细碎的笔触进一步密集化、刚劲化、点凿化，以"点"代"线"，以"力"代"韵"——这是中国山水画"壮美"美学的最极致表达。',
        keyFeatures: ['中锋直笔点凿', '笔触短而刚劲', '层层堆积由淡入浓', '轮廓与内廓一体', '如铁锤钉钉力透纸背']
      },
      {
        id: 'yudian-jiangui',
        year: 1160,
        yearDisplay: '南宋绍兴年间（约1160年）',
        dynastyId: 'song',
        painterName: '江参',
        paintingTitle: '《千里江山图》（局部）',
        name: '江参变体·温润雨点',
        description: '江参将范宽雄强的雨点皴与江南的温润空气结合，笔触略柔和，墨色略淡，形成"南韵北骨"的独特面貌。',
        techniqueDescription: '保留雨点皴的点状笔触，但用笔略柔和，墨色略淡，笔触间距略疏。常于皴后以淡墨轻染，使坚硬的石质略带温润之气。是北派皴法南传的重要过渡形态。',
        visualPrompt: 'Jiang Can style, softer Yu Dian cun texture, merging Northern strength with Southern moistness, slightly gentler dot strokes, lighter ink, subtle atmospheric blending between dots',
        personalPursuit: '江参是南宋初湖州人，一生"居苕霅间，以画自娱"。他既仰慕范宽的雄强，又深怀江南的温润，试图在南北之间找到一条融合之路。',
        eraPressure: '宋室南渡后，画坛重心移至江南。以李唐、刘松年为代表的"院体"日益精巧细腻。作为在野的文人画家，江参必须回应：北派的"雄强"能否在江南的"温润"中存活？',
        transformation: '将坚硬的"凿"变为柔和的"点"，在保留北派骨力的同时，注入南派的气韵——这是"南北宗"分野之前，画家自发进行的一次"南北融合"实验。',
        keyFeatures: ['笔触略柔和', '墨色略淡', '皴后轻染', '南韵北骨', '南北融合的先声']
      },
      {
        id: 'yudian-wangshimin',
        year: 1660,
        yearDisplay: '清代顺治年间（约1660年）',
        dynastyId: 'qing',
        painterName: '王时敏',
        paintingTitle: '《仿范宽山水图》',
        name: '烟客摹古·程式化雨点',
        description: '王时敏以"摹古"为己任，将范宽雨点皴纳入"宋元正派"的传承体系，使其成为可学习、可复制的经典范式。',
        techniqueDescription: '严格遵循范宽雨点皴的基本形态，但笔触更趋于规整统一，缺少原作那种"生辣"的野气。墨色层次清晰，由淡至浓循序渐进，体现了"正统派"对"古法"的敬畏与整理。',
        visualPrompt: 'Wang Shimin orthodox antique style, formalized Yu Dian cun texture, more regular and uniform dot patterns, clear layered ink gradations, scholarly respect for ancient methods, academic precision',
        personalPursuit: '王时敏是明首辅王锡爵之孙，明亡后隐居不仕。他以"护持正法"为己任，希望通过对"宋元大家"的系统摹仿，为风雨飘摇中的汉族文化保留一脉"正传"。',
        eraPressure: '明亡清兴，"正统"与"野逸"的画派之争白热化。王时敏作为"画坛领袖"，必须建立一套清晰可辨的"正宗"谱系，以与徐渭、八大等人的"野逸"画风分庭抗礼。',
        transformation: '将范宽充满个性与野气的雨点皴，转化为代表"古法"的通用符号。独特的艺术创造被纳入普适的传承体系——这是程式从"活的创造"到"法的传承"的典型路径。',
        keyFeatures: ['笔触规整统一', '墨色层次分明', '摹古的严谨性', '缺原创野气', '正宗法脉']
      }
    ],
    aiGuide: {
      opening: '欢迎来到"雨点皴"的世界！这种如铁锤钉钉般的笔触，是北宋范宽为了描绘关中秦岭的坚硬石质而创造的。让我们拖动时间线，看看这种"阳刚之极"的皴法，在千年中经历了怎样的命运流转。',
      questions: [
        {
          id: 'q1',
          question: '范宽为什么要用"雨点"而不是"线条"来画山？这和他"居山林间，危坐终日"的生活方式有什么关系？',
          hint: '关中山的质感和江南山的质感完全不同。想想看，你用手摸石头和摸土坡，感觉有什么不一样？'
        },
        {
          id: 'q2',
          question: '江参为什么要把范宽的雨点"变软"？南渡之后，画家的眼睛发生了什么变化？',
          hint: '宋室南渡，画家从干燥的关中迁到湿润的江南。他们每天看到的山，还一样吗？'
        },
        {
          id: 'q3',
          question: '王时敏摹古的雨点皴，和范宽原创的相比，"少了点什么"？那缺少的东西是什么？',
          hint: '范宽是"师诸心"——画的是他自己感受到的山；王时敏是"师诸人"——画的是范宽画过的山。这中间差了什么？'
        }
      ],
      conclusion: '太棒了！你走完了雨点皴的旅程。从范宽"师诸心"的原创冲动，到江参"南北融合"的温和调整，再到王时敏"护持正法"的经典化——每一步变化，都对应着画家所处的地理环境、时代氛围和身份立场。请记住：一个程式的"刚"与"柔"，从来不是单纯的技法选择，而是画家与世界相处方式的体现。'
    }
  },
  {
    id: 'fupi-cun',
    category: 'cun',
    categoryName: '皴法',
    name: '斧劈皴',
    alias: ['大斧劈', '小斧劈', '带水斧劈'],
    origin: '始创于南宋李唐，为院体山水画的标志性皴法',
    definition: '以侧锋横扫出如斧劈木的块面笔触，笔触利落肯定，棱角分明，表现山石的坚硬陡峭和体面转折。有大斧劈（笔触阔大）、小斧劈（笔触细碎）、带水斧劈（水墨淋漓）之分。',
    culturalContext: '斧劈皴是南宋"一角半边"构图在笔墨层面的对应物。它以刚猛果断的笔触，塑造了那个偏安江南却不甘偏安的时代的独特美学气质。',
    variants: [
      {
        id: 'fupi-litang',
        year: 1140,
        yearDisplay: '南宋绍兴年间（约1140年）',
        dynastyId: 'song',
        painterName: '李唐',
        paintingTitle: '《万壑松风图》',
        name: '李唐初创·侧锋斧劈',
        description: '李唐南渡后创斧劈皴，以侧锋横扫出棱角分明的块面，既保留了范宽的雄强骨力，又融入了江南山水的湿润感，开南宋院体山水之先河。',
        techniqueDescription: '以侧锋卧笔横扫，笔触如斧劈木，落笔重，起笔轻，笔触之间形成清晰的块面。山石轮廓以浓墨勾勒，内廓以斧劈皴填充，皴笔方向顺从山石结构转折。常兼用"带水皴"——一笔之中兼具水墨，使块面边缘自然晕化。',
        visualPrompt: 'Li Tang style, Fu Pi cun axe-cut texture strokes, side brush sweeping strokes creating angular rock facets, sharp edges and corners, stone solid blocky structure, Southern Song academic landscape, bold decisive strokes',
        personalPursuit: '李唐是北宋画院待诏，南渡后流落临安，卖画为生，后被宋高宗识重。他说："雪里烟村雨里滩，看之如易作之难。早知不入时人眼，多买胭脂画牡丹。"——他追求的是不迎合世俗的艺术品格。',
        eraPressure: '南渡之后，中原故土沦丧，"中原山河"成为南宋臣民心中永远的痛。李唐必须在江南的温润气候中，画出北方山河的雄峻之气——这不仅是技法问题，更是政治与情感的双重诉求。',
        transformation: '从范宽雨点皴的"点"过渡到侧锋横扫的"面"，在保留北方雄强骨力的同时，以水墨淋漓的块面适应江南的湿润气候——这是北派皴法在南方土壤中的创造性转化。',
        keyFeatures: ['侧锋卧笔横扫', '棱角分明的块面', '落笔重起笔轻', '带水皴水墨淋漓', '北骨南韵']
      },
      {
        id: 'fupi-mayuan',
        year: 1195,
        yearDisplay: '南宋宁宗年间（约1195年）',
        dynastyId: 'song',
        painterName: '马远',
        paintingTitle: '《踏歌图》',
        name: '马远一角·水墨斧劈',
        description: '马远将斧劈皴进一步凝练简化，以"一角"之景，水墨淋漓的大斧劈，创造了"残山剩水"的独特意境，暗合南宋偏安的时代心理。',
        techniqueDescription: '以阔大的侧锋横扫出"大斧劈"块面，笔触更大更整，常以"带水斧劈"一笔而成，水墨淋漓，自然晕化。构图取"一角"之景，大面积留白与坚实的斧劈山石形成强烈对比。',
        visualPrompt: 'Ma Yuan one-corner composition style, large wet Fu Pi cun axe-cut brushstrokes, massive solid rock blocks, dramatic ink splashes with natural bleeding, one-side composition with vast empty space, Southern Song poetic minimalism',
        personalPursuit: '马远是画院世家，号"马一角"。他追求的是"以少胜多"——以最少的笔墨，传达最深的情感。画面上的"空"，不是虚无，而是对"不在场"的中原故土的无言追念。',
        eraPressure: '宁宗朝，偏安已成定局，"恢复中原"从政治口号变成了文人心中的隐痛。马远的"一角山水"，在"剩水残山"中，曲折地表达了这种无法明言的时代情绪。',
        transformation: '将李唐较为丰富的斧劈皴进一步极简、放大，从"多"到"一"，从"实"到"虚"——这是院体画从"写实"走向"诗意"的关键一步，也是"残山剩水"成为一代美学的开端。',
        keyFeatures: ['大斧劈笔触阔大', '带水皴水墨淋漓', '一角构图极简', '虚实对比强烈', '诗意化表达']
      },
      {
        id: 'fupi-daijin',
        year: 1450,
        yearDisplay: '明代景泰年间（约1450年）',
        dynastyId: 'ming',
        painterName: '戴进',
        paintingTitle: '《风雨归舟图》',
        name: '戴进浙派·刚猛斧劈',
        description: '戴进作为"浙派"创始人，遥接南宋马、夏传统，将斧劈皴推向更刚猛、更外露的极致，开创了明代院体画的新风尚。',
        techniqueDescription: '以侧锋猛扫，笔触更粗犷、更外露、更具动感。斧劈皴块面更大，棱角更锐利，常以飞白笔触表现速度感。墨色对比强烈，黑白分明，充满戏剧张力。',
        visualPrompt: 'Dai Jin Zhe school style, fierce dynamic Fu Pi cun axe-cut strokes, more aggressive sharp edges, strong flying white effects, dramatic black and white contrast, powerful movement expression',
        personalPursuit: '戴进是钱塘人，原为银工，后改学画，入画院又被排挤。他追求的是一种"不平则鸣"的力量感——以刚猛外露的笔触，抒发其人生的坎坷与愤懑。',
        eraPressure: '明代画坛，先是"元四家"的文人画风笼罩，后有吴门画派的文雅之气兴起。作为职业画家的戴进，必须以"刚猛外露"与文人画的"温柔含蓄"分庭抗礼。',
        transformation: '将南宋马、夏含蓄内敛的斧劈皴，推向刚猛外露的极致。从"诗意"的表达变为"力量"的宣泄——这是职业画家对文人画审美霸权的一次反叛。',
        keyFeatures: ['笔触粗犷外露', '棱角锐利飞白', '戏剧化墨色对比', '动感强烈', '浙派风骨']
      },
      {
        id: 'fupi-tangyin',
        year: 1505,
        yearDisplay: '明代弘治年间（约1505年）',
        dynastyId: 'ming',
        painterName: '唐寅',
        paintingTitle: '《山路松声图》',
        name: '六如居士·文人斧劈',
        description: '唐寅（唐伯虎）将浙派刚猛的斧劈皴与吴门文人画的文雅之气融合，创造了"刚柔相济"的文人化斧劈皴。',
        techniqueDescription: '保留斧劈皴的侧锋块面，但笔触更柔和、更含蓄，棱角被磨去了几分锐利。常将斧劈与披麻皴混用，墨色层次更丰富，于刚健中透出秀雅之气。',
        visualPrompt: 'Tang Yin style, scholarly refined Fu Pi cun, softer scholarly axe-cut texture blending with Pi Ma cun, gentle but firm strokes, richer ink layers, elegant literary aesthetic combined with structural strength',
        personalPursuit: '唐寅是"吴中四才子"之一，科场失意后以卖画为生。他既怀文人之志，又具职业画家之能，追求的是"不废功力而能士气"——既有精湛技法，又有文人品格。',
        eraPressure: '明中期，"浙派"因其"刚猛外露"被文人贬为"野狐禅"，"吴派"文人画日益占据话语霸权。唐寅必须在"职业画家的技法"与"文人画家的品格"之间找到平衡点。',
        transformation: '将刚猛外露的浙派斧劈皴柔化、文雅化，使其从"匠人之技"升华为"文人之艺"——这是程式在不同社会阶层之间流动时的典型蜕变。',
        keyFeatures: ['笔触较柔和含蓄', '斧劈披麻混用', '墨色层次丰富', '刚柔相济', '士气与功力兼备']
      }
    ],
    aiGuide: {
      opening: '欢迎探索"斧劈皴"的旅程！这种如利斧劈木般的笔触，是南宋院体画家在江南湿润的空气中，用笔墨重新塑造北方山河雄强气魄的伟大创造。拖动时间线，让我们看看它从李唐到唐寅的四百年嬗变。',
      questions: [
        {
          id: 'q1',
          question: '李唐南渡后为什么要发明斧劈皴？他从北方到南方，眼睛看到的山变了，心中的山有没有变？',
          hint: '李唐是北宋画院待诏，南渡时已经七八十岁了。他心中装着的，是怎样的山河？'
        },
        {
          id: 'q2',
          question: '马远的"一角构图"和他的"大斧劈"皴法有什么内在联系？为什么画面越空，笔触反而越"实"？',
          hint: '想想"少"和"多"的辩证法。一个东西越是少，它就越有力量。'
        },
        {
          id: 'q3',
          question: '戴进的"刚猛"和唐寅的"柔化"，为什么同一个程式会有如此相反的发展方向？这和两位画家的社会身份有什么关系？',
          hint: '戴进是"职业画家"（画工出身），唐寅是"文人画家"（虽卖画但仍属士大夫阶层）。他们面对的"观众"是同一批人吗？'
        }
      ],
      conclusion: '太棒了！你已经完成了斧劈皴的旅程。从李唐南渡后的悲愤创造，到马远"残山剩水"的诗意表达，到戴进的反叛性刚猛，再到唐寅的文人化柔化——你看到了吗？一个程式的命运，就是它所承载的时代精神和画家个体命运的缩影。每一次笔触的"刚"与"柔"之间，都站着一个活生生的人，一个风云变幻的时代。'
    }
  },
  {
    id: 'jiezidian-ye',
    category: 'dianye',
    categoryName: '点叶法',
    name: '介字点',
    alias: ['个字点', '竹叶点', '鼠足点'],
    origin: '始创于元代，成熟于明清，为文人画最具代表性的点叶法',
    definition: '以中锋三至五笔组合成"介"字或"个"字之状，如竹叶之形，用以表现丛树的整体感。其点法简洁概括，重"意"轻"形"，是"以书入画"的典型技法。',
    culturalContext: '介字点的流行，标志着中国山水画从"画树"到"写树"的观念转变——树不再是需要精确描摹的自然物象，而是可以用书法性笔触"书写"的情感载体。',
    variants: [
      {
        id: 'jiezidi-zhaomengfu',
        year: 1302,
        yearDisplay: '元代大德年间（约1302年）',
        dynastyId: 'yuan',
        painterName: '赵孟頫',
        paintingTitle: '《鹊华秋色图》',
        name: '子昂创制·书写介字',
        description: '赵孟頫以书法笔法创介字点，将竹叶的形态简化为"介"字状的书法性笔触，开启了"以书入画"在树法中的实践。',
        techniqueDescription: '以中锋写"介"字，五笔组合，每笔都是独立的书法线条，藏头护尾，力量内含。点与点之间留有空隙，排列松散自然。墨色统一，浓淡变化不大，重在笔法的书写意味。',
        visualPrompt: 'Zhao Mengfu style, Jie Zi dot leaf method, calligraphic character-like leaf dots, 5-stroke composition similar to writing Chinese character Jie, center brush strokes, sparse arrangement, calligraphy aesthetic in painting',
        personalPursuit: '赵孟頫提出"书画同源"理论，主张"石如飞白木如籀，写竹还于八法通"。他要证明：绘画不是低人一等的"技艺"，而是与书法同源的"士大夫之艺"。',
        eraPressure: '元代文人画家面临一个深刻的身份焦虑：绘画在儒家传统中被视为"小道"、"匠艺"。赵孟頫必须通过"以书入画"，提升绘画的文化地位，使其成为文人身份的合法表达。',
        transformation: '从宋代画家"形似摹写"的繁复点叶法，简化为书法性的"介"字符号——这是一次从"再现"到"表现"的观念革命，树法从此获得了独立的审美价值。',
        keyFeatures: ['中锋书写五笔', '书法性用笔', '排列松散自然', '墨色统一', '书画同源的实践']
      },
      {
        id: 'jiezidi-huanggongwang',
        year: 1350,
        yearDisplay: '元代至正年间（约1350年）',
        dynastyId: 'yuan',
        painterName: '黄公望',
        paintingTitle: '《富春山居图》',
        name: '大痴写意·松秀介字',
        description: '黄公望将介字点进一步松化、写意化，点法飘逸松散，如不着力，与其干笔披麻皴浑然一体，达到"逸品"境界。',
        techniqueDescription: '介字点的五笔更松散，常省略一两笔，或变体为"个"字三点。用笔轻捷飘洒，如飞如动，墨色干润相济。点与皴笔穿插交错，树与山的边界趋于模糊。',
        visualPrompt: 'Huang Gongwang style, loose elegant Jie Zi dots, freer lighter leaf strokes, sometimes abbreviated to 3 strokes Ge Zi, dry-wet ink interplay, dots blending seamlessly with texture strokes, literati freehand aesthetic',
        personalPursuit: '黄公望追求"逸"——一种超越一切法度的自由。他画树，不是画树的"形状"，而是画树的"生意"，更是画自己"与天地精神相往来"的自由心灵。',
        eraPressure: '元代晚期社会动荡，文人"学而优则仕"的道路被堵死。黄公望必须找到一种"寄乐于画"的方式，使绘画从"修身之具"变为"安身立命"的精神家园。',
        transformation: '将赵孟頫尚有规矩可循的介字点，推向"无招胜有招"的写意境界。从"法"到"意"，从"功夫"到"自然"——这是文人画审美追求的最高阶段。',
        keyFeatures: ['点法松散飘逸', '常省略变体', '用笔轻捷飘洒', '树山边界模糊', '逸品境界']
      },
      {
        id: 'jiezidi-shenzhou',
        year: 1490,
        yearDisplay: '明代弘治年间（约1490年）',
        dynastyId: 'ming',
        painterName: '沈周',
        paintingTitle: '《庐山高图》',
        name: '石田厚重·积墨介字',
        description: '沈周将介字点与积墨法结合，层层叠加，由淡入浓，使原本轻盈的介字点获得了"苍润浑厚"的厚重感，开创了吴门画派的点叶典范。',
        techniqueDescription: '介字点层层叠加，先淡后浓，反复点簇，每遍墨色略有不同。点法坚实肯定，排列密实厚重。墨色苍润，兼具干笔的"毛"与湿墨的"润"。',
        visualPrompt: 'Shen Zhou style, layered cumulative ink Jie Zi dots, multiple layers of ink from light to dark, dense solid arrangement, rich textured dark and moist ink, Wu school masterful technique',
        personalPursuit: '沈周是吴门画派领袖，一生隐居不仕。他追求的是"力"与"韵"的平衡——既要有元人的逸气，又要有宋人的骨力，于浑厚中见性情。',
        eraPressure: '明代中期，"元四家"的逸笔草草被部分末流画家学为"空疏无物"。沈周必须在"写意"与"功力"之间重建平衡，以纠时弊。',
        transformation: '将元代松秀空灵的介字点，改造为苍润浑厚的积墨点。从"简"到"繁"，从"空"到"实"——这是写意传统在面对流弊时的自我修正与复兴。',
        keyFeatures: ['层层积墨叠加', '点法坚实肯定', '排列密实厚重', '苍润兼具', '纠偏之功']
      }
    ],
    aiGuide: {
      opening: '让我们来探索一种最"书法"的点叶法——"介字点"！它看起来就像在写一个汉字"介"，这背后隐藏着中国文人画家一个了不起的抱负：要证明画画和写字是一回事。拖动时间线，看看这个"字"是怎么被写了几百年的。',
      questions: [
        {
          id: 'q1',
          question: '赵孟頫为什么要把"介"字这种汉字形态引入画树？他的"书画同源"仅仅是一个技法口号吗？',
          hint: '在古代，书法是士大夫的"本分"，绘画却常被视为"匠艺"。赵孟頫把书法带入绘画，是在为画家争取什么？'
        },
        {
          id: 'q2',
          question: '从赵孟頫的"规规矩矩写字"到黄公望的"潦潦草草写字"，介字点变得越来越"不像字"了。为什么越不"像"，反而越高明？',
          hint: '想想"得意忘形"这个成语。中国艺术追求的是"形"还是"意"？'
        },
        {
          id: 'q3',
          question: '沈周为什么要把介字点画得越来越"厚"？他在反对什么样的画风？',
          hint: '如果所有人都学黄公望"逸笔草草"，最后会变成什么样？'
        }
      ],
      conclusion: '非常好！你完成了介字点的旅程。从赵孟頫为绘画争地位的"书画同源"，到黄公望"得意忘形"的自由书写，再到沈周以厚重建平衡的纠偏——你发现了吗？程式的演变遵循着一种奇妙的"辩证法"：一个新程式诞生（正题），它被推向极致（反题），然后有人出来修正（合题），在更高的层次上开始新一轮循环。这就是艺术发展的内在逻辑！'
    }
  },
  {
    id: 'tielu-miao',
    category: 'miao',
    categoryName: '衣纹描法',
    name: '铁线描',
    alias: ['琴弦描', '高古游丝描'],
    origin: '源于魏晋，成熟于唐代，是中国画最古老、最基础的线描法',
    definition: '以中锋圆笔写出粗细均匀、力透纸背的线条，如铁丝般刚劲，又如琴弦般富有弹性。线条无粗细顿挫之变，全凭内在的骨力与韵律取胜，是"骨法用笔"的最纯粹形态。',
    culturalContext: '铁线描是中国绘画"以线造型"传统的根基。它源于魏晋"风骨"观念，与书法中的"篆隶"精神相通，体现了中国人"以简驭繁"、"寓刚于柔"的美学智慧。',
    variants: [
      {
        id: 'tielu-guhkazhi',
        year: 400,
        yearDisplay: '东晋（约400年）',
        dynastyId: 'wei-jin',
        painterName: '顾恺之',
        paintingTitle: '《女史箴图》',
        name: '顾恺之高古·春蚕吐丝',
        description: '顾恺之以"春蚕吐丝"般的高古游丝描，确立了中国人物画"以线造型"的千年传统。线条匀细连绵，循环超忽，如春风拂面，含蓄蕴藉。',
        techniqueDescription: '以中锋圆笔写出匀细线条，线条无粗细变化，如春蚕吐丝般连绵不断。用笔平缓沉静，力量内含，如锥画沙，如屋漏痕。线条之间平行排列，互不交叉，气脉贯通。',
        visualPrompt: 'Gu Kaizhi style, Tie Xian wire drawing line technique, ancient silk-spring quality lines, uniform continuous even strokes, no thickness variation, elegant flowing rhythm, Wei Jin dynasty figure painting aesthetic',
        personalPursuit: '顾恺之提出"以形写神"论，主张"传神写照，正在阿堵中"。他追求的不是外表的形似，而是人物内在的精神气韵。线条的"含蓄不露"，正是魏晋士人"得意忘言"的处世哲学的视觉体现。',
        eraPressure: '魏晋时期，绘画仍被视为"百工之艺"，地位远低于文学、书法。顾恺之必须在理论和实践两方面同时努力，为绘画建立独立的审美价值体系。',
        transformation: '将汉代绘画古拙粗率的线条，提炼为匀细连绵、富有韵律的"春蚕吐丝"——这是中国线条艺术从"实用"走向"审美"的第一步，也是"骨法用笔"论的实践开端。',
        keyFeatures: ['线条匀细无变化', '连绵不断如春蚕吐丝', '中锋圆笔力量内含', '平行排列气脉贯通', '高古含蓄']
      },
      {
        id: 'tielu-wudaozi',
        year: 750,
        yearDisplay: '唐代天宝年间（约750年）',
        dynastyId: 'tang',
        painterName: '吴道子',
        paintingTitle: '《送子天王图》',
        name: '吴带当风·莼菜条描',
        description: '吴道子改造铁线描，创造"莼菜条描"（又称"兰叶描"），线条有粗细顿挫之变，如莼菜叶片状，笔势圆转，衣服飘举，人称"吴带当风"。',
        techniqueDescription: '中锋行笔，但线条有粗细变化，起笔略细，中段略粗，收笔又细，如莼菜之状。用笔迅疾，笔势圆转飞动，线条之间穿插避让，充满动感与节奏感。',
        visualPrompt: 'Wu Daozi style, modified Tie Xian with Chun Cai water-shield leaf line variation, lines with thickness undulation, rapid calligraphic brushwork, flowing drapery in wind, dynamic rhythmic Tang dynasty painting',
        personalPursuit: '吴道子是"画圣"，一生画壁三百余间。他追求的是"落笔生风"的自由——不被法度束缚，在迅疾的挥洒中，让精神与笔墨融为一体。他说："众皆密于盼际，我则离披其点画。"',
        eraPressure: '唐代是中国绘画的鼎盛期，阎立本的"铁线"已达高古之境。吴道子必须在顾恺之、阎立本的基础上，找到属于自己的线描语言，才能开宗立派。',
        transformation: '从顾恺之"无粗细变化"的高古游丝，一变而为"有粗细顿挫"的莼菜条描——这是中国线条艺术从"含蓄"走向"张扬"、从"静"走向"动"的关键转折。',
        keyFeatures: ['线条有粗细变化', '起收细中段粗', '用笔迅疾飞动', '衣纹飘举当风', '动感与节奏感']
      },
      {
        id: 'tielu-likonglin',
        year: 1090,
        yearDisplay: '北宋元祐年间（约1090年）',
        dynastyId: 'song',
        painterName: '李公麟',
        paintingTitle: '《维摩演教图》',
        name: '龙眠白描·铁线正宗',
        description: '李公麟创立"白描"画法，以纯净的墨线塑造形象，不施丹青。其铁线描兼具顾恺之的高古与吴道子的飞动，达到了"不施丹青而光彩照人"的极致。',
        techniqueDescription: '线条以铁线为主，间以兰叶，粗细变化极微妙，全凭中锋骨力。线条极多但井然有序，穿插避让如行云流水。不设色彩，全凭线的韵律、节奏、力度、虚实来表现一切——质感、空间、情感。',
        visualPrompt: 'Li Gonglin style, pure ink Bai Miao line drawing, refined Tie Xian wire lines with subtle variations, no color applied, complex orderly line interweaving, Song dynasty scholar-official aesthetic purity',
        personalPursuit: '李公麟是北宋士大夫画家，"宋画中第一人"。他追求"雅正"——既非画工之"匠"，也非文人之"率"，而是在两者之间建立一种典雅纯正的"士夫画"品格。',
        eraPressure: '北宋中后期，院体画日趋富丽精工，文人画又过于简率写意。李公麟必须以"白描"这种方式，为士大夫阶层找到一种既高雅又有法度的绘画语言。',
        transformation: '将原本只是"造型手段"的线描，提升为独立的、纯粹的审美形式——"白描"从此成为一种独立的画科，铁线描也在李公麟手中获得了最纯正的形态。',
        keyFeatures: ['纯净墨线不施色彩', '中锋骨力极微妙变化', '线条繁而不乱', '典雅纯正', '白描画科之祖']
      },
      {
        id: 'tielu-chenlaolian',
        year: 1630,
        yearDisplay: '明代崇祯年间（约1630年）',
        dynastyId: 'ming',
        painterName: '陈洪绶',
        paintingTitle: '《水浒叶子》',
        name: '老莲变形·古拙铁线',
        description: '陈洪绶（老莲）将铁线描与造型的"变形"结合，线条古拙遒劲，如屈铁盘丝，人物造型夸张奇古，开创了晚明变形主义的独特画风。',
        techniqueDescription: '铁线描更为古拙，线条粗细较匀但转折处有"篆籀"之味，如屈铁盘丝般遒劲。人物造型刻意变形夸张，头大身短，形态奇古，线条服务于这种"宁拙勿巧"的造型追求。',
        visualPrompt: 'Chen Hongshou style, archaic distorted Tie Xian lines, exaggerated figure proportions, twisted metal coiled silk quality lines, intentionally strange ancient forms, late Ming deformationist aesthetic',
        personalPursuit: '陈洪绶是晚明"畸人"，科举屡败，后被召为中书舍人。他追求"宁拙勿巧，宁丑勿媚"——以一种刻意的"不完美"，对抗那个浮躁趋利、审美同质化的时代。',
        eraPressure: '晚明社会商品经济发达，绘画日益商品化、庸俗化。同时，王阳明心学和李贽"童心说"刺激了个性解放思潮。陈洪绶必须以"奇古变形"的方式，既反抗庸俗，又表达自我。',
        transformation: '从李公麟典雅纯正的"正常"铁线，一变而为古拙夸张的"变形"铁线。"形"被打破了，但"线"的精神反而更纯粹了——这是古典程式在个性解放时代的自我更新。',
        keyFeatures: ['古拙遒劲如屈铁', '线条篆籀意味', '造型夸张变形', '宁拙勿巧', '个性解放之声']
      }
    ],
    aiGuide: {
      opening: '欢迎来到"铁线描"的世界！这是中国画最古老、最基础的线描法——一根粗细均匀的线条，画了一千七百年，走出了顾恺之、吴道子、李公麟、陈洪绶四位大师。让我们拖动时间线，看看这根"铁线"是如何被一代又一代的大师"弯曲"出无限可能的。',
      questions: [
        {
          id: 'q1',
          question: '顾恺之的"春蚕吐丝"为什么没有粗细变化？这种"不变"中，藏着怎样的魏晋风度？',
          hint: '魏晋士人崇尚"含蓄"、"得意忘言"。如果一个人的喜怒不形于色，那么他的线条是不是也应该"不形于粗细"？'
        },
        {
          id: 'q2',
          question: '吴道子为什么要把"静的铁线"变成"动的莼菜条"？唐代的"盛唐气象"和线条的"动"之间，有什么隐秘的联系？',
          hint: '唐代是一个外向、张扬、充满力量的时代。你能想象李白用"春蚕吐丝"的风格写诗吗？'
        },
        {
          id: 'q3',
          question: '李公麟为什么要"不施丹青"？放弃了色彩，他得到了什么？',
          hint: '想想"少即是多"。当你拿走了所有可以依赖的东西，剩下的是不是就是最本质的？'
        },
        {
          id: 'q4',
          question: '陈洪绶为什么要把人物画"丑"、画"怪"？在一个追求"美"的世界里，"丑"的意义是什么？',
          hint: '晚明是一个"假"的世界——假道学、假名士、假艺术。陈洪绶的"丑"，是不是对"假美"的一种反抗？'
        }
      ],
      conclusion: '太精彩了！你走完了铁线描一千七百年的旅程。从顾恺之"春蚕吐丝"的含蓄，到吴道子"吴带当风"的飞动，到李公麟"白描独绝"的纯粹，再到陈洪绶"宁拙勿巧"的变形——你看到了吗？一根看似简单的"铁线"，竟然可以承载那么丰富的时代精神和个人品格。请记住：程式从来不是束缚创造力的枷锁，恰恰相反，真正的大师总是在最严格的限制中，创造出最大的自由！'
    }
  }
];

export function getFormulaElements(): FormulaElement[] {
  return formulaElements;
}

export function getFormulaElement(id: string): FormulaElement | undefined {
  return formulaElements.find(e => e.id === id);
}
