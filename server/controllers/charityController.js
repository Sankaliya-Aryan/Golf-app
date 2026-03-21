import Charity from '../models/Charity.js';

// @desc    Get all charities
// @route   GET /api/charities
// @access  Public
export const getCharities = async (req, res, next) => {
  try {
    const charities = await Charity.find({});
    res.json(charities);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a charity
// @route   POST /api/charities
// @access  Private/Admin
export const createCharity = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const charityExists = await Charity.findOne({ name });
    
    if (charityExists) {
      res.status(400);
      throw new Error('Charity already exists');
    }
    
    const charity = await Charity.create({ name, description });
    res.status(201).json(charity);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a charity
// @route   PUT /api/charities/:id
// @access  Private/Admin
export const updateCharity = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const charity = await Charity.findById(req.params.id);

    if (charity) {
      charity.name = name || charity.name;
      charity.description = description || charity.description;
      const updatedCharity = await charity.save();
      res.json(updatedCharity);
    } else {
      res.status(404);
      throw new Error('Charity not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a charity
// @route   DELETE /api/charities/:id
// @access  Private/Admin
export const deleteCharity = async (req, res, next) => {
  try {
    const charity = await Charity.findById(req.params.id);

    if (charity) {
      await Charity.deleteOne({ _id: charity._id });
      res.json({ message: 'Charity removed' });
    } else {
      res.status(404);
      throw new Error('Charity not found');
    }
  } catch (error) {
    next(error);
  }
};
