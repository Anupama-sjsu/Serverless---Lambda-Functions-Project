const postFile = async(file, fileName, description, name, family_name, email, s3, knexClient) => {
    let s3Response;
    let decodedFile = Buffer.from(file, 'base64');
    try {
        s3Response = await s3.upload({
            "Key": fileName,
            "Bucket": process.env.BUCKET_NAME,
            "Body": decodedFile,
            ContentEncoding: 'base64'
        }).promise();
        if(s3Response.Key) {
            let { key, Location } = s3Response;
            let rdsResult = await knexClient('Users').where({user_id: email}).select("user_id");
            if(rdsResult.length === 0) {
                await knexClient('Users').insert({ user_id: email, fname: name, lname: family_name });
            }
            await knexClient('Files').insert({ key: s3Response.key, name: fileName, updt_date: new Date(), description: description, url: Location });
            await knexClient('UserFiles').insert({ user_id: email, key: key });
        }
    }
    catch (e) {
        throw new Error(e)
    }
    return JSON.stringify(s3Response);
}

module.exports = postFile;