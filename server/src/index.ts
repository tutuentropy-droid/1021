import express from 'express';
import cors from 'cors';
import path from 'path';
import apiRoutes from './routes/api';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

const clientBuildPath = path.join(__dirname, '../../client/build');
app.use(express.static(clientBuildPath));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: '画脉通识 API 服务运行正常' });
});

app.get('/', (req, res) => {
  res.json({
    name: '画脉通识 API',
    version: '1.0.0',
    description: '中国画历史与系统知识学习系统',
    endpoints: [
      'GET /api/dynasties - 获取所有朝代',
      'GET /api/dynasties/:id - 获取朝代详情',
      'GET /api/schools - 获取所有画派',
      'GET /api/schools?dynastyId=xxx - 按朝代筛选画派',
      'GET /api/painters - 获取所有画家',
      'GET /api/painters?dynastyId=xxx&schoolId=xxx - 筛选画家',
      'GET /api/paintings - 获取所有画作',
      'GET /api/paintings?dynastyId=xxx&painterId=xxx - 筛选画作',
      'GET /api/theories - 获取所有画论',
      'GET /api/flashcards - 获取所有抽认卡',
      'GET /api/flashcards?random=true&limit=5 - 随机抽认卡',
      'GET /api/knowledge-tree - 获取完整知识树',
      'GET /api/stats - 获取数据统计',
      'GET /api/search?q=xxx - 全文搜索'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`\n🎉 画脉通识 API 服务已启动`);
  console.log(`📍 服务地址: http://localhost:${PORT}`);
  console.log(`📚 API 文档: http://localhost:${PORT}/\n`);
});
