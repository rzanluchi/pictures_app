PictureApp = new Backbone.Marionette.Application();

PictureApp.addRegions({
  mainRegion: "#container",
  headerRegion: "#header"
});

NavbarView = Backbone.Marionette.ItemView.extend({
  template: Handlebars.compile($("#navbar").html()),
  model: new Backbone.Model({'user_name': $.cookie('user')})
});

var appController = {
  home: function() {
    router.navigate('/login', { trigger: true });
  }
};

var router = new Marionette.AppRouter({
  controller: appController,
  appRoutes: {
    '': 'home'
  }
});

PictureApp.addInitializer(function(options){
  Backbone.history.start();
});

$(document).ready(function(){
  PictureApp.start();
});
