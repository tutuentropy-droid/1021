import { useState, useEffect } from 'react';
import {
  Row, Col, Card, Typography, Spin, Select, Tag, Modal,
  Descriptions, List, Divider, Avatar, Empty, Tabs, Button
} from 'antd';
import {
  EyeOutlined,
  BulbOutlined,
  MessageOutlined,
  InfoCircleOutlined,
  HighlightOutlined
} from '@ant-design/icons';
import type { Painting, Dynasty, Painter } from '../types';
import { knowledgeApi } from '../api';

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

function GalleryPage() {
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [dynasties, setDynasties] = useState<Dynasty[]>([]);
  const [painters, setPainters] = useState<Painter[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPainting, setSelectedPainting] = useState<Painting | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filters, setFilters] = useState<{ dynastyId?: string; theme?: string }>({});

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

  const themes = Array.from(new Set(paintings.map(p => p.theme)));

  const getPainterName = (painterId: string) => {
    return painters.find(p => p.id === painterId)?.name || '佚名';
  };

  const getDynastyName = (dynastyId: string) => {
    return dynasties.find(d => d.id === dynastyId)?.name || '';
  };

  const filteredPaintings = paintings.filter(p => {
    if (filters.dynastyId && p.dynastyId !== filters.dynastyId) return false;
    if (filters.theme && p.theme !== filters.theme) return false;
    return true;
  });

  const openPaintingDetail = (painting: Painting) => {
    setSelectedPainting(painting);
    setModalVisible(true);
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
        🖼️ 传世名画深度赏析
      </Title>
      <Paragraph style={{ color: '#8b7355', marginBottom: 24 }}>
        从构图、笔墨、设色、文化背景等多个维度，深入理解每一幅经典之作
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
                  <img src={painting.imageUrl} alt={painting.title} style={{ width: '100%', height: 220, objectFit: 'cover', borderTopLeftRadius: 16, borderTopRightRadius: 16 }} onError={(e) => { e.currentTarget.style.display = 'none' }} />
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
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={900}
        destroyOnClose
      >
        {selectedPainting && (
          <div>
            <img src={selectedPainting.imageUrl} alt={selectedPainting.title} style={{ width: '100%', maxHeight: 350, objectFit: 'contain', borderRadius: 12, marginBottom: 20, backgroundColor: '#f8f5ee' }} onError={(e) => { e.currentTarget.style.display = 'none' }} />

            <Title level={2} className="ink-title" style={{ color: '#5c4a33', marginTop: 0 }}>
              {selectedPainting.title}
            </Title>

            <Descriptions column={2} size="small" style={{ marginBottom: 24 }}>
              <Descriptions.Item label="朝代">{getDynastyName(selectedPainting.dynastyId)}</Descriptions.Item>
              <Descriptions.Item label="作者">{getPainterName(selectedPainting.painterId)}</Descriptions.Item>
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
                      <Text style={{ color: '#6b5b45' }}>• {item}</Text>
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
                        <Text strong style={{ color: '#5c4a33' }}>{item}</Text>
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

export default GalleryPage;
