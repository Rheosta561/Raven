const User = require('../Models/User');

const handleUserUpdate = async (req, res) => {
  try {
    console.log('api hit , user update');
    const { bloodGroup } = req.body;
    const userId =  req.params.userId ; 

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }


    if (req.files && req.files.profileImage && req.files.profileImage.length > 0) {
      existingUser.avatar = req.files.profileImage[0].path;
    }


    if (bloodGroup) {
      existingUser.bloodGroup = bloodGroup;
    }

    await existingUser.save();

    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: existingUser,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during user update',
    });
  }
};
const Feed = require('../Models/feedSchema');

const handleCreateFeed = async (req, res) => {
  try {
    const {
      title,
      description,
      tags,
      type ,
      location,
      link,
      priority ,
      registeredCount = 0,
    } = req.body;

    if (!title || !description || !location) {
      return res.status(400).json({ success: false, message: 'Title, description, and location are required.' });
    }

    const parsedTags = typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags;
    const parsedLocation = typeof location === 'string' ? JSON.parse(location) : location;

    // Raven Points logic
    const ravenPoints = type === 'request' ? 20 : 0;

    const newFeed = new Feed({
      title,
      description,
      tags: parsedTags,
      ravenPoints,
      registeredCount: Number(registeredCount),
      type,
      location: parsedLocation,
      link: link || '',
      priority:(type==='request')?'high':'medium',
    });

    // Handle file uploads
    if (req.files) {
      if (req.files.posterImage && req.files.posterImage.length > 0) {
        newFeed.imageUri = req.files.posterImage[0].path;
      }
      if (req.files.videoClip && req.files.videoClip.length > 0) {
        newFeed.videoUri = req.files.videoClip[0].path;
      }
    }

    await newFeed.save();

    res.status(201).json({ success: true, message: 'Feed created successfully', feed: newFeed });
  } catch (error) {
    console.error('Error creating feed:', error);
    res.status(500).json({ success: false, message: 'Something went wrong' });
  }
};



module.exports = { handleUserUpdate , handleCreateFeed };
