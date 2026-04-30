const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const redisClient = require('../database/redis');
const User = require('../models/user.model');
const { AppError } = require('../middleware/errorHandler');

class UserService {
  static async register({ name, username, email, phone, password }) {
    const existingUserByEmail = await User.findByEmail(email);
    if (existingUserByEmail) {
      throw new AppError('User with this email already exists', 400);
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      username,
      email,
      phone,
      password: hashedPassword,
    });

    return user;
  }

  static async login(email, password) {
    const user = await User.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return { token, user: { id: user.id, name: user.name, username: user.username, email: user.email, phone: user.phone, balance: user.balance } };
  }

  static async updateProfile(id, updateData) {
    const existingUser = await User.findById(id);
    if (!existingUser) {
      throw new AppError('User not found', 404);
    }

    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    const updatedUser = await User.update(id, updateData);
    if (!updatedUser) {
      throw new AppError('User not found', 404);
    }

    const oldEmailKey = `user:${existingUser.email}`;
    await redisClient.del(oldEmailKey);

    if (updateData.email && updateData.email !== existingUser.email) {
      const newEmailKey = `user:${updateData.email}`;
      await redisClient.del(newEmailKey);
    }

    return updatedUser;
  }

  static async getTransactionHistory(userId) {
    return await User.getTransactionHistory(userId);
  }

  static async getTotalSpent(userId) {
    return await User.getTotalSpent(userId);
  }

  static async getUserByEmail(email) {
    const user = await User.findByEmail(email);
    if (!user) {
      return null;
    }

    const { password, ...publicUser } = user;
    return publicUser;
  }
}

module.exports = UserService;