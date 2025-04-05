import express from 'express';
import { Router } from 'express';

const router: Router = express.Router();

// GET all todos
router.get('/', (req, res) => {
  res.json({ message: 'Get all todos' });
});

// GET single todo
router.get('/:id', (req, res) => {
  res.json({ message: `Get todo ${req.params.id}` });
});

// POST create todo
router.post('/', (req, res) => {
  res.json({ message: 'Create todo', data: req.body });
});

// PUT update todo
router.put('/:id', (req, res) => {
  res.json({ message: `Update todo ${req.params.id}`, data: req.body });
});

// DELETE todo
router.delete('/:id', (req, res) => {
  res.json({ message: `Delete todo ${req.params.id}` });
});

export default router; 