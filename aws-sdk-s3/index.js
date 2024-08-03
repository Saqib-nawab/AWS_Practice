require('dotenv').config();
const { GetObjectCommand, S3Client, PutObjectCommand, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// this is the client who is requesting something from bucket
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

//how presigned URL works with Get objects
// command which is being requested
async function getObjectURL(key) {
    const command = new GetObjectCommand({
        Bucket: 'saqib-private',
        Key: key
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 20 });
    return url;
}


async function putObject(filename, contentType) { //user will provide file and contentType while uploading

    const command = new PutObjectCommand({
        Bucket: 'saqib-private',
        Key: `/uploads/user-uploads/${filename}`,
        ContentType: contentType
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 20 });
    return url;
}

// New function to list objects in the S3 bucket
async function listObjects() {
    const command = new ListObjectsV2Command({
        Bucket: 'saqib-private'
    });

    try {
        const response = await s3Client.send(command);
        return response.Contents.map(object => object.Key);
    } catch (error) {
        console.error('Error listing objects:', error);
        throw error;
    }
}
async function init() {
    console.log('Image URL is:', await getObjectURL('SaqibNawab.jpeg'));

    console.log('File upload URL is:', await putObject('test.jpg', 'image/jpeg'));


    const objectKeys = await listObjects();
    console.log('Objects in the bucket:', objectKeys);
}


init();
