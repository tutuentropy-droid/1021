import { useState, useEffect } from 'react';
import { Card, Typography, Spin, Button, Row, Col, Tag, Progress, Select, Space } from 'antd';
import {
  ReloadOutlined,
  LeftOutlined,
  RightOutlined,
  SwapOutlined,
  CheckOutlined,
  EyeOutlined
} from '@ant-design/icons';
import type { Flashcard } from '../types';
import { knowledgeApi } from '../api';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const TYPE_LABELS: Record<string, string> = {
  painter: '画家',
  painting: '画作',
  school: '画派',
  dynasty: '朝代',
  theory: '画论'
};

const TYPE_COLORS: Record<string, string> = {
  painter: '#8b7355',
  painting: '#c0392b',
  school: '#27ae60',
  dynasty: '#2980b9',
  theory: '#8e44ad'
};

function FlashcardsPage() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCount, setKnownCount] = useState(0);
  const [filterType, setFilterType] = useState<string | undefined>(undefined);

  useEffect(() => {
    loadCards();
  }, [filterType]);

  const loadCards = () => {
    setLoading(true);
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownCount(0);
    knowledgeApi.getFlashcards(filterType ? { type: filterType } : {})
      .then(data => setFlashcards(data))
      .finally(() => setLoading(false));
  };

  const shuffleCards = () => {
    setLoading(true);
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownCount(0);
    knowledgeApi.getFlashcards(filterType ? { type: filterType, random: true } : { random: true })
      .then(data => setFlashcards(data))
      .finally(() => setLoading(false));
  };

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex(i => (i + 1) % flashcards.length);
    }, 100);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex(i => (i - 1 + flashcards.length) % flashcards.length);
    }, 100);
  };

  const handleKnown = () => {
    setKnownCount(c => c + 1);
    handleNext();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 100 }}>
        <Spin size="large" tip="加载抽认卡中..." />
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>📭</div>
        <Text type="secondary">暂无抽认卡</Text>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  return (
    <div>
      <Title level={2} className="ink-title" style={{ color: '#5c4a33', marginBottom: 8 }}>
        📇 知识抽认卡
      </Title>
      <Paragraph style={{ color: '#8b7355', marginBottom: 24 }}>
        点击卡片翻转查看答案，用间隔重复法巩固记忆
      </Paragraph>

      <Card className="card-shadow" style={{ borderRadius: 16, marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12}>
            <Space>
              <Text strong style={{ color: '#5c4a33' }}>卡片类型：</Text>
              <Select
                placeholder="全部类型"
                style={{ width: 140 }}
                allowClear
                value={filterType}
                onChange={(value) => setFilterType(value || undefined)}
              >
                {Object.entries(TYPE_LABELS).map(([key, label]) => (
                  <Option key={key} value={key}>{label}卡</Option>
                ))}
              </Select>
            </Space>
          </Col>
          <Col xs={24} md={12} style={{ textAlign: 'right' }}>
            <Space>
              <Button icon={<SwapOutlined />} onClick={shuffleCards}>随机打乱</Button>
              <Button icon={<ReloadOutlined />} onClick={loadCards}>重新开始</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={16}>
          <div className="flashcard-container">
            <div
              className={`flashcard ${isFlipped ? 'flipped' : ''}`}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div className="flashcard-face flashcard-front">
                <Tag
                  color={TYPE_COLORS[currentCard.type]}
                  style={{ position: 'absolute', top: 20, left: 20 }}
                >
                  {TYPE_LABELS[currentCard.type]}卡
                </Tag>
                <div style={{ fontSize: 40, marginBottom: 24 }}>❓</div>
                <Title level={4} className="ink-title" style={{ color: '#5c4a33', lineHeight: 1.6 }}>
                  {currentCard.front}
                </Title>
                <Text type="secondary" style={{ position: 'absolute', bottom: 20 }}>
                  <EyeOutlined /> 点击卡片查看答案
                </Text>
              </div>
              <div className="flashcard-face flashcard-back">
                <div style={{ fontSize: 40, marginBottom: 24 }}>💡</div>
                <Paragraph
                  style={{
                    color: '#fdfbf7',
                    fontSize: 16,
                    lineHeight: 1.8,
                    whiteSpace: 'pre-wrap',
                    textAlign: 'left'
                  }}
                >
                  {currentCard.back}
                </Paragraph>
                <Text style={{ position: 'absolute', bottom: 20, color: '#d4c4a8' }}>
                  点击卡片返回正面
                </Text>
              </div>
            </div>
          </div>
        </Col>

        <Col xs={24} md={8}>
          <Card className="card-shadow" style={{ borderRadius: 16 }}>
            <Title level={5} className="ink-title" style={{ color: '#5c4a33', marginTop: 0 }}>
              学习进度
            </Title>

            <Progress
              type="circle"
              percent={Math.round(progress)}
              format={() => `${currentIndex + 1} / ${flashcards.length}`}
              strokeColor="#8b7355"
              style={{ margin: '16px auto', display: 'block' }}
            />

            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Tag color="#27ae60" style={{ fontSize: 14, padding: '4px 12px' }}>
                ✅ 已掌握：{knownCount}
              </Tag>
            </div>

            <Space direction="vertical" style={{ width: '100%' }}>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={handleKnown}
                size="large"
                style={{ width: '100%', marginBottom: 8 }}
              >
                我记住了，下一张
              </Button>
              <Row gutter={8}>
                <Col span={12}>
                  <Button
                    icon={<LeftOutlined />}
                    onClick={handlePrev}
                    size="large"
                    style={{ width: '100%' }}
                  >
                    上一张
                  </Button>
                </Col>
                <Col span={12}>
                  <Button
                    icon={<RightOutlined />}
                    onClick={handleNext}
                    size="large"
                    style={{ width: '100%' }}
                  >
                    下一张
                  </Button>
                </Col>
              </Row>
            </Space>
          </Card>

          <Card
            className="card-shadow"
            style={{ borderRadius: 16, marginTop: 16 }}
            size="small"
          >
            <Text type="secondary" style={{ fontSize: 12 }}>
              💡 <strong>间隔重复法：</strong>研究表明，将记忆分散到不同时间段复习，比集中学习更有效。
              标记"已掌握"的卡片将在适当时间再次出现，帮助你将知识转化为长期记忆。
            </Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default FlashcardsPage;
