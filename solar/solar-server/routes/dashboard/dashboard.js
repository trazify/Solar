import express from 'express';
import {
  getAdminDashboard,
  getInstallerDashboard,
  getDeliveryDashboard,
  getDealerDashboard,
  getFranchiseeDashboard,
  getInventoryDashboard,
} from '../../controllers/dashboard/dashboardController.js';
import { getAdminStats, getInstallerStats } from '../../controllers/admin/adminStatsController.js';
import { protect, authorize } from '../../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/admin-stats', authorize('admin'), getAdminStats);
router.get('/installer-stats', authorize('admin'), getInstallerStats);
router.get('/admin', authorize('admin'), getAdminDashboard);
router.get('/inventory', authorize('admin'), getInventoryDashboard);
router.get('/installer', authorize('admin'), getInstallerDashboard);
router.get('/delivery', authorize('admin'), getDeliveryDashboard);
router.get('/dealer', authorize('dealer'), getDealerDashboard);
router.get('/franchisee', authorize('franchisee'), getFranchiseeDashboard);

export default router;
