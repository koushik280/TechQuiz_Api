import Attempt from '../../models/Attempt.js';
import User from '../../models/User.js';
import Technology from '../../models/Technology.js';

/**
 * @desc    Get overall analytics (counts, averages)
 * @route   GET /api/admin/analytics/overview
 * @access  Private (Admin)
 */
export const getOverview = async (req, res) => {
  try {
    const totalAttempts = await Attempt.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalTechnologies = await Technology.countDocuments();

    const avgScore = await Attempt.aggregate([
      { $group: { _id: null, avg: { $avg: '$score' } } },
    ]);

    const averageScore = avgScore.length ? avgScore[0].avg : 0;

    // Attempts per technology
    const attemptsPerTech = await Attempt.aggregate([
      { $group: { _id: '$technology', count: { $sum: 1 } } },
      {
        $lookup: {
          from: 'technologies',
          localField: '_id',
          foreignField: '_id',
          as: 'technology',
        },
      },
      { $unwind: '$technology' },
      { $project: { technology: { name: 1 }, count: 1 } },
      { $sort: { count: -1 } },
    ]);

    // Attempts over time (last 7 days)
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const attemptsOverTime = await Attempt.aggregate([
      { $match: { submittedAt: { $gte: last7Days } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$submittedAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      totalAttempts,
      totalUsers,
      totalTechnologies,
      averageScore,
      attemptsPerTech,
      attemptsOverTime,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get top performing users (by average score, attempts)
 * @route   GET /api/admin/analytics/top-users
 * @access  Private (Admin)
 */
export const getTopUsers = async (req, res) => {
  try {
    const topUsers = await Attempt.aggregate([
      {
        $group: {
          _id: '$user',
          totalAttempts: { $sum: 1 },
          avgScore: { $avg: '$score' },
          bestScore: { $max: '$score' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      { $project: { 'user.name': 1, 'user.email': 1, totalAttempts: 1, avgScore: 1, bestScore: 1 } },
      { $sort: { avgScore: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).json(topUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get analytics per technology
 * @route   GET /api/admin/analytics/technologies
 * @access  Private (Admin)
 */
export const getTechnologyAnalytics = async (req, res) => {
  try {
    const techStats = await Attempt.aggregate([
      {
        $group: {
          _id: '$technology',
          totalAttempts: { $sum: 1 },
          avgScore: { $avg: '$score' },
          totalQuestionsAnswered: { $sum: '$totalQuestions' },
        },
      },
      {
        $lookup: {
          from: 'technologies',
          localField: '_id',
          foreignField: '_id',
          as: 'technology',
        },
      },
      { $unwind: '$technology' },
      { $project: { technology: { name: 1 }, totalAttempts: 1, avgScore: 1, totalQuestionsAnswered: 1 } },
      { $sort: { totalAttempts: -1 } },
    ]);

    res.status(200).json(techStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get user details with their attempts (admin view)
 * @route   GET /api/admin/analytics/users/:userId
 * @access  Private (Admin)
 */
export const getUserAnalytics = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const attempts = await Attempt.find({ user: userId })
      .populate('technology', 'name')
      .sort({ submittedAt: -1 })
      .lean();

    const stats = await Attempt.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalAttempts: { $sum: 1 },
          avgScore: { $avg: '$score' },
          bestScore: { $max: '$score' },
          totalQuestions: { $sum: '$totalQuestions' },
        },
      },
    ]);

    res.status(200).json({
      user,
      stats: stats[0] || { totalAttempts: 0, avgScore: 0, bestScore: 0, totalQuestions: 0 },
      attempts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

