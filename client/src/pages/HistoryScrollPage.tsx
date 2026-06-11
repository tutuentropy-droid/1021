import { useState, useEffect, useMemo, useRef } from 'react';
import { Card, Typography, Tag, Spin, Button, Space, Tooltip, Drawer, Empty, Badge, Row, Col, Select, Slider, Switch } from 'antd';
import {
  ClockCircleOutlined,
  EnvironmentOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  EyeOutlined,
  InfoCircleOutlined,
  CompassOutlined,
  FundProjectionScreenOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import type { TimelineData, TimelineEvent, TimelineEventType, Painter } from '../types';
import { knowledgeApi } from '../api';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const EVENT_TYPE_CONFIG: Record<TimelineEventType, { label: string; color: string; icon: string }> = {
  painter_birth: { label: '画家诞生', color: '#8b7355', icon: '👶' },
  painter_death: { label: '画家离世', color: '#7f8c8d', icon: '🕊️' },
  painting_created: { label: '名作诞生', color: '#6b8e23', icon: '🖼️' },
  school_founded: { label: '画派形成', color: '#a0522d', icon: '🎨' },
  theory_published: { label: '画论刊行', color: '#4a6b8a', icon: '📖' },
  literary_work: { label: '文学大事', color: '#8e44ad', icon: '📜' },
  friendship: { label: '文人交游', color: '#d35400', icon: '🤝' },
  historical_event: { label: '历史事件', color: '#c0392b', icon: '⚔️' },
  philosophy_event: { label: '哲学思潮', color: '#2980b9', icon: '💭' }
};

const EVENT_LANES: TimelineEventType[][] = [
  ['philosophy_event', 'historical_event'],
  ['literary_work', 'friendship'],
  ['theory_published', 'school_founded'],
  ['painter_birth', 'painter_death'],
  ['painting_created']
];

const LANE_LABELS = ['哲学·历史', '文学·交游', '画论·画派', '画家生平', '名作典藏'];

function parseYear(yearStr: string | number): number {
  if (typeof yearStr === 'number') return yearStr;
  const match = yearStr.match(/-?\d+/);
  return match ? parseInt(match[0]) : 0;
}

function formatYear(year: number): string {
  if (year < 0) return `公元前${Math.abs(year)}年`;
  return `公元${year}年`;
}

interface HistoryScrollPageProps {
  onNavigate?: (page: string, id?: string) => void;
}

function HistoryScrollPage({ onNavigate }: HistoryScrollPageProps) {
  const [timelineData, setTimelineData] = useState<TimelineData | null>(null);
  const [painters, setPainters] = useState<Painter[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [viewMode, setViewMode] = useState<'macro' | 'micro'>('macro');
  const [zoom, setZoom] = useState(1);
  const [scrollX, setScrollX] = useState(0);
  const [activeDynastyId, setActiveDynastyId] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(true);
  const [filterTypes, setFilterTypes] = useState<TimelineEventType[]>([]);
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      knowledgeApi.getTimelineData(),
      knowledgeApi.getPainters()
    ]).then(([timeline, paintersList]) => {
      setTimelineData(timeline);
      setPainters(paintersList);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const displayEvents = useMemo(() => {
    if (!timelineData) return [];
    let events = timelineData.allEvents;
    if (activeDynastyId) {
      events = events.filter(e => e.dynastyId === activeDynastyId);
    }
    if (filterTypes.length > 0) {
      events = events.filter(e => filterTypes.includes(e.type));
    }
    return events.sort((a, b) => a.year - b.year);
  }, [timelineData, activeDynastyId, filterTypes]);

  const timeRange = useMemo(() => {
    if (!timelineData) return { min: 300, max: 2000 };
    if (activeDynastyId && timelineData.regions) {
      const region = timelineData.regions.find(r => r.id === activeDynastyId);
      if (region) return { min: region.startYear, max: region.endYear };
    }
    if (viewMode === 'macro') {
      return { min: 300, max: 2000 };
    }
    const mid = displayEvents.length > 0
      ? (displayEvents[0].year + displayEvents[displayEvents.length - 1].year) / 2
      : 1100;
    const span = viewMode === 'micro' ? 150 : 500;
    return { min: mid - span, max: mid + span };
  }, [timelineData, activeDynastyId, viewMode, displayEvents]);

  const CHART_WIDTH = 100;
  const CHART_HEIGHT = 560;
  const YEAR_TO_PX = (year: number) => {
    const { min, max } = timeRange;
    return ((year - min) / (max - min)) * (CHART_WIDTH * 30 - 100) + 50;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 100 }}>
        <Spin size="large" tip="正在铺展千年画史长卷..." />
      </div>
    );
  }

  if (!timelineData) {
    return <Empty description="暂无画史数据" />;
  }

  const getPainterName = (id: string) => painters.find(p => p.id === id)?.name || id;

  const handleEventClick = (event: TimelineEvent) => {
    setSelectedEvent(event);
    setDetailVisible(true);
  };

  const renderSpatialMap = () => {
    if (!showMap) return null;
    const locationEvents = displayEvents.filter(e => e.location);
    return (
      <Card
        className="card-shadow"
        style={{ borderRadius: 16, marginBottom: 16 }}
        title={
          <span style={{ color: '#5c4a33' }}>
            <EnvironmentOutlined style={{ marginRight: 8 }} />
            空间肌理 · 地理分布
            <Tag color="#8b7355" style={{ marginLeft: 12, fontSize: 11 }}>
              {locationEvents.length} 处历史坐标
            </Tag>
          </span>
        }
        extra={
          <Switch
            size="small"
            checked={showMap}
            onChange={setShowMap}
            checkedChildren="显示"
            unCheckedChildren="隐藏"
          />
        }
        bodyStyle={{ padding: 0 }}
      >
        <div
          style={{
            height: 280,
            position: 'relative',
            background: `
              linear-gradient(135deg, rgba(139,115,85,0.05) 0%, rgba(200,180,140,0.08) 100%),
              radial-gradient(ellipse at 30% 40%, rgba(74,107,138,0.15) 0%, transparent 40%),
              radial-gradient(ellipse at 70% 60%, rgba(107,142,35,0.12) 0%, transparent 35%)
            `,
            overflow: 'hidden'
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0 }}>
            <path
              d="M 15,35 Q 25,20 45,28 T 70,30 Q 85,35 80,55 Q 75,80 55,82 Q 35,85 25,70 Q 15,55 15,35 Z"
              fill="none"
              stroke="rgba(139,115,85,0.2)"
              strokeWidth="0.3"
              strokeDasharray="1,1"
            />
            <path
              d="M 40,45 Q 55,50 60,65"
              fill="none"
              stroke="rgba(74,107,138,0.3)"
              strokeWidth="0.5"
            />
            <path
              d="M 25,55 Q 40,60 50,70"
              fill="none"
              stroke="rgba(74,107,138,0.3)"
              strokeWidth="0.4"
            />
            {[
              { x: 30, y: 40, name: '长安' },
              { x: 54, y: 40, name: '汴京' },
              { x: 70, y: 55, name: '临安' },
              { x: 69, y: 54, name: '苏州' },
              { x: 71, y: 53, name: '松江' }
            ].map((city, i) => (
              <g key={i}>
                <circle cx={city.x} cy={city.y} r="0.8" fill="rgba(139,115,85,0.4)" />
                <text x={city.x + 1.5} y={city.y + 0.5} fontSize="2.2" fill="rgba(92,74,51,0.6)" fontFamily="STKaiti, KaiTi, serif">
                  {city.name}
                </text>
              </g>
            ))}
          </svg>

          {locationEvents.map(event => {
            if (!event.location) return null;
            const isHovered = hoveredEventId === event.id;
            const isSelected = selectedEvent?.id === event.id;
            const cfg = EVENT_TYPE_CONFIG[event.type];
            return (
              <Tooltip
                key={event.id}
                title={
                  <div style={{ maxWidth: 240 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{cfg.icon} {event.title}</div>
                    <div style={{ fontSize: 12, opacity: 0.85 }}>{event.yearDisplay}</div>
                    <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>{event.location?.name}</div>
                  </div>
                }
              >
                <div
                  style={{
                    position: 'absolute',
                    left: `${event.location.x}%`,
                    top: `${event.location.y}%`,
                    transform: 'translate(-50%, -50%)',
                    cursor: 'pointer',
                    zIndex: isHovered || isSelected ? 10 : 1
                  }}
                  onMouseEnter={() => setHoveredEventId(event.id)}
                  onMouseLeave={() => setHoveredEventId(null)}
                  onClick={() => handleEventClick(event)}
                >
                  <div
                    style={{
                      width: isHovered || isSelected ? 20 : 14,
                      height: isHovered || isSelected ? 20 : 14,
                      borderRadius: '50%',
                      background: cfg.color,
                      border: `2px solid ${isSelected ? '#d4af37' : '#fdfbf7'}`,
                      boxShadow: isHovered || isSelected
                        ? `0 0 0 4px ${cfg.color}33, 0 4px 12px rgba(0,0,0,0.2)`
                        : '0 2px 6px rgba(0,0,0,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: isHovered || isSelected ? 11 : 9,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {cfg.icon}
                  </div>
                  {(isHovered || isSelected) && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        marginTop: 6,
                        whiteSpace: 'nowrap',
                        fontSize: 11,
                        color: '#5c4a33',
                        fontWeight: 600,
                        background: 'rgba(253,251,247,0.95)',
                        padding: '2px 8px',
                        borderRadius: 4,
                        border: '1px solid #d4c4a8',
                        fontFamily: 'STKaiti, KaiTi, serif'
                      }}
                    >
                      {event.location.name}
                    </div>
                  )}
                </div>
              </Tooltip>
            );
          })}
        </div>
      </Card>
    );
  };

  return (
    <div>
      <Card
        className="card-shadow"
        style={{ borderRadius: 16, marginBottom: 16 }}
        bodyStyle={{ padding: 24 }}
      >
        <Row gutter={[24, 16]} align="middle">
          <Col xs={24} md={12}>
            <Title level={2} className="ink-title" style={{ color: '#5c4a33', margin: 0 }}>
              <FundProjectionScreenOutlined style={{ marginRight: 12 }} />
              画史长卷
            </Title>
            <Paragraph style={{ color: '#8b7355', margin: '8px 0 0 0' }}>
              以时间为骨架，空间为肌理，观千年画脉之流转，察画派兴衰、名作诞生、画论刊行、文人交游于一炉
            </Paragraph>
          </Col>
          <Col xs={24} md={12} style={{ textAlign: 'right' }}>
            <Space wrap size={[8, 8]}>
              <Space>
                <Text type="secondary" style={{ fontSize: 12 }}>视角：</Text>
                <Button.Group size="small">
                  <Button
                    type={viewMode === 'macro' ? 'primary' : 'default'}
                    onClick={() => setViewMode('macro')}
                    style={viewMode === 'macro' ? { background: '#8b7355', borderColor: '#8b7355' } : {}}
                    icon={<EyeOutlined />}
                  >
                    宏观
                  </Button>
                  <Button
                    type={viewMode === 'micro' ? 'primary' : 'default'}
                    onClick={() => setViewMode('micro')}
                    style={viewMode === 'micro' ? { background: '#8b7355', borderColor: '#8b7355' } : {}}
                    icon={<AppstoreOutlined />}
                  >
                    微观
                  </Button>
                </Button.Group>
              </Space>

              <Space>
                <Button size="small" icon={<ZoomOutOutlined />} onClick={() => setZoom(z => Math.max(0.5, z - 0.2))} />
                <Text style={{ fontSize: 12, color: '#8b7355', minWidth: 40, textAlign: 'center' }}>
                  {(zoom * 100).toFixed(0)}%
                </Text>
                <Button size="small" icon={<ZoomInOutlined />} onClick={() => setZoom(z => Math.min(2.5, z + 0.2))} />
              </Space>

              <Select
                size="small"
                style={{ width: 130 }}
                placeholder="选择朝代"
                allowClear
                value={activeDynastyId || undefined}
                onChange={(v) => setActiveDynastyId(v || null)}
              >
                {timelineData.regions.map(r => (
                  <Option key={r.id} value={r.id}>
                    <span style={{ color: r.color, marginRight: 6 }}>●</span>
                    {r.name}
                    <Tag color={r.color} style={{ marginLeft: 6, fontSize: 10 }}>
                      {r.events.length}
                    </Tag>
                  </Option>
                ))}
              </Select>

              <Select
                size="small"
                style={{ width: 180 }}
                placeholder="筛选事件类型"
                mode="multiple"
                allowClear
                value={filterTypes}
                onChange={setFilterTypes}
              >
                {Object.entries(EVENT_TYPE_CONFIG).map(([type, cfg]) => (
                  <Option key={type} value={type}>
                    {cfg.icon} {cfg.label}
                  </Option>
                ))}
              </Select>
            </Space>
          </Col>
        </Row>

        <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {Object.entries(EVENT_TYPE_CONFIG).map(([type, cfg]) => (
            <Badge
              key={type}
              count={displayEvents.filter(e => e.type === type).length}
              style={{ backgroundColor: cfg.color }}
            >
              <Tag
                style={{
                  background: filterTypes.includes(type as TimelineEventType) ? `${cfg.color}22` : 'transparent',
                  borderColor: cfg.color,
                  color: '#5c4a33',
                  cursor: 'pointer',
                  margin: 0
                }}
                onClick={() => {
                  const t = type as TimelineEventType;
                  setFilterTypes(prev =>
                    prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
                  );
                }}
              >
                <span style={{ marginRight: 4 }}>{cfg.icon}</span>
                {cfg.label}
              </Tag>
            </Badge>
          ))}
        </div>
      </Card>

      {renderSpatialMap()}

      <Card
        className="card-shadow"
        style={{ borderRadius: 16, overflow: 'hidden' }}
        title={
          <span style={{ color: '#5c4a33' }}>
            <ClockCircleOutlined style={{ marginRight: 8 }} />
            时间骨架 · 立体长卷
            <Tag color="#c0392b" style={{ marginLeft: 12, fontSize: 11 }}>
              共 {displayEvents.length} 个历史节点
            </Tag>
            {viewMode === 'micro' && (
              <Tag color="#4682B4" style={{ marginLeft: 8, fontSize: 11 }}>
                微观视图：聚焦北宋三家山水自然观
              </Tag>
            )}
          </span>
        }
        bodyStyle={{ padding: 0 }}
      >
        <div
          ref={scrollRef}
          style={{
            overflowX: 'auto',
            overflowY: 'hidden',
            background: `
              linear-gradient(180deg, rgba(253,251,247,0.95) 0%, rgba(248,245,238,0.9) 100%)
            `,
            scrollBehavior: 'smooth'
          }}
          onScroll={(e) => setScrollX(e.currentTarget.scrollLeft)}
          className="scroll-y"
        >
          <svg
            width={CHART_WIDTH * 30 * zoom}
            height={CHART_HEIGHT}
            viewBox={`0 0 ${CHART_WIDTH * 30} ${CHART_HEIGHT}`}
            style={{ display: 'block', minWidth: '100%' }}
          >
            <defs>
              {timelineData.regions.map(r => (
                <linearGradient key={r.id} id={`dynasty-${r.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={r.color} stopOpacity="0.08" />
                  <stop offset="50%" stopColor={r.color} stopOpacity="0.04" />
                  <stop offset="100%" stopColor={r.color} stopOpacity="0.08" />
                </linearGradient>
              ))}
              <filter id="event-glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {timelineData.regions.map(region => {
              const x1 = YEAR_TO_PX(Math.max(region.startYear, timeRange.min));
              const x2 = YEAR_TO_PX(Math.min(region.endYear, timeRange.max));
              if (x2 < 0 || x1 > CHART_WIDTH * 30) return null;
              return (
                <g key={region.id}>
                  <rect
                    x={Math.max(0, x1)}
                    y={0}
                    width={Math.min(CHART_WIDTH * 30, x2) - Math.max(0, x1)}
                    height={CHART_HEIGHT}
                    fill={`url(#dynasty-${region.id})`}
                    style={{ pointerEvents: 'none' }}
                  />
                  <line
                    x1={Math.max(10, x1)}
                    y1={0}
                    x2={Math.max(10, x1)}
                    y2={CHART_HEIGHT}
                    stroke={region.color}
                    strokeWidth="1"
                    strokeDasharray="4,4"
                    opacity="0.4"
                  />
                  <line
                    x1={Math.min(CHART_WIDTH * 30 - 10, x2)}
                    y1={0}
                    x2={Math.min(CHART_WIDTH * 30 - 10, x2)}
                    y2={CHART_HEIGHT}
                    stroke={region.color}
                    strokeWidth="1"
                    strokeDasharray="4,4"
                    opacity="0.4"
                  />
                  <text
                    x={Math.max(20, (x1 + x2) / 2)}
                    y={30}
                    fill={region.color}
                    fontSize="18"
                    fontWeight="bold"
                    textAnchor="middle"
                    fontFamily="STKaiti, KaiTi, serif"
                    opacity="0.7"
                  >
                    {region.name}
                  </text>
                  <text
                    x={Math.max(20, (x1 + x2) / 2)}
                    y={50}
                    fill={region.color}
                    fontSize="11"
                    textAnchor="middle"
                    opacity="0.5"
                  >
                    {formatYear(region.startYear)} — {formatYear(region.endYear)}
                  </text>
                </g>
              );
            })}

            {LANE_LABELS.map((label, laneIdx) => {
              const laneY = 80 + laneIdx * 90 + 45;
              return (
                <g key={label}>
                  <line
                    x1={40}
                    y1={laneY}
                    x2={CHART_WIDTH * 30 - 40}
                    y2={laneY}
                    stroke="rgba(139,115,85,0.15)"
                    strokeWidth="1"
                    strokeDasharray="2,6"
                  />
                  <text
                    x={40}
                    y={laneY - 25}
                    fill="#8b7355"
                    fontSize="11"
                    fontFamily="STKaiti, KaiTi, serif"
                    opacity="0.6"
                  >
                    {label}
                  </text>
                </g>
              );
            })}

            <line
              x1={40}
              y1={CHART_HEIGHT - 50}
              x2={CHART_WIDTH * 30 - 40}
              y2={CHART_HEIGHT - 50}
              stroke="#8b7355"
              strokeWidth="2"
            />

            {(() => {
              const { min, max } = timeRange;
              const step = viewMode === 'micro' ? 10 : 50;
              const years = [];
              for (let y = Math.ceil(min / step) * step; y <= max; y += step) {
                years.push(y);
              }
              return years.map(year => {
                const x = YEAR_TO_PX(year);
                if (x < 40 || x > CHART_WIDTH * 30 - 40) return null;
                const isMajor = year % 100 === 0;
                return (
                  <g key={year}>
                    <line
                      x1={x}
                      y1={CHART_HEIGHT - 50}
                      x2={x}
                      y2={CHART_HEIGHT - 50 + (isMajor ? 18 : 10)}
                      stroke="#8b7355"
                      strokeWidth={isMajor ? 1.5 : 1}
                      opacity={isMajor ? 0.8 : 0.5}
                    />
                    <text
                      x={x}
                      y={CHART_HEIGHT - 50 + (isMajor ? 32 : 24)}
                      fill="#8b7355"
                      fontSize={isMajor ? 12 : 10}
                      textAnchor="middle"
                      opacity={isMajor ? 0.8 : 0.6}
                    >
                      {year > 0 ? year : `前${Math.abs(year)}`}
                    </text>
                  </g>
                );
              });
            })()}

            {displayEvents.map(event => {
              const cfg = EVENT_TYPE_CONFIG[event.type];
              const laneTypes = EVENT_LANES.find(lane => lane.includes(event.type)) || EVENT_LANES[0];
              const laneIdx = EVENT_LANES.indexOf(laneTypes);
              const subIdx = laneTypes.indexOf(event.type);
              const baseY = 80 + laneIdx * 90;
              const x = YEAR_TO_PX(event.year);
              const y = baseY + 20 + subIdx * 40;
              const isHovered = hoveredEventId === event.id;
              const isSelected = selectedEvent?.id === event.id;

              if (x < 30 || x > CHART_WIDTH * 30 - 30) return null;

              return (
                <g
                  key={event.id}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredEventId(event.id)}
                  onMouseLeave={() => setHoveredEventId(null)}
                  onClick={() => handleEventClick(event)}
                  filter={isHovered || isSelected ? 'url(#event-glow)' : undefined}
                >
                  <line
                    x1={x}
                    y1={y}
                    x2={x}
                    y2={CHART_HEIGHT - 50}
                    stroke={cfg.color}
                    strokeWidth={isHovered || isSelected ? 1.5 : 0.8}
                    opacity={isHovered || isSelected ? 0.6 : 0.25}
                    strokeDasharray="3,3"
                  />

                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered || isSelected ? 14 : 10}
                    fill={cfg.color}
                    stroke={isSelected ? '#d4af37' : '#fdfbf7'}
                    strokeWidth={isSelected ? 3 : 2}
                    opacity="0.95"
                  />

                  <text
                    x={x}
                    y={y + 4}
                    textAnchor="middle"
                    fontSize={isHovered || isSelected ? 13 : 11}
                    style={{ pointerEvents: 'none' }}
                  >
                    {cfg.icon}
                  </text>

                  {(isHovered || isSelected) && (
                    <>
                      <rect
                        x={x + 18}
                        y={y - 28}
                        width={Math.min(260, event.title.length * 14 + 24)}
                        height={56}
                        rx={8}
                        fill="#fdfbf7"
                        stroke={cfg.color}
                        strokeWidth="1"
                        opacity="0.98"
                      />
                      <text
                        x={x + 30}
                        y={y - 8}
                        fontSize="13"
                        fontWeight="bold"
                        fill="#5c4a33"
                        fontFamily="STKaiti, KaiTi, serif"
                      >
                        {event.title}
                      </text>
                      <text
                        x={x + 30}
                        y={y + 12}
                        fontSize="10"
                        fill="#8b7355"
                        opacity="0.8"
                      >
                        {event.yearDisplay}
                        {event.location && ` · ${event.location.name}`}
                      </text>
                    </>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        <div style={{ padding: '12px 24px', background: '#faf6ee', borderTop: '1px solid #e8dcc8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: '#8b7355', fontSize: 12 }}>
            <CompassOutlined style={{ marginRight: 4 }} />
            横向滚动浏览 · 点击节点查看详情 · 鼠标悬停查看预览
          </Text>
          <Space>
            <Button
              size="small"
              onClick={() => {
                if (scrollRef.current) scrollRef.current.scrollLeft = 0;
              }}
            >
              回到起点
            </Button>
            <Button
              size="small"
              onClick={() => {
                const songX = YEAR_TO_PX(1020);
                if (scrollRef.current) {
                  scrollRef.current.scrollLeft = songX * zoom - 400;
                }
              }}
              type="primary"
              style={{ background: '#4682B4', borderColor: '#4682B4' }}
            >
              跳转北宋三家
            </Button>
          </Space>
        </div>
      </Card>

      <Drawer
        open={detailVisible}
        onClose={() => setDetailVisible(false)}
        width={520}
        title={
          selectedEvent ? (
            <Space>
              <span style={{ fontSize: 20 }}>{EVENT_TYPE_CONFIG[selectedEvent.type].icon}</span>
              <span className="ink-title" style={{ color: '#5c4a33', fontSize: 18 }}>
                {selectedEvent.title}
              </span>
            </Space>
          ) : null
        }
        maskClosable
      >
        {selectedEvent && (
          <div>
            <Space style={{ marginBottom: 20, flexWrap: 'wrap' }}>
              <Tag color={EVENT_TYPE_CONFIG[selectedEvent.type].color} style={{ margin: 0 }}>
                {EVENT_TYPE_CONFIG[selectedEvent.type].label}
              </Tag>
              <Tag color="#8b7355">
                <ClockCircleOutlined style={{ marginRight: 4 }} />
                {selectedEvent.yearDisplay}
              </Tag>
              {selectedEvent.location && (
                <Tag color="#6b8e23">
                  <EnvironmentOutlined style={{ marginRight: 4 }} />
                  {selectedEvent.location.name}
                </Tag>
              )}
            </Space>

            <Card
              style={{ borderRadius: 12, marginBottom: 20 }}
              bodyStyle={{ padding: 20 }}
            >
              <Title level={5} className="ink-title" style={{ color: '#5c4a33', marginTop: 0 }}>
                历史脉络
              </Title>
              <Paragraph style={{ color: '#6b5b45', lineHeight: 1.9, fontSize: 14 }}>
                {selectedEvent.description}
              </Paragraph>
            </Card>

            {selectedEvent.relatedPainterIds && selectedEvent.relatedPainterIds.length > 0 && (
              <Card
                style={{ borderRadius: 12, marginBottom: 20 }}
                size="small"
                title={<span style={{ color: '#5c4a33' }}><InfoCircleOutlined /> 关联人物</span>}
              >
                <Space wrap>
                  {selectedEvent.relatedPainterIds.map(pid => (
                    <Button
                      key={pid}
                      onClick={() => onNavigate?.('tree')}
                      style={{ color: '#8b7355', borderColor: '#d4c4a8' }}
                    >
                      👨‍🎨 {getPainterName(pid)}
                    </Button>
                  ))}
                </Space>
              </Card>
            )}

            {viewMode === 'micro' && selectedEvent.dynastyId === 'song' && (
              <Card
                style={{ borderRadius: 12, borderColor: '#4682B4', background: 'rgba(70,130,180,0.04)' }}
                bodyStyle={{ padding: 16 }}
              >
                <Title level={5} className="ink-title" style={{ color: '#4682B4', marginTop: 0 }}>
                  💡 宏观视角：北宋三家的自然观
                </Title>
                <Paragraph style={{ color: '#5c4a33', lineHeight: 1.8, fontSize: 13, margin: 0 }}>
                  北宋三家——李成（营丘人）、范宽（华原人）、郭熙（河阳人），虽同师北方山水，却因地理与心性之异，各造其妙：
                  <br /><br />
                  <strong style={{ color: '#8b7355' }}>李成</strong>：生于齐鲁平原，观平远寒林，创"卷云皴"，其山"气象萧疏、烟林清旷"——如君子谦谦，温润而清。
                  <br /><br />
                  <strong style={{ color: '#8b7355' }}>范宽</strong>：居关中，对太华、终南之雄伟，创"雨点皴"，其山"峰峦浑厚、势状雄强"——如大丈夫巍然，刚健而沉。
                  <br /><br />
                  <strong style={{ color: '#8b7355' }}>郭熙</strong>：河阳温县人，广游天下名山大川，著《林泉高致》，倡"三远法"——其山既有李成之清旷，又有范宽之雄健，终集大成。
                  <br /><br />
                  三人风格之异，正是"外师造化，中得心源"的最佳注脚：同样的自然山水，因画家所处之地、所感之心不同，便生出万千气象。
                </Paragraph>
              </Card>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}

export default HistoryScrollPage;
