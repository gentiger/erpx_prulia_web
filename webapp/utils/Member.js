sap.ui.define([
	"sap/ui/base/Object",
	'sap/m/MessageToast',
	"sap/ui/model/json/JSONModel",
  "com/erpx/site/prulia/PRULIA/utils/Config"
], function (Object,MessageToast,JSONModel, Config) {
	"use strict";
  return Object.extend("com.erpx.site.prulia.PRULIA.util.Member", {
  	_memberModel: undefined,
    constructor: function() {
    	this._memberModel = new JSONModel();

      	$.get(Config.serverURL+'/api/method/erpx_prulia.prulia_members.doctype.prulia_member.prulia_member.mobile_member_login', function(data, status, xhr){
			// that._memberModel.setProperty("/memberLogon", true);
			that._memberModel.setData(data);
		}).fail(function(error) {
			if(error.responseJSON){

			} else {
				console.log(error); // or whatever
			}
		    
		});
      	
    },
    exit: function(){
    	this._memberModel = undefined;
    },

    getModel: function() {
      return this._memberModel;
    }
  });
});