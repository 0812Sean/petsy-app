const express = require('express');
const verifyToken = require('../middleware/verify-token.js');
const List = require('../models/list.js');
const router = express.Router();

router.use(verifyToken);

// Create a new List
router.post('/', async (req, res) => {
    try {
      req.body.author = req.user._id;
      const list = await List.create(req.body);
      list._doc.author = req.user;
      res.status(201).json(list);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
});

// Get all Lists
router.get('/', async (req, res) => {
    try {
      const lists = await List.find({})
        .populate('author')
        .sort({ createdAt: 'desc' });
      res.status(200).json(lists);
    } catch (error) {
      res.status(500).json(error);
    }
});

// Update the specified Listing
router.put('/:listId', async (req, res) => {
    try {
      const list = await List.findById(req.params.listId);
      if (!list.author.equals(req.user._id)) {
        return res.status(403).send("You're not allowed to do that!");
      }
      const updatedList = await List.findByIdAndUpdate(
        req.params.listId,
        req.body,
        { new: true }
      );
  
// Add the author information to the updated List
      updatedList._doc.author = req.user;
      res.status(200).json(updatedList);
    } catch (error) {
      res.status(500).json(error);
    }
});

router.get('/:listId', async (req, res) => {
  try {
    const list = await List.findById(req.params.listId)
      .populate('author')
      .populate('reviews.author'); 

    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }

    res.status(200).json(list);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// Delete the specified List
router.delete('/:listId', async (req, res) => {
    try {
      const list = await List.findById(req.params.listId);
  
      if (!list.author.equals(req.user._id)) {
        return res.status(403).send("You're not allowed to do that!");
      }
  
      const deletedList = await List.findByIdAndDelete(req.params.listId);
      res.status(200).json(deletedList);
    } catch (error) {
      res.status(500).json(error);
    }
});

// Create a Review under the specified List
router.post('/:listId/reviews', async (req, res) => {
    try {
      req.body.author = req.user._id;
      const list = await List.findById(req.params.listId);
      list.reviews.push(req.body);
      await list.save();
      const newReview = list.reviews[list.reviews.length - 1];
  
      newReview._doc.author = req.user;

      res.status(201).json(newReview);
    } catch (error) {
      res.status(500).json(error);
    }
});

// Get all Reviews for the specified List
router.get('/:listId/reviews', async (req, res) => {
    try {
      const list = await List.findById(req.params.listId)
        .populate('reviews.author'); 
  
      if (!list) {
        return res.status(404).json({ message: 'List not found' });
      }

      res.status(200).json(list.reviews);
    } catch (error) {
      res.status(500).json(error);
    }
});

// Update the specified Review
router.put('/:listId/reviews/:reviewId', async (req, res) => {
    try {
      const list = await List.findById(req.params.listId);
      const review = list.reviews.id(req.params.reviewId);

      if (!review.author.equals(req.user._id)) {
        return res.status(403).send("You're not allowed to do that!");
      }

      review.text = req.body.text;
      await list.save();
      res.status(200).json({ message: 'Ok' });
    } catch (err) {
      res.status(500).json(err);
    }
});

// Delete the specified Review
router.delete('/:listId/reviews/:reviewId', async (req, res) => {
    try {
      const list = await List.findById(req.params.listId);
      list.reviews.remove({ _id: req.params.reviewId });
      await list.save();
      res.status(200).json({ message: 'Ok' });
    } catch (err) {
      res.status(500).json(err);
    }
});

module.exports = router;
