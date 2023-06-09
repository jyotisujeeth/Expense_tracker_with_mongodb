const AWS = require("aws-sdk");

const uploadToS3 = (data, filename) => {
  const BUCKET_NAME = "expensetrackingapp95";
  const IAM_USER_KEY = "AKIA27XFRQTQQEOZ6AYT";
  const IAM_USER_SECRET = "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";

  let s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
  });

  var params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: "public-read",
  };
  return new Promise((res, rej) => {
    s3bucket.upload(params, (err, s3response) => {
      if (err) {
        console.log("Something went wrong", err);
        rej(err);
      } else {
        console.log("success", s3response);
        res(s3response.Location);
      }
    });
  });
};
module.exports = {
  uploadToS3,
};