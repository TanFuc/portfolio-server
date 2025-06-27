import Project from '../models/Project.js';
import slugify from 'slugify';

// GET /api/projects
export const getProjects = async (req, res, next) => {
  try {
    const showAll = req.query.all === 'true';

    const filter = showAll ? {} : { isDeleted: false };
    const projects = await Project.find(filter).sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    next(error);
  }
};


// POST /api/projects
export const createProject = async (req, res, next) => {
  try {
    const { title, description, image, github, demo, technologies } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ tiêu đề và mô tả' });
    }

    const project = new Project({
      title,
      description,
      image,
      github,
      demo,
      technologies,
    });

    const saved = await project.save();
    res.status(201).json(saved);
  } catch (error) {
    next(error);
  }
};

// PUT /api/projects/:id
export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.title) {
      updates.slug = slugify(updates.title, { lower: true, strict: true });
    }

    const project = await Project.findByIdAndUpdate(id, updates, { new: true });

    if (!project) {
      return res.status(404).json({ message: 'Không tìm thấy dự án' });
    }

    res.json(project);
  } catch (error) {
    next(error);
  }
};

// PATCH /api/projects/soft-delete/:id
export const softDeleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

    if (!project) {
      return res.status(404).json({ message: 'Không tìm thấy dự án để xoá mềm' });
    }

    res.json({ message: 'Đã xoá mềm dự án' });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/projects/hard-delete/:id
export const hardDeleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Project.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Không tìm thấy dự án để xoá vĩnh viễn' });
    }

    res.json({ message: 'Đã xoá vĩnh viễn dự án' });
  } catch (error) {
    next(error);
  }
};

// POST /api/projects/duplicate/:id
export const duplicateProject = async (req, res) => {
  try {
    const original = await Project.findById(req.params.id);
    if (!original) return res.status(404).json({ message: 'Project not found' });

    const baseSlug = slugify(`copy-${original.title}`, { lower: true, strict: true });

    let newSlug = baseSlug;
    let count = 1;
    while (await Project.findOne({ slug: newSlug })) {
      newSlug = `${baseSlug}-${count}`;
      count++;
    }

    const duplicated = new Project({
      ...original.toObject(),
      _id: undefined,
      slug: newSlug,
      title: `Copy - ${original.title}`,
      createdAt: undefined,
      updatedAt: undefined,
    });

    await duplicated.save();
    res.status(201).json(duplicated);
  } catch (err) {
    console.error('❌ Lỗi:', err);
    res.status(500).json({ message: 'Lỗi khi nhân bản dự án' });
  }
};

// PATCH /api/projects/restore/:id
export const restoreProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project || project.isDeleted === false) {
      return res.status(404).json({ message: 'Dự án không tồn tại hoặc chưa bị xoá mềm' });
    }

    project.isDeleted = false;
    const restored = await project.save();

    res.json({ message: 'Đã khôi phục dự án', project: restored });
  } catch (error) {
    next(error);
  }
};

// GET /api/projects/:id
export const getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project || project.isDeleted) {
      return res.status(404).json({ message: 'Không tìm thấy dự án' });
    }

    res.json(project);
  } catch (error) {
    next(error);
  }
};

// GET /api/projects/:slug
export const getProjectBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const project = await Project.findOne({ slug, isDeleted: false });

    if (!project) {
      return res.status(404).json({ message: 'Không tìm thấy dự án theo slug' });
    }

    res.json(project);
  } catch (error) {
    next(error);
  }
};
