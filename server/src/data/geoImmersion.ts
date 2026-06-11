import { GeoImmersionPaintingData, SchoolGeoComparison, PainterTravelRoute } from '../types';

const northSouthComparison: SchoolGeoComparison = {
  id: 'north-south-geo',
  northSchool: {
    name: '北方山水画派',
    region: '关陕、中原地区（今陕西、河南、河北一带）',
    terrainType: '高山大川，石质山岳，雄伟险峻',
    climateType: '温带大陆性气候，四季分明，干燥多风',
    artisticFeatures: [
      '以"高远"构图为主，主峰堂堂，顶天立地',
      '山石以"斧劈皴"、"雨点皴"表现坚硬石质',
      '用墨浓重沉雄，骨法刚劲',
      '山体轮廓清晰，气势逼人',
      '以"雄强浑厚"为审美追求'
    ],
    representativePainters: ['荆浩', '关仝', '李成', '范宽', '郭熙'],
    representativePaintings: ['匡庐图', '溪山行旅图', '早春图']
  },
  southSchool: {
    name: '南方山水画派',
    region: '江南地区（今江苏、浙江、安徽一带）',
    terrainType: '丘陵缓坡，土质山峦，平远幽深',
    climateType: '亚热带季风气候，温润多雨，云雾缭绕',
    artisticFeatures: [
      '以"平远"、"深远"构图为主，江天浩渺',
      '山石以"披麻皴"、"解索皴"表现松软土质',
      '用墨清淡松秀，烟云供养',
      '山水与云雾交融，虚处传神',
      '以"平淡天真"为审美追求'
    ],
    representativePainters: ['董源', '巨然', '黄公望', '倪瓒', '王蒙'],
    representativePaintings: ['潇湘图', '富春山居图', '渔庄秋霁图']
  },
  keyDifferences: [
    {
      aspect: '地貌形态',
      north: '石质山岳，棱角分明，壁立千仞',
      south: '土质丘陵，圆润平缓，连绵起伏',
      explanation: '北方的太行山、华山、终南山等是断块山，岩石裸露，多悬崖峭壁；江南的山脉多为侵蚀丘陵，覆盖着茂密的植被，山体轮廓柔和。这种地貌差异直接决定了南北画家观察自然的不同视角。'
    },
    {
      aspect: '气候观感',
      north: '空气干燥，能见度高，山石轮廓清晰',
      south: '空气湿润，多雾多雨，山水掩映于烟云之中',
      explanation: '北方干燥的空气使远山也清晰可见，画家可以清晰看到山石的纹理结构；江南水汽充沛，常年云雾缭绕，远山若隐若现，这种"朦胧美"催生了南派山水画的"虚境"追求。'
    },
    {
      aspect: '皴法差异',
      north: '斧劈皴、雨点皴、豆瓣皴——刚劲短促的笔触',
      south: '披麻皴、解索皴、牛毛皴——松秀绵长的笔触',
      explanation: '皴法是画家对自然地貌的艺术提炼。北方石质坚硬，需要刚劲的"砍凿"式笔触；南方土质松软，适合绵长舒缓的"披拂"式笔触。荆浩的"小斧劈皴"、范宽的"雨点皴"之于北方山石，正如董源的"披麻皴"之于江南丘陵。'
    },
    {
      aspect: '构图范式',
      north: '高远为主，主山居中，正面仰观',
      south: '平远、深远为主，散点透视，移步换景',
      explanation: '站在关中平原仰观终南山，自然产生"高山仰止"的视觉感受，这就是北派"主山堂堂"的由来；而泛舟富春江，两岸景色徐徐展开，自然形成"平远"的散点透视构图。'
    },
    {
      aspect: '审美理想',
      north: '雄强、浑厚、壮伟——阳刚之美',
      south: '平淡、天真、幽远——阴柔之美',
      explanation: '北方山河的雄伟壮丽孕育了"雄浑"的美学追求，体现了儒家"天行健，君子以自强不息"的阳刚精神；江南水乡的秀润悠远则孕育了"逸淡"的美学追求，体现了道家"道法自然"的阴柔智慧。董其昌以"南北宗论"总结这一差异，将南宗尊为文人画正脉。'
    }
  ],
  aiGuide: {
    opening: '欢迎来到南北山水画派的地理溯源之旅。山水画不是凭空想象的产物——每一种皴法、每一种构图、每一种审美追求，都深深植根于画家脚下的那片土地。让我们从地理学的视角，重新理解中国山水画史上最重大的风格分野。',
    questions: [
      { id: 'q1', question: '为什么范宽画中的山"大气磅礴，沉雄高古"，而黄公望画中的山"平淡天真，逸迈超尘"？仅仅是因为画家个性不同吗？', hint: '试着想象两位画家站在各自的窗前，推开窗户看到的第一座山是什么样子的？' },
      { id: 'q2', question: '"雨点皴"和"披麻皴"这两种技法名称非常形象——它们分别对应着怎样的自然地貌？你能否用自己的语言描述这两种"皴"各自"画"的是大自然中的什么景象？', hint: '雨点是短促的、密集的、从空中砸向地面的；而披麻是绵长的、柔软的、一缕一缕披散的。' },
      { id: 'q3', question: '如果一位北方画家来到江南住上十年，他的画风会变吗？一位江南画家移居北方呢？', hint: '回忆范宽的名言："师今人不如师古人，师古人不如师造化。"造化——也就是大自然——才是画家最重要的老师。' },
      { id: 'q4', question: '董其昌说"北宗渐修，南宗顿悟"，这种修行方式的差异，与南北地理气候有没有关联？', hint: '北方天寒地冻，生活艰辛，需要苦耕苦修；江南鱼米之乡，生活优裕，文人有更多闲暇优游山林、吟风弄月。' }
    ],
    conclusion: '南北山水画派的差异，归根结底是人与自然的对话方式不同。北方画家在雄伟的山岳面前感到自身的渺小，于是以敬畏之心描摹天地的壮伟；南方画家在秀润的山水之间感到物我两忘，于是以平淡之笔抒写心灵的悠远。但无论南北，伟大的山水画家都在做同一件事：以造化为师，为山河立传。'
  }
};

const fanKuanTravelRoute: PainterTravelRoute = {
  id: 'fan-kuan-route',
  painterId: 'fan-kuan',
  painterName: '范宽',
  overview: '范宽一生的艺术足迹，就是一个从"师人"到"师物"再到"师心"的升华过程。他从故乡陕西邠州出发，先是师法李成，随后深入终南山、太华山中隐居写生，终于领悟"与其师于人者，未若师诸物也；吾与其师于物者，未若师诸心"的画理，开创了北方山水画派的巅峰风格。',
  stops: [
    {
      id: 'fan-kuan-1',
      location: { name: '邠州', ancientName: '邠州', latitude: 35.04, longitude: 108.1, mapX: 42, mapY: 34, description: '今陕西彬州，范宽的故乡，地处渭北高原南缘' },
      yearDisplay: '北宋初年',
      purpose: '出生与早年生活，接触黄土高原沟壑纵横的地貌',
      artisticOutcome: '家乡的高原沟壑为他提供了最早的山水启蒙，那种苍莽厚重的土地气质，后来成为他画风的底色。'
    },
    {
      id: 'fan-kuan-2',
      location: { name: '汴京', ancientName: '东京汴梁', latitude: 34.8, longitude: 114.3, mapX: 52, mapY: 34, description: '今河南开封，北宋都城，当时的文化艺术中心' },
      yearDisplay: '青年时期',
      duration: '约10年',
      purpose: '师法李成，接触当时的主流画风',
      artisticOutcome: '初学李成，打下了扎实的山水画基础。但他逐渐感到"前人之法，未尝不近取诸物"——只学别人的画，终究是二手的自然。',
      styleTransformation: '从临摹前辈走向"师诸物"的关键转折期'
    },
    {
      id: 'fan-kuan-3',
      location: { name: '终南山', ancientName: '终南山', latitude: 33.9, longitude: 108.9, mapX: 43, mapY: 38, description: '秦岭山脉主峰之一，在今陕西西安以南，是当时著名的隐居胜地' },
      yearDisplay: '中晚年',
      duration: '十余年',
      purpose: '隐居山林，终日坐观山水，对景造意',
      artisticOutcome: '"居山林间，常危坐终日，纵目四顾，以求其趣。虽雪月之际，必徘徊凝览，以发思虑。"终南山的雄伟山势使他的画风为之一变，独创"雨点皴"，确立了"峰峦浑厚，势状雄强"的艺术风格。',
      relatedWorkIds: ['xishan-xinglu-tu'],
      styleTransformation: '独创雨点皴，形成"雄强浑厚"的个人风格'
    },
    {
      id: 'fan-kuan-4',
      location: { name: '太华山', ancientName: '西岳华山', latitude: 34.49, longitude: 110.09, mapX: 46, mapY: 36, description: '五岳之一的西岳，以"奇险天下第一山"著称，花岗岩断块山的典型代表' },
      yearDisplay: '中晚年',
      duration: '多年游历',
      purpose: '进一步观察北方石山的奇险形态，锤炼笔墨语言',
      artisticOutcome: '华山的壁立千仞、一石万仞，使范宽笔下的山石更加坚凝厚重。他画中的山"如行夜山，秋明昏暗"，那种深沉、静穆、崇高的气象，正是华山精神的写照。',
      styleTransformation: '风格成熟期，达到"与山传神"的境界'
    }
  ],
  styleEvolutionPhases: [
    {
      phaseName: '师人期',
      period: '青年时代（汴京）',
      locationInfluence: '在北宋都城接触到李成等前辈大师的作品，深受影响',
      styleCharacteristics: '笔墨精细，偏向李成的"烟林平远"风格，但已显露出厚重的个人倾向',
      representativeWorks: ['早期临摹之作（已佚）']
    },
    {
      phaseName: '师物期',
      period: '中年（终南山隐居初期）',
      locationInfluence: '终日面对终南山的雄伟山势，观察四时朝暮、阴晴雨雪中山水的万千变化',
      styleCharacteristics: '开始脱离前人窠臼，注重对自然的直接观察与写生，笔墨逐渐变得沉雄厚重',
      representativeWorks: ['山水立轴（传说）']
    },
    {
      phaseName: '师心期',
      period: '晚年（终南、太华游历之后）',
      locationInfluence: '将北方山河的雄奇魂丽内化于心，"外师造化，中得心源"',
      styleCharacteristics: '独创"雨点皴"，确立"峰峦浑厚，势状雄强"的典范风格。画中山水已不是某处具体的山，而是北方山河的整体精神气象',
      representativeWorks: ['溪山行旅图', '雪景寒林图']
    }
  ]
};

const huangGongwangTravelRoute: PainterTravelRoute = {
  id: 'huang-gongwang-route',
  painterId: 'huang-gongwang',
  painterName: '黄公望',
  overview: '黄公望的一生，从青年时的宦海沉浮，到中年入狱后的彻底觉悟，再到晚年隐居富春、入道全真，每一次人生转折都伴随着地理位置的迁移和艺术风格的蜕变。他的《富春山居图》，正是江南山水滋养出的最高艺术结晶。',
  stops: [
    {
      id: 'huang-1',
      location: { name: '平江常熟', ancientName: '平江路常熟州', latitude: 31.64, longitude: 120.75, mapX: 65, mapY: 48, description: '今江苏常熟，黄公望的出生地，江南水乡' },
      yearDisplay: '1269年生',
      purpose: '出生与早年生活，自幼浸润在江南水乡的文化氛围中',
      artisticOutcome: '常熟的虞山、尚湖是他最早的山水记忆，"山水"二字已融入他的生命底色。'
    },
    {
      id: 'huang-2',
      location: { name: '杭州', ancientName: '临安', latitude: 30.27, longitude: 120.15, mapX: 62, mapY: 52, description: '南宋故都，元代江南文化中心' },
      yearDisplay: '青年至中年',
      duration: '约30年',
      purpose: '任浙西廉访司书吏等职，宦游杭州，接触赵孟頫等前辈',
      artisticOutcome: '在杭州得见赵孟頫并受其指教，"自叹不如，刻意学之"。赵孟頫的"书画同源"、"师古而不泥古"思想对他影响深远。',
      styleTransformation: '艺术启蒙期，接受赵孟頫文人画思想'
    },
    {
      id: 'huang-3',
      location: { name: '大都', ancientName: '大都', latitude: 39.9, longitude: 116.4, mapX: 56, mapY: 22, description: '今北京，元朝首都，北方政治文化中心' },
      yearDisplay: '约1315-1320年',
      duration: '约5年',
      purpose: '入京任吏，开阔眼界，接触北方文化与山水',
      artisticOutcome: '在大都结识众多文人名士，扩大了艺术视野。短暂的北方生活使他的山水画在南派的秀润之外，又添了几分北派的骨力。',
      styleTransformation: '艺术拓展期，融合南北风格的尝试'
    },
    {
      id: 'huang-4',
      location: { name: '苏州、松江一带', ancientName: '平江路、松江府', latitude: 31.2, longitude: 121.0, mapX: 66, mapY: 50, description: '今苏南、上海一带，元代文人山水画的核心区域' },
      yearDisplay: '出狱后至晚年',
      duration: '约20年',
      purpose: '弃官归隐，加入全真教，以诗画自娱，云游四方',
      artisticOutcome: '"放浪形骸，与全真道士游"，人生观彻底转变。终日"杖藜携酒，游于山水之间"，画风从"精工"转向"逸迈"。与倪瓒、吴镇、王蒙并称"元四家"。',
      relatedWorkIds: ['fuchun-shanju-tu'],
      styleTransformation: '艺术成熟期，确立"浅绛山水"与"逸笔草草"的文人画风格'
    },
    {
      id: 'huang-5',
      location: { name: '富春江', ancientName: '富春', latitude: 30.05, longitude: 119.65, mapX: 61, mapY: 53, description: '钱塘江中游，在今浙江富阳、桐庐一带，以"奇山异水，天下独绝"著称' },
      yearDisplay: '晚年（约1347-1350年）',
      duration: '三四年',
      purpose: '隐居富春江畔，与无用师禅师相伴，潜心创作',
      artisticOutcome: '历时三四年完成《富春山居图》。此时的黄公望已完全"外师造化，中得心源"，笔下的富春江已不是简单的写实，而是"阅尽千帆皆不是，斜晖脉脉水悠悠"的人生境界的外化。',
      relatedWorkIds: ['fuchun-shanju-tu'],
      styleTransformation: '艺术巅峰期，"平淡天真"的最高境界'
    }
  ],
  styleEvolutionPhases: [
    {
      phaseName: '摹古期',
      period: '青年至中年（杭州、大都时期）',
      locationInfluence: '师从赵孟頫，遍观前代名迹，"刻意学之"',
      styleCharacteristics: '笔墨精工，设色古雅，深受赵孟頫影响，尚未形成个人面貌',
      representativeWorks: ['溪山雨意图（早期）']
    },
    {
      phaseName: '蜕变期',
      period: '出狱后（苏松云游时期）',
      locationInfluence: '弃官入道，云游江南山水，人生观发生根本转变',
      styleCharacteristics: '从"精工"转向"逸笔草草"，用墨由浓入淡，开始独创"浅绛山水"——以赭石为主色调的淡设色山水',
      representativeWorks: ['天池石壁图', '丹崖玉树图']
    },
    {
      phaseName: '化境期',
      period: '晚年（富春隐居时期）',
      locationInfluence: '富春江的山水烟岚与全真教的"虚静"思想融为一体',
      styleCharacteristics: '达到"平淡天真"的最高境界。笔墨松秀空灵，"峰峦浑厚，草木华滋"，看似随意涂抹，实则千锤百炼。画中有禅，有诗，有人生的全部感悟',
      representativeWorks: ['富春山居图']
    }
  ]
};

export const geoImmersionData: Record<string, GeoImmersionPaintingData> = {
  'xishan-xinglu-tu': {
    paintingId: 'xishan-xinglu-tu',
    paintingTitle: '溪山行旅图',
    painterId: 'fan-kuan',
    painterName: '范宽',
    terrain: {
      id: 'guan-shaan',
      name: '关陕地貌',
      region: '关中-陕南交界地带（终南山、太华山区域）',
      centerLocation: {
        name: '终南山主峰',
        ancientName: '终南山、太乙山',
        latitude: 33.9,
        longitude: 108.9,
        mapX: 43,
        mapY: 38,
        description: '秦岭山脉的一段，是北方山水画派最重要的地理母体'
      },
      layers: [
        { name: '河谷平原', height: 400, color: '#d4b896', description: '渭河谷地，海拔约400米，黄土层深厚，是古代商旅往来的通道' },
        { name: '山麓缓坡', height: 800, color: '#8b7355', description: '山脚下的缓坡地带，溪水流淌，林木葱郁，行旅之人沿此路前行' },
        { name: '低山丘陵', height: 1500, color: '#5c4d3c', description: '海拔1000-1500米的石质低山，岩石裸露，灌木丛生' },
        { name: '中山峭壁', height: 2200, color: '#3d3226', description: '海拔1500-2200米的陡峭山崖，花岗岩断块山体，壁立千仞' },
        { name: '高峰绝顶', height: 2800, color: '#1f1a14', description: '海拔2200米以上的主峰区域，云雾缭绕，气势逼人，占据画面三分之二' }
      ],
      mountainPeaks: [
        { name: '终南山（太乙山）', height: 2604, description: '画面主峰的原型，"重峦俯渭水，碧嶂插遥天"，是秦岭最具代表性的雄伟山岳' },
        { name: '太华山（西岳）', height: 2154, description: '华山一石万仞的壁立形态，是范宽笔下"雨点皴"山石质感的重要灵感来源' },
        { name: '太行山', height: 2882, description: '绵延千里的太行山系，同样是北方山水画派的重要地理参照，李成、郭熙多取境于此' }
      ],
      waterFeatures: [
        { name: '山间瀑布', type: 'waterfall', description: '画面中轴线处的一线飞瀑，从山涧飞流直下，如白练悬空，是全画气脉所在' },
        { name: '山涧溪流', type: 'stream', description: '山脚下蜿蜒流淌的溪水，潺潺不息，为雄伟的山势增添了灵动之气' },
        { name: '渭河', type: 'river', description: '画面外的地理背景，渭河谷地是连接关中与中原的交通要道，商旅往来不绝' }
      ],
      climateZones: ['暖温带半湿润大陆性季风气候', '山地垂直气候带'],
      terrainDescription: '关陕地区地处黄土高原与秦岭山脉的交汇地带。渭河谷地平缓开阔，秦岭山脉拔地而起，形成巨大的落差。从关中平原仰观终南山，山峰如从天而降，壁立千仞，气势逼人。山体为花岗岩断块结构，岩石裸露，棱角分明，多悬崖峭壁、奇峰怪石。山涧溪流奔涌，瀑布飞泻，与雄伟的山势形成刚柔对比。',
      artisticInfluence: '这种"高山仰止"的视觉体验，直接催生了范宽"高远"构图法——主峰巍然居中，占据画面三分之二，顶天立地。石质山岳的坚硬质感，促使他创造了"雨点皴"——以密集短促的墨点凿出山石的风骨。北方干燥的空气使山石轮廓清晰可辨，因此北派山水"骨法用笔"、"以线立骨"，墨色浓重沉雄。'
    },
    climate: {
      id: 'guanzhong-dawn',
      paintingId: 'xishan-xinglu-tu',
      locationName: '终南山麓，初秋清晨',
      conditions: [
        { timeOfDay: 'dawn', season: 'autumn', humidity: 85, temperature: 12, windSpeed: 5, windDirection: '西北风', fogLevel: 90, cloudLevel: 20, description: '黎明时分，山间夜雾尚未散去，谷底湿气蒸腾，能见度极低，数步之外便一片朦胧。山脚下的溪流因昼夜温差而升起袅袅水汽，如轻纱笼罩。' },
        { timeOfDay: 'morning', season: 'autumn', humidity: 60, temperature: 18, windSpeed: 15, windDirection: '西北风', fogLevel: 30, cloudLevel: 10, description: '旭日初升，阳光穿透薄雾，斜照在山峰上，山石被镀上一层金色。西北风从山谷中吹过，裹挟着松脂和泥土的气息。空气虽然清冽，但已不似黎明时那般湿寒。' },
        { timeOfDay: 'noon', season: 'autumn', humidity: 35, temperature: 24, windSpeed: 10, windDirection: '西风', fogLevel: 0, cloudLevel: 5, description: '正午时分，天朗气清，万里无云。北方干燥的空气使远处的山石纹理也清晰可辨。阳光充足，阴影浓重，山石的体积感格外突出。' }
      ],
      ambientSounds: [
        { id: 's1', type: 'wind', name: '山风过松涛', description: '西北风穿过松林的呼啸声，如千军万马，裹挟着松脂的清香', intensity: 0.7, direction: '从山间吹来' },
        { id: 's2', type: 'waterfall', name: '飞瀑轰鸣', description: '山涧瀑布飞流直下的轰鸣声，在山谷中回荡不绝', intensity: 0.8, direction: '正前方山涧' },
        { id: 's3', type: 'stream', name: '溪流潺潺', description: '山脚下溪水潺潺流淌的声音，时远时近，清脆悦耳', intensity: 0.5, direction: '右下方谷地' },
        { id: 's4', type: 'insects', name: '秋虫呢哝', description: '草丛中秋虫的低吟，是北方初秋特有的生命节律', intensity: 0.3 },
        { id: 's5', type: 'temple_bell', name: '远处钟声', description: '若有若无的山寺钟声，从山谷深处随风飘来，更添空寂之感', intensity: 0.2, direction: '远方山林' }
      ],
      sensoryDescription: '站在《溪山行旅图》前，你仿佛置身于北宋初秋的终南山麓。黎明时分，山间的夜雾尚未散去，空气中弥漫着松脂、泥土和溪水的清冽气息。皮肤感受到西北风中裹挟的凉意，耳中是飞瀑的轰鸣、溪泉的低吟、松涛的回响，以及若有若无的山寺钟声。抬头仰望，巨峰巍然耸立，云雾在山腰流动，一线瀑布从天际飞泻而下。一队商旅从右下角缓缓走来，骡马的蹄声、旅人的吆喝，在空旷的山谷中显得格外渺小。这就是范宽当年"危坐终日，纵目四顾"所感受到的——天地悠悠，山河壮阔，人在其中，不过沧海一粟。',
      recommendedTime: '清晨6至9点——黎明薄雾渐散、旭日初升之时，正是《溪山行旅图》中山水气象最为动人的时刻。'
    },
    northSouthContext: northSouthComparison,
    travelRoute: fanKuanTravelRoute,
    immersiveNarrative: {
      introduction: '欢迎来到北宋范宽《溪山行旅图》的沉浸式地理体验。现在，请你暂时放下眼前的画卷，让我们穿越时空，置身于一千年前的终南山麓。这不仅仅是一次艺术欣赏，更是一次与范宽比肩而立、共同"师诸造化"的朝圣之旅。',
      sceneSetup: '时维北宋前期，大约公元1000年前后的一个秋日清晨。你站在渭河谷地仰望终南山——这座秦岭山脉最雄伟的主峰之一。天色刚亮，夜雾尚未完全散去，你的皮肤能感受到空气中的湿润和凉意。远处，瀑布的轰鸣声若隐若现。',
      guidedWalkthrough: [
        '首先，闭上眼，深吸一口气。你闻到了什么？——是松脂的清香、泥土的腥气、溪水的甘甜，还有山间草叶被露水打湿的气息。这些气味，范宽当年也一定闻到过。',
        '再听听周围的声音——风吹过松林的呼啸、山涧瀑布的轰鸣、脚下溪水的潺潺、草丛中秋虫的呢哝，还有远处隐约传来的山寺钟声。这些声音，共同构成了北方山河的"自然交响乐"。',
        '现在睁开眼，仰望前方。你看到了什么？——一座巨大的山峰从平地拔起，几乎占据了整个视野。山体是如此雄伟，以至于需要你用力仰头才能看到山顶。这就是"高远"——范宽创造的构图法，直接来自他站在关中平原仰望秦岭的真实视觉体验。',
        '仔细看山石的表面——裸露的花岗岩上布满了雨水冲刷出的沟壑，阳光照在突出的棱角上，阴影落在凹陷处。范宽画中的"雨点皴"，正是用密集的墨点来表现这种石质山岳的质感。每一笔"雨点"，都是大自然在石山上刻下的痕迹。',
        '再看山脚下——一队商旅赶着骡马从远处走来。人在这座大山面前是如此渺小，几乎像是画上去的一个标点。范宽把自己和观画者都放在了"仰观者"的位置，让我们在雄伟的自然面前，体会到人作为"天地一沙鸥"的存在。',
        '最后，让我们走到画面右侧的树丛中——那里藏着范宽的签名。1958年，学者李霖灿在这里发现了"范宽"二字。你看，画家就站在那里，和你一起仰望这座他描摹了无数次的大山。'
      ],
      reflectionPrompts: [
        '你刚刚"身处"的这片关陕山水，与你熟悉的江南山水或西方风景有什么本质不同？',
        '范宽说"师诸心"，但他的画看起来又是高度写实的。在你刚才的"身临其境"中，你认为哪些部分是"写实"，哪些部分是"师心"？',
        '如果范宽没有隐居终南山，而是一辈子生活在江南，他还能画出《溪山行旅图》吗？为什么？',
        '当你站在一座真正的大山面前，你会感到自身的渺小吗？这种感觉对理解范宽的"高远"构图有什么帮助？'
      ]
    }
  },
  'fuchun-shanju-tu': {
    paintingId: 'fuchun-shanju-tu',
    paintingTitle: '富春山居图',
    painterId: 'huang-gongwang',
    painterName: '黄公望',
    terrain: {
      id: 'fu-chun',
      name: '富春江水系地貌',
      region: '浙江西部富春江流域（桐庐、富阳一带）',
      centerLocation: {
        name: '富春江七里泷',
        ancientName: '富春、桐江',
        latitude: 29.8,
        longitude: 119.67,
        mapX: 61,
        mapY: 54,
        description: '钱塘江中游河段，以"奇山异水，天下独绝"闻名天下'
      },
      layers: [
        { name: '江面平沙', height: 8, color: '#e8dcc4', description: '富春江水面及沿岸沙洲，海拔仅数米，水网密布，渔舟往来' },
        { name: '冲积平原', height: 30, color: '#bfae8e', description: '河流冲积形成的江南平原，村落散布，良田万顷，竹林桑园' },
        { name: '山麓丘陵', height: 200, color: '#7a9a6d', description: '海拔100-300米的丘陵缓坡，覆盖茂密的亚热带常绿阔叶林' },
        { name: '低山层峦', height: 500, color: '#5a7a4d', description: '海拔300-600米的低山群峰，连绵起伏，云雾常萦绕其间' },
        { name: '中山远岫', height: 1000, color: '#3d5a3d', description: '海拔600-1000米的中山，在画面中作为远景，若隐若现于云雾之中' }
      ],
      mountainPeaks: [
        { name: '天目山', height: 1506, description: '富春江流域的背景山脉，山峦起伏，林木葱郁，是黄公望笔下远山的重要参照' },
        { name: '严子陵钓台', height: 200, description: '富春江边的著名古迹，东汉严光隐居垂钓之处，是中国文人"隐居"文化的象征' },
        { name: '桐庐诸山', height: 800, description: '桐庐境内连绵起伏的丘陵群峰，黄公望《富春山居图》的直接写生对象' }
      ],
      waterFeatures: [
        { name: '富春江主河道', type: 'river', description: '钱塘江中游河段，江面开阔，碧波荡漾，是全画的横向气脉所在' },
        { name: '山间溪流', type: 'stream', description: '从两侧山涧汇入富春江的无数小溪，潺潺流淌，滋养着两岸的竹林茅舍' },
        { name: '沙洲水泊', type: 'lake', description: '富春江沿岸的浅滩与水泊，渔舟停泊，鹭鸟飞翔' }
      ],
      climateZones: ['亚热带季风性湿润气候', '江南丘陵湿润气候带'],
      terrainDescription: '富春江流域地处江南丘陵地带，属钱塘江中游水系。江水自西向东蜿蜒流淌，两岸丘陵连绵起伏，轮廓柔和圆润。山体为侵蚀构造，覆盖着茂密的亚热带常绿阔叶林，四季常青。山间溪流纵横，河谷平畴广阔，村落散布，竹林、桑园、水田、渔舟构成典型的江南水乡风光。常年水汽充沛，云雾缭绕，远山如黛，近山含翠。',
      artisticInfluence: '江南丘陵的连绵与柔和，催生了董源、巨然以来的"披麻皴"——绵长松秀的笔触恰如松软的土质山坡。富春江的开阔与悠远，使黄公望采用"平远"散点透视，长卷徐徐展开，移步换景。云雾的常年缭绕，让南派山水注重"虚境"——以留白和淡墨表现烟云变化，追求"虚实相生"的空灵之美。'
    },
    climate: {
      id: 'fuchun-autumn',
      paintingId: 'fuchun-shanju-tu',
      locationName: '富春江畔，初秋午后',
      conditions: [
        { timeOfDay: 'dawn', season: 'autumn', humidity: 92, temperature: 18, windSpeed: 3, windDirection: '东南风', fogLevel: 95, cloudLevel: 30, description: '黎明时分，江面上浓雾弥漫，能见度不足百米。远山完全隐没在浓雾之中，只能听到江水拍岸的声音。空气潮湿得几乎能拧出水来，竹林中的竹叶上挂满露珠。' },
        { timeOfDay: 'morning', season: 'autumn', humidity: 78, temperature: 22, windSpeed: 8, windDirection: '东南风', fogLevel: 60, cloudLevel: 25, description: '晨雾开始缓缓散去，远山在云雾中若隐若现，如披轻纱。东南风从江面吹来，带着水汽和淡淡的桂花香。阳光透过云层，洒下斑驳的光影。' },
        { timeOfDay: 'afternoon', season: 'autumn', humidity: 65, temperature: 26, windSpeed: 12, windDirection: '南风', fogLevel: 20, cloudLevel: 40, description: '午后时分，浮云淡淡，远山如黛。江南特有的温润空气使山水呈现出层次丰富的灰调——近处是苍翠的浓绿，远处是迷蒙的青灰。江风拂面，凉爽而不寒。' },
        { timeOfDay: 'dusk', season: 'autumn', humidity: 80, temperature: 20, windSpeed: 5, windDirection: '西风', fogLevel: 50, cloudLevel: 50, description: '夕阳西下，江面被染成金红。暮霭从江面缓缓升起，渔舟唱晚，炊烟袅袅。远处的山寺传来阵阵钟声，与归鸟的啼鸣交织在一起。' }
      ],
      ambientSounds: [
        { id: 'fs1', type: 'wind', name: '江风拂柳', description: '南风拂过江面、穿过竹林的轻响，温柔而绵远，带着水汽的湿润', intensity: 0.4, direction: '从江面吹来' },
        { id: 'fs2', type: 'stream', name: '江水拍岸', description: '富春江碧水悠悠，轻轻拍打着岸边礁石的声音，节奏舒缓', intensity: 0.5, direction: '正前方江面' },
        { id: 'fs3', type: 'birds', name: '山林鸟语', description: '白鹭、黄鹂、画眉等江南水鸟和林鸟的鸣叫，此起彼伏，清脆婉转', intensity: 0.6 },
        { id: 'fs4', type: 'insects', name: '蝉鸣蛩吟', description: '初秋时节，寒蝉的低鸣和蟋蟀的吟叫，是江南秋意的声音', intensity: 0.3 },
        { id: 'fs5', type: 'temple_bell', name: '禅院钟声', description: '江边禅院的悠悠钟声，"姑苏城外寒山寺，夜半钟声到客船"的意境', intensity: 0.3, direction: '远山深处' }
      ],
      sensoryDescription: '站在《富春山居图》前，你仿佛来到了元代的富春江畔。初秋午后的江风拂面，温润中带着一丝清凉，空气中弥漫着桂花香、竹香和江水的湿润气息。脚下的草鞋踩在松软的泥土上，远处渔舟上传来隐约的渔歌。眼前是一望无际的江天——远山如黛，连绵起伏；江水如碧，浩渺东流；村舍错落，竹林掩映；一叶扁舟泛于江上，数只白鹭掠过水面。在这里，没有北方山水的雄伟逼人，只有江南的平淡悠远。你会感到身心都放松下来，仿佛与这片山水融为一体，不知何者为我，何者为物。这就是黄公望晚年"畅神"的境界——"我见青山多妩媚，料青山见我应如是"。',
      recommendedTime: '午后14至17点——浮云淡淡、江风徐徐之时，正是《富春山居图》"平淡天真"意境最为动人的时刻。'
    },
    northSouthContext: northSouthComparison,
    travelRoute: huangGongwangTravelRoute,
    immersiveNarrative: {
      introduction: '欢迎来到元代黄公望《富春山居图》的沉浸式地理体验。请你暂时放下这幅被誉为"画中兰亭"的长卷，让我们与年近八十的黄公望一起，站在富春江畔，感受这片"奇山异水，天下独绝"的江南胜境。',
      sceneSetup: '时为元至正七年（1347年）的一个秋日午后。你与黄公望（大痴道人）及无用师禅师一同站在富春江畔的南楼上。公望年近八十，白发苍苍，但精神矍铄。他的手边放着一支画笔、半卷未完成的《富春山居图》。',
      guidedWalkthrough: [
        '首先，闭上眼睛，感受江风拂面。江南的风是湿润的、温柔的，它不像北方山风那样呼啸逼人，而是像丝绸一样轻轻抚过你的皮肤。风中带着什么气味？——是桂花香、竹香、江水的腥甜，还有远处村落飘来的炊烟气息。',
        '再听——江浪拍岸的声音是舒缓的、有节奏的，像在呼吸。竹林里传来鸟鸣，"蝉噪林逾静，鸟鸣山更幽"。远处若有若无的钟声，来自山间的禅院。这些声音合在一起，就是江南的"静"——一种有声的、充满生机的静。',
        '现在睁开眼，顺着公望的视线望向远方。你看到了什么？——不是一座顶天立地的巨峰，而是连绵起伏的丘陵、蜿蜒流淌的江水。远山近水，错落有致。视线可以沿着江面一直飘到天际，这就是"平远"——江南山水特有的空间感。',
        '仔细看近处的山坡——那上面覆盖着厚厚的植被，松软的土壤被雨水冲刷出一道道柔和的纹理。黄公望画中的"披麻皴"，正是用绵长松秀的笔触来表现这种江南丘陵的土质。每一道皴笔，都像是一缕一缕披散开来的麻丝。',
        '再看那江面上的云雾——它不是静止的，而是在流动、在变化。远山时隐时现，近山半遮半露。南派山水最重"虚境"，留白处不是空无，而是流动的烟云、无尽的想象。黄公望的墨色由浓入淡，由淡入无，正是这片江南烟雨的最好写照。',
        '最后，看向公望笔下的那幅画——他画的不是某一处具体的风景，而是整个富春江的"意"。"兴之所至，不觉亹亹布置如许"，他只是兴之所至，随手涂抹，却画出了江南山水的灵魂。因为他已与这片山水融为一体，"吾与其师于物者，未若师诸心"。'
      ],
      reflectionPrompts: [
        '江南的"静"和北方的"雄"，你更喜欢哪一种？这两种审美取向分别对应着怎样的人生哲学？',
        '《富春山居图》被誉为"南宗正脉"，它和《溪山行旅图》在构图、皴法、意境上有哪些根本差异？这些差异的地理根源是什么？',
        '黄公望说"逸笔草草，不求形似"，但他画中的山水又如此"真实"。你如何理解这种"不似之似"？',
        '这幅画在明末被吴洪裕火焚殉葬，烧成两段后反而更具传奇色彩。艺术的"残缺"为什么有时反而更能打动人？'
      ]
    }
  }
};

export const getGeoImmersionData = (paintingId: string): GeoImmersionPaintingData | null => {
  return geoImmersionData[paintingId] || null;
};

export const getSchoolGeoComparison = (): SchoolGeoComparison => {
  return northSouthComparison;
};

export const getPainterTravelRoute = (painterId: string): PainterTravelRoute | null => {
  const routes: Record<string, PainterTravelRoute> = {
    'fan-kuan': fanKuanTravelRoute,
    'huang-gongwang': huangGongwangTravelRoute
  };
  return routes[painterId] || null;
};

export const getAvailableGeoImmersionPaintings = (): string[] => {
  return Object.keys(geoImmersionData);
};
