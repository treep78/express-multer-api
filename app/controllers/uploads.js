'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');
const Upload = models.upload;
const s3Upload = require('../../lib/aws-s3-upload');

const multer = require('multer');
const multerUpload = multer({dest: '/tmp/'});

//sconst authenticate = require('./concerns/authenticate');

const index = (req, res, next) => {
  Upload.find()
    .then(uploads => res.json({ uploads }))
    .catch(err => next(err));
};

const show = (req, res, next) => {
  Upload.findById(req.params.id)
    .then(upload => upload ? res.json({ upload }) : next())
    .catch(err => next(err));
};

const create = (req, res, next) => {
  // let upload = Object.assign(req.body.upload, {
  //   _owner: req.currentUser._id,
  // });
  s3Upload(req.file)
    .then(function(s3Response){
      console.log('s3Upload ran, and returnsed: ', s3Response);
      return Upload.create({
        url: s3Response.Location,
        title: req.body.image.title,
      });
    })
    .then(function(upload){
      console.log('Inside second then, upload is: ',upload);
      res.json({
        body: upload
      });
    })
    .catch(function(error){
      next(error);
    });
};

const update = (req, res, next) => {
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  Upload.findOne(search)
    .then(upload => {
      if (!upload) {
        return next();
      }

      delete req.body._owner;  // disallow owner reassignment.
      return upload.update(req.body.upload)
        .then(() => res.sendStatus(200));
    })
    .catch(err => next(err));
};

const destroy = (req, res, next) => {
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  Upload.findOne(search)
    .then(upload => {
      if (!upload) {
        return next();
      }

      return upload.remove()
        .then(() => res.sendStatus(200));
    })
    .catch(err => next(err));
};

module.exports = controller({
  index,
  show,
  create,
  update,
  destroy,
}, { before: [
  { method: multerUpload.single('image[file]'), only: ['create'] },
], });
