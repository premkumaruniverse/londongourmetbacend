const Feature = require("../../models/Feature");
const { deleteImageFromCloudinary } = require("../../helpers/cloudinary");

// Delete a feature/banner image
const deleteFeatureImage = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the feature/banner first to get the image URL
    const feature = await Feature.findById(id);
    
    if (!feature) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    // Delete image from Cloudinary if it exists
    if (feature.image) {
      try {
        await deleteImageFromCloudinary(feature.image);
      } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        // Continue with deletion even if Cloudinary deletion fails
      }
    }

    // Delete the feature from database
    await Feature.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Banner deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting banner:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete banner',
      error: error.message
    });
  }
};

const addFeatureImage = async (req, res) => {
  try {
    const { image, title = 'Banner', type = 'banner', isActive = true, order = 0 } = req.body;

    console.log('Received data:', { image, title, type, isActive, order });

    if (!image) {
      return res.status(400).json({
        success: false,
        message: 'Image URL is required'
      });
    }

    const featureImage = new Feature({
      image,
      title,
      type,
      isActive,
      order: Number(order) || 0
    });

    console.log('Saving feature image:', featureImage);
    
    const savedImage = await featureImage.save();

    res.status(201).json({
      success: true,
      data: savedImage,
    });
  } catch (error) {
    console.error('Error in addFeatureImage:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate entry. This image already exists.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to add feature image',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

const getFeatureImages = async (req, res) => {
  try {
    const images = await Feature.find({});

    res.status(200).json({
      success: true,
      data: images,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = { 
  addFeatureImage, 
  getFeatureImages, 
  deleteFeatureImage 
};
