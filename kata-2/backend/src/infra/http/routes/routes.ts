import { Router } from 'express';
import { makeTaskController } from '../../../main/factories/task.factory.js';

const router = Router();
const taskController = makeTaskController();

// Usamos arrow functions para garantir que o 'this' do controller seja preservado
router.post('/tasks', (req, res) => taskController.handleCreate(req, res));
router.get('/tasks', (req, res) => taskController.handleList(req, res));

router.patch('/tasks/:id', (req, res) => taskController.handleUpdate(req, res));
router.delete('/tasks/:id', (req, res) => taskController.handleDelete(req, res));

export { router };