const { createUser, authenticateUser } = require('../../models/user.model');

const signUpUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const newUser = await createUser({ name, email, password });
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error("Error signing up user:", error);
    res.status(500).json({ message: 'Error signing up user' });
  }
}

const signInUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await authenticateUser(email, password);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  signUpUser,
  signInUser
}