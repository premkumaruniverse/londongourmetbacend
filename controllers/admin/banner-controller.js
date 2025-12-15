const Feature = require('../../models/Feature');
const { deleteImageFromCloudinary } = require('../../helpers/cloudinary');

// Get all banners
exports.getBanners = async (req, res) => {
  try {
    const banners = await Feature.find({ type: 'banner' }).sort({ order: 1 });
    res.status(200).json({
      success: true,
      data: banners
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching banners',
      error: error.message
    });
  }
};

// Create a new banner
exports.createBanner = async (req, res) => {
  try {
    const { title, description, link, buttonText, order, isActive } = req.body;
    const image = req.file ? req.file.path : null;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: 'Image is required'
      });
    }

    const banner = new Feature({
      title,
      description,
      image,
      link,
      buttonText,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
      type: 'banner'
    });

    await banner.save();

    res.status(201).json({
      success: true,
      data: banner
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating banner',
      error: error.message
    });
  }
};

// Update a banner
exports.updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    
    if (req.file) {
      // Delete old image from cloudinary if exists
      const oldBanner = await Feature.findById(id);
      if (oldBanner && oldBanner.image) {
        await deleteImageFromCloudinary(oldBanner.image);
      }
      updates.image = req.file.path;
    }

    const banner = await Feature.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    res.status(200).json({
      success: true,
      data: banner
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating banner',
      error: error.message
    });
  }
};

// Delete a banner
exports.deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the banner first to get the image URL
    const banner = await Feature.findById(id);
    
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    // Delete image from cloudinary if exists
    if (banner.image) {
      await deleteImageFromCloudinary(banner.image);
    }

    // Delete the banner from database
    await Feature.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Banner deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting banner',
      error: error.message
    });
  }
};

// Toggle banner status
exports.toggleBannerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    const banner = await Feature.findById(id);
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    banner.isActive = !banner.isActive;
    await banner.save();

    res.status(200).json({
      success: true,
      data: banner
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error toggling banner status',
      error: error.message
    });
  }
};
