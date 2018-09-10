sap.ui.define([
  "sap/ui/base/Object",
  "sap/ui/model/json/JSONModel",
  "com/erpx/site/prulia/PRULIA/utils/Config",
  "com/erpx/site/prulia/PRULIA/utils/ErrorHandler"
], function(Object, JSONModel, Config, ErrorHandler) {
  "use strict";
  var oInstance;
  var oNews = Object.extend("com.erpx.site.prulia.PRULIA.utils.News",{
    _newsModel: undefined,
    constructor: function(fnSuccess, fnError){
    },

    getModel: function(fnSuccess, fnError) {
      var that = this;
      var oDeferred = new $.Deferred();
      if(that._newsModel !== undefined){
        oDeferred.resolve(that._newsModel)
      } else {
        that.updateNewsModel(function(){
          oDeferred.resolve(that._newsModel)
        }, function(){
          oDeferred.reject()
        })
      }
      return oDeferred.promise();
    },
    getTop5Model: function(fnSuccess, fnError) {
      var that = this;
      var oDeferred = new $.Deferred();
      if(that._newsModel !== undefined){
        oDeferred.resolve(new JSONModel(that._newsModel.getProperty("/").slice(0,5)))
      } else {
        that.updateNewsModel(function(){
          oDeferred.resolve(new JSONModel(that._newsModel.getProperty("/").slice(0,5)))
        }, function(){
          oDeferred.reject()
        })
      }
      return oDeferred.promise();
    },
    updateNewsModel: function(fnSuccess, fnError){
      $.get('/api/method/erpx_prulia.prulia_news.doctype.prulia_newsletter.prulia_newsletter.get_newsletter_list', function(data, status, xhr){
          var oNewsItem = [];
          if(data.message !== undefined){
            oNewsItem = data.message;
          }
          this._manageNewsImage(oNewsItem); 
          if(this._newsModel === undefined){
            this._newsModel = new JSONModel(oNewsItem);
          } else {
            this._newsModel.setData(oNewsItem);
          }
          fnSuccess(this._newsModel);
        }.bind(this)).fail(function(error) {
          if(error.responseJSON){
            //ErrorHandler.showErrorMessage(JSON.parse(JSON.parse(error.responseJSON._server_messages)[0]).message);
          } else {
            //ErrorHandler.showErrorMessage(null,error);
            console.log(error); // or whatever
            fnError();
          }
        }.bind(this));
    },

    _manageNewsImage: function(aNews){
      for(var i = 0; i < aNews.length; i++){
          if(aNews[i].news_image === undefined || aNews[i].news_image === null){
            aNews[i].news_image = 'css/images/PruliaImage.png'
          } else if(aNews[i].news_image.indexOf("/files/") === 0){
            if(Config.serverURL === "http://127.0.0.1:8080"){
              aNews[i].news_image = "http://127.0.0.1:8000" + aNews[i].news_image;
            } else {
              aNews[i].news_image = Config.serverURL + aNews[i].news_image;
            }
          } 
        }
    }
  });
  return {
        getInstance: function () {
            if (!oInstance) {
                oInstance = new oNews();
            }
            return oInstance;
        }
    };
});