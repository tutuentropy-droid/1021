import { useState, useEffect } from 'react';
import {
  Row, Col, Card, Typography, Spin, Select, Tag, Modal,
  Descriptions, List, Divider, Avatar, Empty, Tabs, Button, Space, Tooltip, Breadcrumb
} from 'antd';
import {
  EyeOutlined,
  BulbOutlined,
  InfoCircleOutlined,
  HighlightOutlined,
  HistoryOutlined,
  ReadOutlined,
  StarOutlined,
  ShareAltOutlined,
  AppstoreOutlined,
  PictureOutlined,
  EditOutlined,
  BookOutlined
} from '@ant-design/icons';
import type { Painting, Dynasty, Painter, SealInscription, LiteraryWork } from '../types';
import { knowledgeApi } from '../api';
import KnowledgeGraph from '../components/KnowledgeGraph';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const THEME_ICONS: Record<string, string> = {
  '山水': '🏔️',
  '花鸟': '🌿',
  '人物': '👥',
  '风俗人物': '🎭',
  '畜兽': '🐂',
  '人物故事': '📖'
};

const LITERARY_TYPE_LABELS: Record<string, string> = {
  poem: '📜 题画诗',
  colophon: '📝 画跋',
  note: '📋 笔记',
  letter: '✉️ 书信',
  theory_excerpt: '📖 画论节选',
  appreciation: '🎨 品评'
};

const LITERARY_TYPE_COLORS: Record<string, string> = {
  poem: '#8b4513',
  colophon: '#c0392b',
  note: '#2c5282',
  letter: '#27ae60',
  theory_excerpt: '#8e44ad',
  appreciation: '#d35400'
};

interface GalleryPageProps {
  initialPaintingId?: string | null;
  onInitialPaintingConsumed?: () => void;
}

function GalleryPage({ initialPaintingId, onInitialPaintingConsumed }: GalleryPageProps) {
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [dynasties, setDynasties] = useState<Dynasty[]>([]);
  const [painters, setPainters] = useState<Painter[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPainting, setSelectedPainting] = useState<Painting | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filters, setFilters] = useState<{ dynastyId?: string; theme?: string }>({});
  const [deepAnalysis, setDeepAnalysis] = useState<any>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState('analysis');
  const [literaryWorks, setLiteraryWorks] = useState<LiteraryWork[]>([]);
  const [literaryWorksLoading, setLiteraryWorksLoading] = useState(false);
  const [selectedLiteraryWork, setSelectedLiteraryWork] = useState<(LiteraryWork & { relatedPaintings: Painting[]; relatedPainters: Painter[] }) | null>(null);
  const [literaryWorkModalVisible, setLiteraryWorkModalVisible] = useState(false);

  useEffect(() => {
    Promise.all([
      knowledgeApi.getPaintings(),
      knowledgeApi.getDynasties(),
      knowledgeApi.getPainters()
    ]).then(([paintingsData, dynastiesData, paintersData]) => {
      setPaintings(paintingsData);
      setDynasties(dynastiesData);
      setPainters(paintersData);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    knowledgeApi.getPaintings(filters).then(setPaintings);
  }, [filters]);

  useEffect(() => {
    if (!loading && initialPaintingId && paintings.length > 0) {
      const painting = paintings.find(p => p.id === initialPaintingId);
      if (painting) {
        setSelectedPainting(painting);
        setModalVisible(true);
        loadDeepAnalysis(initialPaintingId);
        onInitialPaintingConsumed?.();
      }
    }
  }, [loading, initialPaintingId, paintings, onInitialPaintingConsumed]);

  const themes = Array.from(new Set(paintings.map(p => p.theme)));

  const getPainterName = (painterId: string) => {
    return painters.find(p => p.id === painterId)?.name || '佚名';
  };

  const getDynastyName = (dynastyId: string) => {
    return dynasties.find(d => d.id === dynastyId)?.name || '';
  };

  const loadDeepAnalysis = async (paintingId: string) => {
    setAnalysisLoading(true);
    try {
      const data = await knowledgeApi.getPaintingDeepAnalysis(paintingId);
      setDeepAnalysis(data.deepAnalysis);
    } catch (e) {
      console.error(e);
    } finally {
      setAnalysisLoading(false);
    }
  };

  const filteredPaintings = paintings.filter(p => {
    if (filters.dynastyId && p.dynastyId !== filters.dynastyId) return false;
    if (filters.theme && p.theme !== filters.theme) return false;
    return true;
  });

  const openPaintingDetail = (painting: Painting) => {
    setSelectedPainting(painting);
    setModalVisible(true);
    setActiveModalTab('analysis');
    setDeepAnalysis(null);
    loadDeepAnalysis(painting.id);
    loadLiteraryWorks(painting.id);
  };

  const loadLiteraryWorks = async (paintingId: string) => {
    setLiteraryWorksLoading(true);
    try {
      const data = await knowledgeApi.getPaintingLiteraryWorks(paintingId);
      setLiteraryWorks(data);
    } catch (e) {
      console.error(e);
      setLiteraryWorks([]);
    } finally {
      setLiteraryWorksLoading(false);
    }
  };

  const openLiteraryWorkDetail = (workId: string) => {
    knowledgeApi.getLiteraryWork(workId)
      .then(data => {
        setSelectedLiteraryWork(data);
        setLiteraryWorkModalVisible(true);
      })
      .catch(() => {});
  };

  const navigateToPaintingFromLiterary = (paintingId: string) => {
    setLiteraryWorkModalVisible(false);
    setModalVisible(false);
    const painting = paintings.find(p => p.id === paintingId);
    if (painting) {
      setTimeout(() => {
        openPaintingDetail(painting);
      }, 100);
    }
  };

  const renderSealsInscriptions = (items: SealInscription[]) => {
    if (!items || items.length === 0) return <Empty description="暂无印章题跋数据" />;
    const seals = items.filter(i => i.type === 'seal');
    const inscriptions = items.filter(i => i.type === 'inscription');
    return (
      <div>
        {inscriptions.length > 0 && (
          <>
            <Title level={5} className="ink-title" style={{ color: '#5c4a33' }}>
              ✍️ 题跋
            </Title>
            <List
              dataSource={inscriptions}
              renderItem={(item) => (
                <List.Item style={{ border: 'none', padding: '12px 0', borderBottom: '1px dashed #e8dcc8' }}>
                  <div style={{ width: '100%' }}>
                    <Space style={{ marginBottom: 8 }}>
                      <Tag color="#8b7355">{item.owner}</Tag>
                      {item.dynasty && <Tag>{item.dynasty}</Tag>}
                      {item.position && <Tag color="geekblue">{item.position}</Tag>}
                    </Space>
                    <Paragraph style={{ color: '#4a3f33', fontSize: 14, lineHeight: 1.9, fontStyle: 'italic', backgroundColor: '#fdfbf7', padding: 12, borderRadius: 8, margin: '8px 0' }}>
                      "{item.content}"
                    </Paragraph>
                    {item.meaning && (
                      <Text type="secondary" style={{ color: '#8b7355' }}>
                        💡 {item.meaning}
                      </Text>
                    )}
                  </div>
                </List.Item>
              )}
            />
          </>
        )}
        {seals.length > 0 && (
          <>
            <Divider />
            <Title level={5} className="ink-title" style={{ color: '#5c4a33' }}>
              🔴 鉴藏印章
            </Title>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {seals.map((seal, i) => (
                <Tooltip key={i} title={`${seal.owner}${seal.dynasty ? `（${seal.dynasty}）` : ''}${seal.meaning ? ` - ${seal.meaning}` : ''}`}>
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #c0392b 0%, #922b21 100%)',
                      color: '#fdfbf7',
                      padding: '10px 14px',
                      borderRadius: 4,
                      minWidth: 80,
                      textAlign: 'center',
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: 'pointer',
                      fontFamily: 'serif',
                      boxShadow: '0 2px 8px rgba(192,57,43,0.3)'
                    }}>
                      <div style={{ fontSize: 11, opacity: 0.9, marginBottom: 2 }}>{seal.owner}</div>
                      <div style={{ fontSize: 12 }}>{seal.content.slice(0, 6)}</div>
                    </div>
                  </Tooltip>
                ))}
              </div>
            </>
        )}
      </div>
    );
  };

  const renderAnalysisTab = (analysis: any) => {
    const sections = [
      { key: 'overallImpression', label: '整体印象', icon: <EyeOutlined /> },
      { key: 'spatialLayout', label: '空间布局', icon: <InfoCircleOutlined /> },
      { key: 'brushwork', label: '用笔技法', icon: <HighlightOutlined /> },
      { key: 'brushworkQuality', label: '笔墨品格', icon: <StarOutlined /> },
      { key: 'inkUse', label: '用墨特色', icon: <HighlightOutlined /> },
      { key: 'colorUse', label: '设色特点', icon: <HighlightOutlined /> },
      { key: 'culturalContext', label: '文化背景', icon: <BulbOutlined /> },
      { key: 'artisticAchievement', label: '艺术成就', icon: <BulbOutlined /> },
      { key: 'transmissionHistory', label: '收藏传承', icon: <HistoryOutlined /> },
      { key: 'scholarlyAppreciation', label: '历代品评', icon: <ReadOutlined /> },
      { key: 'sealsAndInscriptions', label: '印章题跋', icon: <ShareAltOutlined /> }
    ];

    return (
      <Tabs
        activeKey={activeModalTab}
        onChange={setActiveModalTab}
        items={sections.map(section => ({
          key: section.key,
          label: (
            <span>
              {section.icon} {section.label}
            </span>
          ),
          children: (
            <div className="analysis-section">
              {section.key === 'sealsAndInscriptions' ? (
                renderSealsInscriptions(analysis[section.key])
              ) : (
                <Paragraph style={{ color: '#4a3f33', fontSize: 15, lineHeight: 2, whiteSpace: 'pre-wrap' }}>
                  {analysis[section.key]}
                </Paragraph>
              )}
            </div>
          )
        }))}
      />
    );
  };

  const renderGraphTab = () => {
    if (!selectedPainting) return null;
    return (
      <div style={{ marginTop: 16 }}>
        <KnowledgeGraph
          initialPaintingId={selectedPainting.id}
          height={480}
        />
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 100 }}>
        <Spin size="large" tip="加载画作中..." />
      </div>
    );
  }

  return (
    <div>
      <Title level={2} className="ink-title" style={{ color: '#5c4a33', marginBottom: 8 }}>
        🖼️ 传世名画深度赏析（视觉认知）
      </Title>
      <Paragraph style={{ color: '#8b7355', marginBottom: 24 }}>
        从构图、笔墨品格、印章题跋、文化脉络等多个维度，结合知识图谱深入理解每一幅经典之作
      </Paragraph>

      <Card className="card-shadow" style={{ borderRadius: 16, marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Text strong style={{ color: '#5c4a33', marginRight: 8 }}>朝代：</Text>
            <Select
              placeholder="全部朝代"
              style={{ width: 160 }}
              allowClear
              onChange={(value) => setFilters(f => ({ ...f, dynastyId: value || undefined }))}
            >
              {dynasties.map(d => (
                <Option key={d.id} value={d.id}>{d.name}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Text strong style={{ color: '#5c4a33', marginRight: 8 }}>题材：</Text>
            <Select
              placeholder="全部题材"
              style={{ width: 160 }}
              allowClear
              onChange={(value) => setFilters(f => ({ ...f, theme: value || undefined }))}
            >
              {themes.map(t => (
                <Option key={t} value={t}>{THEME_ICONS[t] || '🎨'} {t}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={8} style={{ textAlign: 'right' }}>
            <Text type="secondary">共 {filteredPaintings.length} 幅作品</Text>
          </Col>
        </Row>
      </Card>

      {filteredPaintings.length === 0 ? (
        <Empty description="暂无匹配的画作" />
      ) : (
        <Row gutter={[16, 16]}>
          {filteredPaintings.map(painting => (
            <Col xs={24} sm={12} lg={8} key={painting.id}>
              <Card
                className="card-shadow"
                hoverable
                style={{ borderRadius: 16, height: '100%' }}
                onClick={() => openPaintingDetail(painting)}
                cover={
                  <div style={{ position: 'relative' }}>
                    <img
                      src={painting.imageUrl}
                      alt={painting.title}
                      referrerPolicy="no-referrer"
                      style={{
                        width: '100%',
                        height: 220,
                        objectFit: 'cover',
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        backgroundColor: '#f8f5ee'
                      }}
                    />
                    <Tag
                      color="#8b7355"
                      style={{ position: 'absolute', top: 12, right: 12 }}
                    >
                      👁️ AI深度鉴赏
                    </Tag>
                  </div>
                }
              >
                <Card.Meta
                  title={
                    <div className="ink-title" style={{ fontSize: 18, color: '#5c4a33' }}>
                      {painting.title}
                    </div>
                  }
                  description={
                    <div style={{ marginTop: 8 }}>
                      <div style={{ marginBottom: 8 }}>
                        <Tag color="#8b7355">{getDynastyName(painting.dynastyId)}</Tag>
                        <Tag color="#a89880">{THEME_ICONS[painting.theme] || '🎨'} {painting.theme}</Tag>
                      </div>
                      <div style={{ color: '#6b5b45', fontSize: 13 }}>
                        <Avatar size={20} style={{ backgroundColor: '#d4c4a8', marginRight: 8, verticalAlign: 'middle' }}>
                          {getPainterName(painting.painterId).charAt(0)}
                        </Avatar>
                        {getPainterName(painting.painterId)}
                      </div>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal
        open={modalVisible}
        onCancel={() => { setModalVisible(false); setActiveModalTab('analysis'); }}
        footer={null}
        width={1000}
        destroyOnClose
      >
        {selectedPainting && (
          <div>
            <Breadcrumb style={{ marginBottom: 12 }}>
              <Breadcrumb.Item>🎨 画作欣赏</Breadcrumb.Item>
              <Breadcrumb.Item>{getDynastyName(selectedPainting.dynastyId)}</Breadcrumb.Item>
              <Breadcrumb.Item>{selectedPainting.title}</Breadcrumb.Item>
            </Breadcrumb>

            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <img
                src={selectedPainting.imageUrl}
                alt={selectedPainting.title}
                referrerPolicy="no-referrer"
                style={{
                  width: '100%',
                  maxHeight: 380,
                  objectFit: 'contain',
                  borderRadius: 12,
                  backgroundColor: '#f8f5ee',
                  boxShadow: '0 4px 20px rgba(139,115,85,0.2)'
                }}
              />
            </div>

            <Title level={2} className="ink-title" style={{ color: '#5c4a33', marginTop: 0, textAlign: 'center' }}>
              {selectedPainting.title}
            </Title>

            <Descriptions column={2} size="small" style={{ marginBottom: 16 }}>
              <Descriptions.Item label="朝代">{getDynastyName(selectedPainting.dynastyId)}</Descriptions.Item>
              <Descriptions.Item label="作者">{getPainterName(selectedPainting.painterId)}</Descriptions.Item>
              <Descriptions.Item label="创作年代">{selectedPainting.year || '不详'}</Descriptions.Item>
              <Descriptions.Item label="题材">{THEME_ICONS[selectedPainting.theme]} {selectedPainting.theme}</Descriptions.Item>
              <Descriptions.Item label="形制">{selectedPainting.format}</Descriptions.Item>
              <Descriptions.Item label="尺寸">{selectedPainting.dimensions || '不详'}</Descriptions.Item>
              <Descriptions.Item label="收藏地" span={2}>{selectedPainting.collection}</Descriptions.Item>
            </Descriptions>

            <Tabs
              activeKey={activeModalTab}
              onChange={setActiveModalTab}
              items={[
                {
                  key: 'analysis',
                  label: <span><EyeOutlined /> AI深度鉴赏</span>,
                  children: analysisLoading ? (
                    <div style={{ padding: 40, textAlign: 'center' }}>
                      <Spin size="large" tip="AI正在从多角度鉴赏此画..." />
                    </div>
                  ) : deepAnalysis ? (
                    renderAnalysisTab(deepAnalysis)
                  ) : (
                    <Empty description="暂无深度鉴赏数据" />
                  )
                },
                {
                  key: 'literary',
                  label: (
                    <span>
                      <EditOutlined /> 题咏与评跋
                      {literaryWorks.length > 0 && (
                        <Tag color="#c0392b" style={{ marginLeft: 6, fontSize: 10 }}>{literaryWorks.length}</Tag>
                      )}
                    </span>
                  ),
                  children: literaryWorksLoading ? (
                    <div style={{ padding: 40, textAlign: 'center' }}>
                      <Spin size="large" tip="加载相关诗文..." />
                    </div>
                  ) : literaryWorks.length > 0 ? (
                    <List
                      dataSource={literaryWorks}
                      renderItem={(item) => (
                        <List.Item
                          style={{ borderBottom: '1px dashed #e8dcc8', padding: '16px 0' }}
                          actions={[
                            <Button
                              type="link"
                              size="small"
                              icon={<BookOutlined />}
                              onClick={() => openLiteraryWorkDetail(item.id)}
                              style={{ color: '#8b7355' }}
                            >
                              阅读全文
                            </Button>
                          ]}
                        >
                          <List.Item.Meta
                            title={
                              <Space>
                                <Tag
                                  style={{
                                    background: LITERARY_TYPE_COLORS[item.type],
                                    color: '#fff',
                                    border: 'none',
                                    fontSize: 11
                                  }}
                                >
                                  {LITERARY_TYPE_LABELS[item.type]}
                                </Tag>
                                <span style={{ color: '#5c4a33', fontWeight: 'bold', fontSize: 15 }}>{item.title}</span>
                              </Space>
                            }
                            description={
                              <div style={{ marginTop: 8 }}>
                                <Text style={{ color: '#8b7355', fontSize: 13 }}>
                                  {item.author} · {dynasties.find(d => d.id === item.dynastyId)?.name || ''}
                                  {item.year && ` · ${item.year}`}
                                </Text>
                                <Paragraph
                                  ellipsis={{ rows: 3 }}
                                  style={{
                                    color: '#6b5b45',
                                    fontSize: 13,
                                    marginTop: 10,
                                    marginBottom: 0,
                                    fontStyle: 'italic',
                                    lineHeight: 1.8
                                  }}
                                >
                                  {item.content}
                                </Paragraph>
                              </div>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  ) : (
                    <Empty description="暂无相关诗文记载" />
                  )
                },
                {
                  key: 'graph',
                  label: <span><AppstoreOutlined /> 知识图谱</span>,
                  children: renderGraphTab()
                }
              ]}
            />

            {deepAnalysis && activeModalTab === 'analysis' && (
              <>
                {deepAnalysis.funFacts && deepAnalysis.funFacts.length > 0 && (
                  <>
                    <Divider />
                    <Title level={4} className="ink-title" style={{ color: '#5c4a33' }}>
                      ✨ 趣闻轶事
                    </Title>
                    <List
                      dataSource={deepAnalysis.funFacts}
                      renderItem={(item: string) => (
                        <List.Item style={{ border: 'none', padding: '8px 0' }}>
                          <Text style={{ color: '#6b5b45' }}>• {item}</Text>
                        </List.Item>
                      )}
                    />
                  </>
                )}

                {deepAnalysis.socraticQuestions && deepAnalysis.socraticQuestions.length > 0 && (
                  <>
                    <Divider />
                    <Title level={4} className="ink-title" style={{ color: '#5c4a33' }}>
                      💭 思考与讨论
                    </Title>
                    <List
                      dataSource={deepAnalysis.socraticQuestions}
                      renderItem={(item: string, index: number) => (
                        <List.Item style={{ border: 'none', padding: '12px 0', borderBottom: index < deepAnalysis.socraticQuestions.length - 1 ? '1px dashed #e8dcc8' : 'none' }}>
                          <div>
                            <Tag color="#c0392b" style={{ marginRight: 8 }}>问题 {index + 1}</Tag>
                            <Text strong style={{ color: '#5c4a33' }}>{item}</Text>
                          </div>
                        </List.Item>
                      )}
                    />
                  </>
                )}
              </>
            )}

            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <Button type="primary" icon={<PictureOutlined />} onClick={() => setModalVisible(false)}>
                关闭
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={literaryWorkModalVisible}
        onCancel={() => setLiteraryWorkModalVisible(false)}
        footer={null}
        width={800}
        destroyOnClose
      >
        {selectedLiteraryWork && (
          <div>
            <Space style={{ marginBottom: 16 }}>
              <Tag
                style={{
                  background: LITERARY_TYPE_COLORS[selectedLiteraryWork.type],
                  color: '#fff',
                  border: 'none',
                  fontSize: 12
                }}
              >
                {LITERARY_TYPE_LABELS[selectedLiteraryWork.type]}
              </Tag>
            </Space>
            <Title level={2} className="ink-title" style={{ color: '#5c4a33', marginTop: 0 }}>
              {selectedLiteraryWork.title}
            </Title>
            <Text style={{ color: '#8b7355' }}>
              {selectedLiteraryWork.author} · {dynasties.find(d => d.id === selectedLiteraryWork.dynastyId)?.name || ''}
              {selectedLiteraryWork.year && ` · ${selectedLiteraryWork.year}`}
            </Text>

            <Divider />

            <div
              style={{
                padding: '20px 24px',
                background: '#faf6ee',
                borderRadius: 12,
                borderLeft: '4px solid #8b7355',
                marginBottom: 20
              }}
            >
              <Title level={4} style={{ color: '#5c4a33', marginTop: 0 }}>
                <EditOutlined /> 原文
              </Title>
              <Paragraph
                style={{
                  color: '#4a3f33',
                  fontSize: 15,
                  lineHeight: 2,
                  whiteSpace: 'pre-wrap',
                  marginBottom: 0,
                  fontFamily: '"KaiTi", "STKaiti", serif'
                }}
              >
                {selectedLiteraryWork.content}
              </Paragraph>
            </div>

            {selectedLiteraryWork.translation && (
              <div style={{ marginBottom: 20 }}>
                <Title level={4} style={{ color: '#5c4a33' }}>
                  📝 白话译文
                </Title>
                <Paragraph
                  style={{
                    color: '#6b5b45',
                    fontSize: 14,
                    lineHeight: 1.8,
                    marginBottom: 0
                  }}
                >
                  {selectedLiteraryWork.translation}
                </Paragraph>
              </div>
            )}

            {selectedLiteraryWork.background && (
              <div style={{ marginBottom: 20 }}>
                <Title level={4} style={{ color: '#5c4a33' }}>
                  📜 创作背景
                </Title>
                <Paragraph
                  style={{
                    color: '#6b5b45',
                    fontSize: 14,
                    lineHeight: 1.8,
                    marginBottom: 0
                  }}
                >
                  {selectedLiteraryWork.background}
                </Paragraph>
              </div>
            )}

            {selectedLiteraryWork.appreciation && (
              <div style={{ marginBottom: 20 }}>
                <Title level={4} style={{ color: '#5c4a33' }}>
                  🎨 赏析
                </Title>
                <Paragraph
                  style={{
                    color: '#6b5b45',
                    fontSize: 14,
                    lineHeight: 1.8,
                    marginBottom: 0,
                    padding: '12px 16px',
                    background: '#f0e9dc',
                    borderRadius: 8
                  }}
                >
                  {selectedLiteraryWork.appreciation}
                </Paragraph>
              </div>
            )}

            {selectedLiteraryWork.relatedPaintings && selectedLiteraryWork.relatedPaintings.length > 0 && (
              <>
                <Divider />
                <Title level={4} style={{ color: '#5c4a33' }}>
                  <PictureOutlined /> 关联画作
                  <Tag color="#c0392b" style={{ marginLeft: 12, fontSize: 12 }}>
                    {selectedLiteraryWork.relatedPaintings.length} 幅
                  </Tag>
                </Title>
                <List
                  grid={{ gutter: 12, xs: 1, sm: 2, md: 2, lg: 2, xl: 3 }}
                  dataSource={selectedLiteraryWork.relatedPaintings}
                  renderItem={(painting) => (
                    <List.Item>
                      <Card
                        hoverable
                        size="small"
                        cover={
                          <img
                            src={painting.imageUrl}
                            alt={painting.title}
                            referrerPolicy="no-referrer"
                            style={{ height: 120, objectFit: 'cover' }}
                          />
                        }
                        bodyStyle={{ padding: 12 }}
                        onClick={() => navigateToPaintingFromLiterary(painting.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <Card.Meta
                          title={<span style={{ fontSize: 13, color: '#5c4a33' }}>{painting.title}</span>}
                          description={
                            <span style={{ fontSize: 12, color: '#8b7355' }}>
                              {painters.find(p => p.id === painting.painterId)?.name || '佚名'}
                            </span>
                          }
                        />
                      </Card>
                    </List.Item>
                  )}
                />
              </>
            )}

            {selectedLiteraryWork.source && (
              <div style={{ marginTop: 20, textAlign: 'right' }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  出处：{selectedLiteraryWork.source}
                </Text>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default GalleryPage;
