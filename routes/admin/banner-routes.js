const express = require('express');
const router = express.Router();
const bannerController = require('../../controllers/admin/banner-controller');
const { isAuthenticated, isAdmin } = require('../../middleware/auth');
const upload = require('../../middleware/upload');

// Get all banners (public)
router.get('/banners', bannerController.getBanners);

// Admin routes (protected)
router.post(
  '/banners',
  isAuthenticated,
  isAdmin,
  upload.single('image'),
  bannerController.createBanner
);

router.put(
  '/banners/:id',
  isAuthenticated,
  isAdmin,
  upload.single('image'),
  bannerController.updateBanner
);

router.delete(
  '/banners/:id',
  isAuthenticated,
  isAdmin,
  bannerController.deleteBanner
);

router.patch(
  '/banners/:id/toggle-status',
  isAuthenticated,
  isAdmin,
  bannerController.toggleBannerStatus
);

module.exports = router;
