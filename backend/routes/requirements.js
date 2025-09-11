import express from 'express';
import Requirement from '../models/Requirement.js';

const router = express.Router();

// Get all requirements
router.get('/', async (req, res) => {
  try {
    const requirements = await Requirement.find().sort({ createdAt: -1 });
    res.json({ success: true, data: requirements });
  } catch (error) {
    console.error('Get requirements error:', error);
    res.status(500).json({ error: 'Failed to fetch requirements' });
  }
});

// Create requirement
router.post('/', async (req, res) => {
  try {
    const requirement = new Requirement(req.body);
    const savedRequirement = await requirement.save();
    res.status(201).json({ success: true, data: savedRequirement });
  } catch (error) {
    console.error('Create requirement error:', error);
    res.status(400).json({ error: error.message });
  }
});

export default router;