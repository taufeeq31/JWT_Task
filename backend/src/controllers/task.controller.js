import Task from '../models/task.model.js';

export const createTask = async (req, res) => {
    try {
        const { title, description } = req.body;
        const task = await Task.create({ userId: req.userId, title, description });
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getTasks = async (req, res) => {
    const tasks = await Task.find({ userId: req.userId });
    res.json(tasks);
};

export const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    const task = await Task.findOneAndUpdate(
        { _id: id, userId: req.userId },
        { title, description, completed },
        { new: true }
    );
    res.json(task);
};

export const deleteTask = async (req, res) => {
    const { id } = req.params;
    await Task.findOneAndDelete({ _id: id, userId: req.userId });
    res.json({ message: 'Deleted' });
};
