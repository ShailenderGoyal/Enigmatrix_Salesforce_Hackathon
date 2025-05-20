import express from 'express';
import { ensureAuthenticated } from "../middlewares/authEnsure.js";
import {
  getMe,
  updateMe,
  updateFormData,
  changePassword,
//   getUsers,
//   getUserById,
//   updateUser,
//   deleteUser,
//   getStatsOverview,
//   getRecentUsers
} from '../controllers/user.controller.js';

const router = express.Router();

// Authenticated User Routes
router.get('/me', ensureAuthenticated, getMe);
router.patch('/me', ensureAuthenticated, updateMe);
router.patch('/me/form-data', ensureAuthenticated, updateFormData);
router.post('/me/change-password', ensureAuthenticated, changePassword);

// // Admin Routes
// router.get('/', adminAuth, getUsers);
// router.get('/stats/overview', adminAuth, getStatsOverview);
// router.get('/stats/recent', adminAuth, getRecentUsers);
// router.get('/:id', adminAuth, getUserById);
// router.patch('/:id', adminAuth, updateUser);
// router.delete('/:id', adminAuth, deleteUser);

export default router;
