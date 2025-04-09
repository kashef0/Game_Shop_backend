const { Storage } = require('@google-cloud/storage');
const path = require('path');

// Initiera Google Cloud Storage klienten med projekt id och credentials
const storage = new Storage({
  projectId: process.env.PROJECT_ID,

  // Credentials hämtas från miljövariabler
  credentials: {
    client_email: process.env.CLIENT_EMAIL,
    private_key: process.env.MYFILENAME.replace(/\\n/g, '\n'),
  },
});

// Välj bucket att arbeta med
const bucket = storage.bucket(process.env.BUCKET_NAME);

// ladda upp en bildfil till Google Cloud Storage
const uploadImage = (file) => {
  return new Promise((resolve, reject) => {
    // Avbryt om ingen fil skickats
    if (!file) {
      reject('No image file');
    }

    // Skapa ett nytt filobjekt i GCS med unikt filnamn
    const blob = bucket.file(`profile_pics/${Date.now()}_${file.originalname}`);

    // Skapa en skrivström för att ladda upp filen
    const blobStream = blob.createWriteStream({
      resumable: false, // uppladdning utan återupptagning
      metadata: {
        contentType: file.mimetype, // Ange rätt filtyp
      },
    });

    // hantera fel under uppladdning
    blobStream.on('error', (err) => {
      reject(err);
    });

    // generera en publik URL till filen
    blobStream.on('finish', () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      resolve(publicUrl);
    });

    // Skriv filens innehåll till GCS
    blobStream.end(file.buffer);
  });
};

module.exports = { uploadImage };
