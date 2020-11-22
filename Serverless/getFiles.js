const getFiles = async(email, isAdmin, knexClient) => {
     let rdsResult;
     try {
        if (isAdmin) {
            rdsResult = await knexClient.from('Files').innerJoin('UserFiles', 'UserFiles.key', 'Files.Key').
            innerJoin('Users', 'UserFiles.user_id', 'Users.user_id');
        }
        else {
            rdsResult = await knexClient.from('Files').innerJoin('UserFiles', 'UserFiles.key', 'Files.Key').
            innerJoin('Users', 'UserFiles.user_id', 'Users.user_id').where({ 'Users.user_id': email });
        }
    }
    catch (e) {
        throw new Error(e)
    }
    return JSON.stringify(rdsResult);
}
module.exports = getFiles;