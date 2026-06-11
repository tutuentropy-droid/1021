import { useState, useEffect, useCallback } from 'react';
import { Button, Spin, Empty } from 'antd';
import {
  LeftOutlined,
  RightOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  EyeOutlined
} from '@ant-design/icons';
import type { SilentViewingData } from '../types';
import { knowledgeApi } from '../api';

function SilentViewingPage() {
  const [data, setData] = useState<SilentViewingData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showText, setShowText] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showUI, setShowUI] = useState(true);

  useEffect(() => {
    knowledgeApi.getSilentViewing()
      .then(data => {
        setData(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const currentItem = data[currentIndex];

  useEffect(() => {
    setShowText(false);
    setHintIndex(0);
    setShowHint(false);
    const textTimer = setTimeout(() => setShowText(true), 2000);
    const hintTimer = setTimeout(() => setShowHint(true), 8000);
    return () => {
      clearTimeout(textTimer);
      clearTimeout(hintTimer);
    };
  }, [currentIndex]);

  useEffect(() => {
    if (!showHint || !currentItem) return;
    const hintInterval = setInterval(() => {
      setHintIndex(prev => {
        if (prev >= currentItem.viewingHints.length - 1) {
          clearInterval(hintInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 6000);
    return () => clearInterval(hintInterval);
  }, [showHint, currentItem]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const handleMouseMove = () => {
      setShowUI(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (isFullscreen) setShowUI(false);
      }, 3000);
    };
    window.addEventListener('mousemove', handleMouseMove);
    handleMouseMove();
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, [isFullscreen]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < data.length - 1) setCurrentIndex(currentIndex + 1);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'f' || e.key === 'F') toggleFullscreen();
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
        setShowUI(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, data.length, isFullscreen, toggleFullscreen]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
        background: '#0a0a0a'
      }}>
        <Spin size="large" tip="..." style={{ color: '#6b5b45' }} />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
        background: '#0a0a0a'
      }}>
        <Empty description="" />
      </div>
    );
  }

  if (!currentItem) return null;

  const containerStyle = isFullscreen
    ? {
        position: 'fixed' as const,
        inset: 0,
        zIndex: 9999,
        background: '#0a0a0a',
        overflow: 'hidden'
      }
    : {
        borderRadius: 16,
        overflow: 'hidden' as const,
        background: '#0a0a0a',
        minHeight: '80vh'
      };

  return (
    <div style={containerStyle}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          padding: isFullscreen ? '32px 48px' : '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          opacity: showUI ? 1 : 0,
          transition: 'opacity 0.8s ease',
          background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 100%)'
        }}
      >
        <div style={{ color: '#8b7355', fontSize: 13, fontFamily: 'STKaiti, KaiTi, serif', letterSpacing: 4 }}>
          无 · 用 · 之 · 学
        </div>
        <Button
          type="text"
          icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
          onClick={toggleFullscreen}
          style={{ color: '#8b7355', fontSize: 16 }}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isFullscreen ? '80px 120px' : '60px 80px'
        }}
      >
        <img
          src={currentItem.imageUrl}
          alt={currentItem.paintingTitle}
          referrerPolicy="no-referrer"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            filter: 'drop-shadow(0 20px 60px rgba(0,0,0,0.5))',
            transition: 'all 1.5s ease',
            opacity: showText ? 0.85 : 1
          }}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10,
          padding: isFullscreen ? '48px 120px' : '32px 60px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'linear-gradient(0deg, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.6) 50%, transparent 100%)',
          opacity: showText ? 1 : 0,
          transition: 'opacity 2s ease'
        }}
      >
        <div
          style={{
            maxWidth: 720,
            textAlign: 'center'
          }}
        >
          <div
            style={{
              color: '#a89880',
              fontSize: 12,
              letterSpacing: 6,
              marginBottom: 16,
              fontFamily: 'STKaiti, KaiTi, serif'
            }}
          >
            {currentItem.paintingTitle}
            {currentItem.painterName && ` · ${currentItem.painterName}`}
          </div>
          <div
            style={{
              color: '#d4c4a8',
              fontSize: 18,
              lineHeight: 2.4,
              fontFamily: 'STKaiti, KaiTi, "Songti SC", SimSun, serif',
              letterSpacing: 2,
              whiteSpace: 'pre-wrap',
              textIndent: '2em',
              textAlign: 'justify'
            }}
          >
            {currentItem.textContent}
          </div>
          {currentItem.textSource && (
            <div
              style={{
                color: '#6b5b45',
                fontSize: 13,
                marginTop: 24,
                fontFamily: 'STKaiti, KaiTi, serif',
                textAlign: 'right'
              }}
            >
              —— {currentItem.textSource}
            </div>
          )}
        </div>

        {showHint && currentItem.viewingHints[hintIndex] && (
          <div
            style={{
              marginTop: 40,
              color: '#5c4a33',
              fontSize: 13,
              letterSpacing: 3,
              fontFamily: 'STKaiti, KaiTi, serif',
              opacity: showHint ? 0.8 : 0,
              transition: 'opacity 2s ease',
              animation: 'fadeIn 2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <EyeOutlined style={{ fontSize: 12 }} />
            {currentItem.viewingHints[hintIndex]}
          </div>
        )}
      </div>

      <div
        style={{
          position: 'absolute',
          left: isFullscreen ? 48 : 16,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          opacity: showUI && currentIndex > 0 ? 0.4 : 0,
          transition: 'opacity 0.8s ease',
          pointerEvents: showUI && currentIndex > 0 ? 'auto' : 'none'
        }}
      >
        <Button
          type="text"
          shape="circle"
          size="large"
          icon={<LeftOutlined style={{ fontSize: 20 }} />}
          onClick={handlePrev}
          style={{ color: '#8b7355', height: 56, width: 56 }}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          right: isFullscreen ? 48 : 16,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          opacity: showUI && currentIndex < data.length - 1 ? 0.4 : 0,
          transition: 'opacity 0.8s ease',
          pointerEvents: showUI && currentIndex < data.length - 1 ? 'auto' : 'none'
        }}
      >
        <Button
          type="text"
          shape="circle"
          size="large"
          icon={<RightOutlined style={{ fontSize: 20 }} />}
          onClick={handleNext}
          style={{ color: '#8b7355', height: 56, width: 56 }}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: isFullscreen ? 24 : 12,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          gap: 8,
          opacity: showUI ? 0.3 : 0,
          transition: 'opacity 0.8s ease'
        }}
      >
        {data.map((_, idx) => (
          <div
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            style={{
              width: idx === currentIndex ? 24 : 6,
              height: 6,
              borderRadius: 3,
              background: idx === currentIndex ? '#8b7355' : '#3d3325',
              transition: 'all 0.5s ease',
              cursor: 'pointer'
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 0.8; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default SilentViewingPage;
