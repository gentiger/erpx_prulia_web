sap.ui.define([
  "sap/ui/base/Object",
  "sap/ui/model/json/JSONModel",
  "com/erpx/site/prulia/PRULIA/utils/Config",
  "com/erpx/site/prulia/PRULIA/utils/ErrorHandler"
], function(Object, JSONModel, Config, ErrorHandler) {
  "use strict";
  return Object.extend("com.erpx.site.prulia.PRULIA.util.SmartPartner", {
    constructor: function() {

      this.model = new JSONModel();
      
    },
    updateModel(fnSuccess, fnError){
      $.get(Config.serverURL + '/api/method/erpx_prulia.prulia_news.doctype.prulia_banner.prulia_banner.get_banner', function(data, status, xhr){
        for(var i = 0; i < data.message.length; i++){
          if(data.message[i].image === null){
            data.message[i].image = 'css/images/PruliaImage.png'
          } else if(data.message[i].image.indexOf("/files/") === 0){
            data.message[i].image = Config.serverURL + data.message[i].image;
            // data.message[i].image = "http://localhost:8000" + data.message[i].image;
          } 
        }
        

        this.model.setData(data.message);
        if(fnSuccess){
          fnSuccess();
        }
      }.bind(this)).fail(function(error) {
        if(fnError){
          fnError();
        }
        if(error.responseJSON){
          //ErrorHandler.showErrorMessage(JSON.parse(JSON.parse(error.responseJSON._server_messages)[0]).message);
        } else {
          //ErrorHandler.showErrorMessage(null,error);
          console.log(error); // or whatever
        }
      }.bind(this));
    },

    getModel: function(fnSuccess, fnError) {
      this.updateModel(fnSuccess, fnError)
      return this.model;
    // },
    // getTop5Model: function(fnSuccess, fnError) {
    //   var top5Model = new JSONModel();
    //   this.updateModel(function(){
    //     top5Model.setData(this.model.getProperty("/").slice(0, 5));
    //     if(fnSuccess){
    //       fnSuccess()
    //     }
    //   }.bind(this), fnError)
      
      
    //   return top5Model;
    }
  });
});