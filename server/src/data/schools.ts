import { School } from '../types';

export const schools: School[] = [
  {
    id: 'green-shanshui-tang',
    name: '唐代青绿山水',
    dynastyId: 'tang',
    description: '以李思训、李昭道父子为代表，用石青、石绿等矿物质颜料勾勒填色，形成华丽富贵的山水画风格。',
    tenets: [
      '以线条勾勒山石轮廓，再填以青绿重色',
      '追求金碧辉煌的装饰效果',
      '构图宏大，多表现仙境宫苑',
      '技法精细，具有装饰性'
    ],
    representativePainters: ['李思训', '李昭道'],
    influence: '奠定了中国山水画的基本形态，影响后世青绿山水的发展'
  },
  {
    id: 'jing-guan-shanshui',
    name: '荆关山水（北方画派）',
    dynastyId: 'wu-dai',
    description: '以荆浩、关仝为代表的北方山水画派，表现北方雄伟险峻的山岳风光，笔法雄健，气势磅礴。',
    tenets: [
      '描绘北方高山大川，气势雄伟',
      '开创"皴法"表现山石质感',
      '注重"图真"，追求对自然的真实再现',
      '笔墨并重，为山水画立法'
    ],
    representativePainters: ['荆浩', '关仝'],
    influence: '开创北方山水画派，直接影响宋代李成、范宽等大家'
  },
  {
    id: 'dong-yuan-shanshui',
    name: '董巨山水（南方画派）',
    dynastyId: 'wu-dai',
    description: '以董源、巨然为代表的南方山水画派，表现江南秀丽山水，笔墨温润，意境淡远。',
    tenets: [
      '描绘江南平缓山峦与烟雨云雾',
      '开创"披麻皴"表现江南土质山峦',
      '多用淡墨，风格温润秀雅',
      '注重水墨渲染，营造朦胧意境'
    ],
    representativePainters: ['董源', '巨然'],
    influence: '开创南方山水画派，为元代文人画所继承发展'
  },
  {
    id: 'song-court',
    name: '宋代院体画',
    dynastyId: 'song',
    description: '宋代宫廷画院主导的绘画风格，以精工细致、写实逼真为特色，题材涵盖山水、花鸟、人物。',
    tenets: [
      '强调写实，状物精微',
      '构图严谨，技法精湛',
      '设色浓丽，风格典雅',
      '注重法度，体现皇家审美趣味'
    ],
    representativePainters: ['崔白', '王希孟', '李唐', '赵佶'],
    influence: '代表宋代绘画最高成就，是中国写实绘画的巅峰'
  },
  {
    id: 'wenrenhua-song',
    name: '宋代文人画',
    dynastyId: 'song',
    description: '以苏轼、米芾等文人士大夫为代表，强调"诗画本一律"，追求主观意趣的表达而非形似。',
    tenets: [
      '"论画以形似，见与儿童邻"——重意轻形',
      '诗书画印结合，强调文学修养',
      '以画寄情，表现人格精神',
      '崇尚水墨，反对浓艳'
    ],
    representativePainters: ['苏轼', '米芾', '米友仁'],
    influence: '奠定文人画理论基础，影响元明清三代绘画发展方向'
  },
  {
    id: 'yuan-si-jia',
    name: '元四家',
    dynastyId: 'yuan',
    description: '黄公望、王蒙、倪瓒、吴镇四位元代画家的合称，代表元代文人画最高成就，以"逸"为最高审美。',
    tenets: [
      '以画为寄，抒写胸中逸气',
      '继承董巨传统，加以发展创新',
      '诗书画印四位一体',
      '以书入画，强调笔墨独立审美价值',
      '干淡松秀，萧散简远为美'
    ],
    representativePainters: ['黄公望', '王蒙', '倪瓒', '吴镇'],
    influence: '确立文人画的正统地位，成为后世山水画学习的典范'
  },
  {
    id: 'zhe-pai',
    name: '浙派',
    dynastyId: 'ming',
    description: '明代前期以戴进为代表的画派，继承南宋院体风格，笔墨刚劲，气势豪放，因开创者戴进为浙江人而得名。',
    tenets: [
      '继承南宋李唐、马远、夏圭传统',
      '用墨苍劲，笔法奔放',
      '构图简括，多取一角半边之景',
      '风格雄健豪放'
    ],
    representativePainters: ['戴进', '吴伟'],
    influence: '明代前期画坛主流，后被吴门派取代'
  },
  {
    id: 'wu-men',
    name: '吴门画派',
    dynastyId: 'ming',
    description: '明代中期以沈周、文徵明、唐寅、仇英为代表，活跃于苏州（吴门）地区的画派，是文人画的重要传承与发展。',
    tenets: [
      '诗书画印兼修，文人气息浓厚',
      '继承元人传统，兼有宋人气度',
      '雅俗共赏，市场与艺术并重',
      '技法全面，山水、花鸟、人物兼善'
    ],
    representativePainters: ['沈周', '文徵明', '唐寅', '仇英'],
    influence: '主导明代中后期画坛，影响深远，弟子众多'
  },
  {
    id: 'songjiang-pai',
    name: '松江画派',
    dynastyId: 'ming',
    description: '晚明以董其昌为代表的画派，提倡"南北宗论"，推崇文人画，强调摹古与笔墨趣味。',
    tenets: [
      '提倡"南北宗论"，崇南贬北',
      '强调临摹古人，讲究笔墨传承',
      '以士气为尚，行家戾家之辨',
      '主张读万卷书，行万里路'
    ],
    representativePainters: ['董其昌', '陈继儒'],
    influence: '影响清代"四王"正统派，左右画坛三百年'
  },
  {
    id: 'si-wang',
    name: '四王（正统派）',
    dynastyId: 'qing',
    description: '清代王时敏、王鉴、王翚、王原祁四位画家的合称，是清代画坛的正统派，以摹古见长，注重笔墨法度。',
    tenets: [
      '以摹古为能事，主张"与古人同鼻孔出气"',
      '讲究笔墨章法，功力深厚',
      '集古人大成，合南北宗于一炉',
      '风格规整，适合初学入门'
    ],
    representativePainters: ['王时敏', '王鉴', '王翚', '王原祁'],
    influence: '得到皇室支持，主导清代画坛正统，影响深远'
  },
  {
    id: 'si-seng',
    name: '四僧（革新派）',
    dynastyId: 'qing',
    description: '清初四位明代遗民画家——八大山人、石涛、髡残、弘仁，寄情书画，个性强烈，风格独特。',
    tenets: [
      '借画抒怀，寄托亡国之思',
      '强调个性表达，"我自用我法"',
      '反对摹古，主张师法自然',
      '风格奇崛，情感真挚强烈'
    ],
    representativePainters: ['八大山人', '石涛', '髡残', '弘仁'],
    influence: '革新传统，对近现代写意画影响巨大'
  },
  {
    id: 'yangzhou-baguai',
    name: '扬州八怪',
    dynastyId: 'qing',
    description: '清中期活跃于扬州地区的画家群体，风格怪异，不拘成法，以写意花鸟著称，适应市民阶层审美需求。',
    tenets: [
      '个性张扬，不趋时流',
      '以写意花鸟为主，兼善竹石',
      '诗书画印结合，文人趣味浓厚',
      '雅俗共赏，适应市场需求'
    ],
    representativePainters: ['郑板桥', '金农', '黄慎', '李鱓', '汪士慎', '高翔', '李方膺', '罗聘'],
    influence: '将文人画推向市场，开海派先河'
  },
  {
    id: 'haishang-huapai',
    name: '海上画派',
    dynastyId: 'qing',
    description: '清末活跃于上海地区的画家群体，融合传统文人画与民间艺术，适应近代都市商业文化需求，开启近现代绘画转型。',
    tenets: [
      '融合传统文人画与民间艺术',
      '色彩鲜艳，雅俗共赏',
      '适应近代商业城市的审美需求',
      '大写意花鸟成就最高',
      '书画篆刻兼修'
    ],
    representativePainters: ['任伯年', '吴昌硕', '虚谷', '蒲华'],
    influence: '连接传统与现代，影响整个20世纪中国画发展'
  }
];
