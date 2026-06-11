import { useState, useEffect, useMemo } from 'react';
import {
  Card, Typography, Button, Space, Tag, Modal, Form, Input,
  Row, Col, Select, Empty, Spin, Alert, List, Drawer,
  Badge, Avatar, Tooltip, Divider, Steps, Switch,
  Popconfirm, message, InputNumber, App
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ShareAltOutlined,
  BulbOutlined,
  SaveOutlined,
  UploadOutlined,
  PictureOutlined,
  OrderedListOutlined,
  FileTextOutlined,
  TeamOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  UnorderedListOutlined,
  HistoryOutlined
} from '@ant-design/icons';
import type {
  Exhibition, ExhibitionSection, ExhibitionItem, Painting,
  ThemeSuggestion, AISuggestion, Dynasty, Painter, ExhibitionPreview
} from '../types';
import { knowledgeApi } from '../api';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { Step } = Steps;

const THEME_ICONS: Record<string, string> = {
  '山水': '🏔️',
  '花鸟': '🌿',
  '人物': '👥',
  '风俗人物': '🎭',
  '畜兽': '🐂',
  '人物故事': '📖'
};

const SUGGESTION_TYPE_LABELS: Record<AISuggestion['type'], string> = {
  theme: '主题建议',
  selection: '作品挑选',
  label: '展签撰写',
  narration: '导览逻辑',
  sequence: '展线顺序',
  'fact-check': '史实核对'
};

const SUGGESTION_SEVERITY_CONFIG = {
  info: { icon: <InfoCircleOutlined />, color: '#1890ff', bgColor: '#e6f7ff' },
  warning: { icon: <WarningOutlined />, color: '#faad14', bgColor: '#fffbe6' },
  error: { icon: <CloseCircleOutlined />, color: '#f5222d', bgColor: '#fff1f0' }
};

interface ExhibitionCuratorPageProps {
  onNavigate?: (page: string, id?: string, extra?: { shareCode?: string }) => void;
}

function ExhibitionCuratorPage({ onNavigate }: ExhibitionCuratorPageProps) {
  const { message } = App.useApp ? App.useApp() : { message: { success: () => {}, error: () => {}, warning: () => {} } };
  
  const [view, setView] = useState<'list' | 'curator' | 'themes'>('list');
  const [exhibitionList, setExhibitionList] = useState<ExhibitionPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [dynasties, setDynasties] = useState<Dynasty[]>([]);
  const [painters, setPainters] = useState<Painter[]>([]);
  const [themeSuggestions, setThemeSuggestions] = useState<ThemeSuggestion[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [theme, setTheme] = useState('');
  const [curatorName, setCuratorName] = useState('');
  const [curatorNote, setCuratorNote] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [conclusion, setConclusion] = useState('');
  const [sections, setSections] = useState<ExhibitionSection[]>([]);
  const [coverPaintingId, setCoverPaintingId] = useState<string | undefined>();
  
  const [paintingModalVisible, setPaintingModalVisible] = useState(false);
  const [currentSectionId, setCurrentSectionId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<{ sectionId: string; item: ExhibitionItem } | null>(null);
  
  const [suggestionsDrawerVisible, setSuggestionsDrawerVisible] = useState(false);

  useEffect(() => {
    Promise.all([
      knowledgeApi.getExhibitions(),
      knowledgeApi.getPaintings(),
      knowledgeApi.getDynasties(),
      knowledgeApi.getPainters(),
      knowledgeApi.getThemeSuggestions()
    ]).then(([list, paintingsData, dynastiesData, paintersData, themes]) => {
      setExhibitionList(list);
      setPaintings(paintingsData);
      setDynasties(dynastiesData);
      setPainters(paintersData);
      setThemeSuggestions(themes);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (view === 'curator' && sections.length > 0) {
      const timer = setTimeout(() => {
        fetchSuggestions();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [sections, title, introduction, view]);

  const fetchSuggestions = async () => {
    setSuggestionsLoading(true);
    try {
      const suggestions = await knowledgeApi.getAISuggestions(sections, title, introduction);
      setAiSuggestions(suggestions);
    } catch (e) {
      console.error(e);
    } finally {
      setSuggestionsLoading(false);
    }
  };

  const getPainterName = (painterId: string) => painters.find(p => p.id === painterId)?.name || '佚名';
  const getDynastyName = (dynastyId: string) => dynasties.find(d => d.id === dynastyId)?.name || '';

  const startNewExhibition = () => {
    setEditingId(null);
    setTitle('');
    setTheme('');
    setCuratorName('');
    setCuratorNote('');
    setIntroduction('');
    setConclusion('');
    setSections([]);
    setCoverPaintingId(undefined);
    setCurrentStep(0);
    setAiSuggestions([]);
    setView('curator');
  };

  const applyThemeSuggestion = (themeSuggestion: ThemeSuggestion) => {
    setTitle(themeSuggestion.title);
    setTheme(themeSuggestion.title);
    setCuratorNote(themeSuggestion.curatorialApproach);
    setIntroduction(themeSuggestion.description);
    setCoverPaintingId(themeSuggestion.relatedPaintingIds[0]);
    
    const newSections: ExhibitionSection[] = [
      {
        id: `section-${Date.now()}-1`,
        title: '主题探源',
        description: `从${themeSuggestion.keywords[0]}的概念起源谈起，追溯其在艺术史中的最初形态与文化内涵。`,
        items: themeSuggestion.relatedPaintingIds.slice(0, 2).map((pid, idx) => ({
          paintingId: pid,
          label: '',
          narration: '',
          displayOrder: idx
        })),
        displayOrder: 0
      },
      {
        id: `section-${Date.now()}-2`,
        title: '流变与发展',
        description: `探索${themeSuggestion.keywords[0]}主题在不同时代的演变轨迹，观察风格与内涵的微妙变化。`,
        items: themeSuggestion.relatedPaintingIds.slice(2, 4).map((pid, idx) => ({
          paintingId: pid,
          label: '',
          narration: '',
          displayOrder: idx
        })),
        displayOrder: 1
      }
    ];
    
    if (themeSuggestion.relatedPaintingIds.length > 4) {
      newSections.push({
        id: `section-${Date.now()}-3`,
        title: '当代回响',
        description: `观察${themeSuggestion.keywords[0]}主题在后世的延续与新变，思考其永恒的艺术价值。`,
        items: themeSuggestion.relatedPaintingIds.slice(4).map((pid, idx) => ({
          paintingId: pid,
          label: '',
          narration: '',
          displayOrder: idx
        })),
        displayOrder: 2
      });
    }
    
    setSections(newSections);
    setView('curator');
    setCurrentStep(2);
  };

  const addSection = () => {
    const newSection: ExhibitionSection = {
      id: `section-${Date.now()}`,
      title: '',
      description: '',
      items: [],
      displayOrder: sections.length
    };
    setSections([...sections, newSection]);
  };

  const updateSection = (sectionId: string, updates: Partial<ExhibitionSection>) => {
    setSections(sections.map(s => 
      s.id === sectionId ? { ...s, ...updates } : s
    ));
  };

  const removeSection = (sectionId: string) => {
    setSections(sections
      .filter(s => s.id !== sectionId)
      .map((s, idx) => ({ ...s, displayOrder: idx }))
    );
  };

  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    const index = sections.findIndex(s => s.id === sectionId);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sections.length - 1) return;
    
    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    newSections.forEach((s, idx) => { s.displayOrder = idx; });
    setSections(newSections);
  };

  const openPaintingSelector = (sectionId: string) => {
    setCurrentSectionId(sectionId);
    setPaintingModalVisible(true);
  };

  const addPaintingToSection = (paintingId: string) => {
    if (!currentSectionId) return;
    
    const section = sections.find(s => s.id === currentSectionId);
    if (!section) return;
    
    if (section.items.some(item => item.paintingId === paintingId)) {
      message.warning('该作品已在本单元中');
      return;
    }
    
    const newItem: ExhibitionItem = {
      paintingId,
      label: '',
      narration: '',
      displayOrder: section.items.length
    };
    
    setSections(sections.map(s => 
      s.id === currentSectionId 
        ? { ...s, items: [...s.items, newItem] }
        : s
    ));
    
    setPaintingModalVisible(false);
    message.success('作品已添加');
  };

  const removeItem = (sectionId: string, itemIndex: number) => {
    setSections(sections.map(s => 
      s.id === sectionId 
        ? { 
            ...s, 
            items: s.items.filter((_, i) => i !== itemIndex)
                  .map((item, idx) => ({ ...item, displayOrder: idx }))
          }
        : s
    ));
  };

  const moveItem = (sectionId: string, itemIndex: number, direction: 'up' | 'down') => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;
    
    if (direction === 'up' && itemIndex === 0) return;
    if (direction === 'down' && itemIndex === section.items.length - 1) return;
    
    const targetIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1;
    
    setSections(sections.map(s => {
      if (s.id !== sectionId) return s;
      const newItems = [...s.items];
      [newItems[itemIndex], newItems[targetIndex]] = [newItems[targetIndex], newItems[itemIndex]];
      newItems.forEach((item, idx) => { item.displayOrder = idx; });
      return { ...s, items: newItems };
    }));
  };

  const openItemEditor = (sectionId: string, item: ExhibitionItem) => {
    setEditingItem({ sectionId, item: { ...item } });
  };

  const saveItemEdit = () => {
    if (!editingItem) return;
    
    setSections(sections.map(s => 
      s.id === editingItem.sectionId
        ? {
            ...s,
            items: s.items.map(item =>
              item.paintingId === editingItem.item.paintingId
                ? editingItem.item
                : item
            )
          }
        : s
    ));
    
    setEditingItem(null);
    message.success('作品展签已保存');
  };

  const saveExhibition = async (publish: boolean = false) => {
    if (!title.trim()) {
      message.error('请填写展览标题');
      setCurrentStep(0);
      return;
    }
    if (sections.length === 0) {
      message.error('请至少添加一个展线单元');
      setCurrentStep(1);
      return;
    }
    if (sections.some(s => s.items.length === 0)) {
      message.error('每个展线单元至少需要一件作品');
      return;
    }
    
    setSaving(true);
    try {
      const request = {
        title,
        theme,
        curatorName,
        curatorNote,
        introduction,
        conclusion,
        sections,
        coverPaintingId
      };
      
      let exhibition: Exhibition;
      if (editingId) {
        exhibition = await knowledgeApi.updateExhibition(editingId, request);
        message.success('展览已保存');
      } else {
        exhibition = await knowledgeApi.createExhibition(request);
        setEditingId(exhibition.id);
        message.success('展览已创建');
      }
      
      if (publish) {
        await knowledgeApi.publishExhibition(exhibition.id);
        message.success('展览已发布并生成分享码');
      }
      
      const list = await knowledgeApi.getExhibitions();
      setExhibitionList(list);
      
    } catch (e) {
      message.error('保存失败');
    } finally {
      setSaving(false);
    }
  };

  const loadExhibitionForEdit = async (id: string) => {
    try {
      setLoading(true);
      const exhibition = await knowledgeApi.getExhibition(id);
      setEditingId(exhibition.id);
      setTitle(exhibition.title);
      setTheme(exhibition.theme);
      setCuratorName(exhibition.curatorName);
      setCuratorNote(exhibition.curatorNote);
      setIntroduction(exhibition.introduction);
      setConclusion(exhibition.conclusion);
      setSections(exhibition.sections.map(s => ({
        ...s,
        items: s.items.map(item => ({
          ...item,
          painting: undefined
        }))
      })));
      setCoverPaintingId(exhibition.coverPaintingId);
      setView('curator');
      setCurrentStep(2);
    } catch (e) {
      message.error('加载展览失败');
    } finally {
      setLoading(false);
    }
  };

  const deleteExhibition = async (id: string) => {
    try {
      await knowledgeApi.deleteExhibition(id);
      const list = await knowledgeApi.getExhibitions();
      setExhibitionList(list);
      message.success('展览已删除');
    } catch (e) {
      message.error('删除失败');
    }
  };

  const publishExhibition = async (id: string) => {
    try {
      const exhibition = await knowledgeApi.publishExhibition(id);
      const list = await knowledgeApi.getExhibitions();
      setExhibitionList(list);
      message.success(`展览已发布，分享码：${exhibition.shareCode}`);
    } catch (e) {
      message.error('发布失败');
    }
  };

  const totalArtworks = useMemo(() => 
    sections.reduce((sum, s) => sum + s.items.length, 0),
    [sections]
  );

  const usedPaintingIds = useMemo(() => 
    new Set(sections.flatMap(s => s.items.map(i => i.paintingId))),
    [sections]
  );

  const suggestionStats = useMemo(() => ({
    total: aiSuggestions.length,
    errors: aiSuggestions.filter(s => s.severity === 'error').length,
    warnings: aiSuggestions.filter(s => s.severity === 'warning').length,
    infos: aiSuggestions.filter(s => s.severity === 'info').length
  }), [aiSuggestions]);

  const renderListView = () => {
    if (loading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 100 }}>
          <Spin size="large" tip="加载中..." />
        </div>
      );
    }

    return (
      <div>
        <Card 
          className="card-shadow" 
          style={{ borderRadius: 16, marginBottom: 24 }}
          bodyStyle={{ padding: 32 }}
        >
          <Row gutter={[24, 16]} align="middle">
            <Col xs={24} md={16}>
              <Title level={2} className="ink-title" style={{ color: '#5c4a33', margin: 0 }}>
                🎨 虚拟展厅策展
              </Title>
              <Paragraph style={{ color: '#8b7355', margin: '8px 0 0 0' }}>
                选定一个主题，按展线挑选名作，撰写展签，梳理导览逻辑，打造属于你的数字展廊
              </Paragraph>
            </Col>
            <Col xs={24} md={8} style={{ textAlign: 'right' }}>
              <Space>
                <Button 
                  size="large"
                  icon={<BulbOutlined />}
                  onClick={() => setView('themes')}
                  style={{ background: '#fff8e6', color: '#d48806', borderColor: '#ffd666' }}
                >
                  选择主题
                </Button>
                <Button 
                  type="primary"
                  size="large"
                  icon={<PlusOutlined />}
                  onClick={startNewExhibition}
                  style={{ background: '#8b7355', borderColor: '#8b7355' }}
                >
                  创建展览
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {exhibitionList.length === 0 ? (
          <Card className="card-shadow" style={{ borderRadius: 16 }}>
            <Empty 
              description={
                <div>
                  <Paragraph style={{ color: '#8b7355', marginBottom: 16 }}>
                    还没有策划任何展览
                  </Paragraph>
                  <Button 
                    type="primary"
                    onClick={() => setView('themes')}
                    style={{ background: '#8b7355', borderColor: '#8b7355' }}
                  >
                    从推荐主题开始
                  </Button>
                </div>
              }
            />
          </Card>
        ) : (
          <Row gutter={[16, 16]}>
            {exhibitionList.map(exhibition => (
              <Col xs={24} sm={12} lg={8} key={exhibition.id}>
                <Card
                  className="card-shadow"
                  hoverable
                  style={{ borderRadius: 16, height: '100%' }}
                  cover={
                    exhibition.coverImageUrl ? (
                      <div style={{ position: 'relative' }}>
                        <img
                          src={exhibition.coverImageUrl}
                          alt={exhibition.title}
                          referrerPolicy="no-referrer"
                          style={{
                            width: '100%',
                            height: 180,
                            objectFit: 'cover',
                            borderTopLeftRadius: 16,
                            borderTopRightRadius: 16
                          }}
                        />
                        {exhibition.isPublished && (
                          <Tag 
                            color="#52c41a"
                            style={{ position: 'absolute', top: 12, left: 12 }}
                          >
                            <CheckCircleOutlined /> 已发布
                          </Tag>
                        )}
                      </div>
                    ) : undefined
                  }
                  actions={[
                    <Tooltip key="edit" title="编辑">
                      <EditOutlined 
                        style={{ color: '#8b7355' }}
                        onClick={() => loadExhibitionForEdit(exhibition.id)}
                      />
                    </Tooltip>,
                    <Tooltip key="view" title="预览">
                      <EyeOutlined 
                        style={{ color: '#1890ff' }}
                        onClick={() => onNavigate?.('exhibition', exhibition.id)}
                      />
                    </Tooltip>,
                    exhibition.isPublished ? (
                      <Tooltip key="share" title={`分享码: ${exhibition.id.slice(0, 8)}`}>
                        <ShareAltOutlined style={{ color: '#52c41a' }} />
                      </Tooltip>
                    ) : (
                      <Tooltip key="publish" title="发布展览">
                        <UploadOutlined 
                          style={{ color: '#faad14' }}
                          onClick={() => publishExhibition(exhibition.id)}
                        />
                      </Tooltip>
                    ),
                    <Popconfirm
                      key="delete"
                      title="确定删除这个展览吗？"
                      onConfirm={() => deleteExhibition(exhibition.id)}
                      okText="确定"
                      cancelText="取消"
                    >
                      <Tooltip title="删除">
                        <DeleteOutlined style={{ color: '#f5222d' }} />
                      </Tooltip>
                    </Popconfirm>
                  ]}
                >
                  <Card.Meta
                    title={
                      <div className="ink-title" style={{ fontSize: 16, color: '#5c4a33' }}>
                        {exhibition.title}
                      </div>
                    }
                    description={
                      <div style={{ marginTop: 8 }}>
                        <div style={{ marginBottom: 8 }}>
                          <Tag color="#8b7355">{exhibition.theme}</Tag>
                        </div>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          <TeamOutlined style={{ marginRight: 4 }} />
                          策展人: {exhibition.curatorName || '佚名'}
                        </Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          <PictureOutlined style={{ marginRight: 4 }} />
                          {exhibition.artworkCount} 幅作品 · {exhibition.sectionCount} 个单元
                        </Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          <EyeOutlined style={{ marginRight: 4 }} />
                          {exhibition.viewCount} 次浏览
                        </Text>
                        <Paragraph 
                          ellipsis={{ rows: 2 }}
                          style={{ color: '#6b5b45', fontSize: 13, marginTop: 8, marginBottom: 0 }}
                        >
                          {exhibition.introduction}
                        </Paragraph>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    );
  };

  const renderThemesView = () => {
    if (loading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 100 }}>
          <Spin size="large" tip="加载主题推荐中..." />
        </div>
      );
    }

    return (
      <div>
        <Card 
          className="card-shadow" 
          style={{ borderRadius: 16, marginBottom: 24 }}
          bodyStyle={{ padding: 24 }}
        >
          <Row align="middle">
            <Col xs={24} md={18}>
              <Title level={2} className="ink-title" style={{ color: '#5c4a33', margin: 0 }}>
                📚 精选展览主题
              </Title>
              <Paragraph style={{ color: '#8b7355', margin: '8px 0 0 0' }}>
                从以下学术主题中选择一个开始你的策展之旅，或返回自由创建
              </Paragraph>
            </Col>
            <Col xs={24} md={6} style={{ textAlign: 'right' }}>
              <Button onClick={() => setView('list')}>
                返回我的展览
              </Button>
            </Col>
          </Row>
        </Card>

        <Row gutter={[16, 16]}>
          {themeSuggestions.map(themeSuggestion => (
            <Col xs={24} lg={12} key={themeSuggestion.id}>
              <Card
                className="card-shadow"
                hoverable
                style={{ borderRadius: 16, height: '100%' }}
                bodyStyle={{ padding: 24 }}
                onClick={() => applyThemeSuggestion(themeSuggestion)}
              >
                <Title level={4} className="ink-title" style={{ color: '#5c4a33', marginTop: 0, marginBottom: 12 }}>
                  {themeSuggestion.title}
                </Title>
                <Paragraph style={{ color: '#6b5b45', marginBottom: 16, lineHeight: 1.8 }}>
                  {themeSuggestion.description}
                </Paragraph>
                <div style={{ marginBottom: 12 }}>
                  {themeSuggestion.keywords.map(kw => (
                    <Tag key={kw} color="#8b7355" style={{ marginBottom: 4 }}>
                      {kw}
                    </Tag>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    <PictureOutlined style={{ marginRight: 4 }} />
                    预计 {themeSuggestion.estimatedWorkCount} 幅作品
                  </Text>
                  <Button 
                    type="primary" 
                    size="small"
                    style={{ background: '#8b7355', borderColor: '#8b7355' }}
                  >
                    使用此主题
                  </Button>
                </div>
                
                <Divider style={{ margin: '16px 0' }} />
                
                <Title level={5} style={{ color: '#8b7355', marginTop: 0, marginBottom: 8, fontSize: 13 }}>
                  <BulbOutlined style={{ marginRight: 4 }} />
                  策展思路
                </Title>
                <Paragraph style={{ color: '#6b5b45', fontSize: 13, marginBottom: 12, lineHeight: 1.7 }}>
                  {themeSuggestion.curatorialApproach}
                </Paragraph>
                
                <Title level={5} style={{ color: '#8b7355', marginTop: 0, marginBottom: 8, fontSize: 13 }}>
                  <UnorderedListOutlined style={{ marginRight: 4 }} />
                  推荐作品
                </Title>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {themeSuggestion.relatedPaintingIds.map(pid => {
                    const painting = paintings.find(p => p.id === pid);
                    return painting ? (
                      <Tag key={pid} color="#d4c4a8" style={{ marginBottom: 4 }}>
                        {painting.title}
                      </Tag>
                    ) : null;
                  })}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  };

  const renderCuratorView = () => {
    return (
      <div>
        <Card 
          className="card-shadow" 
          style={{ borderRadius: 16, marginBottom: 16 }}
          bodyStyle={{ padding: 20 }}
        >
          <Row gutter={[16, 12]} align="middle">
            <Col xs={24} md={12}>
              <Title level={3} className="ink-title" style={{ color: '#5c4a33', margin: 0 }}>
                ✏️ {editingId ? '编辑展览' : '策划新展览'}
              </Title>
            </Col>
            <Col xs={24} md={12} style={{ textAlign: 'right' }}>
              <Space>
                <Button 
                  icon={<BulbOutlined />}
                  onClick={() => setSuggestionsDrawerVisible(true)}
                >
                  AI导师
                  {suggestionStats.total > 0 && (
                    <Badge 
                      count={suggestionStats.errors > 0 ? suggestionStats.errors : suggestionStats.warnings > 0 ? suggestionStats.warnings : suggestionStats.infos}
                      style={{ marginLeft: 8 }}
                    />
                  )}
                </Button>
                <Button 
                  icon={<SaveOutlined />}
                  onClick={() => saveExhibition(false)}
                  loading={saving}
                >
                  保存草稿
                </Button>
                <Button 
                  type="primary"
                  icon={<UploadOutlined />}
                  onClick={() => saveExhibition(true)}
                  loading={saving}
                  style={{ background: '#52c41a', borderColor: '#52c41a' }}
                >
                  发布展览
                </Button>
                <Button onClick={() => setView('list')}>
                  返回列表
                </Button>
              </Space>
            </Col>
          </Row>
          
          <div style={{ marginTop: 16 }}>
            <Steps 
              current={currentStep}
              onChange={setCurrentStep}
              items={[
                { title: '基本信息', icon: <FileTextOutlined /> },
                { title: '展线结构', icon: <OrderedListOutlined /> },
                { title: '作品与展签', icon: <PictureOutlined /> }
              ]}
            />
          </div>
        </Card>

        {suggestionStats.errors > 0 && (
          <Alert
            message={`有 ${suggestionStats.errors} 项需要完善的内容`}
            description="请查看AI导师的建议，完善展览内容后再发布"
            type="error"
            showIcon
            style={{ marginBottom: 16, borderRadius: 8 }}
            action={
              <Button size="small" type="primary" danger onClick={() => setSuggestionsDrawerVisible(true)}>
                查看详情
              </Button>
            }
          />
        )}

        {currentStep >= 0 && (
          <Card 
            className="card-shadow" 
            style={{ borderRadius: 16, marginBottom: 16 }}
            title={
              <span style={{ color: '#5c4a33' }}>
                <FileTextOutlined style={{ marginRight: 8 }} />
                基本信息
              </span>
            }
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item label="展览标题" required style={{ marginBottom: 16 }}>
                  <Input 
                    placeholder="如：渔隐的变迁——山水画中的隐逸精神"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="主题标签" style={{ marginBottom: 16 }}>
                  <Input 
                    placeholder="如：山水、隐逸、文人精神"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="策展人" style={{ marginBottom: 16 }}>
                  <Input 
                    placeholder="您的名字"
                    value={curatorName}
                    onChange={(e) => setCuratorName(e.target.value)}
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="封面作品" style={{ marginBottom: 16 }}>
                  <Select
                    placeholder="选择一幅作品作为展览封面"
                    allowClear
                    value={coverPaintingId}
                    onChange={setCoverPaintingId}
                    size="large"
                    style={{ width: '100%' }}
                  >
                    {paintings.map(p => (
                      <Option key={p.id} value={p.id}>
                        {p.title} · {getPainterName(p.painterId)}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item label="策展人语" style={{ marginBottom: 16 }}>
                  <TextArea 
                    rows={3}
                    placeholder="作为策展人，您希望通过这个展览向观众传达什么？您的个人视角或独特见解是什么？"
                    value={curatorNote}
                    onChange={(e) => setCuratorNote(e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item label="展览导言" required style={{ marginBottom: 16 }}>
                  <TextArea 
                    rows={4}
                    placeholder="导言是展览的入口。请说明：①为什么选择这个主题？②展览准备如何展开？③观众可以获得什么？建议200-500字。"
                    value={introduction}
                    onChange={(e) => setIntroduction(e.target.value)}
                    showCount
                    maxLength={800}
                  />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item label="展览结语" style={{ marginBottom: 16 }}>
                  <TextArea 
                    rows={3}
                    placeholder="结语是观展体验的收尾。可以总结展览的核心观点，或提出引人深思的问题，留给观众回味。"
                    value={conclusion}
                    onChange={(e) => setConclusion(e.target.value)}
                    showCount
                    maxLength={500}
                  />
                </Form.Item>
              </Col>
            </Row>
            
            <div style={{ textAlign: 'right', marginTop: 8 }}>
              <Button type="primary" onClick={() => setCurrentStep(1)}>
                下一步：设计展线
              </Button>
            </div>
          </Card>
        )}

        {currentStep >= 1 && (
          <Card 
            className="card-shadow" 
            style={{ borderRadius: 16, marginBottom: 16 }}
            title={
              <span style={{ color: '#5c4a33' }}>
                <OrderedListOutlined style={{ marginRight: 8 }} />
                展线结构
                <Tag color="#8b7355" style={{ marginLeft: 12, fontSize: 12 }}>
                  {sections.length} 个单元 · {totalArtworks} 幅作品
                </Tag>
              </span>
            }
            extra={
              <Button 
                type="primary"
                icon={<PlusOutlined />}
                onClick={addSection}
                size="small"
                style={{ background: '#8b7355', borderColor: '#8b7355' }}
              >
                添加单元
              </Button>
            }
          >
            {sections.length === 0 ? (
              <Empty 
                description={
                  <div>
                    <Paragraph style={{ color: '#8b7355', marginBottom: 16 }}>
                      还没有添加展线单元
                    </Paragraph>
                    <Paragraph type="secondary" style={{ fontSize: 13, marginBottom: 16 }}>
                      一个展览通常由2-4个单元组成，每个单元围绕一个子主题展开。<br />
                      可以按时间顺序（源起-发展-流变）或主题角度（技法-内涵-影响）来设计。
                    </Paragraph>
                    <Button 
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={addSection}
                      style={{ background: '#8b7355', borderColor: '#8b7355' }}
                    >
                      添加第一个单元
                    </Button>
                  </div>
                }
              />
            ) : (
              <List
                dataSource={[...sections].sort((a, b) => a.displayOrder - b.displayOrder)}
                renderItem={(section, sIdx) => (
                  <List.Item 
                    style={{ 
                      border: '1px solid #e8dcc8', 
                      borderRadius: 12, 
                      marginBottom: 16, 
                      padding: 0,
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{ width: '100%' }}>
                      <div style={{ 
                        background: 'linear-gradient(135deg, #f8f1e5 0%, #f5eee0 100%)',
                        padding: '12px 20px',
                        borderBottom: '1px solid #e8dcc8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <Space>
                          <Tag color="#8b7355" style={{ fontSize: 14, padding: '4px 12px' }}>
                            单元 {sIdx + 1}
                          </Tag>
                          <Input 
                            placeholder="单元标题，如：主题探源"
                            value={section.title}
                            onChange={(e) => updateSection(section.id, { title: e.target.value })}
                            style={{ width: 240, fontSize: 15, fontWeight: 'bold' }}
                            bordered={false}
                          />
                        </Space>
                        <Space>
                          <Tooltip title="上移">
                            <Button 
                              icon={<ArrowUpOutlined />}
                              size="small"
                              disabled={sIdx === 0}
                              onClick={() => moveSection(section.id, 'up')}
                            />
                          </Tooltip>
                          <Tooltip title="下移">
                            <Button 
                              icon={<ArrowDownOutlined />}
                              size="small"
                              disabled={sIdx === sections.length - 1}
                              onClick={() => moveSection(section.id, 'down')}
                            />
                          </Tooltip>
                          <Popconfirm
                            title="确定删除这个单元吗？"
                            onConfirm={() => removeSection(section.id)}
                            okText="确定"
                            cancelText="取消"
                          >
                            <Button 
                              icon={<DeleteOutlined />}
                              size="small"
                              danger
                            />
                          </Popconfirm>
                        </Space>
                      </div>
                      
                      <div style={{ padding: 16 }}>
                        <Input.TextArea
                          placeholder="单元说明：阐述该单元在整个展览叙事中的作用，以及作品之间的相互关系。建议80-150字。"
                          value={section.description}
                          onChange={(e) => updateSection(section.id, { description: e.target.value })}
                          rows={2}
                          style={{ marginBottom: 16 }}
                          showCount
                          maxLength={300}
                        />
                        
                        <div style={{ marginBottom: 12 }}>
                          <Space align="center">
                            <Text strong style={{ color: '#5c4a33' }}>
                              <PictureOutlined style={{ marginRight: 4 }} />
                              作品列表
                            </Text>
                            <Tag color="#a89880">{section.items.length} 幅</Tag>
                            <Button 
                              type="primary"
                              size="small"
                              icon={<PlusOutlined />}
                              onClick={() => openPaintingSelector(section.id)}
                              style={{ background: '#8b7355', borderColor: '#8b7355' }}
                            >
                              添加作品
                            </Button>
                          </Space>
                        </div>
                        
                        {section.items.length === 0 ? (
                          <Empty 
                            description={
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                点击「添加作品」从馆藏名画中挑选
                              </Text>
                            }
                            image={null}
                            style={{ padding: '20px 0' }}
                          />
                        ) : (
                          <List
                            size="small"
                            dataSource={section.items}
                            renderItem={(item, idx) => {
                              const painting = paintings.find(p => p.id === item.paintingId);
                              if (!painting) return null;
                              return (
                                <List.Item
                                  style={{ 
                                    border: '1px dashed #e8dcc8', 
                                    borderRadius: 8, 
                                    marginBottom: 8,
                                    padding: '12px 16px',
                                    background: item.label && item.narration ? '#f6ffed' : '#fffbe6'
                                  }}
                                  actions={[
                                    <Tooltip key="up" title="上移">
                                      <Button 
                                        icon={<ArrowUpOutlined />}
                                        size="small"
                                        disabled={idx === 0}
                                        onClick={() => moveItem(section.id, idx, 'up')}
                                      />
                                    </Tooltip>,
                                    <Tooltip key="down" title="下移">
                                      <Button 
                                        icon={<ArrowDownOutlined />}
                                        size="small"
                                        disabled={idx === section.items.length - 1}
                                        onClick={() => moveItem(section.id, idx, 'down')}
                                      />
                                    </Tooltip>,
                                    <Tooltip key="edit" title={item.label && item.narration ? "展签已完成" : "撰写展签"}>
                                      <Button 
                                        icon={item.label && item.narration ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : <EditOutlined />}
                                        size="small"
                                        onClick={() => openItemEditor(section.id, item)}
                                      />
                                    </Tooltip>,
                                    <Popconfirm
                                      key="delete"
                                      title="移除这件作品？"
                                      onConfirm={() => removeItem(section.id, idx)}
                                      okText="确定"
                                      cancelText="取消"
                                    >
                                      <Button 
                                        icon={<DeleteOutlined />}
                                        size="small"
                                        danger
                                      />
                                    </Popconfirm>
                                  ]}
                                >
                                  <List.Item.Meta
                                    avatar={
                                      <img 
                                        src={painting.imageUrl}
                                        alt={painting.title}
                                        referrerPolicy="no-referrer"
                                        style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
                                      />
                                    }
                                    title={
                                      <Space>
                                        <span className="ink-title" style={{ color: '#5c4a33', fontSize: 15 }}>
                                          {painting.title}
                                        </span>
                                        <Tag color="#a89880">
                                          {getDynastyName(painting.dynastyId)}
                                        </Tag>
                                        <Tag>
                                          {getPainterName(painting.painterId)}
                                        </Tag>
                                        {item.label && (
                                          <Tag color="#52c41a" style={{ fontSize: 11 }}>
                                            ✓ 展签已写
                                          </Tag>
                                        )}
                                        {item.narration && (
                                          <Tag color="#52c41a" style={{ fontSize: 11 }}>
                                            ✓ 导览词已写
                                          </Tag>
                                        )}
                                      </Space>
                                    }
                                    description={
                                      <div style={{ marginTop: 4 }}>
                                        {item.label ? (
                                          <Text style={{ color: '#5c4a33', fontWeight: 500 }}>
                                            「{item.label}」
                                          </Text>
                                        ) : (
                                          <Text type="secondary" style={{ fontSize: 12 }}>
                                            点击编辑按钮撰写展签和导览词
                                          </Text>
                                        )}
                                        {item.narration && (
                                          <Paragraph 
                                            ellipsis={{ rows: 2 }}
                                            style={{ color: '#6b5b45', fontSize: 12, marginTop: 4, marginBottom: 0 }}
                                          >
                                            {item.narration}
                                          </Paragraph>
                                        )}
                                      </div>
                                    }
                                  />
                                </List.Item>
                              );
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            )}
            
            <div style={{ textAlign: 'right', marginTop: 16 }}>
              <Space>
                <Button onClick={() => setCurrentStep(0)}>
                  上一步：基本信息
                </Button>
                {sections.length > 0 && (
                  <Button type="primary" onClick={() => setCurrentStep(2)}>
                    下一步：撰写展签
                  </Button>
                )}
              </Space>
            </div>
          </Card>
        )}

        {currentStep >= 2 && (
          <Card 
            className="card-shadow" 
            style={{ borderRadius: 16, marginBottom: 16 }}
            title={
              <span style={{ color: '#5c4a33' }}>
                <EyeOutlined style={{ marginRight: 8 }} />
                预览展线
              </span>
            }
          >
            <Alert
              message="展览策划完成！"
              description="以下是您的展览展线预览。请检查作品顺序、展签内容是否完整，然后保存或发布。"
              type="success"
              showIcon
              style={{ marginBottom: 16, borderRadius: 8 }}
            />
            
            <div style={{ textAlign: 'right', marginTop: 16 }}>
              <Space>
                <Button onClick={() => setCurrentStep(1)}>
                  上一步：展线结构
                </Button>
                <Button 
                  icon={<EyeOutlined />}
                  onClick={() => editingId && onNavigate?.('exhibition', editingId)}
                  disabled={!editingId}
                >
                  预览展览
                </Button>
              </Space>
            </div>
          </Card>
        )}

        <Modal
          open={paintingModalVisible}
          onCancel={() => setPaintingModalVisible(false)}
          title="选择作品"
          width={1000}
          footer={null}
        >
          <div style={{ marginBottom: 16 }}>
            <Row gutter={[16, 16]}>
              <Col xs={12}>
                <Select
                  placeholder="按朝代筛选"
                  allowClear
                  style={{ width: '100%' }}
                >
                  {dynasties.map(d => (
                    <Option key={d.id} value={d.id}>{d.name}</Option>
                  ))}
                </Select>
              </Col>
              <Col xs={12}>
                <Select
                  placeholder="按题材筛选"
                  allowClear
                  style={{ width: '100%' }}
                >
                  {Array.from(new Set(paintings.map(p => p.theme))).map(t => (
                    <Option key={t} value={t}>{THEME_ICONS[t] || '🎨'} {t}</Option>
                  ))}
                </Select>
              </Col>
            </Row>
          </div>
          
          <Row gutter={[12, 12]} style={{ maxHeight: 500, overflowY: 'auto' }}>
            {paintings.map(painting => (
              <Col xs={12} sm={8} md={6} key={painting.id}>
                <Card
                  hoverable
                  size="small"
                  style={{ 
                    borderRadius: 8, 
                    border: usedPaintingIds.has(painting.id) ? '2px solid #52c41a' : '1px solid #e8dcc8',
                    cursor: usedPaintingIds.has(painting.id) ? 'not-allowed' : 'pointer',
                    opacity: usedPaintingIds.has(painting.id) ? 0.6 : 1
                  }}
                  cover={
                    <img
                      src={painting.imageUrl}
                      alt={painting.title}
                      referrerPolicy="no-referrer"
                      style={{
                        height: 100,
                        objectFit: 'cover',
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8
                      }}
                    />
                  }
                  bodyStyle={{ padding: 8 }}
                  onClick={() => !usedPaintingIds.has(painting.id) && addPaintingToSection(painting.id)}
                >
                  <Card.Meta
                    title={
                      <div style={{ fontSize: 12, color: '#5c4a33' }}>
                        {painting.title}
                        {usedPaintingIds.has(painting.id) && (
                          <Tag color="#52c41a" style={{ fontSize: 10, marginLeft: 4 }}>已选</Tag>
                        )}
                      </div>
                    }
                    description={
                      <div style={{ fontSize: 10, color: '#8b7355' }}>
                        {getDynastyName(painting.dynastyId)} · {getPainterName(painting.painterId)}
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </Modal>

        <Modal
          open={!!editingItem}
          onCancel={() => setEditingItem(null)}
          title={
            editingItem ? (
              <Space>
                <span>撰写展签：</span>
                <span className="ink-title" style={{ color: '#5c4a33' }}>
                  {paintings.find(p => p.id === editingItem.item.paintingId)?.title}
                </span>
              </Space>
            ) : null
          }
          width={700}
          footer={[
            <Button key="cancel" onClick={() => setEditingItem(null)}>
              取消
            </Button>,
            <Button key="save" type="primary" onClick={saveItemEdit}>
              保存展签
            </Button>
          ]}
        >
          {editingItem && (
            <div>
              <Alert
                message="展签撰写指南"
                description={
                  <div>
                    <Text strong>展签标题：</Text>简洁有力地概括该作品在本次展览中的定位，而非仅仅重复画名。<br />
                    <Text strong>导览词：</Text>从展览主题的角度解读这件作品，说明它为什么出现在这里、与主题的关系、与前后作品的联系。建议100-200字。
                  </div>
                }
                type="info"
                showIcon
                style={{ marginBottom: 16, borderRadius: 8 }}
              />
              
              <Form.Item label="展签标题" required style={{ marginBottom: 16 }}>
                <Input 
                  placeholder="如：渔隐的原型——《富春山居图》中的隐逸精神"
                  value={editingItem.item.label}
                  onChange={(e) => setEditingItem({
                    ...editingItem,
                    item: { ...editingItem.item, label: e.target.value }
                  })}
                  size="large"
                />
              </Form.Item>
              
              <Form.Item label="导览词" required style={{ marginBottom: 0 }}>
                <TextArea 
                  rows={6}
                  placeholder="从展览主题的角度，解读这件作品在本单元中的位置和意义..."
                  value={editingItem.item.narration}
                  onChange={(e) => setEditingItem({
                    ...editingItem,
                    item: { ...editingItem.item, narration: e.target.value }
                  })}
                  showCount
                  maxLength={500}
                />
              </Form.Item>
              
              <Divider />
              
              <Title level={5} style={{ color: '#8b7355', marginTop: 0, marginBottom: 8, fontSize: 14 }}>
                <BulbOutlined style={{ marginRight: 4 }} />
                参考信息
              </Title>
              {(() => {
                const p = paintings.find(p => p.id === editingItem.item.paintingId);
                if (!p) return null;
                return (
                  <div style={{ background: '#faf6ee', padding: 12, borderRadius: 8, fontSize: 13, lineHeight: 1.8 }}>
                    <Text strong style={{ color: '#5c4a33' }}>整体印象：</Text>
                    <Text style={{ color: '#6b5b45' }}>{p.analysis.overallImpression.slice(0, 200)}...</Text>
                    <br /><br />
                    <Text strong style={{ color: '#5c4a33' }}>文化背景：</Text>
                    <Text style={{ color: '#6b5b45' }}>{p.analysis.culturalContext.slice(0, 200)}...</Text>
                  </div>
                );
              })()}
            </div>
          )}
        </Modal>

        <Drawer
          open={suggestionsDrawerVisible}
          onClose={() => setSuggestionsDrawerVisible(false)}
          width={520}
          title={
            <Space>
              <BulbOutlined style={{ color: '#faad14', fontSize: 20 }} />
              <span className="ink-title" style={{ color: '#5c4a33', fontSize: 18 }}>
                AI导师 · 画史准确性提示
              </span>
            </Space>
          }
          extra={
            <Button 
              size="small"
              icon={<HistoryOutlined />}
              onClick={fetchSuggestions}
              loading={suggestionsLoading}
            >
              刷新建议
            </Button>
          }
        >
          {suggestionsLoading ? (
            <div style={{ padding: 40, textAlign: 'center' }}>
              <Spin size="large" tip="AI导师正在分析您的展览..." />
            </div>
          ) : aiSuggestions.length === 0 ? (
            <Empty description="暂无建议，您的展览策划已相当完善！" />
          ) : (
            <List
              dataSource={aiSuggestions}
              renderItem={(suggestion) => {
                const config = SUGGESTION_SEVERITY_CONFIG[suggestion.severity];
                return (
                  <List.Item
                    style={{ 
                      borderLeft: `4px solid ${config.color}`,
                      background: config.bgColor,
                      marginBottom: 12,
                      padding: '12px 16px',
                      borderRadius: 4
                    }}
                  >
                    <List.Item.Meta
                      avatar={
                        <div style={{ 
                          color: config.color, 
                          fontSize: 20,
                          marginTop: 4
                        }}>
                          {config.icon}
                        </div>
                      }
                      title={
                        <Space>
                          <Tag color={config.color} style={{ margin: 0 }}>
                            {SUGGESTION_TYPE_LABELS[suggestion.type]}
                          </Tag>
                          <Text strong style={{ color: '#5c4a33' }}>
                            {suggestion.title}
                          </Text>
                        </Space>
                      }
                      description={
                        <div style={{ marginTop: 8 }}>
                          <Paragraph style={{ color: '#6b5b45', fontSize: 13, marginBottom: 8 }}>
                            {suggestion.description}
                          </Paragraph>
                          <Alert
                            message={suggestion.suggestion}
                            type={suggestion.severity === 'error' ? 'error' : suggestion.severity === 'warning' ? 'warning' : 'info'}
                            showIcon
                            style={{ fontSize: 12 }}
                          />
                          {suggestion.reference && (
                            <div style={{ marginTop: 8 }}>
                              <Tag style={{ fontSize: 11 }}>
                                📚 参考：{suggestion.reference.name}
                              </Tag>
                            </div>
                          )}
                        </div>
                      }
                    />
                  </List.Item>
                );
              }}
            />
          )}
          
          <Divider />
          
          <Alert
            message="关于AI导师"
            description="AI导师基于您的展览内容提供画史准确性建议，目的是帮助您完善策展内容。提示仅供参考，创意和诠释的主动权始终在您手中。"
            type="info"
            showIcon
            style={{ borderRadius: 8 }}
          />
        </Drawer>
      </div>
    );
  };

  return (
    <App>
      <div>
        {view === 'list' && renderListView()}
        {view === 'themes' && renderThemesView()}
        {view === 'curator' && renderCuratorView()}
      </div>
    </App>
  );
}

export default ExhibitionCuratorPage;
