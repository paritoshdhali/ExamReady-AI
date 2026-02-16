const express = require('express');
const router = express.Router();

// Mock database - replace with actual database calls
let mcqs = [];

// GET all MCQs
router.get('/', (req, res) => {
    res.json(mcqs);
});

// GET MCQ by ID
router.get('/:id', (req, res) => {
    const mcq = mcqs.find(m => m.id === parseInt(req.params.id));
    if (mcq) {
        res.json(mcq);
    } else {
        res.status(404).send('MCQ not found');
    }
});

// POST new MCQ
router.post('/', (req, res) => {
    const newMCQ = {
        id: mcqs.length + 1,
        question: req.body.question,
        options: req.body.options,
        answer: req.body.answer
    };
    mcqs.push(newMCQ);
    res.status(201).json(newMCQ);
});

// PUT update MCQ
router.put('/:id', (req, res) => {
    const mcq = mcqs.find(m => m.id === parseInt(req.params.id));
    if (mcq) {
        mcq.question = req.body.question;
        mcq.options = req.body.options;
        mcq.answer = req.body.answer;
        res.json(mcq);
    } else {
        res.status(404).send('MCQ not found');
    }
});

// DELETE MCQ
router.delete('/:id', (req, res) => {
    const mcqIndex = mcqs.findIndex(m => m.id === parseInt(req.params.id));
    if (mcqIndex !== -1) {
        mcqs.splice(mcqIndex, 1);
        res.status(204).send();
    } else {
        res.status(404).send('MCQ not found');
    }
});

module.exports = router;
