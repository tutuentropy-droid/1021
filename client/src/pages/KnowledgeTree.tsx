import { useState, useEffect } from 'react';
import { Row, Col, Tree, Card, Typography, Spin, Empty, Tag, Modal, Descriptions, List, Divider, Tabs, Button, Space } from 'antd';
import { PictureOutlined, ReadOutlined } from '@ant-design/icons';
import {
  EyeOutlined,
  BulbOutlined,
  InfoCircleOutlined,
  HighlightOutlined
} from '@ant-design/icons';
import type { TreeNode, Dynasty, School, Painter, Painting } from '../types';
import { knowledgeApi } from '../api';

const { Title, Paragraph } = Typography;

interface KnowledgeTreeProps {
  onNavigate: (page: string, paintingId?: string) => void;
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

function KnowledgeTree({ onNavigate }: KnowledgeTreeProps) {
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [dynasties, setDynasties] = useState<Dynasty[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [painters, setPainters] = useState<Painter[]>([]);
  const [allPaintings, setAllPaintings] = useState<Painting[]>([]);
  const [selectedNode, setSelectedNode] = useState<{ id: string; type: string } | null>(null);
  const [selectedData, setSelectedData] = useState<any>(null);
  const [selectedPainting, setSelectedPainting] = useState<Painting | null>(null);
  const [paintingDetailVisible, setPaintingDetailVisible] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(true);

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
            <Title level={4} className="ink-title" style={{ marginTop: 16, color: '#5c4a33' }}>
              艺术风格
            </Title>
            <Paragraph style={{ color: '#6b5b45' }}>
              {selectedData.style}
            </Paragraph>
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
    </div>
  );
}

export default KnowledgeTree;
