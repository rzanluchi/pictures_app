// Dummy users list
var users = {
  raphael:    { name: 'raphael', pass: 123, tag: 'astronaut_howard'},
  zanluchi:   { name: 'zanluchi', pass: 123, tag: 'bazinga'},
  familyguy:  { name: 'guy', pass: 123, tag: 'guy' }
}

var routes = {}

routes.login = function(req, res){
  var valid_user = users[req.body.user]; 
  if (valid_user && valid_user.pass == req.body.pass){
    req.session.user = {
      name: valid_user.name,
      tag: valid_user.tag
    };
    res.send({ 'session': req.session });
  } else {
    res.send({ 'session': false });
  }
}

routes.logout = function(req, res){
  req.session.user = null
  res.send({ 'session': false });
}

module.exports = routes
