const redisClient = require('../database/redis');
const UserService = require('../services/user.service');
const { AppError } = require('../middleware/errorHandler');

class UserController {
  static async register(req, res, next) {
    try {
      const { name, username, email, phone, password } = req.body;
      const user = await UserService.register({ name, username, email, phone, password });
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        payload: user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const { token, user } = await UserService.login(email, password);
      res.status(200).json({
        success: true,
        message: 'Login successful',
        payload: user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const { id, name, username, email, phone, password, balance } = req.body;
      const updatedUser = await UserService.updateProfile(id, { name, username, email, phone, password, balance });
      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        payload: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTransactionHistory(req, res, next) {
    try {
      const userId = req.user.userId;
      const history = await UserService.getTransactionHistory(userId);
      res.status(200).json({
        success: true,
        message: 'Transaction history retrieved',
        payload: history,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTotalSpent(req, res, next) {
    try {
      const userId = req.user.userId;
      const totalSpent = await UserService.getTotalSpent(userId);
      res.status(200).json({
        success: true,
        message: 'Total spent retrieved',
        payload: { total_spent: totalSpent },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getByEmail(req, res, next) {
    try {
      const { email } = req.params;
      const cacheKey = `user:${email}`;

      const cachedUser = await redisClient.get(cacheKey);
      if (cachedUser) {
        return res.status(200).json({
          success: true,
          message: 'User retrieved from cache',
          payload: JSON.parse(cachedUser),
          source: 'cache',
        });
      }

      const user = await UserService.getUserByEmail(email);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      await redisClient.setex(cacheKey, 60, JSON.stringify(user));
      res.status(200).json({
        success: true,
        message: 'User retrieved from database',
        payload: user,
        source: 'database',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;