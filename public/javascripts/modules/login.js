var loginController = {
  login: function() {
    if($.cookie('user') !== undefined) {
      router.navigate('/pictures/list', { trigger: true });
    } else {
      PictureApp.headerRegion.reset();
      PictureApp.mainRegion.show(new LoginFormView());
    }
  },
  logout: function() {
    $.get("/logout", {}, function(data, status, req) {
      if(data.session == false) {
        $.removeCookie('user');
        router.navigate('/login', { trigger: true });
      }
    });
  }
};

var router = new Marionette.AppRouter({
  controller: loginController,
  appRoutes: {
    'login': 'login',
    'logout': 'logout',
  }
});

LoginFormView = Backbone.Marionette.ItemView.extend({
  template: Handlebars.compile($("#login-form").html()),

  events: {
    'submit form': 'loginHandler'
  },
  
  loginHandler: function(e) {
    e.preventDefault();
    e.stopPropagation();

    var payload = {
      user: this.$('[name="user"]').val(),
      pass: this.$('[name="pass"]').val()
    }
    
    $.post("/login", payload, function(data, status, req) {
      if(data.session) {
        $.cookie('user', data.session.user.name);
        router.navigate('/pictures/list', { trigger: true });
      } else
        $("#message").html('Wrong username or password (try raphael:123 or zanluchi:123)')
    });
  }
});
