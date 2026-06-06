import express from 'express';
import Task from '../models/task.model.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

// @route   GET /api/tasks
// @desc    Get all tasks for the logged-in user [cite: 6]
// @access  Private 
router.get('/', protect, async (req, res) => {
  try {
    // Find tasks belonging to the logged-in user and sort by newest first
    const tasks = await Task.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching tasks' });
  }
});

// @route   POST /api/tasks
// @desc    Create a new task [cite: 6]
// @access  Private 
router.post('/', protect, async (req, res) => {
  try {
    const { title, description } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Task title is required' });
    }

    const task = await Task.create({
      title,
      description,
      userId: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server Error creating task' });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task (title, description, or status) [cite: 6, 7]
// @access  Private 
router.put('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Ensure the user owns this task before updating
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to update this task' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after', runValidators: true }
    );

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Server Error updating task' });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task [cite: 6]
// @access  Private 
router.delete('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Ensure the user owns this task before deleting
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to delete this task' });
    }

    await task.deleteOne();
    res.json({ message: 'Task removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error deleting task' });
  }
});

export default router;