"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_1 = require("../data");
const router = (0, express_1.Router)();
router.get('/dynasties', (req, res) => {
    res.json(data_1.dynasties);
});
router.get('/dynasties/:id', (req, res) => {
    const dynasty = data_1.dynasties.find(d => d.id === req.params.id);
    if (!dynasty) {
        res.status(404).json({ error: '朝代不存在' });
        return;
    }
    res.json(dynasty);
});
router.get('/schools', (req, res) => {
    const { dynastyId } = req.query;
    if (dynastyId) {
        res.json(data_1.schools.filter(s => s.dynastyId === dynastyId));
    }
    else {
        res.json(data_1.schools);
    }
});
router.get('/schools/:id', (req, res) => {
    const school = data_1.schools.find(s => s.id === req.params.id);
    if (!school) {
        res.status(404).json({ error: '画派不存在' });
        return;
    }
    res.json(school);
});
router.get('/painters', (req, res) => {
    const { dynastyId, schoolId } = req.query;
    let result = data_1.painters;
    if (dynastyId) {
        result = result.filter(p => p.dynastyId === dynastyId);
    }
    if (schoolId) {
        result = result.filter(p => p.schoolIds.includes(schoolId));
    }
    res.json(result);
});
router.get('/painters/:id', (req, res) => {
    const painter = data_1.painters.find(p => p.id === req.params.id);
    if (!painter) {
        res.status(404).json({ error: '画家不存在' });
        return;
    }
    const painterPaintings = data_1.paintings.filter(p => p.painterId === painter.id);
    res.json({ ...painter, paintings: painterPaintings });
});
router.get('/paintings', (req, res) => {
    const { dynastyId, painterId, schoolId, theme } = req.query;
    let result = data_1.paintings;
    if (dynastyId) {
        result = result.filter(p => p.dynastyId === dynastyId);
    }
    if (painterId) {
        result = result.filter(p => p.painterId === painterId);
    }
    if (schoolId) {
        result = result.filter(p => p.schoolIds.includes(schoolId));
    }
    if (theme) {
        result = result.filter(p => p.theme === theme);
    }
    res.json(result);
});
router.get('/paintings/:id', (req, res) => {
    const painting = data_1.paintings.find(p => p.id === req.params.id);
    if (!painting) {
        res.status(404).json({ error: '画作不存在' });
        return;
    }
    const painter = data_1.painters.find(p => p.id === painting.painterId);
    const dynasty = data_1.dynasties.find(d => d.id === painting.dynastyId);
    res.json({ ...painting, painter, dynasty });
});
router.get('/theories', (req, res) => {
    const { dynastyId } = req.query;
    if (dynastyId) {
        res.json(data_1.theories.filter(t => t.dynastyId === dynastyId));
    }
    else {
        res.json(data_1.theories);
    }
});
router.get('/theories/:id', (req, res) => {
    const theory = data_1.theories.find(t => t.id === req.params.id);
    if (!theory) {
        res.status(404).json({ error: '画论不存在' });
        return;
    }
    res.json(theory);
});
router.get('/flashcards', (req, res) => {
    const { type, limit, random } = req.query;
    let result = data_1.flashcards;
    if (type) {
        result = result.filter(f => f.type === type);
    }
    if (random === 'true') {
        result = [...result].sort(() => Math.random() - 0.5);
    }
    if (limit) {
        result = result.slice(0, parseInt(limit));
    }
    res.json(result);
});
router.get('/flashcards/:id', (req, res) => {
    const flashcard = data_1.flashcards.find(f => f.id === req.params.id);
    if (!flashcard) {
        res.status(404).json({ error: '抽认卡不存在' });
        return;
    }
    res.json(flashcard);
});
router.get('/knowledge-tree', (req, res) => {
    const tree = data_1.dynasties.map(dynasty => ({
        id: dynasty.id,
        name: dynasty.name,
        type: 'dynasty',
        children: [
            ...data_1.schools
                .filter(s => s.dynastyId === dynasty.id)
                .map(school => ({
                id: school.id,
                name: school.name,
                type: 'school',
                children: data_1.painters
                    .filter(p => p.schoolIds.includes(school.id))
                    .map(painter => ({
                    id: painter.id,
                    name: painter.name,
                    type: 'painter',
                    children: data_1.paintings
                        .filter(p => p.painterId === painter.id)
                        .map(painting => ({
                        id: painting.id,
                        name: painting.title,
                        type: 'painting'
                    }))
                }))
            })),
            ...data_1.painters
                .filter(p => p.dynastyId === dynasty.id && p.schoolIds.length === 0)
                .map(painter => ({
                id: painter.id,
                name: painter.name,
                type: 'painter',
                children: data_1.paintings
                    .filter(p => p.painterId === painter.id)
                    .map(painting => ({
                    id: painting.id,
                    name: painting.title,
                    type: 'painting'
                }))
            }))
        ]
    }));
    res.json(tree);
});
router.get('/stats', (req, res) => {
    res.json({
        dynasties: data_1.dynasties.length,
        schools: data_1.schools.length,
        painters: data_1.painters.length,
        paintings: data_1.paintings.length,
        theories: data_1.theories.length,
        flashcards: data_1.flashcards.length
    });
});
router.get('/search', (req, res) => {
    const { q } = req.query;
    if (!q) {
        res.json([]);
        return;
    }
    const query = q.toLowerCase();
    const results = {
        dynasties: data_1.dynasties.filter(d => d.name.toLowerCase().includes(query) ||
            d.description.toLowerCase().includes(query)),
        schools: data_1.schools.filter(s => s.name.toLowerCase().includes(query) ||
            s.description.toLowerCase().includes(query)),
        painters: data_1.painters.filter(p => p.name.toLowerCase().includes(query) ||
            (p.artName && p.artName.toLowerCase().includes(query)) ||
            p.biography.toLowerCase().includes(query)),
        paintings: data_1.paintings.filter(p => p.title.toLowerCase().includes(query) ||
            p.analysis.overallImpression.toLowerCase().includes(query)),
        theories: data_1.theories.filter(t => t.title.toLowerCase().includes(query) ||
            t.summary.toLowerCase().includes(query))
    };
    res.json(results);
});
exports.default = router;
