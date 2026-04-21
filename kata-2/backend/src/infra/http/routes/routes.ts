import { Router } from 'express';
import { makeTaskController } from '../../../main/factories/task.factory.js';

const router = Router();
const taskController = makeTaskController();

// Usamos arrow functions para garantir que o 'this' do controller seja preservado
router.post('/tasks', (req, res, next) => taskController.handleCreate(req, res, next));
router.get('/tasks', (req, res, next) => taskController.handleList(req, res, next));

router.patch('/tasks/:id', (req, res, next) => taskController.handleUpdate(req, res, next));
router.delete('/tasks/:id', (req, res, next) => taskController.handleDelete(req, res, next));

export { router };