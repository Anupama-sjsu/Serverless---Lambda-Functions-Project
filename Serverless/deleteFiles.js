const deleteFile = async(key, s3, knexClient) => {
    let s3Response;
    try {
        s3Response = await s3.deleteObject({
            Bucket: process.env.BUCKET_NAME,
            Key: key
        }).promise();
        if(s3Response.DeleteMarker) {
            await knexClient('Files').where({key: key}).del();
            await knexClient('UserFiles').where({key: key}).del();
        }
    } catch(e) {
        throw new Error(e)
    }
    return s3Response;
}
module.exports = deleteFile;