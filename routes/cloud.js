var cloudinary = require("cloudinary");
var routes= {};

routes.delete = function(req, res) {
  if (! req.session.user) res.send(401);
  else {
    cloudinary.api.delete_resources([req.body.public_id], function(result) {
      console.log('ok', result);
      res.send(200);
    });
  }
}

routes.upload_pic = function(req, res){
  if (! req.session.user) res.send(401);
  else {
    cloudinary.uploader.upload(
      req.files.pic.path,
      function(result) { res.send(200); },
      {
        public_id: req.files.pic.name.split(".").shift(), 
        crop: 'limit',
        width: 2000,
        height: 2000,
        eager: [
          { width: 200, height: 200, crop: 'thumb', gravity: 'face',
            radius: 20, effect: 'sepia' },
          { width: 100, height: 150, crop: 'fit', format: 'png' }
        ],                                     
        tags: [req.session.user.tag]
      }      
    )

  }
}

routes.list = function(req, res){
  if (!req.session.user) res.send(401);
  else{
    cloudinary.api.resources_by_tag(req.session.user.tag, function(result){
      res.send({
        'resources': result.resources,
        'user': req.session.user
      });
    });
  }
}

module.exports = routes;
