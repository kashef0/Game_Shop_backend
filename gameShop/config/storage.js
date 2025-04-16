const { Storage } = require('@google-cloud/storage');

// Initialize GCS
const storage = new Storage({
  projectId: process.env.PROJECT_ID,
  credentials: {
    client_email: process.env.CLIENT_EMAIL,
    private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
});

const bucket = storage.bucket(process.env.BUCKET_NAME);



const uploadImage = async (file) => {
  if (!file) throw new Error('No file provided');

  const filename = `profile_pics/${Date.now()}_${file.originalname}`;
  const blob = bucket.file(filename);

  try {
    await new Promise((resolve, reject) => {
      const blobStream = blob.createWriteStream({
        resumable: false,
        metadata: { contentType: file.mimetype },
      });

      blobStream.on('error', (err) => {
        console.error('GCS Stream Error:', err); // Log detailed error
        reject(new Error('Failed to upload image to Google Cloud'));
      });

      blobStream.on('finish', () => {
        console.log('Upload successful:', filename);
        resolve();
      });

      blobStream.end(file.buffer);
    });
    await blob.makePublic();
    return `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
  } catch (err) {
    console.error('GCS Upload Failed:', {
      error: err.message,
      stack: err.stack,
    });
    throw err; 
  }
};

module.exports = { uploadImage };