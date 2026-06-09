import { useState, useEffect } from 'react';
import { Row, Col, Tree, Card, Typography, Spin, Empty, Tag } from 'antd';
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
  const [selectedNode, setSelectedNode] = useState<{ id: string; type: string } | null>(null);
  const [selectedData, setSelectedData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      knowledgeApi.getKnowledgeTree(),
      knowledgeApi.getDynasties(),
      knowledgeApi.getSchools(),
      knowledgeApi.getPainters()
    ]).then(([treeData, dynastiesData, schoolsData, paintersData]) => {
      setTree(treeData);
      setDynasties(dynastiesData);
      setSchools(schoolsData);
      setPainters(paintersData);
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
    }
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
      painter: '画家'
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
    </div>
  );
}

export default KnowledgeTree;
