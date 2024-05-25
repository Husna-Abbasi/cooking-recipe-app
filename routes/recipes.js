// routes/recipes.js
const express = require('express');
const Recipe = require('../models/Recipe');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Create a new recipe
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, ingredients, instructions, image } = req.body;
    const recipe = new Recipe({ title, ingredients, instructions, image, createdBy: req.user.id });
    await recipe.save();
    res.status(201).json(recipe);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all recipes
router.get('/', authenticateToken, async (req, res) => {
  try {
    const recipes = await Recipe.find({ createdBy: req.user.id });
    res.json(recipes);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get a specific recipe by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe || recipe.createdBy.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a recipe
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, ingredients, instructions, image } = req.body;
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe || recipe.createdBy.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    recipe.title = title || recipe.title;
    recipe.ingredients = ingredients || recipe.ingredients;
    recipe.instructions = instructions || recipe.instructions;
    recipe.image = image || recipe.image;
    await recipe.save();
    res.json(recipe);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a recipe
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe || recipe.createdBy.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    await Recipe.deleteOne({ _id: recipe._id });
    res.json({ message: 'Recipe deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
