import { useState, useEffect, useRef, useMemo } from 'react';
import { Card, Typography, Tag, Empty, Spin, Button, Space, Select, Row, Col } from 'antd';
import { ZoomInOutlined, ZoomOutOutlined, ReloadOutlined } from '@ant-design/icons';
import type { KnowledgeGraph, KnowledgeGraphNode, KnowledgeGraphEdge } from '../types';
import { knowledgeApi } from '../api';

const { Title, Paragraph } = Typography;
const { Option } = Select;

const NODE_COLORS: Record<string, string> = {
  painter: '#8b7355',
  school: '#a0522d',
  painting: '#6b8e23',
  dynasty: '#4a6b8a'
};

const NODE_ICONS: Record<string, string> = {
  painter: '👨‍🎨',
  school: '🎨',
  painting: '🖼️',
  dynasty: '🏛️'
};

const EDGE_COLORS: Record<string, string> = {
  teacher: '#c0392b',
  student: '#27ae60',
  influenced: '#8e44ad',
  belongsTo: '#2980b9',
  created: '#d35400',
  inherits: '#16a085',
  successor: '#7f8c8d'
};

interface KnowledgeGraphProps {
  initialPainterId?: string;
  initialSchoolId?: string;
  initialPaintingId?: string;
  onNodeClick?: (node: KnowledgeGraphNode) => void;
  height?: number;
}

interface PositionedNode extends KnowledgeGraphNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  fx?: number;
  fy?: number;
}

function KnowledgeGraphComponent({
  initialPainterId,
  initialSchoolId,
  initialPaintingId,
  onNodeClick,
  height = 600
}: KnowledgeGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [graph, setGraph] = useState<KnowledgeGraph | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<KnowledgeGraphNode | null>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [depth, setDepth] = useState(2);
  const [filterType, setFilterType] = useState<string | undefined>(undefined);

  useEffect(() => {
    loadGraph();
  }, [initialPainterId, initialSchoolId, initialPaintingId, depth]);

  const loadGraph = () => {
    setLoading(true);
    const params: any = { depth };
    if (initialPainterId) params.painterId = initialPainterId;
    else if (initialSchoolId) params.schoolId = initialSchoolId;
    else if (initialPaintingId) params.paintingId = initialPaintingId;
    knowledgeApi.getKnowledgeGraph(params)
      .then(data => setGraph(data))
      .finally(() => setLoading(false));
  };

  const displayGraph = useMemo(() => {
    if (!graph) return null;
    if (!filterType) return graph;
    const filteredNodeIds = new Set(
      graph.nodes.filter(n => n.type === filterType).map(n => n.id)
    );
    const connectedNodeIds = new Set(filteredNodeIds);
    graph.edges.forEach(e => {
      if (filteredNodeIds.has(e.source) || filteredNodeIds.has(e.target)) {
        connectedNodeIds.add(e.source);
        connectedNodeIds.add(e.target);
      }
    });
    return {
      nodes: graph.nodes.filter(n => connectedNodeIds.has(n.id)),
      edges: graph.edges.filter(e => connectedNodeIds.has(e.source) && connectedNodeIds.has(e.target))
    };
  }, [graph, filterType]);

  const { positions, edgePaths } = useMemo(() => {
    if (!displayGraph || displayGraph.nodes.length === 0) {
      return { positions: [] as PositionedNode[], edgePaths: [] as any[] };
    }
    const width = 900;
    const heightSpace = height;
    const centerX = width / 2;
    const centerY = heightSpace / 2;
    const nodes: PositionedNode[] = displayGraph.nodes.map((n, i) => {
      const angle = (i / displayGraph.nodes.length) * Math.PI * 2;
      const radius = 180 + Math.random() * 80;
      return {
        ...n,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: 0,
        vy: 0
      };
    });
    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    for (let iter = 0; iter < 200; iter++) {
      nodes.forEach(n => { n.vx = 0; n.vy = 0; });
      nodes.forEach((a, i) => {
        nodes.forEach((b, j) => {
          if (i >= j) return;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = 6000 / (dist * dist);
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          a.vx += fx; a.vy += fy;
          b.vx -= fx; b.vy -= fy;
        });
      });
      displayGraph.edges.forEach(e => {
        const a = nodeMap.get(e.source);
        const b = nodeMap.get(e.target);
        if (!a || !b) return;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const target = e.type === 'created' || e.type === 'belongsTo' ? 180 : 140;
        const force = (dist - target) * 0.02;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        a.vx += fx; a.vy += fy;
        b.vx -= fx; b.vy -= fy;
      });
      nodes.forEach(n => {
        n.vx += (centerX - n.x) * 0.003;
        n.vy += (centerY - n.y) * 0.003;
        n.vx = Math.max(-8, Math.min(8, n.vx));
        n.vy = Math.max(-8, Math.min(8, n.vy));
        n.x += n.vx * 0.5;
        n.y += n.vy * 0.5;
        n.x = Math.max(60, Math.min(width - 60, n.x));
        n.y = Math.max(60, Math.min(heightSpace - 60, n.y));
      });
    }
    const paths = displayGraph.edges.map(e => {
      const a = nodeMap.get(e.source);
      const b = nodeMap.get(e.target);
      if (!a || !b) return null;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const nx = -dy / dist;
      const ny = dx / dist;
      const mx = (a.x + b.x) / 2 + nx * 25;
      const my = (a.y + b.y) / 2 + ny * 25;
      return {
        id: e.id,
        path: `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`,
        midX: mx,
        midY: my,
        edge: e
      };
    }).filter(Boolean);
    return { positions: nodes, edgePaths: paths };
  }, [displayGraph, height]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(s => Math.max(0.3, Math.min(3, s * delta)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === svgRef.current || (e.target as Element).tagName === 'rect') {
      setDragging(true);
      setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging) {
      setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => setDragging(false);

  const handleNodeClick = (node: KnowledgeGraphNode) => {
    setSelectedNode(node);
    onNodeClick?.(node);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height }}>
        <Spin size="large" tip="构建知识图谱中..." />
      </div>
    );
  }

  if (!displayGraph || displayGraph.nodes.length === 0) {
    return (
      <div style={{ height }}>
        <Empty description="暂无图谱数据" />
      </div>
    );
  }

  return (
    <div>
      <Card
        className="card-shadow"
        style={{ borderRadius: 16, marginBottom: 16 }}
        bodyStyle={{ padding: 16 }}
      >
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} md={8}>
            <Space>
              <Button size="small" icon={<ZoomInOutlined />} onClick={() => setScale(s => Math.min(3, s * 1.2))} />
              <Button size="small" icon={<ZoomOutOutlined />} onClick={() => setScale(s => Math.max(0.3, s * 0.8))} />
              <Button size="small" icon={<ReloadOutlined />} onClick={() => { setScale(1); setOffset({ x: 0, y: 0 }); }} />
              <Select
                size="small"
                style={{ width: 120 }}
                placeholder="节点类型"
                allowClear
                value={filterType}
                onChange={setFilterType}
              >
                <Option value="painter">画家</Option>
                <Option value="school">画派</Option>
                <Option value="painting">画作</Option>
                <Option value="dynasty">朝代</Option>
              </Select>
              <Select
                size="small"
                style={{ width: 100 }}
                value={depth}
                onChange={setDepth}
              >
                <Option value={1}>深度1</Option>
                <Option value={2}>深度2</Option>
                <Option value={3}>深度3</Option>
              </Select>
            </Space>
          </Col>
          <Col xs={24} md={16} style={{ textAlign: 'right' }}>
            <Space wrap size={[8, 4]}>
              {Object.entries(NODE_ICONS).map(([type, icon]) => (
                <Tag key={type} color={NODE_COLORS[type]} style={{ margin: 0 }}>
                  {icon} {{
                    painter: '画家',
                    school: '画派',
                    painting: '画作',
                    dynasty: '朝代'
                  }[type]}
                </Tag>
              ))}
            </Space>
          </Col>
        </Row>
      </Card>

      <Card
        className="card-shadow"
        style={{ borderRadius: 16, overflow: 'hidden' }}
        bodyStyle={{ padding: 0 }}
      >
        <div
          style={{
            height,
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #fdfbf7 0%, #f8f5ee 100%)',
            cursor: dragging ? 'grabbing' : 'grab',
            position: 'relative'
          }}
        >
          <svg
            ref={svgRef}
            width="100%"
            height={height}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ touchAction: 'none' }}
          >
            <defs>
              {Object.entries(EDGE_COLORS).map(([type, color]) => (
                <marker
                  key={type}
                  id={`arrow-${type}`}
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
                </marker>
              ))}
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <rect width="100%" height={height} fill="transparent" />
            <g transform={`translate(${offset.x}, ${offset.y}) scale(${scale})`}>
              {edgePaths.map((ep: any) => (
                <g key={ep.id}>
                  <path
                    d={ep.path}
                    fill="none"
                    stroke={EDGE_COLORS[ep.edge.type] || '#999'}
                    strokeWidth={ep.edge.type === 'teacher' || ep.edge.type === 'student' ? 2 : 1.5}
                    strokeOpacity={selectedNode && ep.edge.source !== selectedNode.id && ep.edge.target !== selectedNode.id ? 0.2 : 0.7}
                    markerEnd={`url(#arrow-${ep.edge.type})`}
                  />
                  {(!selectedNode || ep.edge.source === selectedNode.id || ep.edge.target === selectedNode.id) && (
                    <text
                      x={ep.midX}
                      y={ep.midY}
                      fontSize="11"
                      fill={EDGE_COLORS[ep.edge.type]}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{
                        paintOrder: 'stroke',
                        stroke: '#fdfbf7',
                        strokeWidth: 3,
                        strokeLinejoin: 'round',
                        fontWeight: 500
                      }}
                    >
                      {ep.edge.label}
                    </text>
                  )}
                </g>
              ))}
              {positions.map(node => {
                const isSelected = selectedNode?.id === node.id;
                const isDimmed = selectedNode && !isSelected &&
                  !displayGraph.edges.some(e =>
                    (e.source === selectedNode.id && e.target === node.id) ||
                    (e.target === selectedNode.id && e.source === node.id)
                  );
                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    style={{ cursor: 'pointer', opacity: isDimmed ? 0.35 : 1 }}
                    onClick={(e) => { e.stopPropagation(); handleNodeClick(node); }}
                    filter={isSelected ? 'url(#glow)' : undefined}
                  >
                    <circle
                      r={node.type === 'painter' ? 38 : node.type === 'school' ? 34 : 30}
                      fill={NODE_COLORS[node.type]}
                      stroke={isSelected ? '#d4af37' : '#fdfbf7'}
                      strokeWidth={isSelected ? 4 : 3}
                      opacity={0.92}
                    />
                    <text
                      y={-4}
                      textAnchor="middle"
                      fontSize="18"
                      style={{ pointerEvents: 'none' }}
                    >
                      {NODE_ICONS[node.type]}
                    </text>
                    <text
                      y={14}
                      textAnchor="middle"
                      fontSize={node.name.length > 4 ? 10 : 12}
                      fill="#fdfbf7"
                      fontWeight="bold"
                      style={{ pointerEvents: 'none' }}
                    >
                      {node.name.length > 5 ? node.name.slice(0, 5) : node.name}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
          <div style={{ position: 'absolute', bottom: 12, left: 16, color: '#a89880', fontSize: 12 }}>
            缩放: {(scale * 100).toFixed(0)}% · 拖拽平移 · 滚轮缩放 · 点击节点查看详情
          </div>
        </div>
      </Card>

      {selectedNode && (
        <Card className="card-shadow" style={{ borderRadius: 16, marginTop: 16 }}>
          <Tag color={NODE_COLORS[selectedNode.type]} style={{ marginBottom: 12 }}>
            {NODE_ICONS[selectedNode.type]} {{
              painter: '画家',
              school: '画派',
              painting: '画作',
              dynasty: '朝代'
            }[selectedNode.type]}
          </Tag>
          <Title level={4} className="ink-title" style={{ color: '#5c4a33', marginTop: 0 }}>
            {selectedNode.name}
          </Title>
          {selectedNode.description && (
            <Paragraph style={{ color: '#6b5b45' }}>
              {selectedNode.description}
            </Paragraph>
          )}
          {selectedNode.metadata && Object.keys(selectedNode.metadata).length > 0 && (
            <div style={{ marginTop: 12 }}>
              {Object.entries(selectedNode.metadata).map(([k, v]) => (
                v ? (
                  <Tag key={k} style={{ marginBottom: 4 }}>
                    {{
                      years: '生卒',
                      artName: '字号'
                    }[k] || k}: {String(v)}
                  </Tag>
                ) : null
              ))}
            </div>
          )}
          {selectedNode.type === 'painter' && (
            <div style={{ marginTop: 12 }}>
              <Button
                type="primary"
                size="small"
                onClick={() => onNodeClick?.(selectedNode)}
                style={{ background: '#8b7355', borderColor: '#8b7355' }}
              >
                查看画家详情
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

export default KnowledgeGraphComponent;
