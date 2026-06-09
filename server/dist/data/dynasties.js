"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynasties = void 0;
exports.dynasties = [
    {
        id: 'wei-jin',
        name: '魏晋南北朝',
        period: '公元220年—589年',
        years: '220-589',
        description: '中国绘画的启蒙与奠基时期，人物画逐渐成熟，山水画开始萌芽，绘画理论初步建立。',
        characteristics: [
            '人物画达到高峰，出现顾恺之等大师',
            '山水画处于萌芽状态，多为人物配景',
            '佛教艺术传入，壁画兴盛',
            '第一部系统画论《画品》问世'
        ],
        schoolIds: [],
        painterIds: ['gu-kaizhi']
    },
    {
        id: 'tang',
        name: '唐代',
        period: '公元618年—907年',
        years: '618-907',
        description: '中国绘画的全面繁荣期，各画科并盛，名家辈出，风格多样，对后世影响深远。',
        characteristics: [
            '人物画达到鼎盛，阎立本、吴道子并称',
            '山水画成熟，形成青绿与水墨两大流派',
            '花鸟画独立成科',
            '壁画艺术达到巅峰，敦煌莫高窟蔚为大观',
            '绘画理论进一步发展，张彦远《历代名画记》问世'
        ],
        schoolIds: ['green-shanshui-tang'],
        painterIds: ['yan-liben', 'wu-daozi', 'wang-wei', 'han-huang', 'zhou-fang']
    },
    {
        id: 'wu-dai',
        name: '五代',
        period: '公元907年—960年',
        years: '907-960',
        description: '唐宋之间的过渡时期，山水画与花鸟画取得重大突破，为宋代绘画高峰奠定基础。',
        characteristics: [
            '山水画出现荆浩、关仝、董源、巨然四大家',
            '花鸟画形成"徐黄异体"两大风格',
            '人物画继续发展，周文矩、顾闳中名家辈出'
        ],
        schoolIds: ['jing-guan-shanshui', 'dong-yuan-shanshui'],
        painterIds: ['jing-hao', 'guan-tong', 'dong-yuan', 'ju-ran', 'huang-quan', 'xu-xi', 'gu-hongzhong']
    },
    {
        id: 'song',
        name: '宋代',
        period: '公元960年—1279年',
        years: '960-1279',
        description: '中国绘画的黄金时代，宫廷画院兴盛，文人画兴起，各画科全面成熟。',
        characteristics: [
            '宫廷画院制度完善，院体画精工富丽',
            '文人画兴起，苏轼、米芾等倡导"士人画"',
            '山水画达到巅峰，李成、范宽、郭熙、李唐等大家辈出',
            '花鸟画高度成熟，宋徽宗赵佶造诣精深',
            '人物画走向生活化，张择端《清明上河图》为代表',
            '文人画理论体系建立'
        ],
        schoolIds: ['song-court', 'wenrenhua-song'],
        painterIds: ['li-cheng', 'fan-kuan', 'guo-xi', 'cui-bai', 'zhang-zeduan', 'wang-ximeng', 'li-tang', 'zhao-ji', 'su-shi', 'mi-fu']
    },
    {
        id: 'yuan',
        name: '元代',
        period: '公元1271年—1368年',
        years: '1271-1368',
        description: '文人画成为画坛主流，强调"书画同源"，追求逸笔草草、不求形似的艺术境界。',
        characteristics: [
            '文人画占据主导地位',
            '元四家（黄公望、王蒙、倪瓒、吴镇）代表最高成就',
            '强调"以书入画"，诗书画印四位一体',
            '山水画以"逸"为最高审美追求',
            '水墨写意花鸟画发展'
        ],
        schoolIds: ['yuan-si-jia'],
        painterIds: ['huang-gongwang', 'wang-meng', 'ni-zan', 'wu-zhen', 'zhao-mengfu', 'qian-xuan']
    },
    {
        id: 'ming',
        name: '明代',
        period: '公元1368年—1644年',
        years: '1368-1644',
        description: '画派林立，风格多样，吴门画派、浙派等流派争奇斗艳，文人画与院体画并行发展。',
        characteristics: [
            '画派林立，浙派、吴门派、松江派等各领风骚',
            '吴门四家（沈周、文徵明、唐寅、仇英）影响深远',
            '花鸟画方面，陈淳、徐渭开创大写意花鸟',
            '人物画出现陈洪绶等变形主义大师',
            '版画艺术兴盛，徽派版画精美绝伦'
        ],
        schoolIds: ['wu-men', 'zhe-pai', 'songjiang-pai'],
        painterIds: ['dai-jin', 'shen-zhou', 'wen-zhengming', 'tang-yin', 'qiu-ying', 'xu-wei', 'chen-chun', 'chen-hongshou', 'dong-qichang']
    },
    {
        id: 'qing',
        name: '清代',
        period: '公元1644年—1912年',
        years: '1644-1912',
        description: '传统绘画的集大成时期，"四王"正统派与"四僧"革新派并立，海上画派开启近现代绘画先河。',
        characteristics: [
            '"四王"（王时敏、王鉴、王翚、王原祁）主导画坛正统',
            '"四僧"（八大山人、石涛、髡残、弘仁）革新求变',
            '扬州八怪锐意创新，写意花鸟兴盛',
            '海上画派崛起，开启近现代绘画转型',
            '西方绘画技法传入，产生一定影响'
        ],
        schoolIds: ['si-wang', 'si-seng', 'yangzhou-baguai', 'haishang-huapai'],
        painterIds: ['wang-shimin', 'wang-jian', 'wang-hui', 'wang-yuanqi', 'bada-shanren', 'shi-tao', 'kun-can', 'hong-ren', 'zheng-banqiao', 'jin-nong', 'ren-bo-nian', 'wu-changshuo']
    }
];
