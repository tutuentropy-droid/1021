import { useState, useRef, useEffect } from 'react';
import { Card, Typography, Input, Button, Avatar, Space, Empty, Spin, Tag, Row, Col } from 'antd';
import { SendOutlined, UserOutlined, BulbOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ChatMessage, ChatOption, Dynasty, Painting } from '../types';
import { knowledgeApi } from '../api';

const { Title, Paragraph } = Typography;

interface ChatStep {
  message: string;
  options: ChatOption[];
  onSelect?: (value: string) => ChatStep | Promise<ChatStep | null> | null;
}

function ChatGuidePage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [dynasties, setDynasties] = useState<Dynasty[]>([]);
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentOptions, setCurrentOptions] = useState<ChatOption[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      knowledgeApi.getDynasties(),
      knowledgeApi.getPaintings()
    ]).then(([dynastiesData, paintingsData]) => {
      setDynasties(dynastiesData);
      setPaintings(paintingsData);
      setLoading(false);
      startConversation();
    });
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (role: 'user' | 'assistant', content: string, options?: ChatOption[]) => {
    const msg: ChatMessage = {
      id: Date.now().toString() + Math.random(),
      role,
      content,
      options
    };
    setMessages(prev => [...prev, msg]);
    if (options) {
      setCurrentOptions(options);
    } else {
      setCurrentOptions([]);
    }
  };

  const startConversation = () => {
    setMessages([]);
    setTimeout(() => {
      addMessage('assistant',
        '你好！欢迎来到「画脉通识」🎨\n\n我是你的中国画学习向导。中国画历史源远流长，从魏晋到明清，名家辈出，流派纷呈。\n\n为了帮你更好地入门，我想先了解一下——你想从哪个方面开始探索中国画的魅力呢？',
        [
          { label: '🏔️ 我想了解山水画', value: 'shanshui' },
          { label: '🌸 我对花鸟画更感兴趣', value: 'huanniao' },
          { label: '👥 我想从人物画入门', value: 'renwu' },
          { label: '📜 按时间顺序从头开始学', value: 'timeline' },
          { label: '🖼️ 直接看传世名画', value: 'famous' }
        ]
      );
    }, 500);
  };

  const handleOptionSelect = async (value: string) => {
    const selectedOption = currentOptions.find(o => o.value === value);
    if (!selectedOption) return;

    addMessage('user', selectedOption.label);

    await new Promise(r => setTimeout(r, 800));

    switch (value) {
      case 'shanshui':
        addMessage('assistant',
          '好选择！山水画是中国画的第一大画科，被誉为"画中之龙"🐉\n\n从唐代王维开创水墨山水，到宋代范宽、郭熙的雄浑气象，再到元四家的逸笔草草，山水画承载了中国文人的精神追求。\n\n你想深入了解哪位山水画家的作品呢？',
          [
            { label: '范宽《溪山行旅图》（宋）', value: 'fan-kuan' },
            { label: '黄公望《富春山居图》（元）', value: 'huang-gongwang' },
            { label: '郭熙《早春图》（宋）', value: 'guo-xi' },
            { label: '先看看所有山水画名作', value: 'all-shanshui' }
          ]
        );
        break;

      case 'huanniao':
        addMessage('assistant',
          '花鸟画最能体现中国文人的"比兴"传统——梅兰竹菊"四君子"，松竹梅"岁寒三友"，无不寄托着画家的人格追求🌺\n\n从宋代院体的精工富丽，到徐渭、八大山人的大写意，花鸟画的演变也折射出中国艺术精神的变迁。\n\n你想从哪位花鸟画家开始？',
          [
            { label: '徐渭《墨葡萄图》（明）', value: 'xu-wei' },
            { label: '八大山人《荷石水禽图》（清）', value: 'bada' },
            { label: '韩滉《五牛图》（唐）', value: 'han-huang' },
            { label: '看看所有花鸟画', value: 'all-huanniao' }
          ]
        );
        break;

      case 'renwu':
        addMessage('assistant',
          '人物画是中国画最早成熟的画科👥\n\n从顾恺之的"传神写照"，到阎立本、吴道子的大唐气象，再到张择端《清明上河图》的市井百态，人物画记录了中华文明的千年沧桑。\n\n你想从哪幅人物画开始欣赏？',
          [
            { label: '顾恺之《洛神赋图》（晋）', value: 'gu-kaizhi' },
            { label: '张择端《清明上河图》（宋）', value: 'zhang-zeduan' },
            { label: '顾闳中《韩熙载夜宴图》（五代）', value: 'gu-hongzhong' },
            { label: '浏览全部人物画', value: 'all-renwu' }
          ]
        );
        break;

      case 'timeline':
        addMessage('assistant',
          '太好了，让我们沿着历史的长河顺流而下⏳\n\n中国画的发展大致可以分为几个关键时期：',
          [
            { label: '🏛️ 魏晋南北朝（220-589）——绘画的觉醒', value: 'dyn-wei-jin' },
            { label: '🌸 唐代（618-907）——百花齐放', value: 'dyn-tang' },
            { label: '⛰️ 宋代（960-1279）——黄金时代', value: 'dyn-song' },
            { label: '🍃 元代（1271-1368）——文人画的巅峰', value: 'dyn-yuan' },
            { label: '🎨 明清（1368-1912）——流派纷呈', value: 'dyn-ming-qing' }
          ]
        );
        break;

      case 'famous':
        addMessage('assistant',
          '直接进入最精彩的部分！✨\n\n我们精心挑选了十大传世名画，每一幅都是中国艺术史上的丰碑。去画作欣赏页面慢慢品味吧！',
          [
            { label: '🖼️ 前往画作欣赏页面', value: 'go-gallery' },
            { label: '先听我介绍最著名的三幅', value: 'top-3' }
          ]
        );
        break;

      case 'fan-kuan':
      case 'huang-gongwang':
      case 'guo-xi':
      case 'xu-wei':
      case 'bada':
      case 'han-huang':
      case 'gu-kaizhi':
      case 'zhang-zeduan':
      case 'gu-hongzhong':
        const paintingMap: Record<string, string> = {
          'fan-kuan': '溪山行旅图',
          'huang-gongwang': '富春山居图',
          'guo-xi': '早春图',
          'xu-wei': '墨葡萄图',
          'bada': '荷石水禽图',
          'han-huang': '五牛图',
          'gu-kaizhi': '洛神赋图',
          'zhang-zeduan': '清明上河图',
          'gu-hongzhong': '韩熙载夜宴图'
        };
        const paintingName = paintingMap[value];
        addMessage('assistant',
          `好眼光！《${paintingName}》是传世名作中的精品。\n\n你可以点击下方按钮，前往画作欣赏页面查看完整的深度赏析——包括构图分析、笔墨解读、文化背景、艺术成就，还有启发性的思考题。\n\n准备好了吗？`,
          [
            { label: `🖼️ 查看《${paintingName}》深度赏析`, value: 'go-gallery' },
            { label: '我想继续探索其他作品', value: 'continue' }
          ]
        );
        break;

      case 'dyn-wei-jin':
        addMessage('assistant',
          '魏晋南北朝是中国绘画的"觉醒时代"✨\n\n这一时期，绘画从工匠技艺上升为文人艺术。顾恺之提出"传神写照"，谢赫写出《画品》"六法论"，山水画开始萌芽。\n\n虽然这一时期的原作几乎没有留存，但通过宋人摹本，我们依然可以感受到那个"魏晋风度"的时代。',
          [
            { label: '🖼️ 看看顾恺之的作品', value: 'gu-kaizhi' },
            { label: '📖 了解谢赫"六法论"', value: 'go-theories' },
            { label: '进入下一个时代：唐代', value: 'dyn-tang' }
          ]
        );
        break;

      case 'dyn-tang':
        addMessage('assistant',
          '唐代是中国绘画的"青春时代"🌸\n\n大唐盛世，文化包容开放：\n• 人物画：阎立本、吴道子（画圣）、周昉\n• 山水画：李思训（青绿）、王维（水墨，南宗之祖）\n• 畜兽画：韩滉画牛、韩幹画马\n\n吴道子的"吴带当风"，王维的"诗中有画"，都为后世奠定了基础。',
          [
            { label: '👀 看看唐代名画', value: 'all-tang' },
            { label: '进入下一个时代：宋代', value: 'dyn-song' }
          ]
        );
        break;

      case 'dyn-song':
        addMessage('assistant',
          '宋代是中国绘画的"黄金时代"⛰️\n\n宋徽宗设立画院，以诗题取士，画家地位空前提高。\n\n北宋：李成、范宽、郭熙的雄浑山水，崔白的花鸟\n南宋：李唐、刘松年、马远、夏圭"南宋四家"\n\n更重要的是，苏轼、米芾等文人提出"士人画"理论，开启了文人画传统。',
          [
            { label: '🖼️ 欣赏宋代名作', value: 'all-song' },
            { label: '📖 了解宋代画论', value: 'go-theories' },
            { label: '进入下一个时代：元代', value: 'dyn-yuan' }
          ]
        );
        break;

      case 'dyn-yuan':
        addMessage('assistant',
          '元代是文人画的"巅峰时代"🍃\n\n异族统治下，文人士大夫隐遁山林，以画寄情。\n\n"元四家"——黄公望、王蒙、倪瓒、吴镇，将董源、巨然的南方山水传统发展到极致。\n\n他们追求"逸笔草草，不求形似"，将笔墨的独立审美价值推向高峰。',
          [
            { label: '🖼️ 欣赏元四家作品', value: 'all-yuan' },
            { label: '进入下一个时代：明清', value: 'dyn-ming-qing' }
          ]
        );
        break;

      case 'dyn-ming-qing':
        addMessage('assistant',
          '明清是中国画的"集大成时代"🎨\n\n画派林立，风格多样：\n• 明代：浙派、吴门四家、徐渭大写意、董其昌南北宗论\n• 清代：四王正统 vs 四僧革新、扬州八怪、海上画派\n\n从摹古到创新，从文人雅趣到市民审美，传统绘画在变革中孕育着现代转型的契机。',
          [
            { label: '🖼️ 探索明清名画', value: 'all-ming-qing' },
            { label: '📖 看看董其昌"南北宗论"', value: 'go-theories' },
            { label: '✅ 完成时间线之旅，总结一下', value: 'finish-timeline' }
          ]
        );
        break;

      case 'top-3':
        addMessage('assistant',
          '好的！最著名的三幅传世名画：\n\n🏆 《清明上河图》（张择端，宋）——宋代社会的百科全书\n🏆 《富春山居图》（黄公望，元）——"画中之兰亭"\n🏆 《千里江山图》（王希孟，宋）——18岁天才少年的千古绝唱\n\n每一幅都值得细细品味！',
          [
            { label: '🖼️ 前往画作欣赏页面', value: 'go-gallery' },
            { label: '重新开始探索', value: 'restart' }
          ]
        );
        break;

      case 'go-gallery':
        addMessage('assistant', '好的！正在为你跳转到画作欣赏页面～');
        setTimeout(() => onNavigate('gallery'), 800);
        break;

      case 'go-theories':
        addMessage('assistant', '前往画论典籍页面，让我们一起品味古人的艺术智慧～');
        setTimeout(() => onNavigate('theories'), 800);
        break;

      case 'finish-timeline':
        addMessage('assistant',
          '🎉 恭喜你完成了中国画时间线的初步探索！\n\n从魏晋到明清，千年画史如长河奔流。建议你接下来：\n1. 去「画作欣赏」深入品味经典作品\n2. 用「知识抽认卡」巩固记忆\n3. 读「画论典籍」理解古人的艺术观\n\n随时可以点击下方按钮重新开始，或者去其他模块继续探索！',
          [
            { label: '🔄 重新开始对话', value: 'restart' },
            { label: '🖼️ 浏览画作', value: 'go-gallery' },
            { label: '📇 练习抽认卡', value: 'go-flashcards' }
          ]
        );
        break;

      case 'go-flashcards':
        addMessage('assistant', '好的，来用抽认卡检验一下你的学习成果吧！');
        setTimeout(() => onNavigate('flashcards'), 800);
        break;

      case 'restart':
        startConversation();
        break;

      default:
        if (value.startsWith('all-')) {
          addMessage('assistant',
            '太棒了！画作欣赏页面有详细的分类和筛选功能。让我带你过去，你可以按照朝代、题材细细品味每一幅作品。',
            [
              { label: '🖼️ 前往画作欣赏', value: 'go-gallery' },
              { label: '🔄 重新开始探索', value: 'restart' }
            ]
          );
        } else {
          addMessage('assistant',
            '这个方向很有趣！你可以继续：',
            [
              { label: '🖼️ 去画作欣赏深入学习', value: 'go-gallery' },
              { label: '🌲 用知识树构建体系', value: 'go-tree' },
              { label: '🔄 重新开始对话', value: 'restart' }
            ]
          );
        }
    }

    if (value === 'go-tree') {
      setTimeout(() => onNavigate('tree'), 800);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 100 }}>
        <Spin size="large" tip="准备学习向导中..." />
      </div>
    );
  }

  return (
    <div>
      <Title level={2} className="ink-title" style={{ color: '#5c4a33', marginBottom: 8 }}>
        💬 对话引导学习
      </Title>
      <Paragraph style={{ color: '#8b7355', marginBottom: 24 }}>
        像苏格拉底对话一样，让系统引导你一步步探索中国画的世界
      </Paragraph>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={18}>
          <Card
            className="card-shadow"
            style={{ borderRadius: 16, height: '70vh', display: 'flex', flexDirection: 'column' }}
            bodyStyle={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 24 }}
          >
            <div
              ref={chatContainerRef}
              className="scroll-y"
              style={{ flex: 1, overflowY: 'auto', marginBottom: 16, paddingRight: 8 }}
            >
              {messages.map(msg => (
                <div key={msg.id} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 16 }}>
                  {msg.role === 'assistant' && (
                    <Avatar style={{ backgroundColor: '#8b7355', marginRight: 12 }}>
                      <BulbOutlined />
                    </Avatar>
                  )}
                  <div
                    className={`chat-bubble ${msg.role}`}
                    style={{ whiteSpace: 'pre-wrap' }}
                  >
                    {msg.content}
                  </div>
                  {msg.role === 'user' && (
                    <Avatar style={{ backgroundColor: '#d4c4a8', marginLeft: 12 }}>
                      <UserOutlined />
                    </Avatar>
                  )}
                </div>
              ))}

              {currentOptions.length > 0 && (
                <div style={{ marginTop: 24 }}>
                  {currentOptions.map(option => (
                    <button
                      key={option.value}
                      className="option-btn"
                      onClick={() => handleOptionSelect(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {currentOptions.length === 0 && messages.length > 0 && (
              <div style={{ borderTop: '1px solid #e8dcc8', paddingTop: 16, textAlign: 'center' }}>
                <Button icon={<ReloadOutlined />} onClick={startConversation}>
                  重新开始对话
                </Button>
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} md={6}>
          <Card className="card-shadow" style={{ borderRadius: 16, marginBottom: 16 }}>
            <Title level={5} className="ink-title" style={{ color: '#5c4a33', marginTop: 0 }}>
              学习提示
            </Title>
            <Paragraph style={{ color: '#6b5b45', fontSize: 13, marginBottom: 8 }}>
              💡 这是一个引导式的对话学习体验。
            </Paragraph>
            <Paragraph style={{ color: '#6b5b45', fontSize: 13, marginBottom: 8 }}>
              🎯 根据你的兴趣选择不同路径，系统会带你深入相关内容。
            </Paragraph>
            <Paragraph style={{ color: '#6b5b45', fontSize: 13, marginBottom: 0 }}>
              🌳 对话结束后，可以到知识树和画作欣赏页面继续深入学习。
            </Paragraph>
          </Card>

          <Card className="card-shadow" style={{ borderRadius: 16 }}>
            <Title level={5} className="ink-title" style={{ color: '#5c4a33', marginTop: 0 }}>
              已收录
            </Title>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Tag color="#2980b9">{dynasties.length} 个朝代</Tag>
              <Tag color="#8b7355">{paintings.length} 幅名作</Tag>
              <Tag color="#c0392b">系统内置引导路径</Tag>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default ChatGuidePage;
