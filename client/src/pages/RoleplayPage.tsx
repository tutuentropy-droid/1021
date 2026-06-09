import { useState, useEffect } from 'react';
import { Card, Typography, Button, Space, Tag, Divider, Steps, Descriptions, List, Empty, Spin, Row, Col, Avatar, Breadcrumb, Tooltip, Result, Modal } from 'antd';
import {
  ThunderboltOutlined,
  HistoryOutlined,
  TrophyOutlined,
  UserOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  BulbOutlined,
  EyeOutlined,
  InfoCircleOutlined,
  ArrowRightOutlined,
  RollbackOutlined,
  HomeOutlined,
  BookOutlined,
  LineChartOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import type { RoleplayScenario, RoleplayChoice, RoleplayConsequence, RoleplayResult } from '../types';
import { knowledgeApi } from '../api';

const { Title, Paragraph, Text } = Typography;

type Stage = 'select' | 'intro' | 'choice' | 'consequence' | 'result';

const RATING_COLORS: Record<string, string> = {
  master: 'gold',
  excellent: 'purple',
  good: 'blue',
  mediocre: 'orange',
  obscure: 'default'
};

const RATING_LABELS: Record<string, string> = {
  master: '一代宗师',
  excellent: '卓然大家',
  good: '画史名家',
  mediocre: '画史留名',
  obscure: '默默无闻'
};

const SCENARIO_ICONS: Record<string, string> = {
  'southern-song-court': '🏯',
  'yuan-recluse': '🎋',
  'dong-qichang-follower': '📜'
};

interface PathStep {
  choiceId: string;
  optionId: string;
  consequenceId: string;
}

function RoleplayPage() {
  const [stage, setStage] = useState<Stage>('select');
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [currentScenario, setCurrentScenario] = useState<RoleplayScenario | null>(null);
  const [currentChoice, setCurrentChoice] = useState<RoleplayChoice | null>(null);
  const [currentConsequence, setCurrentConsequence] = useState<RoleplayConsequence | null>(null);
  const [finalResult, setFinalResult] = useState<RoleplayResult | null>(null);
  const [path, setPath] = useState<PathStep[]>([]);
  const [loading, setLoading] = useState(false);
  const [consequenceModalVisible, setConsequenceModalVisible] = useState(false);

  useEffect(() => {
    knowledgeApi.getRoleplayScenarios().then(data => setScenarios(data));
  }, []);

  const startScenario = async (scenarioId: string) => {
    setLoading(true);
    const scenario = await knowledgeApi.getRoleplayScenario(scenarioId);
    setCurrentScenario(scenario);
    setPath([]);
    setStage('intro');
    setLoading(false);
  };

  const beginGame = async () => {
    if (!currentScenario) return;
    setLoading(true);
    const choice = await knowledgeApi.getRoleplayChoice(currentScenario.id, currentScenario.initialChoiceId);
    setCurrentChoice(choice);
    setStage('choice');
    setLoading(false);
  };

  const makeChoice = async (optionId: string) => {
    if (!currentScenario || !currentChoice) return;
    const selectedOption = currentChoice.options.find(o => o.id === optionId);
    if (!selectedOption) return;

    setLoading(true);
    const consequence = await knowledgeApi.getRoleplayConsequence(
      currentScenario.id,
      selectedOption.consequenceId
    );

    const newStep: PathStep = {
      choiceId: currentChoice.id,
      optionId,
      consequenceId: selectedOption.consequenceId
    };
    const newPath = [...path, newStep];
    setPath(newPath);
    setCurrentConsequence(consequence);
    setStage('consequence');
    setLoading(false);
  };

  const goToNextChoice = async () => {
    if (!currentScenario || !currentConsequence) return;

    if (!currentConsequence.nextChoiceId) {
      setLoading(true);
      const result = await knowledgeApi.getRoleplayResult(currentScenario.id, path);
      setFinalResult(result);
      setStage('result');
      setLoading(false);
      return;
    }

    setLoading(true);
    const choice = await knowledgeApi.getRoleplayChoice(currentScenario.id, currentConsequence.nextChoiceId);
    setCurrentChoice(choice);
    setStage('choice');
    setLoading(false);
  };

  const restart = () => {
    setStage('select');
    setCurrentScenario(null);
    setCurrentChoice(null);
    setCurrentConsequence(null);
    setFinalResult(null);
    setPath([]);
  };

  const goBackToSelect = () => {
    restart();
  };

  const currentStep = path.length;
  const totalSteps = currentScenario?.choices.length || 0;

  const renderSelect = () => (
    <div>
      <Title level={2} className="ink-title" style={{ color: '#5c4a33', marginBottom: 8 }}>
        🎭 画史推演
      </Title>
      <Paragraph style={{ color: '#8b7355', marginBottom: 32, fontSize: 15 }}>
        穿越千年时光，置身中国画史的关键节点。你将扮演某个历史情境中的画坛人物，
        在时代的十字路口做出艺术抉择。每一个选择都将引向不同的流派走向与历史评价。
        <br />
        <Text type="secondary" style={{ fontSize: 13 }}>
          （推演基于画史真实逻辑展开合理想象，不虚构历史大脉络）
        </Text>
      </Paragraph>

      <Row gutter={[24, 24]}>
        {scenarios.map(s => (
          <Col xs={24} md={8} key={s.id}>
            <Card
              hoverable
              className="card-shadow"
              style={{ borderRadius: 16, height: '100%' }}
              onClick={() => startScenario(s.id)}
              bodyStyle={{ padding: 24 }}
            >
              <div style={{ fontSize: 48, marginBottom: 12 }}>
                {SCENARIO_ICONS[s.id] || '🎨'}
              </div>
              <Tag color="#8b7355" style={{ marginBottom: 12 }}>{s.dynasty}</Tag>
              <Title level={4} className="ink-title" style={{ color: '#5c4a33', marginTop: 0 }}>
                {s.title}
              </Title>
              <Paragraph style={{ color: '#8b7355', fontSize: 13, marginBottom: 12 }}>
                <ClockCircleOutlined /> {s.era}
              </Paragraph>
              <Paragraph style={{ color: '#6b5b45', fontSize: 14, lineHeight: 1.8, minHeight: 100 }}>
                {s.historicalContext.slice(0, 80)}...
              </Paragraph>
              <Descriptions column={1} size="small" style={{ marginBottom: 0 }}>
                <Descriptions.Item label="身份">
                  <UserOutlined /> {s.persona.identity}
                </Descriptions.Item>
              </Descriptions>
              <Button
                type="primary"
                icon={<ArrowRightOutlined />}
                style={{ marginTop: 16, background: '#8b7355', borderColor: '#8b7355', width: '100%' }}
                onClick={(e) => { e.stopPropagation(); startScenario(s.id); }}
              >
                进入此历史节点
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );

  const renderIntro = () => {
    if (!currentScenario) return null;
    return (
      <div>
        <Space style={{ marginBottom: 16 }}>
          <Button icon={<RollbackOutlined />} onClick={goBackToSelect}>返回场景选择</Button>
        </Space>

        <Card className="card-shadow" style={{ borderRadius: 16 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>
            {SCENARIO_ICONS[currentScenario.id] || '🎨'}
          </div>

          <Space style={{ marginBottom: 16 }} wrap>
            <Tag color="#8b7355">{currentScenario.dynasty}</Tag>
            <Tag color="#c0392b"><ClockCircleOutlined /> {currentScenario.era}</Tag>
          </Space>

          <Title level={2} className="ink-title" style={{ color: '#5c4a33', marginTop: 0 }}>
            {currentScenario.title}
          </Title>

          <Divider />

          <Title level={4} className="ink-title" style={{ color: '#5c4a33' }}>
            <HistoryOutlined /> 历史背景
          </Title>
          <Paragraph style={{ color: '#6b5b45', fontSize: 15, lineHeight: 2 }}>
            {currentScenario.historicalContext}
          </Paragraph>

          <Divider />

          <Title level={4} className="ink-title" style={{ color: '#5c4a33' }}>
            <UserOutlined /> 你是——{currentScenario.persona.name}
          </Title>
          <Descriptions column={1} size="small" style={{ marginBottom: 16 }}>
            <Descriptions.Item label="身份">
              <Text strong style={{ color: '#c0392b' }}>{currentScenario.persona.identity}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="背景">
              <span style={{ color: '#6b5b45' }}>{currentScenario.persona.background}</span>
            </Descriptions.Item>
          </Descriptions>

          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <Card size="small" style={{ borderRadius: 12, background: '#fdfbf7' }}>
                <Title level={5} className="ink-title" style={{ color: '#c0392b', marginTop: 0 }}>
                  <InfoCircleOutlined /> 你的约束
                </Title>
                <ul style={{ paddingLeft: 18, color: '#6b5b45', lineHeight: 1.9, marginBottom: 0 }}>
                  {currentScenario.persona.constraints.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card size="small" style={{ borderRadius: 12, background: '#fdfbf7' }}>
                <Title level={5} className="ink-title" style={{ color: '#27ae60', marginTop: 0 }}>
                  <BulbOutlined /> 你的追求
                </Title>
                <ul style={{ paddingLeft: 18, color: '#6b5b45', lineHeight: 1.9, marginBottom: 0 }}>
                  {currentScenario.persona.motivations.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </Card>
            </Col>
          </Row>

          <Divider />

          <Title level={4} className="ink-title" style={{ color: '#5c4a33' }}>
            <ThunderboltOutlined /> 情境展开
          </Title>
          <Paragraph
            style={{
              color: '#4a3f33',
              fontSize: 16,
              lineHeight: 2,
              background: '#faf6ed',
              padding: 24,
              borderRadius: 12,
              borderLeft: '4px solid #8b7355',
              fontStyle: 'italic'
            }}
          >
            {currentScenario.openingNarrative}
          </Paragraph>

          <div style={{ marginTop: 32, textAlign: 'center' }}>
            <Button
              type="primary"
              size="large"
              icon={<ArrowRightOutlined />}
              onClick={beginGame}
              style={{ background: '#8b7355', borderColor: '#8b7355', paddingLeft: 48, paddingRight: 48 }}
            >
              开始你的画史抉择
            </Button>
          </div>
        </Card>
      </div>
    );
  };

  const renderChoice = () => {
    if (!currentScenario || !currentChoice) return null;
    return (
      <div>
        <Space style={{ marginBottom: 16 }} wrap>
          <Button icon={<RollbackOutlined />} onClick={goBackToSelect}>返回场景选择</Button>
          <Button icon={<HistoryOutlined />} onClick={() => setConsequenceModalVisible(true)} disabled={path.length === 0}>
            查看已选路径 ({path.length})
          </Button>
        </Space>

        <Steps
          current={currentStep}
          items={currentScenario.choices.map((_, i) => ({
            title: `第 ${i + 1} 次抉择`
          }))}
          style={{ marginBottom: 32 }}
        />

        <Card className="card-shadow" style={{ borderRadius: 16 }}>
          <Tag color="#c0392b" style={{ marginBottom: 16 }}>
            第 {currentStep + 1} / {totalSteps} 次抉择
          </Tag>

          <Title level={3} className="ink-title" style={{ color: '#5c4a33', marginTop: 0 }}>
            <ThunderboltOutlined /> {currentChoice.question}
          </Title>

          <Paragraph style={{ color: '#6b5b45', fontSize: 15, lineHeight: 2, marginBottom: 32 }}>
            {currentChoice.context}
          </Paragraph>

          <Divider />

          <List
            dataSource={currentChoice.options}
            renderItem={(option, index) => (
              <List.Item
                key={option.id}
                style={{
                  padding: '20px 0',
                  borderBottom: index < currentChoice.options.length - 1 ? '1px dashed #e8dcc8' : 'none',
                  cursor: 'pointer'
                }}
                onClick={() => makeChoice(option.id)}
                className="choice-option"
              >
                <Card
                  hoverable
                  style={{
                    width: '100%',
                    borderRadius: 12,
                    border: '1px solid #e8dcc8',
                    background: '#fdfbf7'
                  }}
                  bodyStyle={{ padding: 20 }}
                >
                  <Space align="start" style={{ width: '100%' }}>
                    <Avatar
                      style={{
                        backgroundColor: '#8b7355',
                        verticalAlign: 'middle',
                        flexShrink: 0
                      }}
                    >
                      {String.fromCharCode(65 + index)}
                    </Avatar>
                    <div style={{ flex: 1 }}>
                      <Title level={5} className="ink-title" style={{ color: '#5c4a33', marginTop: 0, marginBottom: 8 }}>
                        {option.label}
                      </Title>
                      <Paragraph style={{ color: '#6b5b45', fontSize: 14, lineHeight: 1.8, marginBottom: 0 }}>
                        {option.description}
                      </Paragraph>
                    </div>
                    <ArrowRightOutlined style={{ color: '#8b7355', fontSize: 18, flexShrink: 0 }} />
                  </Space>
                </Card>
              </List.Item>
            )}
          />
        </Card>

        <Modal
          title={<span style={{ color: '#5c4a33' }}><HistoryOutlined /> 你的选择路径</span>}
          open={consequenceModalVisible}
          onCancel={() => setConsequenceModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setConsequenceModalVisible(false)}>关闭</Button>
          ]}
          width={700}
        >
          <List
            dataSource={path}
            renderItem={(step, index) => {
              const scenario = currentScenario;
              if (!scenario) return null;
              const choice = scenario.choices.find(c => c.id === step.choiceId);
              const option = choice?.options.find(o => o.id === step.optionId);
              const consequence = scenario.consequences.find(c => c.id === step.consequenceId);
              return (
                <List.Item key={step.choiceId}>
                  <List.Item.Meta
                    avatar={<Avatar style={{ backgroundColor: '#8b7355' }}>{index + 1}</Avatar>}
                    title={<span style={{ color: '#5c4a33', fontWeight: 'bold' }}>{choice?.question}</span>}
                    description={
                      <div>
                        <Paragraph style={{ color: '#c0392b', margin: 0 }}>
                          你的选择：{option?.label}
                        </Paragraph>
                        {consequence && (
                          <Paragraph style={{ color: '#6b5b45', margin: '8px 0 0 0', fontSize: 13 }}>
                            🎯 {consequence.title}
                          </Paragraph>
                        )}
                      </div>
                    }
                  />
                </List.Item>
              );
            }}
          />
        </Modal>
      </div>
    );
  };

  const renderConsequence = () => {
    if (!currentScenario || !currentConsequence) return null;
    return (
      <div>
        <Space style={{ marginBottom: 16 }} wrap>
          <Button icon={<RollbackOutlined />} onClick={goBackToSelect}>返回场景选择</Button>
          <Button icon={<HistoryOutlined />} onClick={() => setConsequenceModalVisible(true)} disabled={path.length === 0}>
            查看已选路径 ({path.length})
          </Button>
        </Space>

        <Steps
          current={currentStep}
          items={currentScenario.choices.map((_, i) => ({
            title: `第 ${i + 1} 次抉择`
          }))}
          style={{ marginBottom: 32 }}
        />

        <Card className="card-shadow" style={{ borderRadius: 16 }}>
          <Space style={{ marginBottom: 16 }} wrap>
            <Tag color="#c0392b">
              第 {currentStep} / {totalSteps} 次抉择结果
            </Tag>
            <Tag color="#27ae60"><TrophyOutlined /> {currentConsequence.title}</Tag>
          </Space>

          <Title level={3} className="ink-title" style={{ color: '#5c4a33', marginTop: 0 }}>
            🎯 {currentConsequence.title}
          </Title>

          <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
            <Col xs={24} md={12}>
              <Card size="small" title={<span><ThunderboltOutlined /> 即时影响</span>} style={{ borderRadius: 12 }}>
                <Paragraph style={{ color: '#6b5b45', lineHeight: 1.9, marginBottom: 0 }}>
                  {currentConsequence.immediateImpact}
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card size="small" title={<span><LineChartOutlined /> 流派走向</span>} style={{ borderRadius: 12 }}>
                <Paragraph style={{ color: '#6b5b45', lineHeight: 1.9, marginBottom: 0 }}>
                  {currentConsequence.schoolTrajectory}
                </Paragraph>
              </Card>
            </Col>
          </Row>

          <Divider />

          <Title level={4} className="ink-title" style={{ color: '#5c4a33' }}>
            <EyeOutlined /> 历代评价
          </Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={6}>
              <Card size="small" style={{ borderRadius: 12, borderTop: '3px solid #c0392b' }}>
                <Text strong style={{ color: '#c0392b' }}>当时</Text>
                <Paragraph style={{ color: '#6b5b45', fontSize: 13, lineHeight: 1.8, marginTop: 8, marginBottom: 0 }}>
                  {currentConsequence.criticalReception.contemporary}
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={6}>
              <Card size="small" style={{ borderRadius: 12, borderTop: '3px solid #2980b9' }}>
                <Text strong style={{ color: '#2980b9' }}>明代</Text>
                <Paragraph style={{ color: '#6b5b45', fontSize: 13, lineHeight: 1.8, marginTop: 8, marginBottom: 0 }}>
                  {currentConsequence.criticalReception.mingDynasty}
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={6}>
              <Card size="small" style={{ borderRadius: 12, borderTop: '3px solid #8e44ad' }}>
                <Text strong style={{ color: '#8e44ad' }}>清代</Text>
                <Paragraph style={{ color: '#6b5b45', fontSize: 13, lineHeight: 1.8, marginTop: 8, marginBottom: 0 }}>
                  {currentConsequence.criticalReception.qingDynasty}
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={6}>
              <Card size="small" style={{ borderRadius: 12, borderTop: '3px solid #27ae60' }}>
                <Text strong style={{ color: '#27ae60' }}>现代</Text>
                <Paragraph style={{ color: '#6b5b45', fontSize: 13, lineHeight: 1.8, marginTop: 8, marginBottom: 0 }}>
                  {currentConsequence.criticalReception.modern}
                </Paragraph>
              </Card>
            </Col>
          </Row>

          <Divider />

          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Card
                size="small"
                style={{ borderRadius: 12, background: '#fdf6e3' }}
                title={<span><BulbOutlined /> <span style={{ color: '#b8860b' }}>历史假设推演</span></span>}
              >
                <Paragraph
                  style={{ color: '#8b6914', lineHeight: 1.9, marginBottom: 0, fontStyle: 'italic' }}
                >
                  {currentConsequence.historicalWhatIf}
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card
                size="small"
                style={{ borderRadius: 12, background: '#eaf2e8' }}
                title={<span><BookOutlined /> <span style={{ color: '#27ae60' }}>真实历史对照</span></span>}
              >
                <Paragraph style={{ color: '#4a7a42', lineHeight: 1.9, marginBottom: 0 }}>
                  {currentConsequence.actualHistory}
                </Paragraph>
              </Card>
            </Col>
          </Row>

          {currentConsequence.relatedPainters.length > 0 && (
            <>
              <Divider />
              <Title level={5} className="ink-title" style={{ color: '#5c4a33' }}>
                <TeamOutlined /> 相关人物
              </Title>
              <Space wrap style={{ marginBottom: 16 }}>
                {currentConsequence.relatedPainters.map((p, i) => (
                  <Tag key={i} color="blue">{p}</Tag>
                ))}
              </Space>
            </>
          )}

          {currentConsequence.relatedSchools.length > 0 && (
            <>
              <Title level={5} className="ink-title" style={{ color: '#5c4a33' }}>
                <AppstoreOutlined /> 相关画派
              </Title>
              <Space wrap>
                {currentConsequence.relatedSchools.map((s, i) => (
                  <Tag key={i} color="purple">{s}</Tag>
                ))}
              </Space>
            </>
          )}

          <div style={{ marginTop: 32, textAlign: 'center' }}>
            {currentConsequence.nextChoiceId ? (
              <Button
                type="primary"
                size="large"
                icon={<ArrowRightOutlined />}
                onClick={goToNextChoice}
                style={{ background: '#8b7355', borderColor: '#8b7355', paddingLeft: 48, paddingRight: 48 }}
              >
                进入下一次抉择
              </Button>
            ) : (
              <Button
                type="primary"
                size="large"
                icon={<TrophyOutlined />}
                onClick={goToNextChoice}
                style={{ background: '#c0392b', borderColor: '#c0392b', paddingLeft: 48, paddingRight: 48 }}
              >
                查看你的画史最终定位
              </Button>
            )}
          </div>
        </Card>

        <Modal
          title={<span style={{ color: '#5c4a33' }}><HistoryOutlined /> 你的选择路径</span>}
          open={consequenceModalVisible}
          onCancel={() => setConsequenceModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setConsequenceModalVisible(false)}>关闭</Button>
          ]}
          width={700}
        >
          <List
            dataSource={path}
            renderItem={(step, index) => {
              const scenario = currentScenario;
              if (!scenario) return null;
              const choice = scenario.choices.find(c => c.id === step.choiceId);
              const option = choice?.options.find(o => o.id === step.optionId);
              const consequence = scenario.consequences.find(c => c.id === step.consequenceId);
              return (
                <List.Item key={step.choiceId}>
                  <List.Item.Meta
                    avatar={<Avatar style={{ backgroundColor: '#8b7355' }}>{index + 1}</Avatar>}
                    title={<span style={{ color: '#5c4a33', fontWeight: 'bold' }}>{choice?.question}</span>}
                    description={
                      <div>
                        <Paragraph style={{ color: '#c0392b', margin: 0 }}>
                          你的选择：{option?.label}
                        </Paragraph>
                        {consequence && (
                          <Paragraph style={{ color: '#6b5b45', margin: '8px 0 0 0', fontSize: 13 }}>
                            🎯 {consequence.title}
                          </Paragraph>
                        )}
                      </div>
                    }
                  />
                </List.Item>
              );
            }}
          />
        </Modal>
      </div>
    );
  };

  const renderResult = () => {
    if (!currentScenario || !finalResult) return null;
    const { finalAssessment } = finalResult;

    return (
      <div>
        <Space style={{ marginBottom: 16 }}>
          <Button icon={<RollbackOutlined />} onClick={goBackToSelect}>返回场景选择</Button>
        </Space>

        <Result
          icon={<TrophyOutlined />}
          status="success"
          title={
            <div>
              <Tag color={RATING_COLORS[finalAssessment.overallRating]} style={{ fontSize: 16, padding: '4px 16px' }}>
                🏆 {RATING_LABELS[finalAssessment.overallRating]}
              </Tag>
            </div>
          }
          subTitle={
            <div style={{ marginTop: 16 }}>
              <Title level={3} className="ink-title" style={{ color: '#5c4a33' }}>
                {finalAssessment.styleLabel}
              </Title>
            </div>
          }
        />

        <Card className="card-shadow" style={{ borderRadius: 16, marginTop: 8 }}>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Card size="small" style={{ borderRadius: 12, textAlign: 'center', borderTop: '3px solid #c0392b' }}>
                <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>流派归属</Text>
                <Text strong style={{ color: '#c0392b', fontSize: 16 }}>
                  {finalAssessment.schoolAffinity}
                </Text>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card size="small" style={{ borderRadius: 12, textAlign: 'center', borderTop: '3px solid #2980b9' }}>
                <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>历史定位</Text>
                <Text strong style={{ color: '#2980b9', fontSize: 16 }}>
                  {finalAssessment.historicalPosition}
                </Text>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card size="small" style={{ borderRadius: 12, textAlign: 'center', borderTop: '3px solid #8e44ad' }}>
                <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>综合评级</Text>
                <Tag color={RATING_COLORS[finalAssessment.overallRating]} style={{ fontSize: 16, padding: '4px 16px' }}>
                  🏆 {RATING_LABELS[finalAssessment.overallRating]}
                </Tag>
              </Card>
            </Col>
          </Row>

          <Divider />

          <Title level={4} className="ink-title" style={{ color: '#5c4a33' }}>
            📜 画史总评
          </Title>
          <Paragraph
            style={{
              color: '#4a3f33',
              fontSize: 16,
              lineHeight: 2,
              background: '#faf6ed',
              padding: 24,
              borderRadius: 12,
              borderLeft: '4px solid #8b7355'
            }}
          >
            {finalAssessment.summary}
          </Paragraph>

          <Divider />

          <Title level={5} className="ink-title" style={{ color: '#5c4a33' }}>
            <HistoryOutlined /> 你的完整选择路径
          </Title>
          <Steps
            direction="vertical"
            size="small"
            current={path.length}
            items={path.map((step, index) => {
              const scenario = currentScenario;
              if (!scenario) return { title: '', description: '' };
              const choice = scenario.choices.find(c => c.id === step.choiceId);
              const option = choice?.options.find(o => o.id === step.optionId);
              const consequence = scenario.consequences.find(c => c.id === step.consequenceId);
              return {
                title: (
                  <span style={{ color: '#5c4a33', fontWeight: 'bold' }}>
                    {choice?.question}
                  </span>
                ),
                description: (
                  <div>
                    <Paragraph style={{ color: '#c0392b', margin: '4px 0' }}>
                      ▸ {option?.label}
                    </Paragraph>
                    <Paragraph style={{ color: '#6b5b45', fontSize: 13, margin: 0 }}>
                      🎯 {consequence?.title}
                    </Paragraph>
                  </div>
                ),
                status: 'finish'
              };
            })}
          />

          <div style={{ marginTop: 32, textAlign: 'center' }}>
            <Space>
              <Button
                size="large"
                icon={<HistoryOutlined />}
                onClick={() => {
                  if (currentScenario) {
                    startScenario(currentScenario.id);
                  }
                }}
                style={{ borderColor: '#8b7355', color: '#8b7355' }}
              >
                重新选择此场景
              </Button>
              <Button
                type="primary"
                size="large"
                icon={<HomeOutlined />}
                onClick={restart}
                style={{ background: '#8b7355', borderColor: '#8b7355' }}
              >
                返回场景列表
              </Button>
            </Space>
          </div>
        </Card>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 100 }}>
          <Spin size="large" tip="加载中..." />
        </div>
      );
    }
    switch (stage) {
      case 'select': return renderSelect();
      case 'intro': return renderIntro();
      case 'choice': return renderChoice();
      case 'consequence': return renderConsequence();
      case 'result': return renderResult();
      default: return renderSelect();
    }
  };

  return (
    <div>
      {stage !== 'select' && (
        <Breadcrumb style={{ marginBottom: 16 }}>
          <Breadcrumb.Item>
            <a onClick={goBackToSelect} style={{ color: '#8b7355' }}>画史推演</a>
          </Breadcrumb.Item>
          {currentScenario && (
            <Breadcrumb.Item>
              <span style={{ color: '#5c4a33' }}>
                {SCENARIO_ICONS[currentScenario.id]} {currentScenario.title}
              </span>
            </Breadcrumb.Item>
          )}
        </Breadcrumb>
      )}
      {renderContent()}
    </div>
  );
}

export default RoleplayPage;
