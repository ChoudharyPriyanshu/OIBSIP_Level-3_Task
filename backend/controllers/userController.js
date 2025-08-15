const User = require('../models/User');

// @desc    Get logged-in user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if email is being changed & if it already exists
    if (req.body.email && req.body.email !== user.email) {
      const emailExists = await User.findOne({ email: req.body.email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      user.email = req.body.email;
    }

    user.name = req.body.name || user.name;
    if (req.body.password) user.password = req.body.password;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await User.deleteOne({ _id: user._id });
    res.json({ message: 'User removed' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser,
};
