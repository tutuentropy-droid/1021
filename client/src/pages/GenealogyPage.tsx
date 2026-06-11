import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Card, Typography, Tag, Spin, Button, Space, Row, Col, Select, Tooltip,
  Drawer, Divider, Avatar, Badge, Progress, Empty
} from 'antd';
import {
  PlayCircleOutlined,
  LeftOutlined,
  RightOutlined,
  BulbOutlined,
  QuestionCircleOutlined,
  HeartOutlined,
  ExperimentOutlined,
  BookOutlined,
  UserOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import type { FormulaElement, FormulaVariant, FormulaCategory } from '../types';
import { knowledgeApi } from '../api';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const CATEGORY_CONFIG: Record<FormulaCategory, { label: string; icon: string; color: string }> = {
  cun: { label: '皴法', icon: '⛰️', color: '#8b7355' },
  dianye: { label: '点叶法', icon: '🌿', color: '#6b8e23' },
  miao: { label: '衣纹描法', icon: '👘', color: '#a0522d' },
  dianshui: { label: '点水法', icon: '💧', color: '#4a6b8a' },
  ran: { label: '染法', icon: '🎨', color: '#8e44ad' }
};

const DYNASTY_COLORS: Record<string, string> = {
  'wei-jin': '#7f8c8d',
  'five-dynasties': '#d35400',
  'tang': '#e67e22',
  'song': '#2980b9',
  'yuan': '#27ae60',
  'ming': '#c0392b',
  'qing': '#8e44ad',
  'modern': '#2c3e50'
};

const DYNASTY_NAMES: Record<string, string> = {
  'wei-jin': '魏晋',
  'five-dynasties': '五代',
  'tang': '唐',
  'song': '宋',
  'yuan': '元',
  'ming': '明',
  'qing': '清',
  'modern': '近现代'
};

function formatYearDisplay(year: number): string {
  if (year < 0) return `公元前${Math.abs(year)}年`;
  return `公元${year}年`;
}

interface GenealogyPageProps {
  onNavigate?: (page: string, id?: string) => void;
}

function FormulaGenealogyPage({ onNavigate }: GenealogyPageProps) {
  const [elements, setElements] = useState<FormulaElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<FormulaElement | null>(null);
  const [currentVariantIndex, setCurrentVariantIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sliderValue, setSliderValue] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [aiMessages, setAiMessages] = useState<{ id: string; type: 'mentor' | 'user'; content: string }[]>([]);
  const [showAIGuide, setShowAIGuide] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showVariantDetail, setShowVariantDetail] = useState(false);
  const [visitedVariants, setVisitedVariants] = useState<Set<string>>(new Set());
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    knowledgeApi.getFormulaGenealogy()
      .then(data => {
        setElements(data.elements);
        if (data.elements.length > 0) {
          setSelectedElement(data.elements[0]);
          setAiMessages([{
            id: 'intro',
            type: 'mentor',
            content: data.elements[0].aiGuide.opening
          }]);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const currentVariant: FormulaVariant | null = useMemo(() => {
    if (!selectedElement || selectedElement.variants.length === 0) return null;
    return selectedElement.variants[currentVariantIndex] || null;
  }, [selectedElement, currentVariantIndex]);

  const minYear = useMemo(() => {
    if (!selectedElement) return 300;
    return Math.min(...selectedElement.variants.map(v => v.year)) - 50;
  }, [selectedElement]);

  const maxYear = useMemo(() => {
    if (!selectedElement) return 2000;
    return Math.max(...selectedElement.variants.map(v => v.year)) + 50;
  }, [selectedElement]);

  const yearFromSlider = useMemo(() => {
    return minYear + (sliderValue / 100) * (maxYear - minYear);
  }, [sliderValue, minYear, maxYear]);

  useEffect(() => {
    if (!selectedElement || selectedElement.variants.length === 0) return;
    const nearestIndex = selectedElement.variants
      .map((v, i) => ({ i, diff: Math.abs(v.year - yearFromSlider) }))
      .sort((a, b) => a.diff - b.diff)[0]?.i;
    if (nearestIndex !== undefined && nearestIndex !== currentVariantIndex) {
      setCurrentVariantIndex(nearestIndex);
    }
  }, [yearFromSlider, selectedElement]);

  useEffect(() => {
    if (currentVariant && !visitedVariants.has(currentVariant.id)) {
      setVisitedVariants(prev => new Set([...prev, currentVariant.id]));
    }
  }, [currentVariant, visitedVariants]);

  const handleSliderMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateSliderFromEvent(e);
  };

  const handleSliderMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      updateSliderFromEvent(e);
    }
  };

  const handleSliderMouseUp = () => {
    setIsDragging(false);
  };

  const updateSliderFromEvent = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderValue(percent);
  };

  const handleElementChange = (elementId: string) => {
    const element = elements.find(e => e.id === elementId);
    if (element) {
      setSelectedElement(element);
      setCurrentVariantIndex(0);
      setSliderValue(0);
      setAiMessages([{
        id: `intro-${element.id}`,
        type: 'mentor',
        content: element.aiGuide.opening
      }]);
      setCurrentQuestionIndex(0);
      setVisitedVariants(new Set());
    }
  };

  const handlePrevVariant = () => {
    if (currentVariantIndex > 0) {
      const newIndex = currentVariantIndex - 1;
      setCurrentVariantIndex(newIndex);
      if (selectedElement) {
        const variant = selectedElement.variants[newIndex];
        const percent = ((variant.year - minYear) / (maxYear - minYear)) * 100;
        setSliderValue(percent);
      }
    }
  };

  const handleNextVariant = () => {
    if (selectedElement && currentVariantIndex < selectedElement.variants.length - 1) {
      const newIndex = currentVariantIndex + 1;
      setCurrentVariantIndex(newIndex);
      const variant = selectedElement.variants[newIndex];
      const percent = ((variant.year - minYear) / (maxYear - minYear)) * 100;
      setSliderValue(percent);
    }
  };

  const handleAskQuestion = () => {
    if (!selectedElement) return;
    const question = selectedElement.aiGuide.questions[currentQuestionIndex];
    if (question) {
      setAiMessages(prev => [
        ...prev,
        {
          id: `q-${currentQuestionIndex}`,
          type: 'mentor',
          content: `💡 思考题 ${currentQuestionIndex + 1}：${question.question}\n\n🔍 小提示：${question.hint}`
        }
      ]);
      setCurrentQuestionIndex(prev => Math.min(prev + 1, selectedElement.aiGuide.questions.length));
    } else {
      const hasConclusion = aiMessages.some(m => m.id === 'conclusion');
      if (!hasConclusion) {
        setAiMessages(prev => [
          ...prev,
          {
            id: 'conclusion',
            type: 'mentor',
            content: selectedElement.aiGuide.conclusion
          }
        ]);
      }
    }
  };

  const progress = selectedElement
    ? (visitedVariants.size / selectedElement.variants.length) * 100
    : 0;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 100 }}>
        <Spin size="large" tip="正在构建程式基因图谱..." />
      </div>
    );
  }

  if (!selectedElement) {
    return <Empty description="暂无程式元素数据" />;
  }

  const categoryConfig = CATEGORY_CONFIG[selectedElement.category];

  return (
    <div>
      <Card
        className="card-shadow"
        style={{ borderRadius: 16, marginBottom: 16 }}
        bodyStyle={{ padding: 24 }}
      >
        <Row gutter={[24, 16]} align="middle">
          <Col xs={24} md={10}>
            <Title level={2} className="ink-title" style={{ color: '#5c4a33', margin: 0 }}>
              <ExperimentOutlined style={{ marginRight: 12 }} />
              程式基因图谱
            </Title>
            <Paragraph style={{ color: '#8b7355', margin: '8px 0 0 0' }}>
              追踪中国画程式语言的千年流变，发现每一次笔触变化背后的画家心灵与时代风潮
            </Paragraph>
          </Col>
          <Col xs={24} md={14} style={{ textAlign: 'right' }}>
            <Space wrap size={[8, 8]}>
              <Select
                size="small"
                style={{ width: 140 }}
                placeholder="选择类别"
                value={selectedElement.category}
                onChange={(cat) => {
                  const firstOfCat = elements.find(e => e.category === cat);
                  if (firstOfCat) handleElementChange(firstOfCat.id);
                }}
              >
                {(Object.keys(CATEGORY_CONFIG) as FormulaCategory[]).map(cat => (
                  <Option key={cat} value={cat}>
                    {CATEGORY_CONFIG[cat].icon} {CATEGORY_CONFIG[cat].label}
                  </Option>
                ))}
              </Select>
              <Select
                size="small"
                style={{ width: 200 }}
                placeholder="选择程式元素"
                value={selectedElement.id}
                onChange={handleElementChange}
              >
                {elements
                  .filter(e => e.category === selectedElement.category)
                  .map(el => (
                    <Option key={el.id} value={el.id}>
                      {el.name}
                    </Option>
                  ))}
              </Select>
              <Badge
                count={`${visitedVariants.size}/${selectedElement.variants.length}`}
                style={{ backgroundColor: categoryConfig.color }}
              >
                <Tag color={categoryConfig.color} style={{ margin: 0 }}>
                  {categoryConfig.icon} {categoryConfig.label}
                </Tag>
              </Badge>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card
        className="card-shadow"
        style={{ borderRadius: 16, marginBottom: 16 }}
        bodyStyle={{ padding: 24 }}
      >
        <Row gutter={[16, 12]} align="middle" style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12}>
            <Space>
              <Tag color={categoryConfig.color} style={{ fontSize: 14, padding: '4px 12px' }}>
                {categoryConfig.icon} {categoryConfig.label}
              </Tag>
              <Title level={3} className="ink-title" style={{ color: '#5c4a33', margin: 0 }}>
                {selectedElement.name}
              </Title>
              {selectedElement.alias.length > 0 && (
                <Text type="secondary" style={{ fontSize: 12 }}>
                  又名：{selectedElement.alias.join('、')}
                </Text>
              )}
            </Space>
          </Col>
          <Col xs={24} sm={12} style={{ textAlign: 'right' }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              溯源进度
            </Text>
            <Progress
              percent={Math.round(progress)}
              size="small"
              style={{ width: 180, marginLeft: 12, display: 'inline-block' }}
              strokeColor={categoryConfig.color}
            />
          </Col>
        </Row>

        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <div style={{ padding: 16, background: '#fdf8f0', borderRadius: 12, height: '100%' }}>
              <Title level={5} className="ink-title" style={{ color: '#5c4a33', marginTop: 0, marginBottom: 12 }}>
                <BookOutlined style={{ marginRight: 8 }} />
                程式定义
              </Title>
              <Paragraph style={{ color: '#6b5b45', lineHeight: 1.9, marginBottom: 16 }}>
                {selectedElement.definition}
              </Paragraph>
              <Title level={5} className="ink-title" style={{ color: '#5c4a33', marginTop: 16, marginBottom: 12 }}>
                <HeartOutlined style={{ marginRight: 8 }} />
                文化语境
              </Title>
              <Paragraph style={{ color: '#6b5b45', lineHeight: 1.9, margin: 0 }}>
                {selectedElement.culturalContext}
              </Paragraph>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div
              style={{
                padding: 16,
                background: `linear-gradient(135deg, ${categoryConfig.color}11 0%, ${categoryConfig.color}22 100%)`,
                borderRadius: 12,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <div
                style={{
                  aspectRatio: '16 / 9',
                  width: '100%',
                  background: `linear-gradient(135deg, ${categoryConfig.color}22 0%, ${categoryConfig.color}44 100%)`,
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ fontSize: 80, opacity: 0.3, position: 'absolute' }}>
                  {categoryConfig.icon}
                </div>
                <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: 48, marginBottom: 8 }}>{categoryConfig.icon}</div>
                  <Text style={{ fontSize: 16, color: categoryConfig.color, fontWeight: 600 }}>
                    {selectedElement.name}
                  </Text>
                </div>
                <svg
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.15 }}
                  viewBox="0 0 100 60"
                  preserveAspectRatio="none"
                >
                  {selectedElement.category === 'cun' && (
                    <>
                      {Array.from({ length: 15 }).map((_, i) => (
                        <path
                          key={i}
                          d={`M ${i * 7 + 5} 10 Q ${i * 7 + 10} 30 ${i * 7 + 5} 50`}
                          stroke={categoryConfig.color}
                          strokeWidth="0.8"
                          fill="none"
                        />
                      ))}
                    </>
                  )}
                  {selectedElement.category === 'dianye' && (
                    <>
                      {Array.from({ length: 30 }).map((_, i) => (
                        <circle
                          key={i}
                          cx={10 + (i % 6) * 15}
                          cy={10 + Math.floor(i / 6) * 12}
                          r={1.5}
                          fill={categoryConfig.color}
                        />
                      ))}
                    </>
                  )}
                  {selectedElement.category === 'miao' && (
                    <>
                      {Array.from({ length: 8 }).map((_, i) => (
                        <path
                          key={i}
                          d={`M 10 ${10 + i * 6} Q 50 ${5 + i * 6} 90 ${10 + i * 6}`}
                          stroke={categoryConfig.color}
                          strokeWidth="0.6"
                          fill="none"
                        />
                      ))}
                    </>
                  )}
                </svg>
              </div>
              <Text type="secondary" style={{ textAlign: 'center', fontSize: 12 }}>
                「{selectedElement.origin}」
              </Text>
            </div>
          </Col>
        </Row>
      </Card>

      <Card
        className="card-shadow"
        style={{ borderRadius: 16, marginBottom: 16, overflow: 'hidden' }}
        bodyStyle={{ padding: 0 }}
      >
        <div
          style={{
            padding: '24px 24px 16px 24px',
            background: `linear-gradient(180deg, ${categoryConfig.color}08 0%, transparent 100%)`
          }}
        >
          <Row align="middle" style={{ marginBottom: 16 }}>
            <Col flex="auto">
              <Space>
                <ClockCircleOutlined style={{ color: categoryConfig.color, fontSize: 18 }} />
                <Title level={4} className="ink-title" style={{ color: '#5c4a33', margin: 0 }}>
                  溯源时间线
                </Title>
              </Space>
            </Col>
            <Col>
              <Space>
                <Button
                  size="small"
                  icon={<LeftOutlined />}
                  onClick={handlePrevVariant}
                  disabled={currentVariantIndex === 0}
                >
                  上一站
                </Button>
                <Tag color={categoryConfig.color} style={{ fontSize: 14, padding: '4px 16px', margin: 0 }}>
                  第 {currentVariantIndex + 1} / {selectedElement.variants.length} 站
                </Tag>
                <Button
                  size="small"
                  type="primary"
                  icon={<RightOutlined />}
                  onClick={handleNextVariant}
                  disabled={currentVariantIndex === selectedElement.variants.length - 1}
                  style={{ background: categoryConfig.color, borderColor: categoryConfig.color }}
                >
                  下一站
                </Button>
              </Space>
            </Col>
          </Row>

          <div
            ref={sliderRef}
            style={{
              position: 'relative',
              height: 80,
              padding: '0 20px',
              cursor: isDragging ? 'grabbing' : 'grab',
              userSelect: 'none'
            }}
            onMouseDown={handleSliderMouseDown}
            onMouseMove={handleSliderMouseMove}
            onMouseUp={handleSliderMouseUp}
            onMouseLeave={handleSliderMouseUp}
          >
            <svg width="100%" height="100%" viewBox="0 0 1000 80" preserveAspectRatio="none">
              <line
                x1="40"
                y1="40"
                x2="960"
                y2="40"
                stroke={categoryConfig.color}
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.3"
              />

              {selectedElement.variants.map((variant, idx) => {
                const x = 40 + ((variant.year - minYear) / (maxYear - minYear)) * 920;
                const isActive = idx === currentVariantIndex;
                const isVisited = visitedVariants.has(variant.id);
                return (
                  <g key={variant.id}>
                    <line
                      x1={x}
                      y1="20"
                      x2={x}
                      y2="60"
                      stroke={DYNASTY_COLORS[variant.dynastyId] || categoryConfig.color}
                      strokeWidth="1"
                      strokeDasharray={isActive ? undefined : '3,3'}
                      opacity={isActive ? 1 : 0.4}
                    />
                    <circle
                      cx={x}
                      cy="40"
                      r={isActive ? 12 : isVisited ? 8 : 6}
                      fill={isActive ? categoryConfig.color : isVisited ? DYNASTY_COLORS[variant.dynastyId] : '#fff'}
                      stroke={DYNASTY_COLORS[variant.dynastyId] || categoryConfig.color}
                      strokeWidth={isActive ? 3 : 2}
                      style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentVariantIndex(idx);
                        const percent = ((variant.year - minYear) / (maxYear - minYear)) * 100;
                        setSliderValue(percent);
                      }}
                    />
                    {isActive && (
                      <circle
                        cx={x}
                        cy="40"
                        r="18"
                        fill="none"
                        stroke={categoryConfig.color}
                        strokeWidth="1.5"
                        opacity="0.4"
                      >
                        <animate attributeName="r" values="14;22;14" dur="1.5s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.6;0.1;0.6" dur="1.5s" repeatCount="indefinite" />
                      </circle>
                    )}
                    <text
                      x={x}
                      y="12"
                      textAnchor="middle"
                      fontSize="10"
                      fill={isActive ? categoryConfig.color : '#8b7355'}
                      fontWeight={isActive ? 'bold' : 'normal'}
                      style={{ pointerEvents: 'none' }}
                    >
                      {DYNASTY_NAMES[variant.dynastyId] || variant.dynastyId}
                    </text>
                    <text
                      x={x}
                      y="75"
                      textAnchor="middle"
                      fontSize="9"
                      fill={isActive ? '#5c4a33' : '#a89880'}
                      style={{ pointerEvents: 'none' }}
                    >
                      {variant.painterName}
                    </text>
                  </g>
                );
              })}

              <line
                x1={40 + (sliderValue / 100) * 920}
                y1="10"
                x2={40 + (sliderValue / 100) * 920}
                y2="70"
                stroke={categoryConfig.color}
                strokeWidth="2"
                opacity="0.6"
                strokeDasharray="4,2"
              />
            </svg>

            <div
              style={{
                position: 'absolute',
                bottom: -4,
                left: 20,
                right: 20,
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 11,
                color: '#a89880'
              }}
            >
              <span>{formatYearDisplay(minYear)}</span>
              <span style={{ color: categoryConfig.color, fontWeight: 600 }}>
                {formatYearDisplay(Math.round(yearFromSlider))}
              </span>
              <span>{formatYearDisplay(maxYear)}</span>
            </div>
          </div>

          <div
            style={{
              marginTop: 8,
              textAlign: 'center',
              fontSize: 12,
              color: '#a89880'
            }}
          >
            💡 拖动时间滑块追踪流变 · 点击圆点直接跳转 · 使用左右按钮顺序探索
          </div>
        </div>
      </Card>

      {currentVariant && (
        <>
          <Card
            className="card-shadow"
            style={{
              borderRadius: 16,
              marginBottom: 16,
              borderLeft: `4px solid ${DYNASTY_COLORS[currentVariant.dynastyId] || categoryConfig.color}`
            }}
            bodyStyle={{ padding: 24 }}
          >
            <Row gutter={[16, 12]} align="middle" style={{ marginBottom: 20 }}>
              <Col>
                <Avatar
                  size={56}
                  style={{
                    background: DYNASTY_COLORS[currentVariant.dynastyId] || categoryConfig.color,
                    fontSize: 20,
                    fontFamily: 'STKaiti, KaiTi, serif'
                  }}
                >
                  {currentVariant.painterName[0]}
                </Avatar>
              </Col>
              <Col flex="auto">
                <Space direction="vertical" size={2}>
                  <Space wrap>
                    <Title level={3} className="ink-title" style={{ color: '#5c4a33', margin: 0 }}>
                      {currentVariant.name}
                    </Title>
                    <Tag color={DYNASTY_COLORS[currentVariant.dynastyId]} style={{ margin: 0 }}>
                      {currentVariant.yearDisplay}
                    </Tag>
                  </Space>
                  <Space size={[8, 4]} wrap>
                    <Tag icon={<UserOutlined />} color="#8b7355">
                      {currentVariant.painterName}
                    </Tag>
                    {currentVariant.paintingTitle && (
                      <Tag color="#6b8e23">
                        🖼️ {currentVariant.paintingTitle}
                      </Tag>
                    )}
                  </Space>
                </Space>
              </Col>
              <Col>
                <Button
                  type="primary"
                  size="large"
                  icon={<PlayCircleOutlined />}
                  onClick={() => setShowVariantDetail(true)}
                  style={{
                    background: `linear-gradient(135deg, ${categoryConfig.color} 0%, ${DYNASTY_COLORS[currentVariant.dynastyId] || categoryConfig.color} 100%)`,
                    border: 'none',
                    borderRadius: 10,
                    padding: '0 24px'
                  }}
                >
                  深入探索
                </Button>
              </Col>
            </Row>

            <Paragraph
              style={{
                fontSize: 15,
                lineHeight: 2,
                color: '#5c4a33',
                padding: '16px 20px',
                background: '#fdf8f0',
                borderRadius: 12,
                margin: 0,
                fontFamily: 'STKaiti, KaiTi, serif',
                textIndent: '2em'
              }}
            >
              {currentVariant.description}
            </Paragraph>

            <Divider style={{ margin: '20px 0' }} />

            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <div style={{ padding: 16, background: '#fffbeb', borderRadius: 12, minHeight: 140 }}>
                  <Title level={5} style={{ color: '#a0522d', marginTop: 0, marginBottom: 12 }}>
                    <InfoCircleOutlined style={{ marginRight: 6 }} />
                    技法特征
                  </Title>
                  <Paragraph style={{ color: '#6b5b45', lineHeight: 1.9, margin: 0, fontSize: 13 }}>
                    {currentVariant.techniqueDescription}
                  </Paragraph>
                  {currentVariant.keyFeatures.length > 0 && (
                    <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {currentVariant.keyFeatures.map((f, i) => (
                        <Tag key={i} color="#d4a017" style={{ margin: 0 }}>
                          {f}
                        </Tag>
                      ))}
                    </div>
                  )}
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div style={{ padding: 16, background: '#eaf5ea', borderRadius: 12, minHeight: 140 }}>
                  <Title level={5} style={{ color: '#27ae60', marginTop: 0, marginBottom: 12 }}>
                    <ExperimentOutlined style={{ marginRight: 6 }} />
                    程式变异
                  </Title>
                  <Paragraph style={{ color: '#3d6b45', lineHeight: 1.9, margin: 0, fontSize: 13 }}>
                    {currentVariant.transformation}
                  </Paragraph>
                </div>
              </Col>
            </Row>
          </Card>

          <Drawer
            open={showVariantDetail}
            onClose={() => setShowVariantDetail(false)}
            width={620}
            title={
              <Space>
                <span style={{ fontSize: 24 }}>
                  {CATEGORY_CONFIG[selectedElement.category].icon}
                </span>
                <span className="ink-title" style={{ color: '#5c4a33', fontSize: 18 }}>
                  {currentVariant.name}
                </span>
              </Space>
            }
            maskClosable
          >
            <div>
              <Space style={{ marginBottom: 20, flexWrap: 'wrap' }}>
                <Tag color={DYNASTY_COLORS[currentVariant.dynastyId]}>
                  {currentVariant.yearDisplay}
                </Tag>
                <Tag icon={<UserOutlined />} color="#8b7355">
                  {currentVariant.painterName}
                </Tag>
                {currentVariant.paintingTitle && (
                  <Tag color="#6b8e23">
                    🖼️ {currentVariant.paintingTitle}
                  </Tag>
                )}
              </Space>

              <Card
                style={{ borderRadius: 12, marginBottom: 16 }}
                bodyStyle={{ padding: 20 }}
              >
                <Title level={5} className="ink-title" style={{ color: '#5c4a33', marginTop: 0 }}>
                  <UserOutlined style={{ marginRight: 8 }} />
                  画家的个人追求
                </Title>
                <Paragraph style={{ color: '#6b5b45', lineHeight: 1.9, fontSize: 14, margin: 0 }}>
                  {currentVariant.personalPursuit}
                </Paragraph>
              </Card>

              <Card
                style={{ borderRadius: 12, marginBottom: 16, borderColor: '#e8c8a8' }}
                bodyStyle={{ padding: 20, background: '#fdf8f0' }}
              >
                <Title level={5} className="ink-title" style={{ color: '#a0522d', marginTop: 0 }}>
                  <ClockCircleOutlined style={{ marginRight: 8 }} />
                  时代的审美压力
                </Title>
                <Paragraph style={{ color: '#6b5b45', lineHeight: 1.9, fontSize: 14, margin: 0 }}>
                  {currentVariant.eraPressure}
                </Paragraph>
              </Card>

              <Card
                style={{ borderRadius: 12, marginBottom: 16, borderColor: '#a8d4a8' }}
                bodyStyle={{ padding: 20, background: '#f0f8f0' }}
              >
                <Title level={5} className="ink-title" style={{ color: '#27ae60', marginTop: 0 }}>
                  <ExperimentOutlined style={{ marginRight: 8 }} />
                  程式如何变异
                </Title>
                <Paragraph style={{ color: '#3d6b45', lineHeight: 1.9, fontSize: 14, margin: 0 }}>
                  {currentVariant.transformation}
                </Paragraph>
              </Card>

              <Card
                style={{ borderRadius: 12 }}
                bodyStyle={{ padding: 20 }}
                title={<span style={{ color: '#5c4a33' }}><BookOutlined /> 技法详解</span>}
              >
                <Paragraph style={{ color: '#6b5b45', lineHeight: 1.9, fontSize: 14, marginBottom: 16 }}>
                  {currentVariant.techniqueDescription}
                </Paragraph>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {currentVariant.keyFeatures.map((f, i) => (
                    <Tag key={i} color="#8b7355" style={{ padding: '4px 12px', fontSize: 13 }}>
                      ✦ {f}
                    </Tag>
                  ))}
                </div>
              </Card>
            </div>
          </Drawer>
        </>
      )}

      <Card
        className="card-shadow"
        style={{ borderRadius: 16 }}
        bodyStyle={{ padding: 0 }}
        title={
          <Space>
            <BulbOutlined style={{ color: '#d4a017', fontSize: 18 }} />
            <span className="ink-title" style={{ color: '#5c4a33' }}>
              AI导师引导
            </span>
            <Badge count={selectedElement.aiGuide.questions.length - currentQuestionIndex} size="small" offset={[2, 0]}>
              <Tag color="#d4a017" style={{ margin: 0, fontSize: 11 }}>
                剩余 {Math.max(0, selectedElement.aiGuide.questions.length - currentQuestionIndex)} 问
              </Tag>
            </Badge>
          </Space>
        }
        extra={
          <Button
            size="small"
            type={showAIGuide ? 'primary' : 'default'}
            icon={<BulbOutlined />}
            onClick={() => setShowAIGuide(!showAIGuide)}
            style={showAIGuide ? { background: '#d4a017', borderColor: '#d4a017' } : {}}
          >
            {showAIGuide ? '收起' : '展开'}
          </Button>
        }
      >
        {showAIGuide && (
          <div style={{ padding: 24 }}>
            <div style={{ maxHeight: 360, overflowY: 'auto', marginBottom: 16 }} className="scroll-y">
              {aiMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`chat-bubble ${msg.type}`}
                  style={{
                    maxWidth: msg.type === 'user' ? '70%' : '90%',
                    whiteSpace: 'pre-wrap',
                    fontFamily: msg.type === 'mentor' ? 'STKaiti, KaiTi, serif' : undefined
                  }}
                >
                  {msg.content}
                </div>
              ))}
            </div>

            <Space wrap size={[8, 8]}>
              <Button
                icon={<QuestionCircleOutlined />}
                onClick={handleAskQuestion}
                disabled={currentQuestionIndex > selectedElement.aiGuide.questions.length}
                style={{
                  background: currentQuestionIndex <= selectedElement.aiGuide.questions.length
                    ? 'linear-gradient(135deg, #d4a017 0%, #b8860b 100%)'
                    : undefined,
                  color: currentQuestionIndex <= selectedElement.aiGuide.questions.length ? '#fff' : undefined,
                  border: 'none'
                }}
              >
                {currentQuestionIndex >= selectedElement.aiGuide.questions.length
                  ? '查看总结'
                  : `继续提问 (${currentQuestionIndex + 1}/${selectedElement.aiGuide.questions.length})`}
              </Button>
              <Tooltip title="浏览这个程式元素的所有变体后再提问更有收获哦">
                <Tag color="#8b7355" style={{ margin: 0 }}>
                  已探索 {visitedVariants.size}/{selectedElement.variants.length} 个历史节点
                </Tag>
              </Tooltip>
            </Space>
          </div>
        )}
      </Card>

      {elements.length > 1 && (
        <Card
          className="card-shadow"
          style={{ borderRadius: 16, marginTop: 16 }}
          title={<span style={{ color: '#5c4a33' }}>🌱 探索更多程式元素</span>}
          bodyStyle={{ padding: 16 }}
        >
          <Row gutter={[12, 12]}>
            {elements.map(el => {
              const cfg = CATEGORY_CONFIG[el.category];
              const isActive = el.id === selectedElement.id;
              return (
                <Col xs={12} sm={8} md={6} key={el.id}>
                  <Card
                    hoverable
                    onClick={() => handleElementChange(el.id)}
                    style={{
                      borderRadius: 12,
                      border: isActive ? `2px solid ${cfg.color}` : '1px solid #e8dcc8',
                      background: isActive ? `${cfg.color}0a` : '#fff',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    bodyStyle={{ padding: 16, textAlign: 'center' }}
                  >
                    <div style={{ fontSize: 32, marginBottom: 8 }}>{cfg.icon}</div>
                    <div className="ink-title" style={{ color: '#5c4a33', fontWeight: 600, marginBottom: 4 }}>
                      {el.name}
                    </div>
                    <Tag color={cfg.color} style={{ margin: 0, fontSize: 11 }}>
                      {cfg.label} · {el.variants.length}变
                    </Tag>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Card>
      )}
    </div>
  );
}

export default FormulaGenealogyPage;
