const AWS = require('aws-sdk');
var s3 = new AWS.S3();
const knexClient = require('knexClient');
const getFiles = require('getFiles');
const postFile = require('postFile');
const deleteFiles = require('deleteFiles');
const putFile = require('putFile');

exports.handler = async(event, context) => {
    let { method } = event.requestContext.http;
    let { claims } = event.requestContext.authorizer.jwt;
    let { name, family_name, email } = claims;
    switch (method) {
        case 'DELETE': {
            let { key } = JSON.parse(event.body);
            return deleteFiles(key, s3, knexClient);
        }
        case 'GET': {
            let isAdmin = (claims["cognito:groups"] && claims["cognito:groups"].toLowerCase() === "[admin]") ? true : false;
            return getFiles(email, isAdmin, knexClient);
        }
        case 'POST': {
            let { file, fileName, description } = JSON.parse(event.body);
            return postFile(file, fileName, description, name, family_name, email, s3, knexClient);
        }
        default:
            throw new Error("Unsupported method");
    }
};