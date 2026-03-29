import Technology from '../models/Technology.js';

/**
 * @desc    Get all technologies (public)
 * @route   GET /api/technologies
 * @access  Public (or authenticated? we'll make it authenticated so users must be logged in)
 */
export const getAllTechnologies = async (req, res) => {
  try {
    const technologies = await Technology.find().sort({ name: 1 });
    res.status(200).json(technologies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

