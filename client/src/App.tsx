import { useState, useEffect } from 'react';
import { Layout, Menu, Spin } from 'antd';
import {
  BookOutlined,
  AppstoreOutlined,
  PictureOutlined,
  FileTextOutlined,
  MessageOutlined,
  BulbOutlined
} from '@ant-design/icons';
import type { Stats } from './types';
import { knowledgeApi } from './api';
import HomePage from './pages/HomePage';
import KnowledgeTree from './pages/KnowledgeTree';
import GalleryPage from './pages/GalleryPage';
import FlashcardsPage from './pages/FlashcardsPage';
import ChatGuidePage from './pages/ChatGuidePage';
import TheoriesPage from './pages/TheoriesPage';

const { Header, Content, Sider, Footer } = Layout;

type PageType = 'home' | 'tree' | 'gallery' | 'flashcards' | 'chat' | 'theories';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    knowledgeApi.getStats()
      .then(data => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  const menuItems = [
    { key: 'home', icon: <BulbOutlined />, label: '首页概览' },
    { key: 'tree', icon: <AppstoreOutlined />, label: '知识树' },
    { key: 'gallery', icon: <PictureOutlined />, label: '画作欣赏' },
    { key: 'flashcards', icon: <FileTextOutlined />, label: '知识抽认卡' },
    { key: 'chat', icon: <MessageOutlined />, label: '对话引导' },
    { key: 'theories', icon: <BookOutlined />, label: '画论典籍' }
  ];

  const handleNavigate = (page: string) => {
    setCurrentPage(page as PageType);
  };

  const renderPage = () => {
    if (loading && currentPage === 'home') {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <Spin size="large" tip="加载知识宝库中..." />
        </div>
      );
    }

    switch (currentPage) {
      case 'home':
        return <HomePage stats={stats!} onNavigate={handleNavigate} />;
      case 'tree':
        return <KnowledgeTree onNavigate={handleNavigate} />;
      case 'gallery':
        return <GalleryPage />;
      case 'flashcards':
        return <FlashcardsPage />;
      case 'chat':
        return <ChatGuidePage onNavigate={handleNavigate} />;
      case 'theories':
        return <TheoriesPage />;
      default:
        return <HomePage stats={stats!} onNavigate={handleNavigate} />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: 48 }}>
          <span style={{ fontSize: 28, marginRight: 12 }}>🖌️</span>
          <h1 className="ink-title" style={{ color: '#fdfbf7', margin: 0, fontSize: 22 }}>
            画脉通识
          </h1>
          <span className="ink-subtitle" style={{ color: '#d4c4a8', marginLeft: 12, fontSize: 13 }}>
            中国画知识学习系统
          </span>
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[currentPage]}
          items={menuItems}
          onClick={({ key }) => setCurrentPage(key as PageType)}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Layout>
        <Content style={{ padding: '24px', maxWidth: 1400, width: '100%', margin: '0 auto' }}>
          {renderPage()}
        </Content>
      </Layout>
      <Footer style={{ textAlign: 'center', background: 'transparent', color: '#8b7355' }}>
        <div className="ink-subtitle">
          画脉通识 · 让中国画的千年文脉，如知识之树在心中生长
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: '#a89880' }}>
          {stats && `共收录 ${stats.dynasties} 个朝代 · ${stats.schools} 个画派 · ${stats.painters} 位画家 · ${stats.paintings} 幅名作 · ${stats.theories} 部画论 · ${stats.flashcards} 张抽认卡`}
        </div>
      </Footer>
    </Layout>
  );
}

export default App;
