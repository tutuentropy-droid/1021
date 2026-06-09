import { useState, useEffect } from 'react';
import { Row, Col, Tree, Card, Typography, Spin, Empty, Tag, Modal, Descriptions, List, Divider, Tabs } from 'antd';
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
  onNavigate: (page: string) => void;
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
    });
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

  const handleSelect = (selectedKeys: React.Key[]) => {
    if (selectedKeys.length === 0) {
      setSelectedNode(null);
      setSelectedData(null);
      return;
    }

    const key = selectedKeys[0] as string;
    const [type, id] = key.split('-');
    setSelectedNode({ id, type });

    switch (type) {
      case 'dynasty':
        setSelectedData(dynasties.find(d => d.id === id));
        break;
      case 'school':
        setSelectedData(schools.find(s => s.id === id));
        break;
      case 'painter':
        setSelectedData(painters.find(p => p.id === id));
        break;
      case 'painting':
        const painting = allPaintings.find(p => p.id === id);
        setSelectedPainting(painting || null);
        setPaintingDetailVisible(true);
        setSelectedData(painting);
        break;
    }
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

    const THEME_ICONS: Record<string, string> = {
      '山水': '🏔️',
      '花鸟': '🌿',
      '人物': '👥',
      '风俗人物': '🎭',
      '畜兽': '🐂',
      '人物故事': '📖'
    };

    const getPainterName = (painterId: string) => {
      return painters.find(p => p.id === painterId)?.name || '佚名';
    };

    const getDynastyName = (dynastyId: string) => {
      return dynasties.find(d => d.id === dynastyId)?.name || '';
    };

    return (
      <Card className="card-shadow" style={{ borderRadius: 16 }}>
        <Tag color="#8b7355" style={{ marginBottom: 12 }}>{typeLabels[selectedNode.type]}</Tag>
        <Title level={2} className="ink-title" style={{ color: '#5c4a33' }}>
          {selectedData.name}
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
            <Paragraph style={{ color: '#6b5b45' }}>
              {selectedData.famousWorks?.join('、')}
            </Paragraph>
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
              style={{
                width: '100%',
                maxHeight: 300,
                objectFit: 'contain',
                borderRadius: 12,
                marginBottom: 20,
                backgroundColor: '#f8f5ee'
              }}
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
            <Descriptions column={2} size="small" style={{ marginBottom: 16 }}>
              <Descriptions.Item label="朝代">{getDynastyName(selectedData.dynastyId)}</Descriptions.Item>
              <Descriptions.Item label="作者">{getPainterName(selectedData.painterId)}</Descriptions.Item>
              <Descriptions.Item label="创作年代">{selectedData.year || '不详'}</Descriptions.Item>
              <Descriptions.Item label="题材">{THEME_ICONS[selectedData.theme]} {selectedData.theme}</Descriptions.Item>
              <Descriptions.Item label="形制">{selectedData.format}</Descriptions.Item>
              <Descriptions.Item label="尺寸">{selectedData.dimensions || '不详'}</Descriptions.Item>
              <Descriptions.Item label="收藏地" span={2}>{selectedData.collection}</Descriptions.Item>
            </Descriptions>
          </>
        )}

        <Paragraph style={{ color: '#6b5b45' }}>
          {selectedData.description}
        </Paragraph>
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

  const THEME_ICONS_MODAL: Record<string, string> = {
    '山水': '🏔️',
    '花鸟': '🌿',
    '人物': '👥',
    '风俗人物': '🎭',
    '畜兽': '🐂',
    '人物故事': '📖'
  };

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
              style={{
                width: '100%',
                maxHeight: 350,
                objectFit: 'contain',
                borderRadius: 12,
                marginBottom: 20,
                backgroundColor: '#f8f5ee'
              }}
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />

            <Title level={2} className="ink-title" style={{ color: '#5c4a33', marginTop: 0 }}>
              {selectedPainting.title}
            </Title>

            <Descriptions column={2} size="small" style={{ marginBottom: 24 }}>
              <Descriptions.Item label="朝代">{getDynastyNameModal(selectedPainting.dynastyId)}</Descriptions.Item>
              <Descriptions.Item label="作者">{getPainterNameModal(selectedPainting.painterId)}</Descriptions.Item>
              <Descriptions.Item label="创作年代">{selectedPainting.year || '不详'}</Descriptions.Item>
              <Descriptions.Item label="题材">{THEME_ICONS_MODAL[selectedPainting.theme]} {selectedPainting.theme}</Descriptions.Item>
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
          </div>
        )}
      </Modal>
    </div>
  );
}

export default KnowledgeTree;
