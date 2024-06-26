const express = require('express');
const router = express.Router();
const Description = require('../models/Description');

const cors = require('cors');

router.use(cors());
router.post('/create', async (req, res) => {
    try {
        const {title, description} = req.body;
        if (!title || !description) {
            return res.status(400).json({message: 'Title, and description are required'});
        }

        const newDescription = new Description({
            title,
            description
        });

        const savedDescription = await newDescription.save();

        res.status(201).json({
            message: 'Description created successfully',
            title: savedDescription.title,
            description: savedDescription.description

        });
    } catch (err) {
        // Handle errors
        res.status(500).json({error: err.message});
    }
});
router.get('/all', async (req, res) => {
    try {
        // Fetch all descriptions from the database
        const descriptions = await Description.find();

        // Send success response with all descriptions
        res.json(descriptions);
    } catch (err) {
        // Handle errors
        res.status(500).json({error: err.message});
    }
});
router.delete('/:id', async (req, res) => {
    try {
        // Find the description by ID and delete it
        const description = await Description.findByIdAndDelete(req.params.id);
        if (!description) {
            return res.status(404).json({message: 'Description not found'});
        }

        // Send success response
        res.json({message: 'Description deleted'});
    } catch (err) {
        // Handle errors
        res.status(500).json({error: err.message});
    }
});

module.exports = router;
