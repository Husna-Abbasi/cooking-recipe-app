// routes/recipes.js
const express = require('express');
const Recipe = require('../models/Recipe');
const router = express.Router();
const cors = require('cors');

router.use(cors());


router.post('/', async (req, res) => {
  try {
    const { title, ingredients, instructions } = req.body;
    const recipe = new Recipe({ title, ingredients, instructions});
    await recipe.save();
    res.status(201).json(recipe);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, ingredients, instructions } = req.body;
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe ) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    recipe.title = title || recipe.title;
    recipe.ingredients = ingredients || recipe.ingredients;
    recipe.instructions = instructions || recipe.instructions;
    await recipe.save();
    res.json(recipe);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    await Recipe.deleteOne({ _id: recipe._id });
    res.json({ message: 'Recipe deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
