import { useState, useEffect, useRef } from 'react';
import {
  Row, Col, Card, Typography, Spin, Select, Tabs, Button, Tag, Space,
  Progress, Slider, List, Avatar, Divider, Timeline as AntTimeline, Badge, Empty
} from 'antd';
import {
  EnvironmentOutlined, ThunderboltOutlined, CloudOutlined, CompassOutlined,
  SoundOutlined, EyeOutlined, BulbOutlined, ArrowRightOutlined,
  PlayCircleOutlined, PauseCircleOutlined, ReadOutlined, InfoCircleOutlined,
  UserOutlined, GlobalOutlined, RiseOutlined, DownOutlined
} from '@ant-design/icons';
import type {
  GeoImmersionPaintingData, TerrainData, ClimateSimulation, ClimateCondition,
  AmbientSound, PainterTravelRoute, SchoolGeoComparison, Painting, Painter, TravelStop
} from '../types';
import { knowledgeApi } from '../api';

const { Title, Paragraph, Text, Link } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

type TabKey = 'terrain' | 'climate' | 'map' | 'comparison' | 'route' | 'guide';

const SOUND_ICONS: Record<string, string> = {
  wind: '🌬️',
  stream: '💧',
  waterfall: '🌊',
  birds: '🐦',
  insects: '🦗',
  rain: '🌧️',
  temple_bell: '🔔'
};

const SEASON_LABELS: Record<string, string> = {
  spring: '春',
  summer: '夏',
  autumn: '秋',
  winter: '冬'
};

const TIME_LABELS: Record<string, string> = {
  dawn: '黎明',
  morning: '清晨',
  noon: '正午',
  afternoon: '午后',
  dusk: '黄昏',
  night: '夜晚'
};

const Terrain3DVisualization = ({ terrain }: { terrain: TerrainData }) => {
  const [rotateX, setRotateX] = useState(25);
  const [rotateY, setRotateY] = useState(-15);
  const [hoveredLayer, setHoveredLayer] = useState<number | null>(null);

  const maxHeight = Math.max(...terrain.layers.map(l => l.height));

  return (
    <div style={{ position: 'relative', height: 450, perspective: 1200, overflow: 'hidden', borderRadius: 8, background: 'linear-gradient(180deg, #f0e6d2 0%, #d4c4a8 100%)' }}>
      <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 10 }}>
        <Space direction="vertical" size="small">
          <Text type="secondary" style={{ fontSize: 12 }}>俯仰: {rotateX}°</Text>
          <Slider min={-30} max={60} value={rotateX} onChange={setRotateX} style={{ width: 120 }} />
          <Text type="secondary" style={{ fontSize: 12 }}>旋转: {rotateY}°</Text>
          <Slider min={-60} max={60} value={rotateY} onChange={setRotateY} style={{ width: 120 }} />
        </Space>
      </div>

      <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 10, maxWidth: 240 }}>
        <Title level={5} style={{ margin: 0, color: '#3d2817' }}>
          <EnvironmentOutlined /> {terrain.name}
        </Title>
        <Text type="secondary" style={{ fontSize: 12, color: '#5c4d3c' }}>{terrain.region}</Text>
      </div>

      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '55%',
          transformStyle: 'preserve-3d',
          transform: `translate(-50%, -50%) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: 'transform 0.3s ease'
        }}
      >
        {terrain.layers.map((layer, idx) => {
          const sizeBase = 320 - idx * 45;
          const heightPx = (layer.height / maxHeight) * 80;
          const opacity = hoveredLayer === idx ? 1 : 0.88;
          return (
            <div
              key={layer.name}
              onMouseEnter={() => setHoveredLayer(idx)}
              onMouseLeave={() => setHoveredLayer(null)}
              style={{
                position: 'absolute',
                left: '50%',
                bottom: idx * 30,
                width: sizeBase,
                height: heightPx,
                transform: `translateX(-50%) translateZ(${idx * 25}px)`,
                background: `linear-gradient(180deg, ${layer.color}dd 0%, ${layer.color} 100%)`,
                borderRadius: sizeBase > 200 ? '4px' : '2px',
                boxShadow: `0 4px 20px rgba(0,0,0,0.3), inset 0 2px 10px rgba(255,255,255,0.1)`,
                opacity,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: hoveredLayer === idx ? '2px solid #f0d78c' : 'none'
              }}
            >
              <Text style={{ color: '#fff', fontSize: 11, fontWeight: 600, textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>
                {hoveredLayer === idx ? `${layer.name} · ${layer.height}m` : layer.name.slice(0, 4)}
              </Text>
            </div>
          );
        })}

        {terrain.waterFeatures.map((wf, idx) => (
          <div
            key={wf.name}
            style={{
              position: 'absolute',
              left: '50%',
              bottom: idx === 0 ? 0 : -10 + idx * 8,
              width: 100 - idx * 15,
              height: wf.type === 'waterfall' ? 40 : 6,
              transform: `translateX(-50%) translateZ(${idx * 5}px) ${wf.type === 'waterfall' ? 'rotateX(-90deg)' : ''}`,
              background: wf.type === 'waterfall'
                ? 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(200,220,255,0.7) 100%)'
                : 'linear-gradient(90deg, rgba(100,150,200,0.6) 0%, rgba(150,200,230,0.8) 50%, rgba(100,150,200,0.6) 100%)',
              borderRadius: 3,
              boxShadow: '0 0 10px rgba(100,150,200,0.5)'
            }}
          />
        ))}
      </div>

      {hoveredLayer !== null && (
        <div style={{
          position: 'absolute',
          bottom: 12,
          left: 12,
          right: 12,
          background: 'rgba(61,40,23,0.92)',
          color: '#f5e6c8',
          padding: '10px 14px',
          borderRadius: 6,
          zIndex: 10
        }}>
          <Text strong style={{ color: '#f0d78c' }}>{terrain.layers[hoveredLayer].name}</Text>
          <Text style={{ color: '#d4c4a8', marginLeft: 8, fontSize: 12 }}>海拔约 {terrain.layers[hoveredLayer].height} 米</Text>
          <Paragraph style={{ margin: '6px 0 0 0', color: '#e8dcc4', fontSize: 13 }}>
            {terrain.layers[hoveredLayer].description}
          </Paragraph>
        </div>
      )}
    </div>
  );
};

const AncientChinaMap = ({ route, onStopSelect }: { route?: PainterTravelRoute; onStopSelect?: (stop: TravelStop) => void }) => {
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);

  if (!route) {
    return <Empty description="暂无游历路线数据" />;
  }

  return (
    <div style={{ position: 'relative', height: 520, borderRadius: 8, overflow: 'hidden', background: `
      radial-gradient(ellipse at center, #e8dcc4 0%, #d4c4a8 60%, #bfae8e 100%)
    ` }}>
      <svg viewBox="0 0 100 80" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
            <path d="M 5 0 L 0 0 0 5" fill="none" stroke="#a89880" strokeWidth="0.08" opacity="0.5" />
          </pattern>
        </defs>
        <rect width="100" height="80" fill="url(#grid)" />

        <path
          d="M 15,45 Q 25,30 40,35 T 65,38 Q 75,40 85,35"
          fill="none"
          stroke="#8b7355"
          strokeWidth="0.5"
          opacity="0.4"
        />
        <path
          d="M 30,55 Q 40,50 55,52 Q 65,55 75,50"
          fill="none"
          stroke="#7a9a6d"
          strokeWidth="0.35"
          opacity="0.6"
        />
        <path
          d="M 20,60 Q 35,58 50,60 Q 65,62 80,58"
          fill="none"
          stroke="#6b8cb8"
          strokeWidth="0.6"
          opacity="0.5"
        />

        <path
          d="M 38,28 L 42,30 L 40,33 Z"
          fill="#c0392b"
          opacity="0.6"
        />
        <text x="40" y="38" textAnchor="middle" fontSize="1.6" fill="#8b4513" fontWeight="bold">秦 岭</text>

        <path
          d="M 55,25 Q 58,28 60,26 L 62,30 Q 60,33 57,31 Z"
          fill="#c0392b"
          opacity="0.5"
        />
        <text x="60" y="36" textAnchor="middle" fontSize="1.4" fill="#8b4513" opacity="0.8">太行山</text>

        <ellipse cx="58" cy="58" rx="10" ry="2.5" fill="#6b8cb8" opacity="0.4" />
        <text x="58" y="59" textAnchor="middle" fontSize="1.5" fill="#2c5282" opacity="0.8">长江</text>

        <ellipse cx="45" cy="42" rx="8" ry="2" fill="#6b8cb8" opacity="0.4" />
        <text x="45" y="43" textAnchor="middle" fontSize="1.5" fill="#2c5282" opacity="0.8">黄河</text>

        {route.stops.length > 1 && (
          <polyline
            points={route.stops.map(s => `${s.location.mapX},${s.location.mapY}`).join(' ')}
            fill="none"
            stroke="#c0392b"
            strokeWidth="0.25"
            strokeDasharray="1,0.5"
            opacity="0.8"
          />
        )}
      </svg>

      {route.stops.map((stop, idx) => {
        const isSelected = selectedStopId === stop.id;
        return (
          <div
            key={stop.id}
            onClick={() => {
              setSelectedStopId(stop.id);
              onStopSelect?.(stop);
            }}
            style={{
              position: 'absolute',
              left: `${stop.location.mapX}%`,
              top: `${stop.location.mapY}%`,
              transform: 'translate(-50%, -50%)',
              cursor: 'pointer',
              zIndex: isSelected ? 20 : 10
            }}
          >
            <div style={{
              width: isSelected ? 28 : 22,
              height: isSelected ? 28 : 22,
              borderRadius: '50%',
              background: isSelected ? '#c0392b' : '#8b4513',
              border: '2px solid #f5e6c8',
              boxShadow: isSelected ? '0 0 15px rgba(192,57,43,0.8)' : '0 2px 6px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}>
              <Text style={{ color: '#f5e6c8', fontSize: 11, fontWeight: 700 }}>{idx + 1}</Text>
            </div>
            <div style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginTop: 4,
              whiteSpace: 'nowrap'
            }}>
              <Text style={{
                fontSize: 11,
                color: isSelected ? '#c0392b' : '#3d2817',
                fontWeight: isSelected ? 700 : 500,
                background: 'rgba(245,230,200,0.9)',
                padding: '1px 6px',
                borderRadius: 4
              }}>
                {stop.location.ancientName || stop.location.name}
              </Text>
            </div>
          </div>
        );
      })}

      <div style={{
        position: 'absolute',
        top: 12,
        left: 12,
        background: 'rgba(61,40,23,0.85)',
        padding: '8px 14px',
        borderRadius: 6,
        maxWidth: 260
      }}>
        <Title level={5} style={{ margin: 0, color: '#f0d78c' }}>
          <GlobalOutlined /> {route.painterName}游历图
        </Title>
        <Text style={{ color: '#d4c4a8', fontSize: 12, display: 'block', marginTop: 4 }}>
          点击地图上的标记，查看各阶段的艺术转变
        </Text>
      </div>

      {selectedStopId && (
        <div style={{
          position: 'absolute',
          bottom: 12,
          right: 12,
          left: 12,
          background: 'rgba(61,40,23,0.92)',
          padding: 14,
          borderRadius: 8,
          zIndex: 30
        }}>
          {(() => {
            const stop = route.stops.find(s => s.id === selectedStopId);
            if (!stop) return null;
            const stopIdx = route.stops.findIndex(s => s.id === selectedStopId) + 1;
            return (
              <Row gutter={12}>
                <Col flex="80px">
                  <Avatar size={64} style={{ background: '#c0392b', fontSize: 24 }}>{stopIdx}</Avatar>
                </Col>
                <Col flex="auto">
                  <Title level={5} style={{ margin: 0, color: '#f0d78c' }}>
                    {stop.location.ancientName || stop.location.name}
                    <Text type="secondary" style={{ color: '#a89880', marginLeft: 8, fontSize: 13 }}>
                      {stop.yearDisplay} · 逗留{stop.duration || '未详'}
                    </Text>
                  </Title>
                  <Paragraph style={{ margin: '4px 0', color: '#e8dcc4', fontSize: 13 }}>
                    <Text strong style={{ color: '#f0d78c' }}>缘由：</Text>{stop.purpose}
                  </Paragraph>
                  <Paragraph style={{ margin: 0, color: '#e8dcc4', fontSize: 13 }}>
                    <Text strong style={{ color: '#f0d78c' }}>艺术成果：</Text>{stop.artisticOutcome}
                  </Paragraph>
                  {stop.styleTransformation && (
                    <Tag color="red" style={{ marginTop: 6 }}>
                      <RiseOutlined /> {stop.styleTransformation}
                    </Tag>
                  )}
                </Col>
              </Row>
            );
          })()}
        </div>
      )}
    </div>
  );
};

const ClimateSimulationPanel = ({ climate }: { climate: ClimateSimulation }) => {
  const [currentConditionIdx, setCurrentConditionIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setCurrentConditionIdx(prev => (prev + 1) % climate.conditions.length);
      }, 4000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, climate.conditions.length]);

  const condition: ClimateCondition = climate.conditions[currentConditionIdx];
  const fogOpacity = condition.fogLevel / 100 * 0.7;
  const cloudOpacity = condition.cloudLevel / 100 * 0.5;

  return (
    <div style={{ position: 'relative', height: 420, borderRadius: 8, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: condition.timeOfDay === 'dawn' || condition.timeOfDay === 'dusk'
          ? 'linear-gradient(180deg, #ff9966 0%, #e8a87c 30%, #c38d6d 70%, #5c4d3c 100%)'
          : condition.timeOfDay === 'night'
          ? 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
          : 'linear-gradient(180deg, #87ceeb 0%, #b0d4e8 40%, #d4c4a8 100%)',
        transition: 'background 2s ease'
      }} />

      {condition.cloudLevel > 0 && (
        <div style={{
          position: 'absolute',
          top: '10%',
          left: 0,
          right: 0,
          height: '30%',
          background: `radial-gradient(ellipse at 20% 30%, rgba(255,255,255,${cloudOpacity}) 0%, transparent 50%),
                       radial-gradient(ellipse at 60% 20%, rgba(255,255,255,${cloudOpacity * 0.8}) 0%, transparent 40%),
                       radial-gradient(ellipse at 80% 40%, rgba(255,255,255,${cloudOpacity * 0.6}) 0%, transparent 35%)`,
          animation: 'cloudMove 30s linear infinite',
          pointerEvents: 'none'
        }} />
      )}

      {condition.fogLevel > 0 && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60%',
          background: `linear-gradient(0deg, rgba(245,230,200,${fogOpacity}) 0%, rgba(245,230,200,${fogOpacity * 0.5}) 50%, transparent 100%)`,
          pointerEvents: 'none',
          transition: 'opacity 1s ease'
        }} />
      )}

      {condition.windSpeed > 10 && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `repeating-linear-gradient(${90 + condition.windSpeed}deg, transparent, transparent 20px, rgba(255,255,255,0.08) 20px, rgba(255,255,255,0.08) 22px)`,
          animation: `windBlow ${15 / (condition.windSpeed / 10)}s linear infinite`,
          pointerEvents: 'none'
        }} />
      )}

      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '35%',
        background: 'linear-gradient(180deg, #7a9a6d 0%, #5c4d3c 100%)',
        clipPath: 'polygon(0 40%, 15% 20%, 30% 50%, 45% 15%, 60% 45%, 75% 10%, 90% 35%, 100% 55%, 100% 100%, 0 100%)'
      }} />

      <div style={{
        position: 'absolute',
        bottom: '8%',
        left: 0,
        right: 0,
        height: '15%',
        background: `linear-gradient(90deg, rgba(100,150,200,0.6) 0%, rgba(150,200,230,0.8) 50%, rgba(100,150,200,0.6) 100%)`,
        animation: 'waterFlow 4s ease-in-out infinite'
      }} />

      <div style={{
        position: 'absolute',
        top: 12,
        left: 12,
        right: 12,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        zIndex: 10
      }}>
        <div style={{ background: 'rgba(61,40,23,0.85)', padding: '8px 14px', borderRadius: 6 }}>
          <Title level={5} style={{ margin: 0, color: '#f0d78c' }}>
            <CloudOutlined /> {climate.locationName}
          </Title>
          <Space size="middle" style={{ marginTop: 6 }}>
            <Tag color="orange">{SEASON_LABELS[condition.season]}季</Tag>
            <Tag color="gold">{TIME_LABELS[condition.timeOfDay]}</Tag>
            <Tag color="blue">{condition.temperature}°C</Tag>
          </Space>
        </div>

        <Space>
          <Button
            icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
            onClick={() => setIsPlaying(!isPlaying)}
            type="primary"
            ghost
          >
            {isPlaying ? '暂停' : '播放时序'}
          </Button>
          <Button
            icon={<SoundOutlined />}
            onClick={() => setSoundEnabled(!soundEnabled)}
            type={soundEnabled ? 'primary' : 'default'}
            ghost
          >
            {soundEnabled ? '环境音开' : '环境音关'}
          </Button>
        </Space>
      </div>

      <div style={{
        position: 'absolute',
        bottom: 12,
        left: 12,
        right: 12,
        zIndex: 10
      }}>
        <Row gutter={[12, 8]}>
          <Col span={6}>
            <Card size="small" style={{ background: 'rgba(61,40,23,0.85)', border: 'none' }} bodyStyle={{ padding: 8 }}>
              <Text style={{ color: '#a89880', fontSize: 11 }}>湿度</Text>
              <Progress percent={condition.humidity} size="small" strokeColor="#6b8cb8" showInfo={false} />
              <Text style={{ color: '#f5e6c8', fontSize: 12, fontWeight: 600 }}>{condition.humidity}%</Text>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" style={{ background: 'rgba(61,40,23,0.85)', border: 'none' }} bodyStyle={{ padding: 8 }}>
              <Text style={{ color: '#a89880', fontSize: 11 }}>风速</Text>
              <Progress percent={Math.min(condition.windSpeed * 3, 100)} size="small" strokeColor="#8b7355" showInfo={false} />
              <Text style={{ color: '#f5e6c8', fontSize: 12, fontWeight: 600 }}>{condition.windSpeed} km/h {condition.windDirection}</Text>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" style={{ background: 'rgba(61,40,23,0.85)', border: 'none' }} bodyStyle={{ padding: 8 }}>
              <Text style={{ color: '#a89880', fontSize: 11 }}>雾霭</Text>
              <Progress percent={condition.fogLevel} size="small" strokeColor="#bfae8e" showInfo={false} />
              <Text style={{ color: '#f5e6c8', fontSize: 12, fontWeight: 600 }}>{condition.fogLevel}%</Text>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" style={{ background: 'rgba(61,40,23,0.85)', border: 'none' }} bodyStyle={{ padding: 8 }}>
              <Text style={{ color: '#a89880', fontSize: 11 }}>云量</Text>
              <Progress percent={condition.cloudLevel} size="small" strokeColor="#e8dcc4" showInfo={false} />
              <Text style={{ color: '#f5e6c8', fontSize: 12, fontWeight: 600 }}>{condition.cloudLevel}%</Text>
            </Card>
          </Col>
        </Row>

        <Card size="small" style={{ background: 'rgba(61,40,23,0.85)', border: 'none', marginTop: 8 }} bodyStyle={{ padding: 10 }}>
          <Paragraph style={{ margin: 0, color: '#e8dcc4', fontSize: 13 }}>
            {condition.description}
          </Paragraph>
        </Card>

        <Divider style={{ margin: '8px 0', borderColor: 'rgba(245,230,200,0.2)' }} />

        <Space size={[4, 4]} wrap>
          {climate.ambientSounds.map(sound => (
            <Tag
              key={sound.id}
              icon={<span>{SOUND_ICONS[sound.type]}</span>}
              color="geekblue"
              style={{ opacity: soundEnabled ? sound.intensity * 0.5 + 0.5 : 0.3, fontSize: 12 }}
            >
              {sound.name}
              {sound.direction && <Text style={{ color: '#a89880', marginLeft: 4, fontSize: 10 }}>· {sound.direction}</Text>}
            </Tag>
          ))}
        </Space>
      </div>

      <style>{`
        @keyframes cloudMove {
          0% { transform: translateX(0); }
          100% { transform: translateX(-30px); }
        }
        @keyframes windBlow {
          0% { background-position: 0 0; }
          100% { background-position: 100px 0; }
        }
        @keyframes waterFlow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.9; }
        }
      `}</style>
    </div>
  );
};

const SchoolComparisonPanel = ({ comparison }: { comparison: SchoolGeoComparison }) => {
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(comparison.aiGuide.questions[0]?.id || null);

  return (
    <div>
      <Card
        title={<span style={{ color: '#f0d78c' }}><ThunderboltOutlined /> 南北画派地理溯源对比</span>}
        style={{ background: 'rgba(61,40,23,0.92)', border: 'none' }}
        headStyle={{ borderBottom: '1px solid rgba(245,230,200,0.2)' }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Card size="small" style={{ background: 'rgba(192,57,43,0.15)', border: '1px solid rgba(192,57,43,0.4)' }}>
              <Title level={5} style={{ margin: 0, color: '#e74c3c' }}>🏔️ {comparison.northSchool.name}</Title>
              <Text style={{ color: '#e8dcc4', fontSize: 12, display: 'block', marginTop: 4 }}>
                <EnvironmentOutlined /> {comparison.northSchool.region}
              </Text>
              <Divider style={{ margin: '8px 0', borderColor: 'rgba(192,57,43,0.3)' }} />
              <Text strong style={{ color: '#f0d78c' }}>地貌：</Text>
              <Text style={{ color: '#e8dcc4' }}>{comparison.northSchool.terrainType}</Text>
              <br />
              <Text strong style={{ color: '#f0d78c' }}>气候：</Text>
              <Text style={{ color: '#e8dcc4' }}>{comparison.northSchool.climateType}</Text>
              <Divider style={{ margin: '8px 0', borderColor: 'rgba(192,57,43,0.3)' }} />
              <List
                size="small"
                dataSource={comparison.northSchool.artisticFeatures}
                renderItem={item => (
                  <List.Item style={{ border: 'none', padding: '2px 0' }}>
                    <Text style={{ color: '#e8dcc4', fontSize: 12 }}>• {item}</Text>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card size="small" style={{ background: 'rgba(39,174,96,0.12)', border: '1px solid rgba(39,174,96,0.4)' }}>
              <Title level={5} style={{ margin: 0, color: '#27ae60' }}>🌿 {comparison.southSchool.name}</Title>
              <Text style={{ color: '#e8dcc4', fontSize: 12, display: 'block', marginTop: 4 }}>
                <EnvironmentOutlined /> {comparison.southSchool.region}
              </Text>
              <Divider style={{ margin: '8px 0', borderColor: 'rgba(39,174,96,0.3)' }} />
              <Text strong style={{ color: '#f0d78c' }}>地貌：</Text>
              <Text style={{ color: '#e8dcc4' }}>{comparison.southSchool.terrainType}</Text>
              <br />
              <Text strong style={{ color: '#f0d78c' }}>气候：</Text>
              <Text style={{ color: '#e8dcc4' }}>{comparison.southSchool.climateType}</Text>
              <Divider style={{ margin: '8px 0', borderColor: 'rgba(39,174,96,0.3)' }} />
              <List
                size="small"
                dataSource={comparison.southSchool.artisticFeatures}
                renderItem={item => (
                  <List.Item style={{ border: 'none', padding: '2px 0' }}>
                    <Text style={{ color: '#e8dcc4', fontSize: 12 }}>• {item}</Text>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </Card>

      <Card
        title={<span style={{ color: '#f0d78c' }}><CompassOutlined /> 五大维度差异解析</span>}
        style={{ background: 'rgba(61,40,23,0.92)', border: 'none', marginTop: 12 }}
        headStyle={{ borderBottom: '1px solid rgba(245,230,200,0.2)' }}
      >
        <Row gutter={[12, 12]}>
          {comparison.keyDifferences.map((diff, idx) => (
            <Col span={12} key={diff.aspect}>
              <Card size="small" style={{ background: 'rgba(245,230,200,0.06)', border: '1px solid rgba(245,230,200,0.15)', height: '100%' }}>
                <Space align="center">
                  <Badge count={idx + 1} style={{ backgroundColor: '#c0392b' }} />
                  <Text strong style={{ color: '#f0d78c', fontSize: 15 }}>{diff.aspect}</Text>
                </Space>
                <Row gutter={8} style={{ marginTop: 8 }}>
                  <Col span={12}>
                    <Text type="danger" style={{ fontSize: 12 }}>北方：</Text>
                    <Text style={{ color: '#e8dcc4', fontSize: 12, display: 'block' }}>{diff.north}</Text>
                  </Col>
                  <Col span={12}>
                    <Text style={{ color: '#27ae60', fontSize: 12 }}>南方：</Text>
                    <Text style={{ color: '#e8dcc4', fontSize: 12, display: 'block' }}>{diff.south}</Text>
                  </Col>
                </Row>
                <Paragraph style={{ margin: '6px 0 0 0', color: '#bfae8e', fontSize: 12 }}>
                  <InfoCircleOutlined style={{ marginRight: 4 }} />
                  {diff.explanation}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      <Card
        title={<span style={{ color: '#f0d78c' }}><BulbOutlined /> AI导师引导问答</span>}
        style={{ background: 'rgba(61,40,23,0.92)', border: 'none', marginTop: 12 }}
        headStyle={{ borderBottom: '1px solid rgba(245,230,200,0.2)' }}
      >
        <Paragraph style={{ color: '#e8dcc4' }}>
          {comparison.aiGuide.opening}
        </Paragraph>
        <Divider style={{ margin: '8px 0', borderColor: 'rgba(245,230,200,0.2)' }} />
        <AntTimeline
          mode="left"
          items={comparison.aiGuide.questions.map(q => ({
            color: '#c0392b',
            dot: <BulbOutlined />,
            children: (
              <div
                onClick={() => setExpandedQuestion(expandedQuestion === q.id ? null : q.id)}
                style={{ cursor: 'pointer' }}
              >
                <Text strong style={{ color: '#f0d78c', fontSize: 14 }}>{q.question}</Text>
                {expandedQuestion === q.id && (
                  <div style={{ marginTop: 8, padding: 10, background: 'rgba(245,230,200,0.08)', borderRadius: 6 }}>
                    <Text style={{ color: '#bfae8e', fontSize: 12 }}>
                      <InfoCircleOutlined style={{ marginRight: 4 }} />提示：{q.hint}
                    </Text>
                  </div>
                )}
                {expandedQuestion !== q.id && (
                  <DownOutlined style={{ color: '#a89880', marginLeft: 6, fontSize: 10 }} />
                )}
              </div>
            )
          }))}
        />
        <Divider style={{ margin: '8px 0', borderColor: 'rgba(245,230,200,0.2)' }} />
        <Paragraph style={{ margin: 0, color: '#e8dcc4', fontStyle: 'italic' }}>
          <ReadOutlined style={{ marginRight: 4, color: '#f0d78c' }} />
          {comparison.aiGuide.conclusion}
        </Paragraph>
      </Card>
    </div>
  );
};

interface Props {
  onNavigate?: (page: string, id?: string) => void;
}

export default function GeoImmersionPage({ onNavigate }: Props) {
  const [availablePaintings, setAvailablePaintings] = useState<{ id: string; title: string; imageUrl: string; theme: string }[]>([]);
  const [selectedPaintingId, setSelectedPaintingId] = useState<string | null>(null);
  const [immersionData, setImmersionData] = useState<(GeoImmersionPaintingData & { painting?: Painting; painter?: Painter }) | null>(null);
  const [comparisonData, setComparisonData] = useState<SchoolGeoComparison | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('terrain');
  const [walkthroughIdx, setWalkthroughIdx] = useState(0);
  const [showWalkthrough, setShowWalkthrough] = useState(false);

  useEffect(() => {
    knowledgeApi.getAvailableGeoImmersionPaintings()
      .then(data => {
        setAvailablePaintings(data);
        if (data.length > 0) {
          setSelectedPaintingId(data[0].id);
        }
      })
      .finally(() => setLoading(false));
    knowledgeApi.getSchoolGeoComparison().then(setComparisonData);
  }, []);

  useEffect(() => {
    if (selectedPaintingId) {
      setLoading(true);
      knowledgeApi.getGeoImmersionPainting(selectedPaintingId)
        .then(data => {
          setImmersionData(data);
          setWalkthroughIdx(0);
        })
        .finally(() => setLoading(false));
    }
  }, [selectedPaintingId]);

  if (loading && !immersionData) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <Spin size="large" tip="加载沉浸式地理体验中..." />
      </div>
    );
  }

  return (
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
                <div style={{ fontSize: 56, textAlign: 'center' }}>🗺️</div>
              </Col>
              <Col flex="auto">
                <Title level={2} style={{ margin: 0, color: '#f0d78c' }}>
                  山河入画 · 地理沉浸式体验
                </Title>
                <Paragraph style={{ margin: '6px 0 0 0', color: '#d4c4a8', fontSize: 14 }}>
                  将画作与其诞生的地理空间深度绑定——通过三维地形重建、气候模拟、古地图游历，
                  让你站在画家当年的位置，感受范宽笔下的关陕雄奇、黄公望心中的富春悠远。
                </Paragraph>
              </Col>
              <Col>
                <Space wrap>
                  <Text style={{ color: '#a89880', fontSize: 12 }}>选择画作：</Text>
                  <Select
                    value={selectedPaintingId || undefined}
                    onChange={setSelectedPaintingId}
                    style={{ minWidth: 200 }}
                    options={availablePaintings.map(p => ({ value: p.id, label: p.title }))}
                  />
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {immersionData && (
        <>
          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col xs={24} lg={16}>
              <Tabs
                activeKey={activeTab}
                onChange={k => setActiveTab(k as TabKey)}
                type="card"
                items={[
                  { key: 'terrain', label: <span><EnvironmentOutlined /> 三维地形</span> },
                  { key: 'climate', label: <span><CloudOutlined /> 气候模拟</span> },
                  { key: 'map', label: <span><GlobalOutlined /> 古地图</span> },
                  { key: 'route', label: <span><UserOutlined /> 画家行迹</span> },
                  { key: 'comparison', label: <span><ThunderboltOutlined /> 南北对比</span> },
                  { key: 'guide', label: <span><BulbOutlined /> AI导师</span> }
                ]}
                style={{ background: 'rgba(61,40,23,0.92)', borderRadius: 8, padding: 8 }}
              />

              <div style={{ marginTop: 12 }}>
                {activeTab === 'terrain' && <Terrain3DVisualization terrain={immersionData.terrain} />}
                {activeTab === 'climate' && <ClimateSimulationPanel climate={immersionData.climate} />}
                {activeTab === 'map' && (
                  <AncientChinaMap route={immersionData.travelRoute} />
                )}
                {activeTab === 'route' && immersionData.travelRoute && (
                  <Card style={{ background: 'rgba(61,40,23,0.92)', border: 'none', borderRadius: 8 }} bodyStyle={{ padding: 20 }}>
                    <Title level={4} style={{ margin: 0, color: '#f0d78c' }}>
                      {immersionData.travelRoute.painterName}的艺术足迹
                    </Title>
                    <Paragraph style={{ color: '#e8dcc4', marginTop: 8 }}>
                      {immersionData.travelRoute.overview}
                    </Paragraph>
                    <Divider style={{ borderColor: 'rgba(245,230,200,0.2)' }} />

                    <Title level={5} style={{ color: '#f0d78c' }}>📍 游历路线</Title>
                    <AntTimeline
                      mode="alternate"
                      items={immersionData.travelRoute.stops.map((stop, idx) => ({
                        color: idx === immersionData.travelRoute!.stops.length - 1 ? 'green' : '#c0392b',
                        dot: <EnvironmentOutlined />,
                        label: <Text style={{ color: '#bfae8e', fontSize: 12 }}>{stop.yearDisplay}</Text>,
                        children: (
                          <Card size="small" style={{ background: 'rgba(245,230,200,0.06)', border: '1px solid rgba(245,230,200,0.15)' }}>
                            <Text strong style={{ color: '#f0d78c' }}>
                              {stop.location.ancientName || stop.location.name}
                            </Text>
                            {stop.duration && (
                              <Tag color="blue" style={{ marginLeft: 8 }}>{stop.duration}</Tag>
                            )}
                            <Paragraph style={{ margin: '4px 0', color: '#e8dcc4', fontSize: 13 }}>
                              {stop.artisticOutcome}
                            </Paragraph>
                            {stop.styleTransformation && (
                              <Tag color="red"><RiseOutlined /> {stop.styleTransformation}</Tag>
                            )}
                          </Card>
                        )
                      }))}
                    />

                    <Divider style={{ borderColor: 'rgba(245,230,200,0.2)', margin: '16px 0' }} />

                    <Title level={5} style={{ color: '#f0d78c' }}>🎨 风格演变三阶段</Title>
                    <Row gutter={[12, 12]}>
                      {immersionData.travelRoute.styleEvolutionPhases.map((phase, idx) => (
                        <Col md={8} key={phase.phaseName}>
                          <Card
                            hoverable
                            style={{
                              background: 'rgba(245,230,200,0.06)',
                              border: `1px solid ${idx === 2 ? 'rgba(240,215,140,0.5)' : 'rgba(245,230,200,0.15)'}`,
                              height: '100%'
                            }}
                          >
                            <Badge count={`第${idx + 1}阶段`} style={{ backgroundColor: idx === 2 ? '#c0392b' : '#8b7355' }} />
                            <Title level={5} style={{ color: '#f0d78c', margin: '8px 0' }}>{phase.phaseName}</Title>
                            <Text style={{ color: '#a89880', fontSize: 12, display: 'block' }}>{phase.period}</Text>
                            <Paragraph style={{ margin: '6px 0', color: '#e8dcc4', fontSize: 12 }}>
                              <Text strong style={{ color: '#f0d78c' }}>地理影响：</Text>
                              {phase.locationInfluence}
                            </Paragraph>
                            <Paragraph style={{ margin: '4px 0', color: '#e8dcc4', fontSize: 12 }}>
                              <Text strong style={{ color: '#f0d78c' }}>风格特征：</Text>
                              {phase.styleCharacteristics}
                            </Paragraph>
                            <Paragraph style={{ margin: 0, color: '#bfae8e', fontSize: 12 }}>
                              代表作：{phase.representativeWorks.join('、')}
                            </Paragraph>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </Card>
                )}
                {activeTab === 'comparison' && comparisonData && (
                  <SchoolComparisonPanel comparison={comparisonData} />
                )}
                {activeTab === 'guide' && (
                  <Card style={{ background: 'rgba(61,40,23,0.92)', border: 'none', borderRadius: 8 }} bodyStyle={{ padding: 20 }}>
                    <Title level={4} style={{ margin: 0, color: '#f0d78c' }}>
                      <EyeOutlined /> 沉浸式观画引导
                    </Title>
                    <Paragraph style={{ color: '#e8dcc4', marginTop: 8, fontSize: 15 }}>
                      {immersionData.immersiveNarrative.introduction}
                    </Paragraph>

                    <Card
                      size="small"
                      style={{ background: 'rgba(192,57,43,0.1)', border: '1px solid rgba(192,57,43,0.3)', marginTop: 12 }}
                    >
                      <Text style={{ color: '#e74c3c' }}>🎬 场景设定</Text>
                      <Paragraph style={{ margin: '4px 0 0 0', color: '#e8dcc4' }}>
                        {immersionData.immersiveNarrative.sceneSetup}
                      </Paragraph>
                    </Card>

                    <Divider style={{ margin: '16px 0', borderColor: 'rgba(245,230,200,0.2)' }} />

                    <Space style={{ marginBottom: 12 }}>
                      <Button type="primary" onClick={() => { setShowWalkthrough(true); setWalkthroughIdx(0); }}>
                        <PlayCircleOutlined /> 开始沉浸式漫步
                      </Button>
                      {showWalkthrough && (
                        <Button onClick={() => setShowWalkthrough(false)}>
                          结束
                        </Button>
                      )}
                    </Space>

                    {showWalkthrough && (
                      <Card
                        style={{
                          background: 'linear-gradient(135deg, rgba(192,57,43,0.15) 0%, rgba(61,40,23,0.95) 100%)',
                          border: '2px solid rgba(240,215,140,0.4)',
                          borderRadius: 12
                        }}
                        bodyStyle={{ padding: 20 }}
                      >
                        <Row align="middle" justify="space-between" style={{ marginBottom: 12 }}>
                          <Tag color="gold" style={{ fontSize: 14, padding: '4px 12px' }}>
                            第 {walkthroughIdx + 1} / {immersionData.immersiveNarrative.guidedWalkthrough.length} 步
                          </Tag>
                          <Space>
                            <Button
                              size="small"
                              disabled={walkthroughIdx === 0}
                              onClick={() => setWalkthroughIdx(i => Math.max(0, i - 1))}
                            >
                              上一步
                            </Button>
                            <Button
                              size="small"
                              type="primary"
                              disabled={walkthroughIdx === immersionData.immersiveNarrative.guidedWalkthrough.length - 1}
                              onClick={() => setWalkthroughIdx(i => Math.min(immersionData!.immersiveNarrative.guidedWalkthrough.length - 1, i + 1))}
                            >
                              下一步 <ArrowRightOutlined />
                            </Button>
                          </Space>
                        </Row>
                        <Progress
                          percent={((walkthroughIdx + 1) / immersionData.immersiveNarrative.guidedWalkthrough.length) * 100}
                          showInfo={false}
                          strokeColor="#f0d78c"
                          style={{ marginBottom: 16 }}
                        />
                        <Paragraph style={{ margin: 0, color: '#f5e6c8', fontSize: 17, lineHeight: 1.9 }}>
                          {immersionData.immersiveNarrative.guidedWalkthrough[walkthroughIdx]}
                        </Paragraph>
                      </Card>
                    )}

                    <Divider style={{ margin: '16px 0', borderColor: 'rgba(245,230,200,0.2)' }} />

                    <Title level={5} style={{ color: '#f0d78c' }}>🤔 思考与感悟</Title>
                    <List
                      dataSource={immersionData.immersiveNarrative.reflectionPrompts}
                      renderItem={(item, idx) => (
                        <List.Item style={{ border: 'none', padding: '8px 0', alignItems: 'flex-start' }}>
                          <Avatar style={{ backgroundColor: '#c0392b', marginRight: 12 }}>{idx + 1}</Avatar>
                          <Text style={{ color: '#e8dcc4', fontSize: 14, lineHeight: 1.7 }}>{item}</Text>
                        </List.Item>
                      )}
                    />

                    <Divider style={{ margin: '16px 0', borderColor: 'rgba(245,230,200,0.2)' }} />

                    <Card size="small" style={{ background: 'rgba(245,230,200,0.06)', border: '1px solid rgba(245,230,200,0.15)' }}>
                      <Text strong style={{ color: '#f0d78c' }}>🌡️ 感官全体验：</Text>
                      <Paragraph style={{ margin: '6px 0 0 0', color: '#e8dcc4' }}>
                        {immersionData.climate.sensoryDescription}
                      </Paragraph>
                      <Tag color="gold" style={{ marginTop: 8 }}>
                        ⏰ 最佳体验时刻：{immersionData.climate.recommendedTime}
                      </Tag>
                    </Card>
                  </Card>
                )}
              </div>
            </Col>

            <Col xs={24} lg={8}>
              <Card
                style={{
                  background: 'rgba(61,40,23,0.92)',
                  border: 'none',
                  borderRadius: 8,
                  position: 'sticky',
                  top: 24
                }}
                bodyStyle={{ padding: 16 }}
              >
                <div style={{ position: 'relative', borderRadius: 6, overflow: 'hidden' }}>
                  <img
                    src={immersionData.painting?.imageUrl}
                    alt={immersionData.paintingTitle}
                    style={{ width: '100%', display: 'block' }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(transparent, rgba(61,40,23,0.95))',
                    padding: '20px 12px 12px'
                  }}>
                    <Title level={4} style={{ margin: 0, color: '#f0d78c' }}>
                      {immersionData.paintingTitle}
                    </Title>
                    <Text style={{ color: '#d4c4a8', fontSize: 13 }}>
                      {immersionData.painterName} · {immersionData.painting?.year}
                    </Text>
                  </div>
                </div>

                <Divider style={{ margin: '12px 0', borderColor: 'rgba(245,230,200,0.2)' }} />

                <Row gutter={[8, 8]}>
                  <Col span={12}>
                    <Card size="small" style={{ background: 'rgba(245,230,200,0.06)', border: 'none', textAlign: 'center' }}>
                      <EnvironmentOutlined style={{ color: '#c0392b', fontSize: 20 }} />
                      <Text style={{ color: '#e8dcc4', fontSize: 11, display: 'block', marginTop: 4 }}>地貌类型</Text>
                      <Text strong style={{ color: '#f0d78c', fontSize: 12 }}>{immersionData.terrain.name}</Text>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card size="small" style={{ background: 'rgba(245,230,200,0.06)', border: 'none', textAlign: 'center' }}>
                      <CloudOutlined style={{ color: '#6b8cb8', fontSize: 20 }} />
                      <Text style={{ color: '#e8dcc4', fontSize: 11, display: 'block', marginTop: 4 }}>气候带</Text>
                      <Text strong style={{ color: '#f0d78c', fontSize: 12 }}>{immersionData.terrain.climateZones[0]?.slice(0, 6)}</Text>
                    </Card>
                  </Col>
                </Row>

                <Divider style={{ margin: '12px 0', borderColor: 'rgba(245,230,200,0.2)' }} />

                <Title level={5} style={{ color: '#f0d78c', margin: 0 }}>🏔️ 地貌特征</Title>
                <Paragraph style={{ color: '#e8dcc4', fontSize: 13, marginTop: 8 }}>
                  {immersionData.terrain.terrainDescription}
                </Paragraph>

                <Divider style={{ margin: '12px 0', borderColor: 'rgba(245,230,200,0.2)' }} />

                <Title level={5} style={{ color: '#f0d78c', margin: 0 }}>🎨 艺术影响</Title>
                <Paragraph style={{ color: '#e8dcc4', fontSize: 13, marginTop: 8 }}>
                  {immersionData.terrain.artisticInfluence}
                </Paragraph>

                <Divider style={{ margin: '12px 0', borderColor: 'rgba(245,230,200,0.2)' }} />

                <Title level={5} style={{ color: '#f0d78c', margin: 0 }}>⛰️ 主要山岳</Title>
                <List
                  size="small"
                  dataSource={immersionData.terrain.mountainPeaks.slice(0, 2)}
                  renderItem={peak => (
                    <List.Item style={{ border: 'none', padding: '4px 0' }}>
                      <Text strong style={{ color: '#e8dcc4', fontSize: 12 }}>{peak.name}</Text>
                      <Tag color="orange" style={{ marginLeft: 6 }}>海拔 {peak.height}m</Tag>
                    </List.Item>
                  )}
                />

                <Divider style={{ margin: '12px 0', borderColor: 'rgba(245,230,200,0.2)' }} />

                <Title level={5} style={{ color: '#f0d78c', margin: 0 }}>💧 水文景观</Title>
                <List
                  size="small"
                  dataSource={immersionData.terrain.waterFeatures}
                  renderItem={wf => (
                    <List.Item style={{ border: 'none', padding: '4px 0' }}>
                      <Text style={{ color: '#e8dcc4', fontSize: 12 }}>
                        {wf.type === 'waterfall' ? '🌊' : wf.type === 'river' ? '🏞️' : wf.type === 'lake' ? '🏝️' : '💧'} {wf.name}
                      </Text>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}
