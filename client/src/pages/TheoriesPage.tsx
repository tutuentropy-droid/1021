import { useState, useEffect } from 'react';
import {
  Card, Typography, Spin, Row, Col, Tag, Collapse, Descriptions,
  Empty, Divider, Avatar
} from 'antd';
import {
  BookOutlined,
  MessageOutlined,
  BulbOutlined
} from '@ant-design/icons';
import type { Theory, Dynasty } from '../types';
import { knowledgeApi } from '../api';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

function TheoriesPage() {
  const [theories, setTheories] = useState<Theory[]>([]);
  const [dynasties, setDynasties] = useState<Dynasty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      knowledgeApi.getTheories(),
      knowledgeApi.getDynasties()
    ]).then(([theoriesData, dynastiesData]) => {
      setTheories(theoriesData);
      setDynasties(dynastiesData);
      setLoading(false);
    });
  }, []);

  const getDynastyName = (dynastyId: string) => {
    return dynasties.find(d => d.id === dynastyId)?.name || '';
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 100 }}>
        <Spin size="large" tip="加载画论中..." />
      </div>
    );
  }

  if (theories.length === 0) {
    return <Empty description="暂无画论数据" />;
  }

  return (
    <div>
      <Title level={2} className="ink-title" style={{ color: '#5c4a33', marginBottom: 8 }}>
        📚 画论典籍
      </Title>
      <Paragraph style={{ color: '#8b7355', marginBottom: 24 }}>
        从谢赫六法到石涛"一画论"，读懂中国传统绘画的美学智慧
      </Paragraph>

      <Row gutter={[16, 16]}>
        {theories.map(theory => (
          <Col xs={24} lg={12} key={theory.id}>
            <Card
              className="card-shadow"
              style={{
                borderRadius: 16,
                height: '100%',
                borderLeft: '4px solid #8b7355'
              }}
              bodyStyle={{ padding: 24 }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 16 }}>
                <Avatar
                  size={48}
                  style={{
                    backgroundColor: '#8b7355',
                    marginRight: 16,
                    flexShrink: 0
                  }}
                  icon={<BookOutlined />}
                />
                <div style={{ flex: 1 }}>
                  <Tag color="#c0392b" style={{ marginBottom: 8 }}>
                    {getDynastyName(theory.dynastyId)}
                  </Tag>
                  <Title level={4} className="ink-title" style={{ color: '#5c4a33', margin: '4px 0' }}>
                    {theory.title}
                  </Title>
                  <Text type="secondary" style={{ color: '#8b7355' }}>
                    <MessageOutlined /> {theory.authorName}
                  </Text>
                </div>
              </div>

              <Divider style={{ margin: '16px 0' }} />

              <Title level={5} className="ink-title" style={{ color: '#5c4a33', marginTop: 0 }}>
                <BulbOutlined /> 核心思想
              </Title>
              <Paragraph style={{ color: '#6b5b45', marginBottom: 16 }}>
                {theory.summary}
              </Paragraph>

              <Collapse
                ghost
                bordered={false}
                style={{ padding: 0 }}
                items={[
                  {
                    key: '1',
                    label: <span style={{ color: '#8b7355', fontWeight: 500 }}>📖 经典名句与解读（{theory.quotes.length}条）</span>,
                    children: (
                      <div style={{ padding: '8px 0' }}>
                        {theory.quotes.map((quote, index) => (
                          <div
                            key={index}
                            style={{
                              padding: 16,
                              background: '#fdf6e3',
                              borderRadius: 8,
                              marginBottom: index < theory.quotes.length - 1 ? 12 : 0
                            }}
                          >
                            <div
                              className="ink-title"
                              style={{
                                color: '#5c4a33',
                                fontSize: 15,
                                marginBottom: 8,
                                paddingBottom: 8,
                                borderBottom: '1px dashed #d4c4a8',
                                fontStyle: 'italic'
                              }}
                            >
                              "{quote.text}"
                            </div>
                            <Text style={{ color: '#6b5b45', fontSize: 13, lineHeight: 1.8 }}>
                              {quote.explanation}
                            </Text>
                          </div>
                        ))}
                      </div>
                    )
                  }
                ]}
              />

              <Divider style={{ margin: '16px 0' }} />

              <Title level={5} className="ink-title" style={{ color: '#5c4a33' }}>
                🌟 历史影响
              </Title>
              <Paragraph style={{ color: '#6b5b45', marginBottom: 0 }}>
                {theory.influence}
              </Paragraph>
            </Card>
          </Col>
        ))}
      </Row>

      <div
        style={{
          marginTop: 32,
          padding: 24,
          background: 'linear-gradient(135deg, #5c4a33 0%, #8b7355 100%)',
          borderRadius: 16,
          color: '#fdfbf7'
        }}
      >
        <Title level={4} className="ink-title" style={{ color: '#fdfbf7', marginTop: 0 }}>
          📖 画论学习建议
        </Title>
        <Paragraph style={{ color: '#d4c4a8', marginBottom: 8 }}>
          中国古代画论是中华文化的瑰宝，建议按以下顺序学习：
        </Paragraph>
        <ol style={{ paddingLeft: 20, color: '#e8dcc8', lineHeight: 2 }}>
          <li><strong>谢赫《画品》六法论</strong> —— 入门必读，理解中国画的品评标准</li>
          <li><strong>荆浩《笔法记》</strong> —— 山水画理论的奠基之作</li>
          <li><strong>郭熙《林泉高致》</strong> —— 宋代山水画创作经验的总结</li>
          <li><strong>苏轼文人画论</strong> —— 理解文人画"重意轻形"的美学追求</li>
          <li><strong>董其昌"南北宗论"</strong> —— 了解影响画坛三百年的流派理论</li>
          <li><strong>石涛《苦瓜和尚画语录》</strong> —— 最具革新精神的画论经典</li>
        </ol>
      </div>
    </div>
  );
}

export default TheoriesPage;
