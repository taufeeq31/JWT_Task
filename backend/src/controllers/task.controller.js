import Task from '../models/task.model.js';

// Simple MongoDB ObjectId validator (24 hex chars)
const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);

export const createTask = async (req, res, next) => {
    try {
        const { title, description } = req.body;

        const titleTrimmed = typeof title === 'string' ? title.trim() : '';
        if (!titleTrimmed) {
            return res.status(400).json({ message: 'Title required' });
        }

        const task = await Task.create({
            userId: req.userId,
            title: titleTrimmed,
            description: typeof description === 'string' ? description.trim() : description,
        });
        return res.status(201).json(task);
    } catch (error) {
        return next(error);
    }
};

export const getTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find({ userId: req.userId });
        return res.json(tasks);
    } catch (error) {
        return next(error);
    }
};

export const updateTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid id' });
        }

        const { title, description, completed } = req.body;
        const update = {};
        if (typeof title !== 'undefined') {
            const t = typeof title === 'string' ? title.trim() : '';
            if (!t) return res.status(400).json({ message: 'Title required' });
            update.title = t;
        }
        if (typeof description !== 'undefined') {
            update.description = typeof description === 'string' ? description.trim() : description;
        }
        if (typeof completed !== 'undefined') {
            update.completed = Boolean(completed);
        }

        const task = await Task.findOneAndUpdate(
            { _id: id, userId: req.userId },
            update,
            { new: true }
        );
        if (!task) return res.status(404).json({ message: 'Not found' });
        return res.json(task);
    } catch (error) {
        return next(error);
    }
};

export const deleteTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid id' });
        }
        const deleted = await Task.findOneAndDelete({ _id: id, userId: req.userId });
        if (!deleted) return res.status(404).json({ message: 'Not found' });
        return res.json({ message: 'Deleted' });
    } catch (error) {
        return next(error);
    }
};
