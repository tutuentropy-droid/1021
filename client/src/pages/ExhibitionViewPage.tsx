import { useState, useEffect } from 'react';
import {
  Row, Col, Card, Typography, Spin, Button, Space, Tag, Modal,
  Descriptions, Divider, Breadcrumb, Empty, Avatar, Tooltip, Affix
} from 'antd';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  HomeOutlined,
  ShareAltOutlined,
  PictureOutlined,
  UserOutlined,
  CalendarOutlined,
  EyeOutlined,
  InfoCircleOutlined,
  MenuOutlined
} from '@ant-design/icons';
import type { Exhibition, Painting, Dynasty, Painter } from '../types';
import { knowledgeApi } from '../api';

const { Title, Paragraph, Text } = Typography;

interface ExhibitionViewPageProps {
  exhibitionId?: string;
  shareCode?: string;
  onNavigate: (page: string) => void;
}

function ExhibitionViewPage({ exhibitionId, shareCode, onNavigate }: ExhibitionViewPageProps) {
  const [exhibition, setExhibition] = useState<Exhibition | null>(null);
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [dynasties, setDynasties] = useState<Dynasty[]>([]);
  const [painters, setPainters] = useState<Painter[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [paintingModalVisible, setPaintingModalVisible] = useState(false);
  const [selectedPainting, setSelectedPainting] = useState<Painting | null>(null);
  const [showToc, setShowToc] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);

  useEffect(() => {
    Promise.all([
      knowledgeApi.getPaintings(),
      knowledgeApi.getDynasties(),
      knowledgeApi.getPainters()
    ]).then(([paintingsData, dynastiesData, paintersData]) => {
      setPaintings(paintingsData);
      setDynasties(dynastiesData);
      setPainters(paintersData);
    });
  }, []);

  useEffect(() => {
    loadExhibition();
  }, [exhibitionId, shareCode]);

  const loadExhibition = async () => {
    setLoading(true);
    try {
      let data: Exhibition | null = null;
      if (shareCode) {
        data = await knowledgeApi.getExhibitionByShareCode(shareCode);
      } else if (exhibitionId) {
        data = await knowledgeApi.getExhibition(exhibitionId);
      }
      setExhibition(data);
    } catch (e) {
      console.error(e);
      setExhibition(null);
    } finally {
      setLoading(false);
    }
  };

  const getPainting = (paintingId: string) => {
    return paintings.find(p => p.id === paintingId);
  };

  const getPainterName = (painterId: string) => {
    return painters.find(p => p.id === painterId)?.name || '佚名';
  };

  const getDynastyName = (dynastyId: string) => {
    return dynasties.find(d => d.id === dynastyId)?.name || '';
  };

  const getCoverImage = () => {
    if (!exhibition) return '';
    if (exhibition.coverPaintingId) {
      const painting = getPainting(exhibition.coverPaintingId);
      if (painting) return painting.imageUrl;
    }
    for (const section of exhibition.sections) {
      for (const item of section.items) {
        const painting = getPainting(item.paintingId);
        if (painting) return painting.imageUrl;
      }
    }
    return '';
  };

  const getTotalArtworkCount = () => {
    if (!exhibition) return 0;
    return exhibition.sections.reduce((sum, section) => sum + section.items.length, 0);
  };

  const getCurrentItem = () => {
    if (!exhibition || !exhibition.sections[currentSectionIndex]) return null;
    const section = exhibition.sections[currentSectionIndex];
    return section.items[currentItemIndex] || null;
  };

  const getCurrentPainting = () => {
    const item = getCurrentItem();
    if (!item) return null;
    return getPainting(item.paintingId);
  };

  const goToPrevious = () => {
    if (!exhibition) return;
    const section = exhibition.sections[currentSectionIndex];
    if (currentItemIndex > 0) {
      setCurrentItemIndex(currentItemIndex - 1);
    } else if (currentSectionIndex > 0) {
      const prevSection = exhibition.sections[currentSectionIndex - 1];
      setCurrentSectionIndex(currentSectionIndex - 1);
      setCurrentItemIndex(prevSection.items.length - 1);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToNext = () => {
    if (!exhibition) return;
    const section = exhibition.sections[currentSectionIndex];
    if (currentItemIndex < section.items.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
    } else if (currentSectionIndex < exhibition.sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentItemIndex(0);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToItem = (sectionIdx: number, itemIdx: number) => {
    setCurrentSectionIndex(sectionIdx);
    setCurrentItemIndex(itemIdx);
    setShowToc(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openPaintingDetail = (painting: Painting) => {
    setSelectedPainting(painting);
    setPaintingModalVisible(true);
  };

  const copyShareLink = () => {
    if (!exhibition) return;
    const link = `${window.location.origin}/exhibition/share/${exhibition.shareCode}`;
    navigator.clipboard.writeText(link).then(() => {
      Modal.success({
        title: '分享链接已复制',
        content: '您可以将链接分享给好友，让他们也能参观这个展览。',
        icon: <ShareAltOutlined style={{ color: '#52c41a' }} />
      });
    });
  };

  const hasPrevious = () => {
    if (!exhibition) return false;
    return currentSectionIndex > 0 || currentItemIndex > 0;
  };

  const hasNext = () => {
    if (!exhibition) return false;
    const section = exhibition.sections[currentSectionIndex];
    return currentItemIndex < section.items.length - 1 || currentSectionIndex < exhibition.sections.length - 1;
  };

  const getCurrentIndex = () => {
    if (!exhibition) return 0;
    let count = 0;
    for (let i = 0; i < currentSectionIndex; i++) {
      count += exhibition.sections[i].items.length;
    }
    return count + currentItemIndex + 1;
  };

  const renderCover = () => {
    const coverImage = getCoverImage();
    return (
      <div
        style={{
          position: 'relative',
          height: 400,
          borderRadius: 16,
          overflow: 'hidden',
          marginBottom: 24,
          background: coverImage ? `url(${coverImage}) center/cover no-repeat` : 'linear-gradient(135deg, #8b7355 0%, #5c4a33 100%)',
          boxShadow: '0 8px 32px rgba(139,115,85,0.3)'
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(92,74,51,0.95) 0%, rgba(92,74,51,0.6) 50%, rgba(92,74,51,0.3) 100%)'
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '40px 48px',
            color: '#fdfbf7'
          }}
        >
          <Space style={{ marginBottom: 12 }}>
            <Tag color="#c0392b" style={{ fontSize: 14, padding: '4px 12px' }}>
              🎨 虚拟展览
            </Tag>
            {exhibition?.isPublished && (
              <Tag color="#52c41a" style={{ fontSize: 14, padding: '4px 12px' }}>
                已发布
              </Tag>
            )}
            {exhibition?.theme && (
              <Tag color="#8b7355" style={{ fontSize: 14, padding: '4px 12px' }}>
                {exhibition.theme}
              </Tag>
            )}
          </Space>
          <Title level={1} className="ink-title" style={{ color: '#fdfbf7', margin: '8px 0', fontSize: 42 }}>
            {exhibition?.title || '虚拟展览'}
          </Title>
          <Space size={24} style={{ marginTop: 16 }}>
            <Text style={{ color: '#d4c4a8', fontSize: 16 }}>
              <UserOutlined style={{ marginRight: 8 }} />
              策展人：{exhibition?.curatorName || '佚名'}
            </Text>
            <Text style={{ color: '#d4c4a8', fontSize: 16 }}>
              <PictureOutlined style={{ marginRight: 8 }} />
              {getTotalArtworkCount()} 幅作品
            </Text>
            <Text style={{ color: '#d4c4a8', fontSize: 16 }}>
              <CalendarOutlined style={{ marginRight: 8 }} />
              {exhibition?.createdAt ? new Date(exhibition.createdAt).toLocaleDateString('zh-CN') : ''}
            </Text>
            {exhibition?.viewCount !== undefined && (
              <Text style={{ color: '#d4c4a8', fontSize: 16 }}>
                <EyeOutlined style={{ marginRight: 8 }} />
                {exhibition.viewCount} 次浏览
              </Text>
            )}
          </Space>
        </div>
      </div>
    );
  };

  const renderIntroduction = () => {
    if (!exhibition?.introduction) return null;
    return (
      <Card className="card-shadow" style={{ borderRadius: 16, marginBottom: 24 }}>
        <Title level={3} className="ink-title" style={{ color: '#5c4a33', marginTop: 0 }}>
          📜 展览导言
        </Title>
        <Paragraph style={{ color: '#4a3f33', fontSize: 16, lineHeight: 2 }}>
          {exhibition.introduction}
        </Paragraph>
        {exhibition.curatorNote && (
          <>
            <Divider />
            <div style={{ background: '#faf6ee', padding: '20px 24px', borderRadius: 12, borderLeft: '4px solid #8b7355' }}>
              <Title level={5} className="ink-title" style={{ color: '#5c4a33', marginTop: 0 }}>
                💬 策展人语
              </Title>
              <Paragraph style={{ color: '#6b5b45', fontSize: 15, lineHeight: 1.9, marginBottom: 0, fontStyle: 'italic' }}>
                "{exhibition.curatorNote}"
              </Paragraph>
            </div>
          </>
        )}
      </Card>
    );
  };

  const renderSectionHeader = () => {
    if (!exhibition) return null;
    const section = exhibition.sections[currentSectionIndex];
    if (!section) return null;

    return (
      <Card className="card-shadow" style={{ borderRadius: 16, marginBottom: 24 }}>
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <Tag color="#c0392b" style={{ fontSize: 13, marginBottom: 8 }}>
            第 {currentSectionIndex + 1} 单元 / 共 {exhibition.sections.length} 单元
          </Tag>
          <Title level={2} className="ink-title" style={{ color: '#5c4a33', margin: '8px 0' }}>
            {section.title}
          </Title>
          {section.description && (
            <Paragraph style={{ color: '#8b7355', fontSize: 15, marginTop: 8, marginBottom: 0 }}>
              {section.description}
            </Paragraph>
          )}
        </div>
      </Card>
    );
  };

  const renderArtwork = () => {
    const item = getCurrentItem();
    const painting = getCurrentPainting();
    if (!item || !painting) return null;

    return (
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <Card
            className="card-shadow"
            style={{ borderRadius: 16, cursor: 'pointer' }}
            onClick={() => openPaintingDetail(painting)}
            cover={
              <div style={{ position: 'relative' }}>
                <img
                  src={painting.imageUrl}
                  alt={painting.title}
                  referrerPolicy="no-referrer"
                  style={{
                    width: '100%',
                    maxHeight: 500,
                    objectFit: 'contain',
                    backgroundColor: '#f8f5ee',
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16
                  }}
                />
                <Tooltip title="点击查看大图">
                  <div
                    style={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      background: 'rgba(92,74,51,0.8)',
                      color: '#fdfbf7',
                      padding: '8px 16px',
                      borderRadius: 20,
                      fontSize: 13
                    }}
                  >
                    <EyeOutlined style={{ marginRight: 6 }} />
                    查看大图
                  </div>
                </Tooltip>
              </div>
            }
          >
            <Descriptions column={2} size="small">
              <Descriptions.Item label="朝代">{getDynastyName(painting.dynastyId)}</Descriptions.Item>
              <Descriptions.Item label="作者">{getPainterName(painting.painterId)}</Descriptions.Item>
              <Descriptions.Item label="创作年代">{painting.year || '不详'}</Descriptions.Item>
              <Descriptions.Item label="题材">{painting.theme}</Descriptions.Item>
              <Descriptions.Item label="形制">{painting.format}</Descriptions.Item>
              <Descriptions.Item label="收藏地">{painting.collection}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card className="card-shadow" style={{ borderRadius: 16, height: '100%' }}>
            <div style={{ marginBottom: 16 }}>
              <Tag color="#8b7355" style={{ fontSize: 12, marginBottom: 8 }}>
                作品 {getCurrentIndex()} / {getTotalArtworkCount()}
              </Tag>
              <Title level={3} className="ink-title" style={{ color: '#5c4a33', margin: '8px 0' }}>
                {painting.title}
              </Title>
            </div>

            <Divider />

            {item.label && (
              <div style={{ marginBottom: 24 }}>
                <Title level={5} className="ink-title" style={{ color: '#5c4a33' }}>
                  🏷️ 展签
                </Title>
                <Paragraph style={{ color: '#4a3f33', fontSize: 15, lineHeight: 1.9 }}>
                  {item.label}
                </Paragraph>
              </div>
            )}

            {item.narration && (
              <div>
                <Title level={5} className="ink-title" style={{ color: '#5c4a33' }}>
                  🎤 导览词
                </Title>
                <Paragraph style={{ color: '#6b5b45', fontSize: 15, lineHeight: 1.9 }}>
                  {item.narration}
                </Paragraph>
              </div>
            )}

            {!item.label && !item.narration && (
              <Empty description="暂无展签和导览词" />
            )}
          </Card>
        </Col>
      </Row>
    );
  };

  const renderNavigation = () => {
    if (!exhibition || exhibition.sections.length === 0) return null;

    return (
      <Affix offsetBottom={24}>
        <Card
          className="card-shadow"
          style={{
            borderRadius: 16,
            backdropFilter: 'blur(10px)',
            background: 'rgba(253,251,247,0.95)'
          }}
        >
          <Row align="middle" gutter={[16, 16]}>
            <Col xs={12} md={4}>
              <Button
                block
                icon={<MenuOutlined />}
                onClick={() => setShowToc(true)}
                style={{ borderColor: '#8b7355', color: '#8b7355' }}
              >
                展览目录
              </Button>
            </Col>
            <Col xs={12} md={4}>
              <Button
                block
                icon={<ShareAltOutlined />}
                onClick={() => setShareModalVisible(true)}
                style={{ borderColor: '#8b7355', color: '#8b7355' }}
              >
                分享展览
              </Button>
            </Col>
            <Col xs={24} md={16}>
              <Row gutter={[16, 16]} align="middle">
                <Col flex={1}>
                  <Button
                    block
                    icon={<ArrowLeftOutlined />}
                    onClick={goToPrevious}
                    disabled={!hasPrevious()}
                    size="large"
                    style={{ borderColor: '#8b7355', color: '#8b7355' }}
                  >
                    上一件
                  </Button>
                </Col>
                <Col flex="auto" style={{ textAlign: 'center' }}>
                  <Text strong style={{ color: '#5c4a33', fontSize: 16 }}>
                    {getCurrentIndex()} / {getTotalArtworkCount()}
                  </Text>
                </Col>
                <Col flex={1}>
                  <Button
                    block
                    type="primary"
                    icon={<ArrowRightOutlined />}
                    onClick={goToNext}
                    disabled={!hasNext()}
                    size="large"
                    style={{ background: '#8b7355', borderColor: '#8b7355' }}
                  >
                    {currentSectionIndex === exhibition.sections.length - 1 &&
                     currentItemIndex === exhibition.sections[currentSectionIndex].items.length - 1
                      ? '进入结语'
                      : '下一件'}
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      </Affix>
    );
  };

  const renderConclusion = () => {
    if (!exhibition?.conclusion) return null;

    const isLastItem = () => {
      if (!exhibition) return false;
      const section = exhibition.sections[currentSectionIndex];
      return currentSectionIndex === exhibition.sections.length - 1 &&
             currentItemIndex === section.items.length - 1;
    };

    if (!isLastItem()) return null;

    return (
      <Card className="card-shadow" style={{ borderRadius: 16, marginTop: 32, marginBottom: 100 }}>
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <Tag color="#52c41a" style={{ fontSize: 14, padding: '4px 12px', marginBottom: 16 }}>
            🎉 展览结束
          </Tag>
          <Title level={2} className="ink-title" style={{ color: '#5c4a33', margin: '8px 0' }}>
            结语
          </Title>
        </div>
        <Divider />
        <Paragraph style={{ color: '#4a3f33', fontSize: 16, lineHeight: 2, padding: '0 24px' }}>
          {exhibition.conclusion}
        </Paragraph>
        <Divider />
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Space size={16}>
            <Button
              size="large"
              icon={<HomeOutlined />}
              onClick={() => onNavigate('curator')}
              style={{ borderColor: '#8b7355', color: '#8b7355' }}
            >
              返回策展中心
            </Button>
            <Button
              size="large"
              type="primary"
              icon={<ShareAltOutlined />}
              onClick={() => setShareModalVisible(true)}
              style={{ background: '#8b7355', borderColor: '#8b7355' }}
            >
              分享给好友
            </Button>
          </Space>
        </div>
      </Card>
    );
  };

  const renderTocModal = () => {
    if (!exhibition) return null;

    return (
      <Modal
        title={
          <span>
            <InfoCircleOutlined style={{ color: '#8b7355', marginRight: 8 }} />
            展览目录
          </span>
        }
        open={showToc}
        onCancel={() => setShowToc(false)}
        footer={null}
        width={700}
      >
        {exhibition.sections.map((section, sectionIdx) => (
          <div key={section.id} style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
              <Tag color="#c0392b" style={{ fontSize: 12, marginRight: 8 }}>
                第 {sectionIdx + 1} 单元
              </Tag>
              <Title level={4} className="ink-title" style={{ color: '#5c4a33', margin: 0, flex: 1 }}>
                {section.title}
              </Title>
            </div>
            {section.description && (
              <Paragraph style={{ color: '#8b7355', fontSize: 13, marginLeft: 36, marginBottom: 12 }}>
                {section.description}
              </Paragraph>
            )}
            <div style={{ marginLeft: 36 }}>
              {section.items.map((item, itemIdx) => {
                const painting = getPainting(item.paintingId);
                const isActive = sectionIdx === currentSectionIndex && itemIdx === currentItemIndex;
                return (
                  <div
                    key={item.paintingId}
                    onClick={() => goToItem(sectionIdx, itemIdx)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '10px 12px',
                      borderRadius: 8,
                      marginBottom: 4,
                      cursor: 'pointer',
                      background: isActive ? 'rgba(139,115,85,0.1)' : 'transparent',
                      border: isActive ? '1px solid #8b7355' : '1px solid transparent',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Avatar
                      size={36}
                      src={painting?.imageUrl}
                      style={{ marginRight: 12 }}
                    />
                    <div style={{ flex: 1 }}>
                      <Text strong style={{ color: isActive ? '#8b7355' : '#5c4a33' }}>
                        {painting?.title || '未知作品'}
                      </Text>
                      <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>
                        {painting ? `${getDynastyName(painting.dynastyId)} · ${getPainterName(painting.painterId)}` : ''}
                      </Text>
                    </div>
                    {isActive && (
                      <Tag color="#8b7355" style={{ fontSize: 11 }}>当前</Tag>
                    )}
                  </div>
                );
              })}
            </div>
            {sectionIdx < exhibition.sections.length - 1 && <Divider style={{ margin: '24px 0' }} />}
          </div>
        ))}
      </Modal>
    );
  };

  const renderShareModal = () => {
    return (
      <Modal
        title={
          <span>
            <ShareAltOutlined style={{ color: '#8b7355', marginRight: 8 }} />
            分享展览
          </span>
        }
        open={shareModalVisible}
        onCancel={() => setShareModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setShareModalVisible(false)}>
            关闭
          </Button>,
          <Button
            key="copy"
            type="primary"
            icon={<ShareAltOutlined />}
            onClick={copyShareLink}
            style={{ background: '#8b7355', borderColor: '#8b7355' }}
          >
            复制链接
          </Button>
        ]}
        width={600}
      >
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎨</div>
          <Title level={3} className="ink-title" style={{ color: '#5c4a33', margin: '8px 0' }}>
            {exhibition?.title}
          </Title>
          <Text style={{ color: '#8b7355', fontSize: 15 }}>
            策展人：{exhibition?.curatorName || '佚名'}
          </Text>
        </div>
        <Divider />
        <div style={{ background: '#faf6ee', padding: '20px 24px', borderRadius: 12 }}>
          <Text strong style={{ color: '#5c4a33', display: 'block', marginBottom: 8 }}>
            分享链接：
          </Text>
          <div
            style={{
              background: '#fff',
              padding: '12px 16px',
              borderRadius: 8,
              border: '1px dashed #d4c4a8',
              fontFamily: 'monospace',
              fontSize: 13,
              color: '#6b5b45',
              wordBreak: 'break-all'
            }}
          >
            {exhibition?.shareCode
              ? `${window.location.origin}/exhibition/share/${exhibition.shareCode}`
              : '展览尚未发布，无法分享'}
          </div>
        </div>
      </Modal>
    );
  };

  const renderPaintingModal = () => {
    if (!selectedPainting) return null;

    return (
      <Modal
        open={paintingModalVisible}
        onCancel={() => setPaintingModalVisible(false)}
        footer={null}
        width={1000}
        destroyOnClose
      >
        <div>
          <Breadcrumb style={{ marginBottom: 12 }}>
            <Breadcrumb.Item>🎨 画作欣赏</Breadcrumb.Item>
            <Breadcrumb.Item>{getDynastyName(selectedPainting.dynastyId)}</Breadcrumb.Item>
            <Breadcrumb.Item>{selectedPainting.title}</Breadcrumb.Item>
          </Breadcrumb>

          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <img
              src={selectedPainting.imageUrl}
              alt={selectedPainting.title}
              referrerPolicy="no-referrer"
              style={{
                width: '100%',
                maxHeight: 500,
                objectFit: 'contain',
                borderRadius: 12,
                backgroundColor: '#f8f5ee',
                boxShadow: '0 4px 20px rgba(139,115,85,0.2)'
              }}
            />
          </div>

          <Title level={2} className="ink-title" style={{ color: '#5c4a33', marginTop: 0, textAlign: 'center' }}>
            {selectedPainting.title}
          </Title>

          <Descriptions column={2} size="small" style={{ marginBottom: 16 }}>
            <Descriptions.Item label="朝代">{getDynastyName(selectedPainting.dynastyId)}</Descriptions.Item>
            <Descriptions.Item label="作者">{getPainterName(selectedPainting.painterId)}</Descriptions.Item>
            <Descriptions.Item label="创作年代">{selectedPainting.year || '不详'}</Descriptions.Item>
            <Descriptions.Item label="题材">{selectedPainting.theme}</Descriptions.Item>
            <Descriptions.Item label="形制">{selectedPainting.format}</Descriptions.Item>
            <Descriptions.Item label="尺寸">{selectedPainting.dimensions || '不详'}</Descriptions.Item>
            <Descriptions.Item label="收藏地" span={2}>{selectedPainting.collection}</Descriptions.Item>
          </Descriptions>

          <Divider />

          <Title level={5} className="ink-title" style={{ color: '#5c4a33' }}>
            📖 作品赏析
          </Title>
          <Paragraph style={{ color: '#4a3f33', fontSize: 15, lineHeight: 2 }}>
            {selectedPainting.analysis.overallImpression}
          </Paragraph>

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Button type="primary" icon={<PictureOutlined />} onClick={() => setPaintingModalVisible(false)}
              style={{ background: '#8b7355', borderColor: '#8b7355' }}>
              关闭
            </Button>
          </div>
        </div>
      </Modal>
    );
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 100 }}>
        <Spin size="large" tip="加载展览中..." />
      </div>
    );
  }

  if (!exhibition) {
    return (
      <div style={{ padding: 100, textAlign: 'center' }}>
        <Empty
          description="展览不存在或已被删除"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
        <Button
          type="primary"
          icon={<HomeOutlined />}
          onClick={() => onNavigate('curator')}
          style={{ marginTop: 16, background: '#8b7355', borderColor: '#8b7355' }}
        >
          返回策展中心
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item onClick={() => onNavigate('home')}>
          <span style={{ cursor: 'pointer' }}>首页</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item onClick={() => onNavigate('curator')}>
          <span style={{ cursor: 'pointer' }}>策展中心</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{exhibition.title}</Breadcrumb.Item>
      </Breadcrumb>

      {renderCover()}
      {renderIntroduction()}
      {renderSectionHeader()}
      {renderArtwork()}
      {renderConclusion()}
      {renderNavigation()}
      {renderTocModal()}
      {renderShareModal()}
      {renderPaintingModal()}

      <div style={{ height: 100 }} />
    </div>
  );
}

export default ExhibitionViewPage;
