const { GetObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

//this is the client who is requesting something from bucket
const s3Client = new S3Client({
    region: 'us-east-1',
    Credential: {
        accessKeyId: "AKIAZI2LIRHH53D5O4WX",
        secretAccessKey: "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"
    }
});


//command which is being requested
async function getObjectURL(key) {
    const command = new GetObjectCommand({
        Bucket: 'saqib-private',
        Key: key
    });

    const url = await getSignedUrl(s3Client, command);
    return url;
}
async function init() {
    console.log('Image URL is: ', await getObjectURL('SaqibNawab.jpeg '));
}

init();