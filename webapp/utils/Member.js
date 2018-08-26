sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/m/MessageToast',
	"com/erpx/site/prulia/PRULIA/utils/Config"
], function (JSONModel,MessageToast,Config) {
	"use strict";

	return {
		_memberModel : undefined,
		createMemberModel: function () {
			if( this._memberModel === undefined){
				this._memberModel = new JSONModel({
					memberLogon: false,
					memberName: ""
				});
			}
			
			this.check_if_cookie_valid();
			return this._memberModel;
		},
		
		loginMember: function(username, password){
			/*Setup Frappe Cookie*/
			$.post(Config.serverURL + '/api/method/login',{ usr: username, pwd: password, device: "desktop" }, function(data, status, xhr){
				var cookie_source = xhr.getResponseHeader('Set-Cookie');
				// debugger;
				// localStorage.session_id = common.get_cookie("sid", cookie_source);
				this.check_if_cookie_valid();
				this._memberModel.setProperty("/memberLogon", true);
				this._memberModel.setProperty("/memberName", data.full_name);
				MessageToast.show("Member successfully login");
			}.bind(this))
		},
		
		logoutMember: function(){
			$.get(Config.serverURL + '/api/method/logout', function(data, status, xhr){
				this.check_if_cookie_valid();
				this._memberModel.setProperty("/memberLogon", false);
				this._memberModel.setProperty("/memberName", '');
				MessageToast.show("Member successfully logout");
			}.bind(this))
			
		},
		
		check_if_cookie_valid: function(){
			$.get(Config.serverURL + '/api/method/frappe.auth.get_logged_user', function(data, status, xhr){
				debugger;
			})
		}

	};
});