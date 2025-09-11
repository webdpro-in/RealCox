import express from 'express';
import Company from '../models/Company.js';

const router = express.Router();

// Get all companies
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });
    res.json({ success: true, data: companies });
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
});

// Create company
router.post('/', async (req, res) => {
  try {
    const company = new Company(req.body);
    const savedCompany = await company.save();
    res.status(201).json({ success: true, data: savedCompany });
  } catch (error) {
    console.error('Create company error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Update company
router.put('/', async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    const updatedCompany = await Company.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!updatedCompany) {
      return res.status(404).json({ error: 'Company not found' });
    }
    
    res.json({ success: true, data: updatedCompany });
  } catch (error) {
    console.error('Update company error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete company
router.delete('/', async (req, res) => {
  try {
    const { id } = req.body;
    const deletedCompany = await Company.findByIdAndDelete(id);
    
    if (!deletedCompany) {
      return res.status(404).json({ error: 'Company not found' });
    }
    
    res.json({ success: true, message: 'Company deleted successfully' });
  } catch (error) {
    console.error('Delete company error:', error);
    res.status(400).json({ error: error.message });
  }
});

export default router;