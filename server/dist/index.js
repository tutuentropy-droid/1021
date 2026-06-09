"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const api_1 = __importDefault(require("./routes/api"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api', api_1.default);
const clientBuildPath = path_1.default.join(__dirname, '../../client/build');
app.use(express_1.default.static(clientBuildPath));
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
