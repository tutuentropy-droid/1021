import { Card, Row, Col, Statistic, Button, Typography, Empty, Divider } from 'antd';
import {
  AppstoreOutlined,
  PictureOutlined,
  FileTextOutlined,
  MessageOutlined,
  BookOutlined,
  ArrowRightOutlined,
  BulbOutlined,
  FundProjectionScreenOutlined,
  EyeInvisibleOutlined
} from '@ant-design/icons';
import type { Stats } from '../types';

const { Title, Paragraph } = Typography;

interface HomePageProps {
  stats: Stats | null;
  onNavigate: (page: string) => void;
}

function HomePage({ stats, onNavigate }: HomePageProps) {
  if (!stats) {
    return (
      <Empty
        description="数据加载失败，请确认后端服务已启动（npm run dev）"
        style={{ marginTop: 80 }}
      />
    );
  }

  const features = [
    {
      icon: <FundProjectionScreenOutlined style={{ fontSize: 40, color: '#8b7355' }} />,
      title: '画史长卷',
      desc: '以时间为骨架、空间为肌理的立体长卷，宏观微观一键切换，一览千年画史流变',
      page: 'timeline',
      color: '#fdfbf3'
    },
    {
      icon: <AppstoreOutlined style={{ fontSize: 40, color: '#8b7355' }} />,
      title: '知识树导航',
      desc: '按朝代、流派、画家、作品的层级脉络，建立完整的中国画认知框架',
      page: 'tree',
      color: '#fdf6e3'
    },
    {
      icon: <PictureOutlined style={{ fontSize: 40, color: '#8b7355' }} />,
      title: '名作深度赏析',
      desc: '从构图、笔墨、设色、文化背景等多维度深度解析经典画作',
      page: 'gallery',
      color: '#f8f1e5'
    },
    {
      icon: <FileTextOutlined style={{ fontSize: 40, color: '#8b7355' }} />,
      title: '知识抽认卡',
      desc: '人物卡、作品卡、流派卡、画论卡，用间隔重复巩固记忆',
      page: 'flashcards',
      color: '#f5eee0'
    },
    {
      icon: <MessageOutlined style={{ fontSize: 40, color: '#8b7355' }} />,
      title: '对话引导学习',
      desc: '像苏格拉底式提问一样，引导你深度思考画作背后的艺术真谛',
      page: 'chat',
      color: '#f2e9d8'
    },
    {
      icon: <BookOutlined style={{ fontSize: 40, color: '#8b7355' }} />,
      title: '画论典籍',
      desc: '六法论、林泉高致、南北宗论……读懂古人的艺术智慧',
      page: 'theories',
      color: '#efe5d0'
    }
  ];

  return (
    <div>
      <div style={{
        background: 'linear-gradient(135deg, #5c4a33 0%, #8b7355 100%)',
        borderRadius: 20,
        padding: '48px',
        marginBottom: 32,
        color: '#fdfbf7',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', right: -50, top: -50, fontSize: 300, opacity: 0.1 }}>🖌️</div>
        <Title level={1} className="ink-title" style={{ color: '#fdfbf7', marginBottom: 16 }}>
          画脉通识
        </Title>
        <Title level={3} className="ink-subtitle" style={{ color: '#d4c4a8', fontWeight: 'normal', marginBottom: 24 }}>
          像搭建知识树一样，建立完整的中国画认知框架
        </Title>
        <Paragraph style={{ color: '#e8dcc8', fontSize: 16, maxWidth: 600, marginBottom: 32 }}>
          从魏晋风骨到唐宋气象，从元人逸笔到明清意趣——穿越千年画史，
          与顾恺之、范宽、黄公望、徐渭、八大山人等大家对话，
          在笔墨丹青中感受中华文化的深邃与美丽。
        </Paragraph>
        <Button
          type="primary"
          size="large"
          icon={<BulbOutlined />}
          onClick={() => onNavigate('chat')}
          style={{ background: '#fdfbf7', color: '#5c4a33', border: 'none', marginRight: 16 }}
        >
          开始引导学习
        </Button>
        <Button
          size="large"
          icon={<PictureOutlined />}
          onClick={() => onNavigate('gallery')}
          style={{ background: 'transparent', color: '#fdfbf7', borderColor: '#d4c4a8' }}
        >
          浏览传世名画
        </Button>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={12} sm={8} md={4}>
          <Card className="card-shadow" style={{ textAlign: 'center', borderRadius: 12 }}>
            <Statistic title="朝代脉络" value={stats.dynasties} suffix="个" valueStyle={{ color: '#8b7355' }} />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card className="card-shadow" style={{ textAlign: 'center', borderRadius: 12 }}>
            <Statistic title="画派流源" value={stats.schools} suffix="个" valueStyle={{ color: '#8b7355' }} />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card className="card-shadow" style={{ textAlign: 'center', borderRadius: 12 }}>
            <Statistic title="丹青大家" value={stats.painters} suffix="位" valueStyle={{ color: '#8b7355' }} />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card className="card-shadow" style={{ textAlign: 'center', borderRadius: 12 }}>
            <Statistic title="传世名作" value={stats.paintings} suffix="幅" valueStyle={{ color: '#8b7355' }} />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card className="card-shadow" style={{ textAlign: 'center', borderRadius: 12 }}>
            <Statistic title="画论典籍" value={stats.theories} suffix="部" valueStyle={{ color: '#8b7355' }} />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card className="card-shadow" style={{ textAlign: 'center', borderRadius: 12 }}>
            <Statistic title="知识卡片" value={stats.flashcards} suffix="张" valueStyle={{ color: '#8b7355' }} />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card
            className="card-shadow"
            style={{ textAlign: 'center', borderRadius: 12, background: '#fdf5ef', border: '1px dashed #c4a87a' }}
          >
            <Statistic
              title={<span style={{ fontStyle: 'italic' }}>画史阙如</span>}
              value={stats.absentEntries || 0}
              suffix="项"
              valueStyle={{ color: '#a0522d' }}
              prefix={<EyeInvisibleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Title level={3} className="ink-title" style={{ marginBottom: 24 }}>
        探索中国画的六大路径
      </Title>

      <Row gutter={[16, 16]}>
        {features.map(feature => (
          <Col xs={24} sm={12} md={8} key={feature.page}>
            <Card
              className="card-shadow"
              hoverable
              style={{ borderRadius: 16, height: '100%', background: feature.color, border: 'none' }}
              onClick={() => onNavigate(feature.page)}
            >
              <div style={{ marginBottom: 16 }}>{feature.icon}</div>
              <Title level={4} className="ink-title" style={{ marginBottom: 8, color: '#5c4a33' }}>
                {feature.title}
              </Title>
              <Paragraph style={{ color: '#6b5b45', marginBottom: 16 }}>
                {feature.desc}
              </Paragraph>
              <div style={{ color: '#8b7355' }}>
                开始探索 <ArrowRightOutlined />
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Divider style={{ margin: '40px 0 32px 0' }} />

      <Card
        className="card-shadow"
        style={{
          borderRadius: 20,
          marginBottom: 32,
          background: 'linear-gradient(135deg, #fdf5ef 0%, #f8ede0 100%)',
          border: '2px dashed #c4a87a',
          overflow: 'hidden'
        }}
        bodyStyle={{ padding: 0 }}
      >
        <Row gutter={0}>
          <Col xs={24} md={17}>
            <div style={{ padding: '36px 40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <span
                  style={{
                    fontSize: 40,
                    filter: 'grayscale(0.3) opacity(0.75)',
                    display: 'inline-block'
                  }}
                >
                  ❓
                </span>
                <div>
                  <Title level={3} style={{ margin: 0, color: '#5c4a33' }} className="ink-title">
                    阙如录 · 画史中的缺席场域
                  </Title>
                  <Paragraph style={{ margin: '6px 0 0 0', color: '#8b7355', fontSize: 13, fontStyle: 'italic' }}>
                    "君子于其所不知，盖阙如也" ——《论语·子路》
                  </Paragraph>
                </div>
              </div>

              <Paragraph style={{ color: '#6b5b45', lineHeight: 1.9, marginBottom: 16, fontSize: 15 }}>
                王维的真迹、顾恺之的原作、吴道子的三百壁壁画……
                在千年兵燹与岁月流转中，无数名作已成过眼云烟。
              </Paragraph>
              <Paragraph style={{ color: '#6b5b45', lineHeight: 1.9, marginBottom: 24, fontSize: 15 }}>
                系统不虚构这些空白的面貌，而是整理历代<span style={{ color: '#a0522d', fontWeight: 500 }}>追忆</span>、
                <span style={{ color: '#6b8e23', fontWeight: 500 }}>考据</span>与
                <span style={{ color: '#4a6b8a', fontWeight: 500 }}>感叹</span>的文献片段，
                让"缺席"本身成为一种可感知的历史存在——每一段空白，
                都是一道通往更辽阔想象世界的门扉。
              </Paragraph>

              <Button
                type="primary"
                size="large"
                icon={<EyeInvisibleOutlined />}
                onClick={() => onNavigate('absent')}
                style={{
                  background: 'linear-gradient(135deg, #8b7355 0%, #a0522d 100%)',
                  border: 'none',
                  borderRadius: 10,
                  padding: '0 28px'
                }}
              >
                进入阙如录
              </Button>
            </div>
          </Col>
          <Col xs={24} md={7} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div
              style={{
                width: 160,
                height: 200,
                border: '2px dashed #bdbdbd',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255,255,255,0.6)',
                position: 'relative',
                transform: 'rotate(-3deg)'
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: -12,
                  left: 12,
                  padding: '2px 10px',
                  background: '#fff',
                  border: '1px solid #d4c4a8',
                  borderRadius: 4,
                  fontSize: 11,
                  color: '#a89880',
                  transform: 'rotate(-5deg)'
                }}
                >
                  真迹失传
                </div>
                <div style={{ textAlign: 'center', color: '#9e9e9e' }}>
                  <div style={{ fontSize: 48, marginBottom: 8, fontStyle: 'italic' }}>?</div>
                  <div style={{ fontSize: 12, fontStyle: 'italic' }}>唯存追忆</div>
                  <div style={{ fontSize: 12, marginTop: 20, fontStyle: 'italic', color: '#bdbdbd' }}>
                    — 文献在场 —
                  </div>
                </div>
              </div>
            </Col>
        </Row>
      </Card>

      <div style={{
        marginTop: 8,
        padding: 32,
        background: '#fff',
        borderRadius: 16,
        border: '1px solid #e8dcc8'
      }}>
        <Title level={4} className="ink-title" style={{ color: '#5c4a33', marginBottom: 16 }}>
          学习建议
        </Title>
        <Row gutter={24}>
          <Col xs={24} md={8}>
            <div style={{ padding: '16px 0' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>🌱</div>
              <strong style={{ color: '#5c4a33' }}>初学者</strong>
              <Paragraph style={{ color: '#6b5b45', marginTop: 8 }}>
                从「对话引导」开始，让系统带领你入门；或从「知识树」的魏晋时期开始，按时间顺序顺流而下。
              </Paragraph>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div style={{ padding: '16px 0' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>🌿</div>
              <strong style={{ color: '#5c4a33' }}>进阶者</strong>
              <Paragraph style={{ color: '#6b5b45', marginTop: 8 }}>
                重点研读「画作欣赏」，结合「画论典籍」理解古人的艺术观，用「抽认卡」巩固记忆。
              </Paragraph>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div style={{ padding: '16px 0' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>🌳</div>
              <strong style={{ color: '#5c4a33' }}>研究者</strong>
              <Paragraph style={{ color: '#6b5b45', marginTop: 8 }}>
                对比不同朝代、流派的风格演变，思考画作背后的文化语境，建立自己的知识体系。
              </Paragraph>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default HomePage;
