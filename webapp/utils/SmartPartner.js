sap.ui.define([
  "sap/ui/base/Object",
  "sap/ui/model/json/JSONModel",
  "com/erpx/site/prulia/PRULIA/utils/Config",
  "com/erpx/site/prulia/PRULIA/utils/ErrorHandler"
], function(Object, JSONModel, Config, ErrorHandler) {
  "use strict";
  var oInstance;
  var oSmartPartner = Object.extend("com.erpx.site.prulia.PRULIA.utils.SmartPartner",{
    _smartPartnerModel: undefined,
    constructor: function(fnSuccess, fnError){
    },

    getModel: function(fnSuccess, fnError) {
      var that = this;
      var oDeferred = new $.Deferred();
      if(that._smartPartnerModel !== undefined){
        oDeferred.resolve(that._smartPartnerModel)
      } else {
        that.updateSmartPartnerModel(function(){
          oDeferred.resolve(that._smartPartnerModel)
        }, function(){
          oDeferred.reject()
        })
      }
      return oDeferred.promise();
    },
    updateSmartPartnerModel: function(fnSuccess, fnError){
      $.get(Config.serverURL + '/api/method/erpx_prulia.prulia_news.doctype.prulia_banner.prulia_banner.get_banner', function(data, status, xhr){
          var oSmartPartnerItem = [];
          if(data.message !== undefined){
            oSmartPartnerItem = data.message;
          }
          this._manageSmartPartnerImage(oSmartPartnerItem); 
          if(this._smartPartnerModel === undefined){
            this._smartPartnerModel = new JSONModel(oSmartPartnerItem);
          } else {
            this._smartPartnerModel.setData(oSmartPartnerItem);
          }
          fnSuccess(this._smartPartnerModel);
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

    _manageSmartPartnerImage: function(aSmartPartner){
      for(var i = 0; i < aSmartPartner.length; i++){
          if(aSmartPartner[i].image === undefined || aSmartPartner[i].image === null){
            aSmartPartner[i].image = 'css/images/PruliaImage.png'
          } else if(aSmartPartner[i].image.indexOf("/files/") === 0){
            if(Config.serverURL === "http://127.0.0.1:8080"){
              aSmartPartner[i].image = "http://127.0.0.1:8000" + aSmartPartner[i].image;
            } else {
              aSmartPartner[i].image = Config.serverURL + aSmartPartner[i].image;
            }
          } 
        }
    }
  });
  return {
        getInstance: function () {
            if (!oInstance) {
                oInstance = new oSmartPartner();
            }
            return oInstance;
        }
    };
});