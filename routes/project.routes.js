import express from 'express';
import {
  getProjects,
  createProject,
  updateProject,
  softDeleteProject,
  hardDeleteProject,
  duplicateProject,
  restoreProject,
  getProjectById,
  getProjectBySlug,
} from '../controllers/project.controller.js';
import auth from '../middleware/auth.middleware.js';


const router = express.Router();

router.get('/', getProjects);
router.get('/slug/:slug', getProjectBySlug);
router.get('/:id', getProjectById);
router.post('/', auth, createProject);
router.put('/:id', auth, updateProject);
router.patch('/soft-delete/:id', auth, softDeleteProject);
router.patch('/restore/:id', auth, restoreProject);
router.post('/duplicate/:id', auth, duplicateProject);
router.delete('/hard-delete/:id', auth, hardDeleteProject);

export default router;
