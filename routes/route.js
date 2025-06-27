import projectRoutes from './project.routes.js';
import authRoutes from './auth.routes.js';

const route = (app) => {
  app.use('/api/projects', projectRoutes);
  app.use('/api/auth', authRoutes);
};

export default route;
