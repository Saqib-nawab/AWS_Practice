require('dotenv').config();
const { GetObjectCommand, S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");



// In this code:

// We import DeleteObjectCommand from the AWS SDK.
// We create a new function deleteObject to delete an object from the S3 bucket saqib - private.
// The deleteObject function uses DeleteObjectCommand to delete the specified object and logs a success message.
// We call the deleteObject function in the init function, first listing the objects, then deleting the first object in the list(if any), and finally listing the objects again to show the updated list.





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

// New function to delete an object from the S3 bucket
async function deleteObject(key) {
    const command = new DeleteObjectCommand({
        Bucket: 'saqib-private',
        Key: key
    });

    try {
        const response = await s3Client.send(command);
        console.log('Successfully deleted object:', key);
        return response;
    } catch (error) {
        console.error('Error deleting object:', error);
        throw error;
    }
}
async function init() {
    console.log('Image URL is:', await getObjectURL('SaqibNawab.jpeg'));

    console.log('File upload URL is:', await putObject('test.jpg', 'image/jpeg'));


    const objectKeys = await listObjects();
    console.log('Objects in the bucket:', objectKeys);

    if (objectKeys.length > 0) {
        console.log('Deleting object:', objectKeys[0]);
        await deleteObject(objectKeys[0]);

        const updatedObjectKeys = await listObjects();
        console.log('Objects in the bucket after deletion:', updatedObjectKeys);
    }

}


init();



