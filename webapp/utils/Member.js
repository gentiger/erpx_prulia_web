sap.ui.define([
	"sap/ui/base/Object",
	'sap/m/MessageToast',
	"sap/ui/model/json/JSONModel"
], function (Object,MessageToast,JSONModel) {
	"use strict";
  return Object.extend("com.erpx.site.prulia.PRULIA.util.Member", {
  	_memberModel: undefined,
    constructor: function() {
    	this._memberModel = new JSONModel();

      	$.get('/api/method/erpx_prulia.prulia_members.doctype.prulia_member.prulia_member.mobile_member_login', function(data, status, xhr){
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

	// return {
	// 	_memberModel : undefined,
	// 	createMemberModel: function () {
	// 		if( this._memberModel === undefined){
	// 			this._memberModel = new JSONModel({
	// 				memberLogon: false,
	// 				memberName: ""
	// 			});
	// 		}
			
	// 		this.check_if_cookie_valid();
	// 		return this._memberModel;
	// 	},
		
	// 	loginMember: function(username, password){
	// 		/*Setup Frappe Cookie*/
	// 		$.post(Config.serverURL + '/api/method/login',{ usr: username, pwd: password, device: "desktop" }, function(data, status, xhr){
	// 			var cookie_source = xhr.getResponseHeader('Set-Cookie');
	// 			// debugger;
	// 			// localStorage.session_id = common.get_cookie("sid", cookie_source);
	// 			this.check_if_cookie_valid(function(){
	// 				MessageToast.show("Member successfully login");
	// 			});
				
				
	// 		}.bind(this))
	// 	},
		
	// 	logoutMember: function(){
	// 		$.get(Config.serverURL + '/api/method/logout', function(data, status, xhr){
	// 			this.check_if_cookie_valid();
	// 			this._memberModel.setProperty("/memberLogon", false);
	// 			this._memberModel.setProperty("/memberName", '');
	// 			MessageToast.show("Member successfully logout");
	// 		}.bind(this))
			
	// 	},
		
	// 	check_if_cookie_valid: function(fnSuccess){
	// 		var that = this;
	// 		$.get(Config.serverURL + '/api/method/frappe.auth.get_logged_user', function(data, status, xhr){
	// 			debugger;
	// 			$.get(Config.serverURL + '/api/method/erpx_prulia.prulia_members.doctype.prulia_member.prulia_member.mobile_member_login', function(data, status, xhr){
	// 				that._memberModel.setProperty("/memberLogon", true);
	// 				that._memberModel.setProperty("/memberName", data.full_name);
	// 			}).fail(function(error) {
	// 				if(error.responseJSON){

	// 				} else {
	// 					console.log(error); // or whatever
	// 				}
				    
	// 			});
	// 		}).fail(function() {
	// 		    console.log('No valid user session found'); // or whatever
	// 		});
	// 	}

	// };
// });