import { useState, useEffect } from 'react';
import {
  Row, Col, Card, Typography, Spin, Tag, Space, Button, Steps, Timeline,
  Progress, Divider, List, Avatar, Badge, Empty, Modal
} from 'antd';
import {
  BulbOutlined, ArrowRightOutlined, LeftOutlined, CheckCircleOutlined,
  BookOutlined, ClockCircleOutlined, StarOutlined, InfoCircleOutlined,
  RiseOutlined, ExperimentOutlined
} from '@ant-design/icons';
import type { LearningPath, PathStep, PathPhase } from '../types';
import { knowledgeApi } from '../api';

const { Title, Paragraph, Text } = Typography;

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: '入门',
  intermediate: '进阶',
  advanced: '高阶'
};

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'green',
  intermediate: 'orange',
  advanced: 'red'
};

const STEP_TYPE_LABELS: Record<string, string> = {
  painting: '画作',
  theory: '画论',
  painter: '画家',
  school: '画派',
  reflection: '反思'
};

const STEP_TYPE_COLORS: Record<string, string> = {
  painting: 'blue',
  theory: 'purple',
  painter: 'cyan',
  school: 'geekblue',
  reflection: 'gold'
};

const STEP_TYPE_ICONS: Record<string, string> = {
  painting: '🖼️',
  theory: '📜',
  painter: '👤',
  school: '🏛️',
  reflection: '💭'
};

interface PathListItem {
  id: string;
  theoristName: string;
  courtesyName?: string;
  dynasty: string;
  era: string;
  title: string;
  subtitle: string;
  coverEmoji: string;
  description: string;
  corePhilosophy: string;
  totalSteps: number;
  estimatedTime: string;
  difficulty: string;
  representativeWorks: string[];
  relatedTheoryId?: string;
  phaseCount: number;
}

interface Props {
  onNavigate?: (page: string, id?: string) => void;
}

export default function LearningPathPage({ onNavigate }: Props) {
  const [paths, setPaths] = useState<PathListItem[]>([]);
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPhaseIdx, setCurrentPhaseIdx] = useState(0);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'step'>('list');
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [showAiInsight, setShowAiInsight] = useState(false);
  const [insightType, setInsightType] = useState<'midway' | 'conclusion'>('midway');

  useEffect(() => {
    knowledgeApi.getLearningPaths()
      .then(data => setPaths(data))
      .finally(() => setLoading(false));
  }, []);

  const handlePathSelect = (pathId: string) => {
    setLoading(true);
    knowledgeApi.getLearningPath(pathId)
      .then(data => {
        setSelectedPath(data);
        setCurrentPhaseIdx(0);
        setCurrentStepIdx(0);
        setViewMode('detail');
      })
      .finally(() => setLoading(false));
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedPath(null);
    setCurrentPhaseIdx(0);
    setCurrentStepIdx(0);
    setCompletedSteps(new Set());
  };

  const handleStepClick = (phaseIdx: number, stepIdx: number) => {
    setCurrentPhaseIdx(phaseIdx);
    setCurrentStepIdx(stepIdx);
    setViewMode('step');
  };

  const handleNextStep = () => {
    if (!selectedPath) return;
    
    const currentPhase = selectedPath.phases[currentPhaseIdx];
    if (currentStepIdx < currentPhase.steps.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    } else if (currentPhaseIdx < selectedPath.phases.length - 1) {
      setCurrentPhaseIdx(currentPhaseIdx + 1);
      setCurrentStepIdx(0);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
    } else if (currentPhaseIdx > 0) {
      const prevPhase = selectedPath?.phases[currentPhaseIdx - 1];
      if (prevPhase) {
        setCurrentPhaseIdx(currentPhaseIdx - 1);
        setCurrentStepIdx(prevPhase.steps.length - 1);
      }
    }
  };

  const handleMarkComplete = () => {
    if (!selectedPath) return;
    const step = selectedPath.phases[currentPhaseIdx].steps[currentStepIdx];
    const newCompleted = new Set(completedSteps);
    newCompleted.add(step.id);
    setCompletedSteps(newCompleted);
  };

  const getTotalSteps = () => {
    if (!selectedPath) return 0;
    return selectedPath.phases.reduce((sum, phase) => sum + phase.steps.length, 0);
  };

  const getCurrentStepNumber = () => {
    if (!selectedPath) return 0;
    let count = 0;
    for (let i = 0; i < currentPhaseIdx; i++) {
      count += selectedPath.phases[i].steps.length;
    }
    return count + currentStepIdx + 1;
  };

  const isFirstStep = () => currentPhaseIdx === 0 && currentStepIdx === 0;
  const isLastStep = () => {
    if (!selectedPath) return true;
    const lastPhase = selectedPath.phases[selectedPath.phases.length - 1];
    return currentPhaseIdx === selectedPath.phases.length - 1 && 
           currentStepIdx === lastPhase.steps.length - 1;
  };

  const checkMidwayPoint = () => {
    if (!selectedPath) return false;
    const totalSteps = getTotalSteps();
    const currentStepNum = getCurrentStepNumber();
    return currentStepNum === Math.floor(totalSteps / 2) ||
           currentStepNum === Math.ceil(totalSteps / 2);
  };

  const handleShowAiInsight = (type: 'midway' | 'conclusion') => {
    setInsightType(type);
    setShowAiInsight(true);
  };

  if (loading && paths.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <Spin size="large" tip="加载学习路径中..." />
      </div>
    );
  }

  const renderPathList = () => (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card
            style={{
              background: 'linear-gradient(135deg, #3d2817 0%, #5c4d3c 50%, #3d2817 100%)',
              border: 'none',
              borderRadius: 12
            }}
            bodyStyle={{ padding: 24 }}
          >
            <Row align="middle" gutter={16}>
              <Col flex="80px">
                <div style={{ fontSize: 56, textAlign: 'center' }}>🧭</div>
              </Col>
              <Col flex="auto">
                <Title level={2} style={{ margin: 0, color: '#f0d78c' }}>
                  师古之路 · 模拟学习路径
                </Title>
                <Paragraph style={{ margin: '6px 0 0 0', color: '#d4c4a8', fontSize: 14 }}>
                  系统研究谢赫、张彦远、郭熙、董其昌等画论家的自学路径与师承结构，
                  将其提炼为可选的「模拟学习路径」。跟随大师的足迹，体验古人构建画史认知的不同模式。
                </Paragraph>
              </Col>
              <Col>
                <Space direction="vertical" size="small" style={{ textAlign: 'right' }}>
                  <Text style={{ color: '#a89880', fontSize: 12 }}>共 {paths.length} 条路径</Text>
                  <Tag color="gold">AI 导师全程引导</Tag>
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {paths.map((path, index) => (
          <Col xs={24} md={12} key={path.id}>
            <Card
              hoverable
              onClick={() => handlePathSelect(path.id)}
              style={{
                height: '100%',
                background: 'rgba(61,40,23,0.92)',
                border: '1px solid rgba(245,230,200,0.2)',
                borderRadius: 12,
                transition: 'all 0.3s ease'
              }}
              bodyStyle={{ padding: 20 }}
            >
              <Row gutter={16} align="top">
                <Col flex="64px">
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${['#c0392b', '#27ae60', '#2980b9', '#8e44ad'][index % 4]} 0%, rgba(61,40,23,0.5) 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 32
                    }}
                  >
                    {path.coverEmoji}
                  </div>
                </Col>
                <Col flex="auto">
                  <Space align="center" wrap>
                    <Title level={4} style={{ margin: 0, color: '#f0d78c' }}>
                      {path.theoristName}
                    </Title>
                    {path.courtesyName && (
                      <Text type="secondary" style={{ color: '#a89880', fontSize: 13 }}>
                        {path.courtesyName}
                      </Text>
                    )}
                    <Tag color={DIFFICULTY_COLORS[path.difficulty]}>
                      {DIFFICULTY_LABELS[path.difficulty]}
                    </Tag>
                  </Space>
                  <Text style={{ color: '#a89880', fontSize: 13, display: 'block', marginTop: 4 }}>
                    {path.era} · {path.dynasty}
                  </Text>
                  <Title level={5} style={{ color: '#e8dcc4', marginTop: 10, marginBottom: 6 }}>
                    {path.title}
                  </Title>
                  <Text style={{ color: '#bfae8e', fontSize: 13 }}>{path.subtitle}</Text>
                </Col>
              </Row>

              <Divider style={{ margin: '12px 0', borderColor: 'rgba(245,230,200,0.15)' }} />

              <Paragraph style={{ color: '#e8dcc4', fontSize: 13, margin: 0 }}>
                {path.description}
              </Paragraph>

              <div style={{ marginTop: 12 }}>
                <Text type="secondary" style={{ color: '#a89880', fontSize: 12 }}>
                  <BulbOutlined style={{ marginRight: 4 }} />
                  核心理念：
                </Text>
                <Text style={{ color: '#f0d78c', fontSize: 13, marginLeft: 4 }}>
                  {path.corePhilosophy.slice(0, 50)}...
                </Text>
              </div>

              <Row gutter={[12, 8]} style={{ marginTop: 14 }}>
                <Col span={8}>
                  <Card
                    size="small"
                    style={{
                      background: 'rgba(245,230,200,0.06)',
                      border: '1px solid rgba(245,230,200,0.12)',
                      textAlign: 'center'
                    }}
                    bodyStyle={{ padding: 8 }}
                  >
                    <Text style={{ color: '#f0d78c', fontSize: 16, fontWeight: 600 }}>
                      {path.phaseCount}
                    </Text>
                    <Text style={{ color: '#a89880', fontSize: 11, display: 'block' }}>
                      阶段
                    </Text>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card
                    size="small"
                    style={{
                      background: 'rgba(245,230,200,0.06)',
                      border: '1px solid rgba(245,230,200,0.12)',
                      textAlign: 'center'
                    }}
                    bodyStyle={{ padding: 8 }}
                  >
                    <Text style={{ color: '#f0d78c', fontSize: 16, fontWeight: 600 }}>
                      {path.totalSteps}
                    </Text>
                    <Text style={{ color: '#a89880', fontSize: 11, display: 'block' }}>
                      学习点
                    </Text>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card
                    size="small"
                    style={{
                      background: 'rgba(245,230,200,0.06)',
                      border: '1px solid rgba(245,230,200,0.12)',
                      textAlign: 'center'
                    }}
                    bodyStyle={{ padding: 8 }}
                  >
                    <Text style={{ color: '#f0d78c', fontSize: 16, fontWeight: 600 }}>
                      {path.estimatedTime.replace('约', '').replace('小时', 'h')}
                    </Text>
                    <Text style={{ color: '#a89880', fontSize: 11, display: 'block' }}>
                      预计时长
                    </Text>
                  </Card>
                </Col>
              </Row>

              <div style={{ marginTop: 16, textAlign: 'right' }}>
                <Button type="primary" icon={<ArrowRightOutlined />}>
                  开始学习
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Card
        style={{
          marginTop: 24,
          background: 'rgba(61,40,23,0.92)',
          border: 'none',
          borderRadius: 12
        }}
      >
        <Title level={4} style={{ margin: 0, color: '#f0d78c' }}>
          <ExperimentOutlined /> 学习说明
        </Title>
        <Divider style={{ margin: '12px 0', borderColor: 'rgba(245,230,200,0.2)' }} />
        <Row gutter={[16, 12]}>
          <Col xs={24} md={8}>
            <Space align="start">
              <Avatar size={32} style={{ backgroundColor: '#c0392b' }}>1</Avatar>
              <div>
                <Text strong style={{ color: '#f0d78c' }}>选择路径</Text>
                <Text style={{ color: '#e8dcc4', fontSize: 13, display: 'block' }}>
                  选择一位画论家的学习路径，体验他的认知方式
                </Text>
              </div>
            </Space>
          </Col>
          <Col xs={24} md={8}>
            <Space align="start">
              <Avatar size={32} style={{ backgroundColor: '#27ae60' }}>2</Avatar>
              <div>
                <Text strong style={{ color: '#f0d78c' }}>循序学习</Text>
                <Text style={{ color: '#e8dcc4', fontSize: 13, display: 'block' }}>
                  按照路径设定的阶段和步骤，逐一深入学习
                </Text>
              </div>
            </Space>
          </Col>
          <Col xs={24} md={8}>
            <Space align="start">
              <Avatar size={32} style={{ backgroundColor: '#2980b9' }}>3</Avatar>
              <div>
                <Text strong style={{ color: '#f0d78c' }}>AI 导师揭示</Text>
                <Text style={{ color: '#e8dcc4', fontSize: 13, display: 'block' }}>
                  路径终点，AI导师将揭示路径的设计逻辑与时代局限
                </Text>
              </div>
            </Space>
          </Col>
        </Row>
      </Card>
    </div>
  );

  const renderPathDetail = () => {
    if (!selectedPath) return null;

    return (
      <div>
        <Card
          style={{
            background: 'linear-gradient(135deg, #3d2817 0%, #5c4d3c 50%, #3d2817 100%)',
            border: 'none',
            borderRadius: 12,
            marginBottom: 16
          }}
          bodyStyle={{ padding: 20 }}
        >
          <Row align="middle" gutter={16}>
            <Col flex="auto">
              <Space align="center" wrap>
                <Button
                  type="text"
                  icon={<LeftOutlined />}
                  onClick={handleBackToList}
                  style={{ color: '#a89880', marginRight: 8 }}
                >
                  返回路径列表
                </Button>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #c0392b 0%, rgba(61,40,23,0.5) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24
                  }}
                >
                  {selectedPath.coverEmoji}
                </div>
                <div>
                  <Space align="center" wrap>
                    <Title level={3} style={{ margin: 0, color: '#f0d78c' }}>
                      {selectedPath.title}
                    </Title>
                    <Tag color={DIFFICULTY_COLORS[selectedPath.difficulty]}>
                      {DIFFICULTY_LABELS[selectedPath.difficulty]}
                    </Tag>
                  </Space>
                  <Text style={{ color: '#a89880', fontSize: 13 }}>
                    {selectedPath.theoristName} · {selectedPath.era}
                  </Text>
                </div>
              </Space>
            </Col>
            <Col>
              <Space wrap>
                <Tag color="blue">
                  <ClockCircleOutlined /> {selectedPath.estimatedTime}
                </Tag>
                <Tag color="purple">
                  <BookOutlined /> {getTotalSteps()} 个学习点
                </Tag>
                <Tag color="green">
                  <StarOutlined /> {selectedPath.phases.length} 个阶段
                </Tag>
              </Space>
            </Col>
          </Row>
        </Card>

        <Row gutter={16}>
          <Col xs={24} lg={16}>
            {selectedPath.phases.map((phase, phaseIdx) => (
              <Card
                key={phase.id}
                style={{
                  background: 'rgba(61,40,23,0.92)',
                  border: 'none',
                  borderRadius: 12,
                  marginBottom: 16
                }}
                bodyStyle={{ padding: 20 }}
              >
                <Row align="middle" gutter={12} style={{ marginBottom: 12 }}>
                  <Col>
                    <Badge
                      count={`第${phaseIdx + 1}阶段`}
                      style={{ backgroundColor: '#c0392b', fontSize: 13, padding: '0 12px' }}
                    />
                  </Col>
                  <Col flex="auto">
                    <Title level={4} style={{ margin: 0, color: '#f0d78c' }}>
                      {phase.name}
                    </Title>
                  </Col>
                </Row>
                <Paragraph style={{ color: '#bfae8e', marginBottom: 16 }}>
                  {phase.description}
                </Paragraph>

                <List
                  size="small"
                  dataSource={phase.steps}
                  renderItem={(step, stepIdx) => (
                    <List.Item
                      onClick={() => handleStepClick(phaseIdx, stepIdx)}
                      style={{
                        cursor: 'pointer',
                        padding: '12px 8px',
                        borderRadius: 8,
                        transition: 'background 0.2s ease',
                        borderBottom: '1px solid rgba(245,230,200,0.08)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(245,230,200,0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <List.Item.Meta
                        avatar={
                          <div
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: 8,
                              background: `rgba(${step.type === 'reflection' ? '243,156,18' : step.type === 'theory' ? '155,89,182' : '52,152,219'}, 0.2)`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 20
                            }}
                          >
                            {STEP_TYPE_ICONS[step.type]}
                          </div>
                        }
                        title={
                          <Space align="center">
                            <Text strong style={{ color: '#e8dcc4' }}>{step.title}</Text>
                            <Tag color={STEP_TYPE_COLORS[step.type]} style={{ fontSize: 11 }}>
                              {STEP_TYPE_LABELS[step.type]}
                            </Tag>
                            {completedSteps.has(step.id) && (
                              <CheckCircleOutlined style={{ color: '#27ae60' }} />
                            )}
                          </Space>
                        }
                        description={
                          <Text style={{ color: '#a89880', fontSize: 12 }}>
                            {step.subtitle}
                            {step.duration && ` · ${step.duration}`}
                          </Text>
                        }
                      />
                      <ArrowRightOutlined style={{ color: '#a89880' }} />
                    </List.Item>
                  )}
                />
              </Card>
            ))}

            {selectedPath.aiGuide && (
              <Card
                style={{
                  background: 'rgba(39,174,96,0.1)',
                  border: '1px solid rgba(39,174,96,0.3)',
                  borderRadius: 12
                }}
                bodyStyle={{ padding: 20 }}
              >
                <Title level={4} style={{ margin: 0, color: '#27ae60' }}>
                  <BulbOutlined /> AI 导师 · 学习建议
                </Title>
                <Paragraph style={{ color: '#e8dcc4', marginTop: 12 }}>
                  {selectedPath.aiGuide.introduction}
                </Paragraph>
                <Button
                  type="primary"
                  ghost
                  onClick={() => handleShowAiInsight('conclusion')}
                  style={{ borderColor: '#27ae60', color: '#27ae60' }}
                >
                  提前了解路径设计逻辑
                </Button>
              </Card>
            )}
          </Col>

          <Col xs={24} lg={8}>
            <Card
              style={{
                background: 'rgba(61,40,23,0.92)',
                border: 'none',
                borderRadius: 12,
                position: 'sticky',
                top: 20
              }}
              bodyStyle={{ padding: 20 }}
            >
              <Title level={5} style={{ margin: 0, color: '#f0d78c' }}>
                学习进度
              </Title>
              <Progress
                percent={Math.round((completedSteps.size / getTotalSteps()) * 100)}
                strokeColor="#f0d78c"
                style={{ marginTop: 12 }}
              />
              <Text style={{ color: '#a89880', fontSize: 12, display: 'block', marginTop: 8 }}>
                已完成 {completedSteps.size} / {getTotalSteps()} 个学习点
              </Text>

              <Divider style={{ margin: '16px 0', borderColor: 'rgba(245,230,200,0.2)' }} />

              <Title level={5} style={{ margin: 0, color: '#f0d78c' }}>
                核心理念
              </Title>
              <Paragraph style={{ color: '#e8dcc4', marginTop: 10, fontSize: 14 }}>
                「{selectedPath.corePhilosophy}」
              </Paragraph>

              <Divider style={{ margin: '16px 0', borderColor: 'rgba(245,230,200,0.2)' }} />

              <Title level={5} style={{ margin: 0, color: '#f0d78c' }}>
                路径概览
              </Title>
              <Steps
                direction="vertical"
                size="small"
                current={currentPhaseIdx + (currentStepIdx > 0 ? 0.5 : 0)}
                style={{ marginTop: 12 }}
                items={selectedPath.phases.map((phase, idx) => ({
                  title: <Text style={{ color: '#e8dcc4', fontSize: 13 }}>{phase.name}</Text>,
                  description: <Text style={{ color: '#a89880', fontSize: 11 }}>{phase.steps.length} 个学习点</Text>,
                  status: idx < currentPhaseIdx ? 'finish' : idx === currentPhaseIdx ? 'process' : 'wait'
                }))}
              />
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  const renderStepDetail = () => {
    if (!selectedPath) return null;

    const phase = selectedPath.phases[currentPhaseIdx];
    const step = phase.steps[currentStepIdx];
    const totalSteps = getTotalSteps();
    const currentStepNum = getCurrentStepNumber();
    const progress = (currentStepNum / totalSteps) * 100;

    return (
      <div>
        <Card
          style={{
            background: 'linear-gradient(135deg, #3d2817 0%, #5c4d3c 50%, #3d2817 100%)',
            border: 'none',
            borderRadius: 12,
            marginBottom: 16
          }}
          bodyStyle={{ padding: 16 }}
        >
          <Row align="middle" gutter={12}>
            <Col flex="auto">
              <Space align="center" wrap>
                <Button
                  type="text"
                  icon={<LeftOutlined />}
                  onClick={() => setViewMode('detail')}
                  style={{ color: '#a89880' }}
                >
                  返回路径
                </Button>
                <Tag color="#c0392b">
                  第 {currentPhaseIdx + 1} 阶段 · {phase.name}
                </Tag>
              </Space>
            </Col>
            <Col>
              <Text style={{ color: '#a89880', fontSize: 13 }}>
                {currentStepNum} / {totalSteps}
              </Text>
            </Col>
          </Row>
          <Progress
            percent={progress}
            showInfo={false}
            strokeColor="#f0d78c"
            style={{ marginTop: 12 }}
          />
        </Card>

        <Row gutter={16}>
          <Col xs={24} lg={16}>
            <Card
              style={{
                background: 'rgba(61,40,23,0.92)',
                border: 'none',
                borderRadius: 12,
                minHeight: 500
              }}
              bodyStyle={{ padding: 28 }}
            >
              <Space align="center" style={{ marginBottom: 16 }} wrap>
                <Tag color={STEP_TYPE_COLORS[step.type]} style={{ fontSize: 13, padding: '4px 12px' }}>
                  {STEP_TYPE_ICONS[step.type]} {STEP_TYPE_LABELS[step.type]}
                </Tag>
                {step.duration && (
                  <Tag color="default" style={{ fontSize: 12 }}>
                    <ClockCircleOutlined /> {step.duration}
                  </Tag>
                )}
                {completedSteps.has(step.id) && (
                  <Tag color="success" style={{ fontSize: 12 }}>
                    <CheckCircleOutlined /> 已完成
                  </Tag>
                )}
              </Space>

              <Title level={2} style={{ color: '#f0d78c', marginTop: 0, marginBottom: 8 }}>
                {step.title}
              </Title>
              <Text style={{ color: '#bfae8e', fontSize: 16, display: 'block', marginBottom: 20 }}>
                {step.subtitle}
              </Text>

              <Divider style={{ margin: '20px 0', borderColor: 'rgba(245,230,200,0.2)' }} />

              <div style={{ lineHeight: 2, fontSize: 16, color: '#e8dcc4' }}>
                {step.content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} style={{ marginBottom: 16 }}>{paragraph}</p>
                ))}
              </div>

              {step.keyInsights && step.keyInsights.length > 0 && (
                <div style={{ marginTop: 28 }}>
                  <Title level={4} style={{ color: '#f0d78c', marginBottom: 12 }}>
                    <RiseOutlined style={{ marginRight: 8 }} />
                    核心洞见
                  </Title>
                  <Card
                    style={{
                      background: 'rgba(240,215,140,0.08)',
                      border: '1px solid rgba(240,215,140,0.3)',
                      borderRadius: 8
                    }}
                    bodyStyle={{ padding: 16 }}
                  >
                    <List
                      size="small"
                      dataSource={step.keyInsights}
                      renderItem={(insight, idx) => (
                        <List.Item style={{ borderBottom: 'none', padding: '8px 0' }}>
                          <Space align="start" size={12}>
                            <Badge
                              count={idx + 1}
                              style={{ backgroundColor: '#c0392b', minWidth: 24, height: 24, fontSize: 12 }}
                            />
                            <Text style={{ color: '#e8dcc4', fontSize: 14, lineHeight: 1.8 }}>
                              {insight}
                            </Text>
                          </Space>
                        </List.Item>
                      )}
                    />
                  </Card>
                </div>
              )}

              {step.practiceExercise && (
                <div style={{ marginTop: 28 }}>
                  <Title level={4} style={{ color: '#27ae60', marginBottom: 12 }}>
                    <ExperimentOutlined style={{ marginRight: 8 }} />
                    实践练习
                  </Title>
                  <Card
                    style={{
                      background: 'rgba(39,174,96,0.08)',
                      border: '1px solid rgba(39,174,96,0.3)',
                      borderRadius: 8
                    }}
                    bodyStyle={{ padding: 16 }}
                  >
                    <Text style={{ color: '#e8dcc4', fontSize: 15, lineHeight: 1.9 }}>
                      {step.practiceExercise}
                    </Text>
                  </Card>
                </div>
              )}

              <Divider style={{ margin: '28px 0', borderColor: 'rgba(245,230,200,0.2)' }} />

              <Row justify="space-between" align="middle">
                <Col>
                  <Button
                    disabled={isFirstStep()}
                    onClick={handlePrevStep}
                    icon={<LeftOutlined />}
                  >
                    上一步
                  </Button>
                </Col>
                <Col>
                  <Space>
                    {!completedSteps.has(step.id) && (
                      <Button
                        type="primary"
                        ghost
                        onClick={handleMarkComplete}
                        style={{ borderColor: '#27ae60', color: '#27ae60' }}
                      >
                        <CheckCircleOutlined /> 标记完成
                      </Button>
                    )}
                    <Button
                      type="primary"
                      onClick={handleNextStep}
                      disabled={isLastStep()}
                    >
                      下一步 <ArrowRightOutlined />
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Card>

            {isLastStep() && selectedPath.aiGuide && (
              <Card
                style={{
                  marginTop: 16,
                  background: 'linear-gradient(135deg, rgba(142,68,173,0.2) 0%, rgba(61,40,23,0.92) 100%)',
                  border: '2px solid rgba(142,68,173,0.4)',
                  borderRadius: 12
                }}
                bodyStyle={{ padding: 24 }}
              >
                <Row align="middle" gutter={16}>
                  <Col flex="60px">
                    <div style={{ fontSize: 48 }}>🎓</div>
                  </Col>
                  <Col flex="auto">
                    <Title level={3} style={{ margin: 0, color: '#9b59b6' }}>
                      恭喜！你走完了这条路径
                    </Title>
                    <Text style={{ color: '#bfae8e', fontSize: 14, display: 'block', marginTop: 6 }}>
                      现在，让 AI 导师为你揭示这条路径的设计逻辑、时代局限，以及与其他路径的对比
                    </Text>
                  </Col>
                  <Col>
                    <Button
                      type="primary"
                      size="large"
                      onClick={() => handleShowAiInsight('conclusion')}
                      style={{ background: '#9b59b6', borderColor: '#9b59b6' }}
                    >
                      <BulbOutlined /> 查看导师总结
                    </Button>
                  </Col>
                </Row>
              </Card>
            )}

            {checkMidwayPoint() && !isLastStep() && selectedPath.aiGuide && (
              <Card
                style={{
                  marginTop: 16,
                  background: 'rgba(243,156,18,0.1)',
                  border: '1px solid rgba(243,156,18,0.4)',
                  borderRadius: 12
                }}
                bodyStyle={{ padding: 20 }}
              >
                <Row align="middle" gutter={12}>
                  <Col flex="auto">
                    <Space align="center">
                      <div style={{ fontSize: 28 }}>💡</div>
                      <div>
                        <Text strong style={{ color: '#f39c12', fontSize: 15 }}>
                          学习过半，来一次中途反思？
                        </Text>
                        <Text style={{ color: '#bfae8e', fontSize: 13, display: 'block' }}>
                          AI 导师有话想对你说
                        </Text>
                      </div>
                    </Space>
                  </Col>
                  <Col>
                    <Button
                      onClick={() => handleShowAiInsight('midway')}
                      style={{ borderColor: '#f39c12', color: '#f39c12' }}
                      ghost
                    >
                      查看中途反思
                    </Button>
                  </Col>
                </Row>
              </Card>
            )}
          </Col>

          <Col xs={24} lg={8}>
            <Card
              style={{
                background: 'rgba(61,40,23,0.92)',
                border: 'none',
                borderRadius: 12,
                position: 'sticky',
                top: 20
              }}
              bodyStyle={{ padding: 20 }}
            >
              <Title level={5} style={{ margin: 0, color: '#f0d78c' }}>
                本阶段学习进度
              </Title>
              <Progress
                percent={Math.round(((currentStepIdx + 1) / phase.steps.length) * 100)}
                strokeColor="#f0d78c"
                style={{ marginTop: 12 }}
              />
              <Text style={{ color: '#a89880', fontSize: 12, display: 'block', marginTop: 8 }}>
                {currentStepIdx + 1} / {phase.steps.length} 个学习点
              </Text>

              <Divider style={{ margin: '16px 0', borderColor: 'rgba(245,230,200,0.2)' }} />

              <Title level={5} style={{ margin: 0, color: '#f0d78c' }}>
                本阶段目录
              </Title>
              <Timeline
                style={{ marginTop: 12 }}
                items={phase.steps.map((s, idx) => ({
                  color: idx < currentStepIdx ? 'green' : idx === currentStepIdx ? '#f0d78c' : 'gray',
                  dot: idx < currentStepIdx ? <CheckCircleOutlined /> : undefined,
                  children: (
                    <div
                      onClick={() => setCurrentStepIdx(idx)}
                      style={{
                        cursor: 'pointer',
                        color: idx === currentStepIdx ? '#f0d78c' : idx < currentStepIdx ? '#27ae60' : '#a89880',
                        fontWeight: idx === currentStepIdx ? 600 : 'normal',
                        fontSize: 13
                      }}
                    >
                      {s.title}
                    </div>
                  )
                }))}
              />

              {selectedPath.aiGuide && (
                <>
                  <Divider style={{ margin: '16px 0', borderColor: 'rgba(245,230,200,0.2)' }} />
                  <Title level={5} style={{ margin: 0, color: '#f0d78c' }}>
                    <BulbOutlined /> AI 导师
                  </Title>
                  <Space direction="vertical" size="small" style={{ marginTop: 12, width: '100%' }}>
                    <Button
                      block
                      ghost
                      onClick={() => handleShowAiInsight('midway')}
                      style={{ borderColor: '#f39c12', color: '#f39c12' }}
                    >
                      中途反思
                    </Button>
                    <Button
                      block
                      ghost
                      onClick={() => handleShowAiInsight('conclusion')}
                      style={{ borderColor: '#9b59b6', color: '#9b59b6' }}
                    >
                      路径总结
                    </Button>
                  </Space>
                </>
              )}
            </Card>
          </Col>
        </Row>

        <Modal
          title={
            <Space align="center">
              <BulbOutlined style={{ color: '#9b59b6' }} />
              <Text style={{ color: '#f0d78c', fontSize: 16, fontWeight: 600 }}>
                AI 导师 · {insightType === 'midway' ? '中途反思' : '路径总结'}
              </Text>
            </Space>
          }
          open={showAiInsight}
          onCancel={() => setShowAiInsight(false)}
          width={720}
          footer={[
            <Button key="close" onClick={() => setShowAiInsight(false)}>
              关闭
            </Button>
          ]}
          styles={{
            header: { background: '#3d2817', borderBottom: '1px solid rgba(245,230,200,0.2)' },
            body: { background: '#3d2817', padding: 24 },
            footer: { background: '#3d2817', borderTop: '1px solid rgba(245,230,200,0.2)' }
          }}
        >
          {selectedPath && (
            <div style={{ color: '#e8dcc4' }}>
              {insightType === 'midway' && (
                <div>
                  <Title level={4} style={{ color: '#f39c12', marginTop: 0 }}>
                    💭 中途反思
                  </Title>
                  <Paragraph style={{ fontSize: 15, lineHeight: 2, color: '#e8dcc4' }}>
                    {selectedPath.aiGuide.midwayReflection}
                  </Paragraph>
                </div>
              )}

              {insightType === 'conclusion' && (
                <div>
                  <Title level={4} style={{ color: '#9b59b6', marginTop: 0 }}>
                    🎓 路径总结
                  </Title>
                  <Paragraph style={{ fontSize: 15, lineHeight: 2, color: '#e8dcc4' }}>
                    {selectedPath.aiGuide.conclusion}
                  </Paragraph>

                  <Divider style={{ margin: '20px 0', borderColor: 'rgba(245,230,200,0.2)' }} />

                  <Title level={5} style={{ color: '#f0d78c' }}>
                    🔧 设计逻辑
                  </Title>
                  <Paragraph style={{ fontSize: 14, lineHeight: 1.9, color: '#e8dcc4', whiteSpace: 'pre-wrap' }}>
                    {selectedPath.aiGuide.designLogic}
                  </Paragraph>

                  <Divider style={{ margin: '20px 0', borderColor: 'rgba(245,230,200,0.2)' }} />

                  <Title level={5} style={{ color: '#e74c3c' }}>
                    ⚠️ 时代局限
                  </Title>
                  <Paragraph style={{ fontSize: 14, lineHeight: 1.9, color: '#e8dcc4', whiteSpace: 'pre-wrap' }}>
                    {selectedPath.aiGuide.limitations}
                  </Paragraph>

                  <Divider style={{ margin: '20px 0', borderColor: 'rgba(245,230,200,0.2)' }} />

                  <Title level={5} style={{ color: '#27ae60' }}>
                    🔄 与其他路径对比
                  </Title>
                  <Paragraph style={{ fontSize: 14, lineHeight: 1.9, color: '#e8dcc4', whiteSpace: 'pre-wrap' }}>
                    {selectedPath.aiGuide.comparisonWithOthers}
                  </Paragraph>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    );
  };

  return (
    <div>
      {viewMode === 'list' && renderPathList()}
      {viewMode === 'detail' && renderPathDetail()}
      {viewMode === 'step' && renderStepDetail()}
    </div>
  );
}
