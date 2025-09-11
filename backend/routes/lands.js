import express from 'express';
import Land from '../models/Land.js';

const router = express.Router();

// Get all lands with optional company filter
router.get('/', async (req, res) => {
  try {
    const { companyId } = req.query;
    const filter = companyId ? { companyId } : {};
    
    const lands = await Land.find(filter)
      .populate('companyId', 'name email phone')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: lands });
  } catch (error) {
    console.error('Get lands error:', error);
    res.status(500).json({ error: 'Failed to fetch lands' });
  }
});

// Create land
router.post('/', async (req, res) => {
  try {
    const land = new Land(req.body);
    const savedLand = await land.save();
    const populatedLand = await Land.findById(savedLand._id).populate('companyId', 'name email phone');
    
    res.status(201).json({ success: true, data: populatedLand });
  } catch (error) {
    console.error('Create land error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Update land
router.put('/', async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    const updatedLand = await Land.findByIdAndUpdate(id, updateData, { new: true })
      .populate('companyId', 'name email phone');
    
    if (!updatedLand) {
      return res.status(404).json({ error: 'Land not found' });
    }
    
    res.json({ success: true, data: updatedLand });
  } catch (error) {
    console.error('Update land error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete land
router.delete('/', async (req, res) => {
  try {
    const { id } = req.body;
    const deletedLand = await Land.findByIdAndDelete(id);
    
    if (!deletedLand) {
      return res.status(404).json({ error: 'Land not found' });
    }
    
    res.json({ success: true, message: 'Land deleted successfully' });
  } catch (error) {
    console.error('Delete land error:', error);
    res.status(400).json({ error: error.message });
  }
});

export default router;