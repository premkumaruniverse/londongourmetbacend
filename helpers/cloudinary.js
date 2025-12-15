const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
  cloud_name: "dawnqi3cn",
  api_key: "143897353982449",
  api_secret: "jsUUZBSZkn8uoyeRbgqXtGKD0-E",
});

const storage = new multer.memoryStorage();

async function imageUploadUtil(file) {
  const result = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });

  return result;
}

const upload = multer({ storage });

/**
 * Delete an image from Cloudinary
 * @param {string} imageUrl - The public URL or public ID of the image to delete
 * @returns {Promise<Object>} - The result of the deletion operation
 */
const deleteImageFromCloudinary = async (imageUrl) => {
  try {
    // Extract public ID from URL if it's a full URL
    let publicId = imageUrl;
    if (imageUrl.includes('cloudinary.com')) {
      // Extract the public ID from the URL
      const parts = imageUrl.split('/');
      const filename = parts[parts.length - 1];
      publicId = filename.split('.')[0]; // Remove file extension
      
      // If the image is in a folder, include the folder path
      const uploadIndex = parts.findIndex(part => part === 'upload');
      if (uploadIndex > 0) {
        const folderParts = parts.slice(uploadIndex + 2, -1); // Get folder parts
        if (folderParts.length > 0) {
          publicId = `${folderParts.join('/')}/${publicId}`;
        }
      }
    }

    // Delete the resource
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image'
    });

    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};

module.exports = { 
  upload, 
  imageUploadUtil, 
  deleteImageFromCloudinary 
};
