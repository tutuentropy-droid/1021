import { useState, useEffect } from 'react';
import { Row, Col, Tree, Card, Typography, Spin, Empty, Tag, Modal, Descriptions, List, Divider, Tabs, Button, Space, Breadcrumb } from 'antd';
import {
  PictureOutlined,
  ReadOutlined,
  EyeOutlined,
  BulbOutlined,
  InfoCircleOutlined,
  HighlightOutlined,
  AppstoreOutlined,
  TeamOutlined,
  BookOutlined,
  LinkOutlined,
  EditOutlined,
  MessageOutlined
} from '@ant-design/icons';
import type { TreeNode, Dynasty, School, Painter, Painting, ReadingRecommendation, ReadingCategory, LiteraryWork } from '../types';
import { knowledgeApi } from '../api';
import KnowledgeGraph from '../components/KnowledgeGraph';

const { Title, Paragraph, Text } = Typography;

const CATEGORY_LABELS: Record<ReadingCategory, string> = {
  classic: '📜 经典画论',
  academic: '📘 现代学术',
  documentary: '🎬 纪录片',
  exhibition: '🏛️ 线上展览'
};

const CATEGORY_COLORS: Record<ReadingCategory, string> = {
  classic: '#8b4513',
  academic: '#2c5282',
  documentary: '#c0392b',
  exhibition: '#27ae60'
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

interface KnowledgeTreeProps {
  onNavigate: (page: string, paintingId?: string) => void;
  initialPainterId?: string | null;
  onInitialPainterConsumed?: () => void;
}

const THEME_ICONS: Record<string, string> = {
  '山水': '🏔️',
  '花鸟': '🌿',
  '人物': '👥',
  '风俗人物': '🎭',
  '畜兽': '🐂',
  '人物故事': '📖'
};

function parseNodeKey(key: string): { type: string; id: string } | null {
  const dashIndex = key.indexOf('-');
  if (dashIndex <= 0) return null;
  return {
    type: key.slice(0, dashIndex),
    id: key.slice(dashIndex + 1)
  };
}

function KnowledgeTree({ onNavigate, initialPainterId, onInitialPainterConsumed }: KnowledgeTreeProps) {
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [dynasties, setDynasties] = useState<Dynasty[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [painters, setPainters] = useState<Painter[]>([]);
  const [allPaintings, setAllPaintings] = useState<Painting[]>([]);
  const [selectedNode, setSelectedNode] = useState<{ id: string; type: string } | null>(null);
  const [selectedData, setSelectedData] = useState<any>(null);
  const [selectedPainting, setSelectedPainting] = useState<Painting | null>(null);
  const [paintingDetailVisible, setPaintingDetailVisible] = useState(false);
  const [knowledgeGraphVisible, setKnowledgeGraphVisible] = useState(false);
  const [graphSource, setGraphSource] = useState<{ type: string; id: string } | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(true);
  const [readingRecommendation, setReadingRecommendation] = useState<ReadingRecommendation | null>(null);
  const [readingLoading, setReadingLoading] = useState(false);
  const [literaryWorks, setLiteraryWorks] = useState<LiteraryWork[]>([]);
  const [literaryWorksLoading, setLiteraryWorksLoading] = useState(false);
  const [selectedLiteraryWork, setSelectedLiteraryWork] = useState<(LiteraryWork & { relatedPaintings: Painting[]; relatedPainters: Painter[] }) | null>(null);
  const [literaryWorkModalVisible, setLiteraryWorkModalVisible] = useState(false);

  useEffect(() => {
    Promise.all([
      knowledgeApi.getKnowledgeTree(),
      knowledgeApi.getDynasties(),
      knowledgeApi.getSchools(),
      knowledgeApi.getPainters(),
      knowledgeApi.getPaintings()
    ]).then(([treeData, dynastiesData, schoolsData, paintersData, paintingsData]) => {
      setTree(treeData);
      setDynasties(dynastiesData);
      setSchools(schoolsData);
      setPainters(paintersData);
      setAllPaintings(paintingsData);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const params = selectedNode
      ? { contextType: selectedNode.type as 'dynasty' | 'school' | 'painter' | 'painting', contextId: selectedNode.id }
      : undefined;
    setReadingLoading(true);
    knowledgeApi.getReadingRecommendations(params)
      .then(data => setReadingRecommendation(data))
      .catch(() => setReadingRecommendation(null))
      .finally(() => setReadingLoading(false));
  }, [selectedNode]);

  useEffect(() => {
    if (!selectedNode) {
      setLiteraryWorks([]);
      return;
    }

    setLiteraryWorksLoading(true);
    let fetchPromise;

    if (selectedNode.type === 'painting') {
      fetchPromise = knowledgeApi.getPaintingLiteraryWorks(selectedNode.id);
    } else if (selectedNode.type === 'painter') {
      fetchPromise = knowledgeApi.getPainterLiteraryWorks(selectedNode.id);
    } else {
      setLiteraryWorks([]);
      setLiteraryWorksLoading(false);
      return;
    }

    fetchPromise
      .then(data => setLiteraryWorks(data))
      .catch(() => setLiteraryWorks([]))
      .finally(() => setLiteraryWorksLoading(false));
  }, [selectedNode]);

  const convertToAntTree = (nodes: TreeNode[]): any[] => {
    return nodes.map(node => ({
      key: `${node.type}-${node.id}`,
      title: (
        <span>
          {node.type === 'dynasty' && '🏛️ '}
          {node.type === 'school' && '🎨 '}
          {node.type === 'painter' && '👨‍🎨 '}
          {node.type === 'painting' && '🖼️ '}
          {node.name}
        </span>
      ),
      children: node.children ? convertToAntTree(node.children) : undefined
    }));
  };

  const selectNode = (type: string, id: string) => {
    setSelectedKeys([`${type}-${id}`]);
    setSelectedNode({ id, type });
    setPaintingDetailVisible(false);
    setSelectedPainting(null);

    switch (type) {
      case 'dynasty':
        setSelectedData(dynasties.find(d => d.id === id) || null);
        break;
      case 'school':
        setSelectedData(schools.find(s => s.id === id) || null);
        break;
      case 'painter':
        setSelectedData(painters.find(p => p.id === id) || null);
        break;
      case 'painting': {
        const painting = allPaintings.find(p => p.id === id) || null;
        setSelectedData(painting);
        setSelectedPainting(painting);
        break;
      }
      default:
        setSelectedData(null);
    }
  };

  useEffect(() => {
    if (initialPainterId && painters.length > 0) {
      const painter = painters.find(p => p.id === initialPainterId);
      if (painter) {
        selectNode('painter', initialPainterId);
      }
      onInitialPainterConsumed?.();
    }
  }, [initialPainterId, painters]);

  const handleSelect = (keys: React.Key[]) => {
    if (keys.length === 0) {
      setSelectedKeys([]);
      setSelectedNode(null);
      setSelectedData(null);
      setSelectedPainting(null);
      setPaintingDetailVisible(false);
      return;
    }

    const parsed = parseNodeKey(keys[0] as string);
    if (!parsed) return;
    selectNode(parsed.type, parsed.id);
  };

  const openPaintingAnalysis = (painting: Painting) => {
    setSelectedPainting(painting);
    setPaintingDetailVisible(true);
  };

  const goToGallery = (paintingId: string) => {
    onNavigate('gallery', paintingId);
  };

  const openLiteraryWorkDetail = (workId: string) => {
    knowledgeApi.getLiteraryWork(workId)
      .then(data => {
        setSelectedLiteraryWork(data);
        setLiteraryWorkModalVisible(true);
      })
      .catch(() => {});
  };

  const renderAnalysisTab = (analysis: any) => {
    const sections = [
      { key: 'overallImpression', label: '整体印象', icon: <EyeOutlined /> },
      { key: 'composition', label: '构图布局', icon: <InfoCircleOutlined /> },
      { key: 'brushwork', label: '用笔技法', icon: <HighlightOutlined /> },
      { key: 'inkUse', label: '用墨特色', icon: <HighlightOutlined /> },
      { key: 'colorUse', label: '设色特点', icon: <HighlightOutlined /> },
      { key: 'culturalContext', label: '文化背景', icon: <BulbOutlined /> },
      { key: 'artisticAchievement', label: '艺术成就', icon: <BulbOutlined /> }
    ];

    return (
      <Tabs
        items={sections.map(section => ({
          key: section.key,
          label: (
            <span>
              {section.icon} {section.label}
            </span>
          ),
          children: (
            <div className="analysis-section">
              <Paragraph style={{ color: '#4a3f33', fontSize: 15, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                {analysis[section.key]}
              </Paragraph>
            </div>
          )
        }))}
      />
    );
  };

  const renderDetail = () => {
    if (!selectedNode || !selectedData) {
      return (
        <Empty
          description={
            <div style={{ color: '#8b7355' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🌲</div>
              <div className="ink-subtitle" style={{ fontSize: 16 }}>点击左侧节点，探索中国画的知识脉络</div>
            </div>
          }
        />
      );
    }

    const typeLabels: Record<string, string> = {
      dynasty: '朝代',
      school: '画派',
      painter: '画家',
      painting: '画作'
    };

    const getPainterName = (painterId: string) => {
      return painters.find(p => p.id === painterId)?.name || '佚名';
    };

    const getDynastyName = (dynastyId: string) => {
      return dynasties.find(d => d.id === dynastyId)?.name || '';
    };

    const displayTitle = selectedNode.type === 'painting'
      ? selectedData.title
      : selectedData.name;

    return (
      <Card className="card-shadow" style={{ borderRadius: 16 }}>
        <Tag color="#8b7355" style={{ marginBottom: 12 }}>{typeLabels[selectedNode.type]}</Tag>
        <Title level={2} className="ink-title" style={{ color: '#5c4a33' }}>
          {displayTitle}
        </Title>

        {selectedNode.type === 'dynasty' && (
          <>
            <Paragraph style={{ color: '#8b7355', fontSize: 14 }}>
              {selectedData.period}
            </Paragraph>
            <Title level={4} className="ink-title" style={{ marginTop: 24, color: '#5c4a33' }}>
              时代特征
            </Title>
            <ul style={{ paddingLeft: 20, color: '#6b5b45', lineHeight: 2 }}>
              {selectedData.characteristics?.map((c: string, i: number) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </>
        )}

        {selectedNode.type === 'school' && (
          <>
            <Title level={4} className="ink-title" style={{ color: '#5c4a33' }}>
              艺术主张
            </Title>
            <ul style={{ paddingLeft: 20, color: '#6b5b45', lineHeight: 2 }}>
              {selectedData.tenets?.map((t: string, i: number) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
            <Title level={4} className="ink-title" style={{ marginTop: 24, color: '#5c4a33' }}>
              代表画家
            </Title>
            <Paragraph style={{ color: '#6b5b45' }}>
              {selectedData.representativePainters?.join('、')}
            </Paragraph>
            <Title level={4} className="ink-title" style={{ marginTop: 24, color: '#5c4a33' }}>
              历史影响
            </Title>
            <Paragraph style={{ color: '#6b5b45' }}>
              {selectedData.influence}
            </Paragraph>
            <Space style={{ marginTop: 16 }}>
              <Button
                icon={<AppstoreOutlined />}
                onClick={() => {
                  setGraphSource({ type: 'school', id: selectedData.id });
                  setKnowledgeGraphVisible(true);
                }}
              >
                查看知识图谱
              </Button>
            </Space>
          </>
        )}

        {selectedNode.type === 'painter' && (
          <>
            {selectedData.artName && (
              <Paragraph style={{ color: '#8b7355' }}>
                号：{selectedData.artName}
                {selectedData.courtesyName && ` · 字：${selectedData.courtesyName}`}
              </Paragraph>
            )}
            <Paragraph style={{ color: '#8b7355' }}>
              {selectedData.years}
            </Paragraph>
            <Title level={4} className="ink-title" style={{ color: '#5c4a33' }}>
              生平简介
            </Title>
            <Paragraph style={{ color: '#6b5b45' }}>
              {selectedData.biography}
            </Paragraph>
            <Title level={4} className="ink-title" style={{ color: '#5c4a33' }}>
              艺术风格
            </Title>
            <Paragraph style={{ color: '#6b5b45' }}>
              {selectedData.style}
            </Paragraph>

            {(selectedData.teacherIds?.length > 0 || selectedData.studentIds?.length > 0 || selectedData.influencedPainterIds?.length > 0) && (
              <>
                <Title level={4} className="ink-title" style={{ marginTop: 16, color: '#5c4a33' }}>
                  <TeamOutlined /> 师承脉络
                </Title>
                {selectedData.teacherIds?.length > 0 && (
                  <div style={{ marginBottom: 8 }}>
                    <Text strong style={{ color: '#8b7355' }}>师承：</Text>
                    <Space wrap style={{ marginLeft: 8 }}>
                      {selectedData.teacherIds.map((tid: string) => {
                        const p = painters.find(pp => pp.id === tid);
                        return p ? (
                          <Button
                            key={tid}
                            type="link"
                            size="small"
                            style={{ color: '#c0392b', padding: 0 }}
                            onClick={() => selectNode('painter', tid)}
                          >
                            👨‍🎓 {p.name}
                          </Button>
                        ) : null;
                      })}
                    </Space>
                  </div>
                )}
                {selectedData.studentIds?.length > 0 && (
                  <div style={{ marginBottom: 8 }}>
                    <Text strong style={{ color: '#8b7355' }}>传予：</Text>
                    <Space wrap style={{ marginLeft: 8 }}>
                      {selectedData.studentIds.map((sid: string) => {
                        const p = painters.find(pp => pp.id === sid);
                        return p ? (
                          <Button
                            key={sid}
                            type="link"
                            size="small"
                            style={{ color: '#27ae60', padding: 0 }}
                            onClick={() => selectNode('painter', sid)}
                          >
                            📖 {p.name}
                          </Button>
                        ) : null;
                      })}
                    </Space>
                  </div>
                )}
                {selectedData.influencedPainterIds?.length > 0 && (
                  <div>
                    <Text strong style={{ color: '#8b7355' }}>影响后世：</Text>
                    <Space wrap style={{ marginLeft: 8 }}>
                      {selectedData.influencedPainterIds.map((iid: string) => {
                        const p = painters.find(pp => pp.id === iid);
                        return p ? (
                          <Button
                            key={iid}
                            type="link"
                            size="small"
                            style={{ color: '#8e44ad', padding: 0 }}
                            onClick={() => selectNode('painter', iid)}
                          >
                            ✨ {p.name}
                          </Button>
                        ) : null;
                      })}
                    </Space>
                  </div>
                )}
                <Space style={{ marginTop: 12 }}>
                  <Button
                    icon={<AppstoreOutlined />}
                    onClick={() => {
                      setGraphSource({ type: 'painter', id: selectedData.id });
                      setKnowledgeGraphVisible(true);
                    }}
                  >
                    查看知识图谱
                  </Button>
                </Space>
              </>
            )}

            <Title level={4} className="ink-title" style={{ marginTop: 16, color: '#5c4a33' }}>
              代表作品
            </Title>
            <Space wrap style={{ marginBottom: 8 }}>
              {allPaintings
                .filter(p => p.painterId === selectedData.id)
                .map(painting => (
                  <Button
                    key={painting.id}
                    type="link"
                    size="small"
                    style={{ color: '#8b7355', padding: 0 }}
                    onClick={() => selectNode('painting', painting.id)}
                  >
                    🖼️ {painting.title}
                  </Button>
                ))}
            </Space>
            {allPaintings.filter(p => p.painterId === selectedData.id).length === 0 && (
              <Paragraph style={{ color: '#6b5b45' }}>
                {selectedData.famousWorks?.join('、')}
              </Paragraph>
            )}
            {selectedData.anecdotes && selectedData.anecdotes.length > 0 && (
              <>
                <Title level={4} className="ink-title" style={{ marginTop: 16, color: '#5c4a33' }}>
                  趣闻轶事
                </Title>
                <ul style={{ paddingLeft: 20, color: '#6b5b45', lineHeight: 2 }}>
                  {selectedData.anecdotes.map((a: string, i: number) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </>
            )}

            {literaryWorks.length > 0 && (
              <>
                <Divider />
                <Title level={4} className="ink-title" style={{ color: '#5c4a33' }}>
                  <MessageOutlined /> 相关诗文与画论
                  <Tag color="#c0392b" style={{ marginLeft: 12, fontSize: 12 }}>
                    共 {literaryWorks.length} 篇
                  </Tag>
                </Title>
                {literaryWorksLoading ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
                    <Spin tip="加载相关诗文..." />
                  </div>
                ) : (
                  <List
                    dataSource={literaryWorks}
                    renderItem={(item) => (
                      <List.Item
                        style={{ borderBottom: '1px dashed #e8dcc8', padding: '12px 0' }}
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
                              <span style={{ color: '#5c4a33', fontWeight: 'bold' }}>{item.title}</span>
                            </Space>
                          }
                          description={
                            <div>
                              <Text style={{ color: '#8b7355', fontSize: 13 }}>
                                {item.author} · {dynasties.find(d => d.id === item.dynastyId)?.name || ''}
                                {item.year && ` · ${item.year}`}
                              </Text>
                              <Paragraph
                                ellipsis={{ rows: 2 }}
                                style={{
                                  color: '#6b5b45',
                                  fontSize: 13,
                                  marginTop: 8,
                                  marginBottom: 0,
                                  fontStyle: 'italic'
                                }}
                              >
                                {item.content.slice(0, 100)}...
                              </Paragraph>
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                )}
              </>
            )}
          </>
        )}

        {selectedNode.type === 'painting' && selectedData && (
          <>
            <img
              src={selectedData.imageUrl}
              alt={selectedData.title}
              referrerPolicy="no-referrer"
              style={{
                width: '100%',
                maxHeight: 300,
                objectFit: 'contain',
                borderRadius: 12,
                marginBottom: 20,
                backgroundColor: '#f8f5ee'
              }}
            />
            <Descriptions column={2} size="small" style={{ marginBottom: 16 }}>
              <Descriptions.Item label="朝代">{getDynastyName(selectedData.dynastyId)}</Descriptions.Item>
              <Descriptions.Item label="作者">
                <Button
                  type="link"
                  size="small"
                  style={{ padding: 0, height: 'auto' }}
                  onClick={() => selectNode('painter', selectedData.painterId)}
                >
                  {getPainterName(selectedData.painterId)}
                </Button>
              </Descriptions.Item>
              <Descriptions.Item label="创作年代">{selectedData.year || '不详'}</Descriptions.Item>
              <Descriptions.Item label="题材">{THEME_ICONS[selectedData.theme]} {selectedData.theme}</Descriptions.Item>
              <Descriptions.Item label="形制">{selectedData.format}</Descriptions.Item>
              <Descriptions.Item label="尺寸">{selectedData.dimensions || '不详'}</Descriptions.Item>
              <Descriptions.Item label="收藏地" span={2}>{selectedData.collection}</Descriptions.Item>
            </Descriptions>
            <Title level={4} className="ink-title" style={{ color: '#5c4a33' }}>
              整体印象
            </Title>
            <Paragraph style={{ color: '#6b5b45', lineHeight: 1.8 }}>
              {selectedData.analysis?.overallImpression}
            </Paragraph>
            <Space style={{ marginTop: 16 }}>
              <Button
                type="primary"
                icon={<ReadOutlined />}
                onClick={() => openPaintingAnalysis(selectedData)}
                style={{ background: '#8b7355', borderColor: '#8b7355' }}
              >
                查看深度赏析
              </Button>
              <Button
                icon={<PictureOutlined />}
                onClick={() => goToGallery(selectedData.id)}
              >
                前往画作欣赏
              </Button>
            </Space>

            {literaryWorks.length > 0 && (
              <>
                <Divider />
                <Title level={4} className="ink-title" style={{ color: '#5c4a33' }}>
                  <EditOutlined /> 题咏与评跋
                  <Tag color="#c0392b" style={{ marginLeft: 12, fontSize: 12 }}>
                    共 {literaryWorks.length} 篇
                  </Tag>
                </Title>
                {literaryWorksLoading ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
                    <Spin tip="加载相关诗文..." />
                  </div>
                ) : (
                  <List
                    dataSource={literaryWorks}
                    renderItem={(item) => (
                      <List.Item
                        style={{ borderBottom: '1px dashed #e8dcc8', padding: '12px 0' }}
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
                              <span style={{ color: '#5c4a33', fontWeight: 'bold' }}>{item.title}</span>
                            </Space>
                          }
                          description={
                            <div>
                              <Text style={{ color: '#8b7355', fontSize: 13 }}>
                                {item.author} · {dynasties.find(d => d.id === item.dynastyId)?.name || ''}
                                {item.year && ` · ${item.year}`}
                              </Text>
                              <Paragraph
                                ellipsis={{ rows: 2 }}
                                style={{
                                  color: '#6b5b45',
                                  fontSize: 13,
                                  marginTop: 8,
                                  marginBottom: 0,
                                  fontStyle: 'italic'
                                }}
                              >
                                {item.content.slice(0, 100)}...
                              </Paragraph>
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                )}
              </>
            )}
          </>
        )}

        {selectedNode.type !== 'painting' && selectedData.description && (
          <Paragraph style={{ color: '#6b5b45' }}>
            {selectedData.description}
          </Paragraph>
        )}
      </Card>
    );
  };

  const renderReadingList = () => {
    if (readingLoading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
          <Spin tip="正在为你精选延伸读物..." />
        </div>
      );
    }

    if (!readingRecommendation || readingRecommendation.items.length === 0) {
      return null;
    }

    const { items, intro } = readingRecommendation;

    return (
      <Card
        className="card-shadow"
        style={{ borderRadius: 16, marginTop: 24 }}
        title={
          <span style={{ color: '#5c4a33' }}>
            <BookOutlined style={{ marginRight: 8 }} />
            卧游书单
            <Tag color="#c0392b" style={{ marginLeft: 12, fontSize: 12 }}>
              AI 导师推荐
            </Tag>
          </span>
        }
      >
        <Paragraph style={{ color: '#6b5b45', marginBottom: 20, padding: '12px 16px', background: '#faf6ee', borderRadius: 8, borderLeft: '3px solid #8b7355' }}>
          <span style={{ fontSize: 18, marginRight: 6 }}>💡</span>
          {intro}
        </Paragraph>

        <List
          grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 3 }}
          dataSource={items}
          renderItem={(item) => (
            <List.Item>
              <Card
                hoverable
                style={{
                  borderRadius: 12,
                  height: '100%',
                  border: '1px solid #e8dcc8',
                  background: 'linear-gradient(135deg, #fffef8 0%, #faf6ee 100%)'
                }}
                bodyStyle={{ padding: 16 }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div
                    style={{
                      fontSize: 36,
                      marginRight: 12,
                      padding: '8px 12px',
                      background: '#f5ede0',
                      borderRadius: 8
                    }}
                  >
                    {item.coverEmoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <Tag
                      style={{
                        marginBottom: 8,
                        background: CATEGORY_COLORS[item.category],
                        color: '#fff',
                        border: 'none',
                        fontSize: 11
                      }}
                    >
                      {CATEGORY_LABELS[item.category]}
                    </Tag>
                    <Title
                      level={4}
                      className="ink-title"
                      style={{
                        color: '#5c4a33',
                        margin: 0,
                        fontSize: 16,
                        lineHeight: 1.4
                      }}
                    >
                      {item.title}
                    </Title>
                    {item.author && (
                      <Text style={{ color: '#8b7355', fontSize: 13 }}>
                        {item.author} {item.dynasty && `· ${item.dynasty}`}
                      </Text>
                    )}
                  </div>
                </div>

                <Paragraph
                  style={{
                    color: '#6b5b45',
                    fontSize: 13,
                    lineHeight: 1.7,
                    marginBottom: 12
                  }}
                >
                  {item.description}
                </Paragraph>

                <div
                  style={{
                    padding: '10px 12px',
                    background: '#faf0e0',
                    borderRadius: 8,
                    borderLeft: '3px solid #c0392b'
                  }}
                >
                  <Text style={{ color: '#c0392b', fontWeight: 'bold', fontSize: 13 }}>
                    📖 为什么你接下来应该读这本：
                  </Text>
                  <Paragraph style={{ color: '#5c4a33', fontSize: 13, lineHeight: 1.7, margin: '6px 0 0 0' }}>
                    {item.whyRead}
                  </Paragraph>
                </div>

                {item.sourceUrl && (
                  <Button
                    type="link"
                    icon={<LinkOutlined />}
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#8b7355', padding: 0, marginTop: 12 }}
                  >
                    前往探索
                  </Button>
                )}
              </Card>
            </List.Item>
          )}
        />
      </Card>
    );
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 100 }}>
        <Spin size="large" tip="加载知识树中..." />
      </div>
    );
  }

  const getPainterNameModal = (painterId: string) => {
    return painters.find(p => p.id === painterId)?.name || '佚名';
  };

  const getDynastyNameModal = (dynastyId: string) => {
    return dynasties.find(d => d.id === dynastyId)?.name || '';
  };

  return (
    <div>
      <Title level={2} className="ink-title" style={{ color: '#5c4a33', marginBottom: 8 }}>
        🌲 中国画知识树
      </Title>
      <Paragraph style={{ color: '#8b7355', marginBottom: 24 }}>
        从朝代到流派，从画家到作品，层层展开，构建你的中国画认知之树
      </Paragraph>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card
            className="card-shadow"
            style={{ borderRadius: 16, maxHeight: '70vh', overflow: 'auto' }}
            bodyStyle={{ padding: 16 }}
          >
            <Tree
              showLine={{ showLeafIcon: false }}
              treeData={convertToAntTree(tree)}
              defaultExpandAll={false}
              expandedKeys={tree.map(t => `dynasty-${t.id}`)}
              selectedKeys={selectedKeys}
              onSelect={handleSelect}
              blockNode
            />
          </Card>
        </Col>
        <Col xs={24} md={16}>
          {renderDetail()}
        </Col>
      </Row>

      {renderReadingList()}

      <Modal
        open={paintingDetailVisible}
        onCancel={() => setPaintingDetailVisible(false)}
        footer={null}
        width={900}
        destroyOnClose
      >
        {selectedPainting && (
          <div>
            <img
              src={selectedPainting.imageUrl}
              alt={selectedPainting.title}
              referrerPolicy="no-referrer"
              style={{
                width: '100%',
                maxHeight: 350,
                objectFit: 'contain',
                borderRadius: 12,
                marginBottom: 20,
                backgroundColor: '#f8f5ee'
              }}
            />

            <Title level={2} className="ink-title" style={{ color: '#5c4a33', marginTop: 0 }}>
              {selectedPainting.title}
            </Title>

            <Descriptions column={2} size="small" style={{ marginBottom: 24 }}>
              <Descriptions.Item label="朝代">{getDynastyNameModal(selectedPainting.dynastyId)}</Descriptions.Item>
              <Descriptions.Item label="作者">{getPainterNameModal(selectedPainting.painterId)}</Descriptions.Item>
              <Descriptions.Item label="创作年代">{selectedPainting.year || '不详'}</Descriptions.Item>
              <Descriptions.Item label="题材">{THEME_ICONS[selectedPainting.theme]} {selectedPainting.theme}</Descriptions.Item>
              <Descriptions.Item label="形制">{selectedPainting.format}</Descriptions.Item>
              <Descriptions.Item label="尺寸">{selectedPainting.dimensions || '不详'}</Descriptions.Item>
              <Descriptions.Item label="收藏地" span={2}>{selectedPainting.collection}</Descriptions.Item>
            </Descriptions>

            <Divider />

            <Title level={4} className="ink-title" style={{ color: '#5c4a33' }}>
              📖 深度赏析
            </Title>

            {renderAnalysisTab(selectedPainting.analysis)}

            {selectedPainting.analysis.funFacts && selectedPainting.analysis.funFacts.length > 0 && (
              <>
                <Divider />
                <Title level={4} className="ink-title" style={{ color: '#5c4a33' }}>
                  ✨ 趣闻轶事
                </Title>
                <List
                  dataSource={selectedPainting.analysis.funFacts}
                  renderItem={(item) => (
                    <List.Item style={{ border: 'none', padding: '8px 0' }}>
                      <Paragraph style={{ color: '#6b5b45', margin: 0 }}>• {item}</Paragraph>
                    </List.Item>
                  )}
                />
              </>
            )}

            {selectedPainting.analysis.socraticQuestions && selectedPainting.analysis.socraticQuestions.length > 0 && (
              <>
                <Divider />
                <Title level={4} className="ink-title" style={{ color: '#5c4a33' }}>
                  💭 思考与讨论
                </Title>
                <List
                  dataSource={selectedPainting.analysis.socraticQuestions}
                  renderItem={(item, index) => (
                    <List.Item style={{ border: 'none', padding: '12px 0', borderBottom: index < selectedPainting.analysis.socraticQuestions.length - 1 ? '1px dashed #e8dcc8' : 'none' }}>
                      <div>
                        <Tag color="#c0392b" style={{ marginRight: 8 }}>问题 {index + 1}</Tag>
                        <span style={{ color: '#5c4a33', fontWeight: 'bold' }}>{item}</span>
                      </div>
                    </List.Item>
                  )}
                />
              </>
            )}

            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <Button
                type="primary"
                icon={<PictureOutlined />}
                onClick={() => {
                  setPaintingDetailVisible(false);
                  goToGallery(selectedPainting.id);
                }}
                style={{ background: '#8b7355', borderColor: '#8b7355' }}
              >
                在画作欣赏中打开
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={knowledgeGraphVisible}
        onCancel={() => setKnowledgeGraphVisible(false)}
        footer={null}
        width={1200}
        destroyOnClose
        title={
          <span style={{ color: '#5c4a33' }}>
            <AppstoreOutlined /> 知识图谱
            {graphSource && (
              <Tag color="#8b7355" style={{ marginLeft: 12 }}>
                {graphSource.type === 'painter' ? '画家脉络' : graphSource.type === 'school' ? '画派脉络' : '画作关联'}
              </Tag>
            )}
          </span>
        }
      >
        {graphSource && (
          <KnowledgeGraph
            initialPainterId={graphSource.type === 'painter' ? graphSource.id : undefined}
            initialSchoolId={graphSource.type === 'school' ? graphSource.id : undefined}
            initialPaintingId={graphSource.type === 'painting' ? graphSource.id : undefined}
            height={560}
          />
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
                        onClick={() => {
                          setLiteraryWorkModalVisible(false);
                          selectNode('painting', painting.id);
                        }}
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

export default KnowledgeTree;
