Picture = Backbone.Model.extend({});

Pictures = Backbone.Collection.extend({
  model: Picture
});

pics = new Pictures([]);

PictureUploadFormView = Backbone.Marionette.ItemView.extend({
  template: Handlebars.compile($("#picture-upload-form").html()),
  
  events: {
    'submit form': 'uploadHandler'
  },
  
  uploadHandler: function(e){
    e.preventDefault();
    e.stopPropagation();
    var options = {
      beforeSubmit: function(){
        $('#preloader').stop().fadeIn();
      },
      statusCode: {
        401: function(req, status, error) {
          $.removeCookie('user');
          router.navigate('/login', { trigger: true });
        }
      },
      success:function(data){
        $('#preloader').stop().fadeOut();
        router.navigate("#/pictures/list");
      }
    }
    $(e.target).ajaxSubmit(options); 
    // return false to prevent normal browser submit and page navigation 
    return false;     
  }
  
});

PictureItemView = Backbone.Marionette.ItemView.extend({
  template: Handlebars.compile($("#picture-item").html()),
  tagName: "tr"  
})

PicturesListView = Backbone.Marionette.CompositeView.extend({
  tagName: "table",
  id: "pictures",
  className: "table",
  template: Handlebars.compile($("#pictures-list").html()),
  itemView: PictureItemView,
  
  appendHtml: function(collectionView, itemView){
    collectionView.$("tbody").append(itemView.el);
  },
  
  events: {
    'click a': 'removePic'
  },
  
  removePic: function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    $.ajax({
      url: '/delete_pic',
      type: 'POST',
      data: { public_id: $(e.target).attr("data-public_id") },
      beforeSend: function() { $('#preloader').stop().fadeIn(); },
      statusCode: {
        401: function(req, status, error) {
          $.removeCookie('user');
          router.navigate('/login', { trigger: true });
        }
      },
      success: function(data, status, req) {
        router.navigate('/pictures/list/refresh');
        router.navigate('/pictures/list', { trigger: true });
      },
      complete: function(req, status) {
        $('#preloader').stop().fadeOut();
      }
    });
  }
});

var picturesController = {
  list: function() {
    PictureApp.headerRegion.show(new NavbarView({
      model: new Backbone.Model({'user_name': $.cookie('user')})
    }));
    PictureApp.mainRegion.show(new PicturesListView({
      collection: pics
    }));
    
    $.ajax({
      url: '/pics',
      type: 'GET',
      dataType:'json',
      beforeSend: function() { $('#preloader').stop().fadeIn(); },
      statusCode: {
        401: function(req, status, error) {
          $.removeCookie('user');
          router.navigate('/login', { trigger: true });
        }
      },
      success: function(data, status, req) {
        PictureApp.mainRegion.show(new PicturesListView({
          collection: new Pictures(data.resources)
        }));
      },
      complete: function(req, status) {
        $('#preloader').stop().fadeOut();
      }
    });
  },
  upload: function(){
    PictureApp.headerRegion.show(new NavbarView());
    PictureApp.mainRegion.show(new PictureUploadFormView());
  }
};

var router = new Marionette.AppRouter({
  controller: picturesController,
  appRoutes: {
    'pictures/list': 'list',
    'pictures/upload': 'upload'
  }
});
