const express = require('express');
const router = express.Router();
const authenticateToken = require('../routes/recipes');
const Description = require('../models/Description');

// POST /api/description/create
// Create a new recipe
router.post('/create', authenticateToken, async (req, res) => {
  try {
    // Check if the name, title, and description are provided in the request body
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: 'Title, and description are required' });
    }

    // Create a new recipe description object
    const newDescription = new Description({
      title,
      description
    });

    // Save the recipe description to the database
    const savedDescription = await newDescription.save();

    // Send success response with only name, title, and description
    res.status(201).json({
      message: 'Description created successfully',
      title: savedDescription.title,
      description: savedDescription.description
      
    });
  } catch (err) {
    // Handle errors
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
