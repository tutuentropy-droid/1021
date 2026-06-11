import { useState, useEffect } from 'react';
import {
  Row, Col, Card, Typography, Spin, Select, Tag, Modal,
  List, Divider, Button, Space, Breadcrumb, Input, Empty
} from 'antd';
import {
  EditOutlined,
  ReadOutlined,
  SearchOutlined,
  BookOutlined,
  PictureOutlined,
  FilterOutlined
} from '@ant-design/icons';
import type { LiteraryWork, Painting, Painter, Dynasty, LiteraryWorkType } from '../types';
import { knowledgeApi } from '../api';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

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

interface LiteraryWorksPageProps {
  onNavigate: (page: string, paintingId?: string) => void;
}

function LiteraryWorksPage({ onNavigate }: LiteraryWorksPageProps) {
  const [literaryWorks, setLiteraryWorks] = useState<LiteraryWork[]>([]);
  const [allWorks, setAllWorks] = useState<LiteraryWork[]>([]);
  const [dynasties, setDynasties] = useState<Dynasty[]>([]);
  const [painters, setPainters] = useState<Painter[]>([]);
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWork, setSelectedWork] = useState<(LiteraryWork & { relatedPaintings: Painting[]; relatedPainters: Painter[] }) | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filters, setFilters] = useState<{ dynastyId?: string; type?: LiteraryWorkType; keyword?: string }>({});

  useEffect(() => {
    Promise.all([
      knowledgeApi.getLiteraryWorks(),
      knowledgeApi.getDynasties(),
      knowledgeApi.getPainters(),
      knowledgeApi.getPaintings()
    ]).then(([worksData, dynastiesData, paintersData, paintingsData]) => {
      setAllWorks(worksData);
      setLiteraryWorks(worksData);
      setDynasties(dynastiesData);
      setPainters(paintersData);
      setPaintings(paintingsData);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let result = [...allWorks];

    if (filters.dynastyId) {
      result = result.filter(w => w.dynastyId === filters.dynastyId);
    }
    if (filters.type) {
      result = result.filter(w => w.type === filters.type);
    }
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      result = result.filter(w =>
        w.title.toLowerCase().includes(keyword) ||
        w.author.toLowerCase().includes(keyword) ||
        w.content.toLowerCase().includes(keyword) ||
        (w.background && w.background.toLowerCase().includes(keyword))
      );
    }

    setLiteraryWorks(result);
  }, [filters, allWorks]);

  const getPainterName = (painterId: string) => {
    return painters.find(p => p.id === painterId)?.name || '佚名';
  };

  const getDynastyName = (dynastyId: string) => {
    return dynasties.find(d => d.id === dynastyId)?.name || '';
  };

  const openWorkDetail = (workId: string) => {
    knowledgeApi.getLiteraryWork(workId)
      .then(data => {
        setSelectedWork(data);
        setModalVisible(true);
      })
      .catch(() => {});
  };

  const navigateToPainting = (paintingId: string) => {
    setModalVisible(false);
    onNavigate('gallery', paintingId);
  };

  const literaryTypes = Array.from(new Set(allWorks.map(w => w.type)));

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 100 }}>
        <Spin size="large" tip="加载诗文中..." />
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>🏠 首页</Breadcrumb.Item>
        <Breadcrumb.Item>📜 诗文雅集</Breadcrumb.Item>
      </Breadcrumb>

      <Title level={2} className="ink-title" style={{ color: '#5c4a33', marginBottom: 8 }}>
        📜 诗文雅集 · 画与文的对话
      </Title>
      <Paragraph style={{ color: '#8b7355', marginBottom: 24 }}>
        从题画诗、画跋、笔记、书信到画论节选，品读历代文人与画作的精神交流，以文观画，以画悟文
      </Paragraph>

      <Card className="card-shadow" style={{ borderRadius: 16, marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <Text strong style={{ color: '#5c4a33', marginRight: 8 }}>朝代：</Text>
            <Select
              placeholder="全部朝代"
              style={{ width: 140 }}
              allowClear
              onChange={(value) => setFilters(f => ({ ...f, dynastyId: value || undefined }))}
            >
              {dynasties.map(d => (
                <Option key={d.id} value={d.id}>{d.name}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Text strong style={{ color: '#5c4a33', marginRight: 8 }}>类型：</Text>
            <Select
              placeholder="全部类型"
              style={{ width: 140 }}
              allowClear
              onChange={(value) => setFilters(f => ({ ...f, type: value || undefined }))}
            >
              {literaryTypes.map(t => (
                <Option key={t} value={t}>
                  <Tag color={LITERARY_TYPE_COLORS[t]} style={{ margin: 0 }}>
                    {LITERARY_TYPE_LABELS[t]}
                  </Tag>
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={12} style={{ textAlign: 'right' }}>
            <Search
              placeholder="搜索诗文标题、作者、内容..."
              allowClear
              enterButton={<SearchOutlined />}
              size="middle"
              onSearch={(value) => setFilters(f => ({ ...f, keyword: value || undefined }))}
              style={{ maxWidth: 350 }}
            />
          </Col>
        </Row>
      </Card>

      <Space style={{ marginBottom: 16 }}>
        <FilterOutlined style={{ color: '#8b7355' }} />
        <Text type="secondary" style={{ color: '#8b7355' }}>
          共找到 {literaryWorks.length} 篇相关诗文
        </Text>
      </Space>

      {literaryWorks.length === 0 ? (
        <Empty description="暂无匹配的诗文" />
      ) : (
        <Row gutter={[16, 16]}>
          {literaryWorks.map(work => (
            <Col xs={24} sm={12} lg={8} xl={6} key={work.id}>
              <Card
                className="card-shadow"
                hoverable
                style={{ borderRadius: 16, height: '100%' }}
                onClick={() => openWorkDetail(work.id)}
                bodyStyle={{ padding: '16px 18px' }}
              >
                <div style={{ marginBottom: 10 }}>
                  <Tag
                    style={{
                      background: LITERARY_TYPE_COLORS[work.type],
                      color: '#fff',
                      border: 'none',
                      fontSize: 11
                    }}
                  >
                    {LITERARY_TYPE_LABELS[work.type]}
                  </Tag>
                </div>
                <Title
                  level={4}
                  className="ink-title"
                  style={{
                    color: '#5c4a33',
                    fontSize: 16,
                    marginTop: 0,
                    marginBottom: 8,
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {work.title}
                </Title>
                <div style={{ marginBottom: 10 }}>
                  <Text style={{ color: '#8b7355', fontSize: 13 }}>
                    {work.author} · {getDynastyName(work.dynastyId)}
                  </Text>
                </div>
                <Paragraph
                  ellipsis={{ rows: 4 }}
                  style={{
                    color: '#6b5b45',
                    fontSize: 13,
                    marginBottom: 12,
                    fontStyle: 'italic',
                    lineHeight: 1.8,
                    minHeight: 90
                  }}
                >
                  {work.content}
                </Paragraph>
                <Divider style={{ margin: '12px 0' }} />
                <Space wrap>
                  {work.relatedPaintingIds.slice(0, 3).map(pid => {
                    const painting = paintings.find(p => p.id === pid);
                    return painting ? (
                      <Tag
                        key={pid}
                        color="geekblue"
                        style={{ margin: 2, cursor: 'pointer', fontSize: 11 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateToPainting(pid);
                        }}
                      >
                        <PictureOutlined /> {painting.title}
                      </Tag>
                    ) : null;
                  })}
                  {work.relatedPaintingIds.length > 3 && (
                    <Tag style={{ fontSize: 11 }}>
                      +{work.relatedPaintingIds.length - 3} 幅
                    </Tag>
                  )}
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={850}
        destroyOnClose
      >
        {selectedWork && (
          <div>
            <Space style={{ marginBottom: 16 }}>
              <Tag
                style={{
                  background: LITERARY_TYPE_COLORS[selectedWork.type],
                  color: '#fff',
                  border: 'none',
                  fontSize: 12
                }}
              >
                {LITERARY_TYPE_LABELS[selectedWork.type]}
              </Tag>
            </Space>
            <Title level={2} className="ink-title" style={{ color: '#5c4a33', marginTop: 0 }}>
              {selectedWork.title}
            </Title>
            <Text style={{ color: '#8b7355' }}>
              {selectedWork.author} · {getDynastyName(selectedWork.dynastyId)}
              {selectedWork.year && ` · ${selectedWork.year}`}
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
                {selectedWork.content}
              </Paragraph>
            </div>

            {selectedWork.translation && (
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
                  {selectedWork.translation}
                </Paragraph>
              </div>
            )}

            {selectedWork.background && (
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
                  {selectedWork.background}
                </Paragraph>
              </div>
            )}

            {selectedWork.appreciation && (
              <div style={{ marginBottom: 20 }}>
                <Title level={4} style={{ color: '#5c4a33' }}>
                  <ReadOutlined /> 赏析
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
                  {selectedWork.appreciation}
                </Paragraph>
              </div>
            )}

            {selectedWork.relatedPaintings && selectedWork.relatedPaintings.length > 0 && (
              <>
                <Divider />
                <Title level={4} style={{ color: '#5c4a33' }}>
                  <PictureOutlined /> 关联画作
                  <Tag color="#c0392b" style={{ marginLeft: 12, fontSize: 12 }}>
                    {selectedWork.relatedPaintings.length} 幅
                  </Tag>
                  <Text type="secondary" style={{ marginLeft: 8, fontSize: 12, fontWeight: 'normal' }}>
                    点击画作卡片可直接跳转欣赏
                  </Text>
                </Title>
                <List
                  grid={{ gutter: 12, xs: 1, sm: 2, md: 3, lg: 3, xl: 4 }}
                  dataSource={selectedWork.relatedPaintings}
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
                        onClick={() => navigateToPainting(painting.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <Card.Meta
                          title={<span style={{ fontSize: 13, color: '#5c4a33' }}>{painting.title}</span>}
                          description={
                            <span style={{ fontSize: 12, color: '#8b7355' }}>
                              {getPainterName(painting.painterId)}
                            </span>
                          }
                        />
                      </Card>
                    </List.Item>
                  )}
                />
              </>
            )}

            {selectedWork.relatedPainters && selectedWork.relatedPainters.length > 0 && (
              <>
                <Divider />
                <Title level={4} style={{ color: '#5c4a33' }}>
                  <BookOutlined /> 关联画家
                </Title>
                <Space wrap size={[8, 8]}>
                  {selectedWork.relatedPainters.map(painter => (
                    <Tag
                      key={painter.id}
                      color="#8b7355"
                      style={{ padding: '4px 10px', fontSize: 13 }}
                    >
                      {painter.name} · {getDynastyName(painter.dynastyId)}
                    </Tag>
                  ))}
                </Space>
              </>
            )}

            {selectedWork.source && (
              <div style={{ marginTop: 20, textAlign: 'right' }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  出处：{selectedWork.source}
                </Text>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default LiteraryWorksPage;
