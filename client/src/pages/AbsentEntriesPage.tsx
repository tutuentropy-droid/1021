import { useState, useEffect } from 'react';
import {
  Card, Typography, Tag, Empty, Spin, Row, Col, Select, Divider, List,
  Button, Space, Avatar, Collapse, Badge
} from 'antd';
import {
  ExclamationCircleOutlined,
  EyeInvisibleOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  BookOutlined,
  QuestionCircleOutlined,
  ArrowLeftOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import type { AbsentEntrySummary, AbsentEntryDetail, AbsentType, AbsentStatus, FragmentType } from '../types';
import { knowledgeApi } from '../api';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

const TYPE_LABELS: Record<AbsentType, string> = {
  painting: '失传画作',
  painter: '失传作品',
  mural: '毁佚壁画'
};

const TYPE_ICONS: Record<AbsentType, string> = {
  painting: '🖼️',
  painter: '👤',
  mural: '🏛️'
};

const STATUS_LABELS: Record<AbsentStatus, string> = {
  recorded_only: '只见著录',
  copy_only: '仅存摹本',
  lost: '完全失传',
  destroyed: '毁于兵燹'
};

const STATUS_COLORS: Record<AbsentStatus, string> = {
  recorded_only: '#8b7355',
  copy_only: '#6b8e23',
  lost: '#a0522d',
  destroyed: '#b22222'
};

const FRAGMENT_LABELS: Record<FragmentType, string> = {
  record: '历代著录',
  research: '考据论文',
  lament: '追忆感叹',
  colophon: '题跋题记'
};

const FRAGMENT_COLORS: Record<FragmentType, string> = {
  record: '#4a6b8a',
  research: '#6b8e23',
  lament: '#a0522d',
  colophon: '#8b7355'
};

interface AbsentEntriesPageProps {
  onNavigate?: (page: string, id?: string) => void;
  initialAbsentId?: string;
  onInitialAbsentIdConsumed?: () => void;
}

function AbsentEntriesPage({ onNavigate, initialAbsentId, onInitialAbsentIdConsumed }: AbsentEntriesPageProps) {
  const [entries, setEntries] = useState<AbsentEntrySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<AbsentType | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<AbsentStatus | undefined>(undefined);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<AbsentEntryDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    loadEntries();
  }, [filterType, filterStatus]);

  useEffect(() => {
    if (initialAbsentId) {
      loadDetail(initialAbsentId);
      onInitialAbsentIdConsumed?.();
    }
  }, [initialAbsentId]);

  const loadEntries = () => {
    setLoading(true);
    const params: any = {};
    if (filterType) params.type = filterType;
    if (filterStatus) params.status = filterStatus;
    knowledgeApi.getAbsentEntries(params)
      .then(data => setEntries(data))
      .finally(() => setLoading(false));
  };

  const loadDetail = (id: string) => {
    setSelectedId(id);
    setDetailLoading(true);
    knowledgeApi.getAbsentEntry(id)
      .then(data => setDetail(data))
      .finally(() => setDetailLoading(false));
  };

  const handleBack = () => {
    setSelectedId(null);
    setDetail(null);
  };

  if (detail) {
    return (
      <div>
        <Card
          className="card-shadow"
          style={{ borderRadius: 16, marginBottom: 16 }}
          bodyStyle={{ padding: 24 }}
        >
          <Space size="middle" style={{ marginBottom: 16 }}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={handleBack}
              type="text"
              style={{ color: '#8b7355' }}
            >
              返回阙如录
            </Button>
          </Space>

          <div style={{
            borderLeft: `4px solid ${STATUS_COLORS[detail.status]}`,
            paddingLeft: 20,
            marginBottom: 24
          }}>
            <Space size="small" style={{ marginBottom: 8 }} wrap>
              <Tag
                color={STATUS_COLORS[detail.status]}
                style={{ fontSize: 14, padding: '4px 12px' }}
              >
                <EyeInvisibleOutlined /> {STATUS_LABELS[detail.status]}
              </Tag>
              <Tag style={{ fontSize: 13, padding: '4px 12px' }}>
                {TYPE_ICONS[detail.type]} {TYPE_LABELS[detail.type]}
              </Tag>
              {detail.dynasty && (
                <Tag color="#4a6b8a" style={{ fontSize: 13 }}>
                  <ClockCircleOutlined /> {detail.dynasty.name}
                </Tag>
              )}
            </Space>
            <Title level={2} className="ink-title" style={{ margin: 0, color: '#5c4a33' }}>
              {detail.name}
            </Title>
            <Text type="secondary" style={{ fontSize: 14 }}>
              围绕此"缺席"所形成的认知场域
            </Text>
          </div>

          <Row gutter={[24, 24]}>
            <Col xs={24} lg={14}>
              <Card
                size="small"
                className="card-shadow"
                style={{ borderRadius: 12, marginBottom: 16 }}
                title={
                  <Space>
                    <BookOutlined style={{ color: '#8b7355' }} />
                    <span>历史背景与失传经过</span>
                  </Space>
                }
              >
                <Paragraph style={{ color: '#5c4a33', lineHeight: 1.9, fontSize: 15 }}>
                  {detail.description}
                </Paragraph>
              </Card>

              <Card
                size="small"
                className="card-shadow"
                style={{ borderRadius: 12, marginBottom: 16 }}
                title={
                  <Space>
                    <ExclamationCircleOutlined style={{ color: '#b22222' }} />
                    <span style={{ color: '#8b4513' }}>所失者何</span>
                  </Space>
                }
                bodyStyle={{ background: '#fdf5ef', borderRadius: '0 0 12px 12px' }}
              >
                <Paragraph style={{ color: '#8b4513', lineHeight: 1.9, fontSize: 15, fontStyle: 'italic', margin: 0 }}>
                  "{detail.whatWasLost}"
                </Paragraph>
              </Card>

              {detail.scholarlyDebate && (
                <Card
                  size="small"
                  className="card-shadow"
                  style={{ borderRadius: 12 }}
                  title={
                    <Space>
                      <QuestionCircleOutlined style={{ color: '#6b5b45' }} />
                      <span>学界争议</span>
                    </Space>
                  }
                >
                  <Paragraph style={{ color: '#6b5b45', lineHeight: 1.9 }}>
                    {detail.scholarlyDebate}
                  </Paragraph>
                </Card>
              )}
            </Col>

            <Col xs={24} lg={10}>
              <Card
                size="small"
                className="card-shadow"
                style={{ borderRadius: 12 }}
                title={
                  <Space>
                    <FileTextOutlined style={{ color: '#8b7355' }} />
                    <span>关联信息</span>
                  </Space>
                }
              >
                {detail.attributedPainter && (
                  <div style={{ marginBottom: 16 }}>
                    <Text strong style={{ color: '#6b5b45' }}>传为</Text>
                    <div style={{ marginTop: 8 }}>
                      <Card
                        size="small"
                        hoverable
                        style={{ borderRadius: 8, background: '#f8f5ee' }}
                        onClick={() => onNavigate?.('tree', detail.attributedPainter?.id)}
                      >
                        <Space>
                          <Avatar size={42} style={{ background: '#8b7355' }}>
                            👨‍🎨
                          </Avatar>
                          <div>
                            <div style={{ fontWeight: 600, color: '#5c4a33' }}>
                              {detail.attributedPainter.name}
                            </div>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              {detail.attributedPainter.years}
                            </Text>
                          </div>
                        </Space>
                      </Card>
                    </div>
                  </div>
                )}

                {detail.relatedPaintings && detail.relatedPaintings.length > 0 && (
                  <div>
                    <Text strong style={{ color: '#6b5b45' }}>传世参照</Text>
                    <Paragraph style={{ fontSize: 12, color: '#a89880', margin: '8px 0' }}>
                      虽非原作，然风格或可参照
                    </Paragraph>
                    {detail.relatedPaintings.map(p => (
                      <Card
                        key={p.id}
                        size="small"
                        hoverable
                        style={{ borderRadius: 8, marginBottom: 8, background: '#f8f5ee' }}
                        onClick={() => onNavigate?.('gallery', p.id)}
                      >
                        <Space>
                          <Avatar size={42} style={{ background: '#6b8e23' }}>
                            🖼️
                          </Avatar>
                          <div>
                            <div style={{ fontWeight: 600, color: '#5c4a33' }}>
                              {p.title}
                            </div>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              {p.collection}
                            </Text>
                          </div>
                        </Space>
                      </Card>
                    ))}
                  </div>
                )}
              </Card>
            </Col>
          </Row>
        </Card>

        <Card
          className="card-shadow"
          style={{ borderRadius: 16 }}
          title={
            <Space size="large">
              <Space>
                <FileTextOutlined style={{ color: '#8b7355', fontSize: 20 }} />
                <Title level={4} style={{ margin: 0, color: '#5c4a33' }} className="ink-title">
                  历代追忆、考据与感叹
                </Title>
              </Space>
              <Badge
                count={`${detail.sources.length} 则`}
                style={{ backgroundColor: '#8b7355' }}
              />
            </Space>
          }
          bodyStyle={{ padding: 0 }}
        >
          {detail.sources.map((fragment, idx) => (
            <div
              key={fragment.id}
              style={{
                padding: '24px 28px',
                borderBottom: idx < detail.sources.length - 1 ? '1px dashed #d4c4a8' : 'none',
                background: idx % 2 === 0 ? '#fdfbf7' : '#faf6ed'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                <Space size="small" wrap>
                  <Tag color={FRAGMENT_COLORS[fragment.type]} style={{ margin: 0 }}>
                    {FRAGMENT_LABELS[fragment.type]}
                  </Tag>
                  <Text strong style={{ color: '#5c4a33', fontSize: 15 }}>
                    {fragment.author}
                    {fragment.authorDynasty && (
                      <Text type="secondary" style={{ fontSize: 13, marginLeft: 6 }}>
                        〔{fragment.authorDynasty}〕
                      </Text>
                    )}
                  </Text>
                  {fragment.title && (
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      《{fragment.title}》
                    </Text>
                  )}
                </Space>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {fragment.source}
                </Text>
              </div>

              <div style={{
                padding: '16px 20px',
                background: '#fff9ef',
                borderRadius: 10,
                borderLeft: '3px solid #d4af37',
                marginBottom: 12
              }}>
                <Paragraph
                  style={{
                    margin: 0,
                    color: '#5c4a33',
                    fontSize: 15,
                    lineHeight: 2,
                    fontFamily: '"Songti SC", "SimSun", serif',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {fragment.content}
                </Paragraph>
              </div>

              {fragment.translation && (
                <div style={{ padding: '0 4px' }}>
                  <Text type="secondary" style={{ fontSize: 12, marginBottom: 4, display: 'block' }}>
                    〔今释〕
                  </Text>
                  <Paragraph style={{ margin: 0, color: '#8b7355', lineHeight: 1.8, fontSize: 14 }}>
                    {fragment.translation}
                  </Paragraph>
                </div>
              )}
            </div>
          ))}
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Card
        className="card-shadow"
        style={{ borderRadius: 16, marginBottom: 20 }}
        bodyStyle={{ padding: 28 }}
      >
        <div style={{
          background: 'linear-gradient(135deg, #fdf5ef 0%, #f8ede0 50%, #f0e0cc 100%)',
          borderRadius: 14,
          padding: '24px 28px',
          marginBottom: 20,
          border: '1px dashed #c4a87a'
        }}>
          <Row gutter={[16, 12]} align="middle">
            <Col>
              <Avatar
                size={56}
                style={{
                  background: 'linear-gradient(135deg, #8b7355 0%, #a0522d 100%)',
                  fontSize: 28
                }}
                icon={<EyeInvisibleOutlined />}
              />
            </Col>
            <Col flex="auto">
              <Title level={3} style={{ margin: 0, color: '#5c4a33' }} className="ink-title">
                阙如录 · 画史之缺席场域
              </Title>
              <Paragraph style={{ margin: '8px 0 0 0', color: '#8b7355', fontSize: 14 }}>
                本区域不虚构已失之作的面貌，而是整理历代追忆、考据与感叹的文献碎片，
                让"缺席"本身成为一种可感知的历史存在。
              </Paragraph>
            </Col>
          </Row>
        </div>

        <Row gutter={[12, 12]} align="middle">
          <Col>
            <Space size="middle" wrap>
              <Select
                placeholder="按类型筛选"
                style={{ width: 160 }}
                allowClear
                value={filterType}
                onChange={setFilterType}
              >
                <Option value="painting">失传画作</Option>
                <Option value="painter">失传作品</Option>
                <Option value="mural">毁佚壁画</Option>
              </Select>

              <Select
                placeholder="按失传状态筛选"
                style={{ width: 160 }}
                allowClear
                value={filterStatus}
                onChange={setFilterStatus}
              >
                <Option value="recorded_only">只见著录</Option>
                <Option value="copy_only">仅存摹本</Option>
                <Option value="lost">完全失传</Option>
                <Option value="destroyed">毁于兵燹</Option>
              </Select>

              {(filterType || filterStatus) && (
                <Button
                  size="small"
                  icon={<ReloadOutlined />}
                  onClick={() => { setFilterType(undefined); setFilterStatus(undefined); }}
                >
                  清除筛选
                </Button>
              )}
            </Space>
          </Col>
        </Row>

        <Divider style={{ margin: '20px 0 12px 0' }} />

        <Row gutter={[16, 16]}>
          {Object.entries(STATUS_LABELS).map(([status, label]) => (
            <Col xs={12} sm={6} key={status}>
              <div style={{
                padding: '12px 16px',
                borderRadius: 10,
                background: '#fdfbf7',
                border: `1px solid ${STATUS_COLORS[status as AbsentStatus]}33`,
                textAlign: 'center'
              }}>
                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                  {label}
                </Text>
                <Text strong style={{ color: STATUS_COLORS[status as AbsentStatus], fontSize: 18 }}>
                  {entries.filter(e => e.status === status).length}
                </Text>
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <Spin size="large" tip="整理历代文献中..." />
        </div>
      ) : entries.length === 0 ? (
        <Empty description="暂无符合条件的条目" />
      ) : (
        <Row gutter={[16, 16]}>
          {entries.map(entry => (
            <Col xs={24} lg={12} key={entry.id}>
              <Card
                className="card-shadow"
                hoverable
                style={{ borderRadius: 14 }}
                bodyStyle={{ padding: 22 }}
                onClick={() => loadDetail(entry.id)}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: 12,
                  gap: 12
                }}>
                  <Space size="small" wrap>
                    <Tag
                      color={STATUS_COLORS[entry.status]}
                      style={{ margin: 0 }}
                    >
                      {STATUS_LABELS[entry.status]}
                    </Tag>
                    <Tag>
                      {TYPE_ICONS[entry.type]} {TYPE_LABELS[entry.type]}
                    </Tag>
                  </Space>
                  <Badge
                    count={`${entry.sourceCount}则`}
                    style={{
                      backgroundColor: '#fdfbf7',
                      color: '#8b7355',
                      boxShadow: 'none',
                      border: '1px solid #d4c4a8'
                    }}
                  />
                </div>

                <Title level={4} style={{ margin: '0 0 10px 0', color: '#5c4a33' }} className="ink-title">
                  {entry.name}
                </Title>

                <Paragraph
                  ellipsis={{ rows: 3 }}
                  style={{ color: '#6b5b45', lineHeight: 1.8, margin: 0 }}
                >
                  {entry.description}
                </Paragraph>

                <Divider style={{ margin: '14px 0' }} dashed />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    点击展开，进入围绕"缺席"的认知场域 →
                  </Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    <FileTextOutlined /> {entry.sourceCount} 则文献
                  </Text>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default AbsentEntriesPage;
