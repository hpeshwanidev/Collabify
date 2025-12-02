const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all tasks
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [
        { createdBy: req.user.id },
        { assignedTo: req.user.id },
        { team: req.user.id }
      ]
    })
      .populate('createdBy', 'username')
      .populate('assignedTo', 'username')
      .populate('team', 'username')
      .sort({ createdAt: -1 });
    
    res.json(tasks);
  } catch (e) {
    console.error('Error fetching tasks:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate, priority, team } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const task = await Task.create({
      title,
      description,
      assignedTo: assignedTo || [],
      createdBy: req.user.id,
      dueDate,
      priority: priority || 'medium',
      team: team || []
    });

    const populatedTask = await Task.findById(task._id)
      .populate('createdBy', 'username')
      .populate('assignedTo', 'username')
      .populate('team', 'username');

    res.json(populatedTask);
  } catch (e) {
    console.error('Error creating task:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update task status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['not_started', 'in_progress', 'finished'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate('createdBy', 'username')
      .populate('assignedTo', 'username')
      .populate('team', 'username');

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (e) {
    console.error('Error updating task status:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update task
router.patch('/:id', auth, async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate, priority, team } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, assignedTo, dueDate, priority, team },
      { new: true }
    )
      .populate('createdBy', 'username')
      .populate('assignedTo', 'username')
      .populate('team', 'username');

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (e) {
    console.error('Error updating task:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (e) {
    console.error('Error deleting task:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;