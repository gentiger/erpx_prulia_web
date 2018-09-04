sap.ui.define([
	"com/erpx/site/prulia/PRULIA/utils/Config",
	"com/erpx/site/prulia/PRULIA/utils/ErrorHandler",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/Dialog",
	"sap/m/Title",
	"sap/m/VBox",
	'sap/ui/layout/form/SimpleForm',
	"sap/m/Label",
	"sap/m/Input",
	"sap/m/Button",
	"sap/m/MessageBox"
], function (Config, ErrorHandler, JSONModel, MessageToast, Dialog, Title, VBox, SimpleForm, Label, Input, Button, MessageBox) {
	"use strict";

	return {
		_loginModel : undefined,
		_memberModel: undefined,
		getLoginModel : function(){
			if (this._loginModel === undefined){
				this._loginModel = new JSONModel({
					memberLogon: false
				});
			}
			return this._loginModel;
		},
		getMemberModel : function(){
			if (this._memberModel === undefined){
				this._memberModel = new JSONModel();
			}
			return this._memberModel;
		},
		login: function(username, password, fnSuccess, fnError){
			/*Setup Frappe Cookie*/
			
			$.post(Config.serverURL + '/api/method/login',{ usr: username, pwd: password, device: "desktop" }, function(data, status, xhr){
				var cookie_source = xhr.getResponseHeader('Set-Cookie');
				this.readMemberDetails(function(){
					fnSuccess();
				}, fnError);
			}.bind(this)).fail(function(error) {
				if(error.responseJSON && error.responseJSON._server_messages){
					ErrorHandler.showErrorMessage(JSON.parse(JSON.parse(error.responseJSON._server_messages)[0]).message);
				} else if(error.responseJSON && error.responseJSON.message){
					ErrorHandler.showErrorMessage(error.responseJSON.message);
				} else {
					ErrorHandler.showErrorMessage(null,error);
					console.log(error); // or whatever
				}
				fnError();
			}.bind(this));
		},
		logout: function(fnSuccess, fnError){
			$.get(Config.serverURL + '/api/method/logout', function(data, status, xhr){
				this._loginModel.setProperty("/memberLogon", false);
				this._memberModel.setData({});
				if(fnSuccess){
					fnSuccess();
				}
				// 
			}.bind(this)).fail(function(error){
				if(fnError){
					fnError();
				}
				ErrorHandler.showErrorMessage(null,error);
				console.log(error); // or whatever

			}.bind(this))
		},
		check_if_cookie_valid: function(fnSuccess, fnError){
			var that = this;
			$.get(Config.serverURL + '/api/method/frappe.auth.get_logged_user', function(data, status, xhr){
				this._loginModel.setProperty("/memberLogon", true);
				if(fnSuccess){
					fnSuccess();
				}
			}.bind(this)).fail(function() {
			    console.log('No valid user session found');
			    this._loginModel.setProperty("/memberLogon", false);
			    if(fnError){
					fnError();
				}
			}.bind(this));
		},
		open_forget_password_dialog: function(oController){
			if (!this.passwordDialog) {
				this.passwordDialog = new Dialog({
					title: 'Forgot Password?',
					stretch: oController.getOwnerComponent().getModel("device").getProperty("/system/phone"),
					content: new VBox({
						items:[
							new sap.m.Title({
								text:"Enter your Agent ID and NRIC Number so we can send you temporary password"
							}),
							new SimpleForm({
								editable:true,
								layout:"ResponsiveGridLayout",
								content: [
									new Label({
										text: "Agent ID"
									}),
									new Input("forgotpassword-AgentID"),
									new Label({
										text: "NRIC Number"
									}),
									new Input("forgotpassword-NricNo")
								]
							})
						]
					}),
					beginButton: new Button({
						text: 'Send',
						press: function (oEvent) {
							oController.getOwnerComponent().getModel("appParam").setProperty("/busy", true);
							this.forget_password(
								sap.ui.getCore().byId("forgotpassword-AgentID").getValue(), 
								sap.ui.getCore().byId("forgotpassword-NricNo").getValue(), 
								function(){
									oController.getOwnerComponent().getModel("appParam").setProperty("/busy", false);
								}.bind(this), function(){
									oController.getOwnerComponent().getModel("appParam").setProperty("/busy", false);
								}.bind(this));
							this.passwordDialog.close();
							// MessageToast.show("User successful login");
						}.bind(this)
					}),
					endButton: new Button({
						text: 'Cancel',
						press: function () {
							this.passwordDialog.close();
						}.bind(this)
					}),
					afterClose: function(){
						oController.getView().removeDependent(this.passwordDialog);
						this.passwordDialog.destroy();
						this.passwordDialog = undefined;

					}.bind(this)
				}).addStyleClass("sapUiContentPadding");

				//to get access to the global model
				oController.getView().addDependent(this.passwordDialog);
			}

			this.passwordDialog.open();
		},
		forget_password: function(prulia_id, nric_number, fnSuccess, fnError){
			console.log(prulia_id + " " + nric_number);
			$.ajax({
			 	type: "POST",
			  	url: Config.serverURL + '/api/method/erpx_prulia.prulia_members.doctype.prulia_member.prulia_member.forget_password',
			  	data: JSON.stringify({prulia_id: prulia_id, nric_number: nric_number}),
			  	success: function(data, status, xhr){
			  		if(fnSuccess){
						fnSuccess();
					}
			  		if(data.message.indexOf('not found')> -1){
			  			MessageBox.show("Noticed that you are new in PRULIA, please click OK to proceed with membership registration",
							{
								icon: sap.m.MessageBox.Icon.WARNING,
          						title: "Warning",
          						actions: [sap.m.MessageBox.Action.CANCEL, sap.m.MessageBox.Action.OK],
          						onClose: function(oAction){
									window.open("http://103.253.146.122/member-registration/")
								}
							}
						);
			  		} else if (data.message.indexOf('temporary login credential')> 1){
			  			MessageBox.information(data.message);
			  		} else {
			  			MessageToast.show(data.message);
			  		}
					// var cookie_source = xhr.getResponseHeader('Set-Cookie');
					// this.readMemberDetails(function(){
					// 	MessageToast.show("Member successfully login");
					// });
					}.bind(this),
			  	dataType: 'json',
			  	contentType: 'application/json',
			  	error: function(error) {
					// debugger;
					if(fnError){
						fnError();
					}
					if(error.responseJSON && error.responseJSON._server_messages && JSON.parse(error.responseJSON._server_messages)[0] && JSON.parse(JSON.parse(error.responseJSON._server_messages)[0]).message.indexOf('not found')> -1){
						MessageBox.show("Noticed that you are new in PRULIA, please click OK to proceed with membership registration",
							{
								icon: sap.m.MessageBox.Icon.WARNING,
          						title: "Warning",
          						actions: [sap.m.MessageBox.Action.CANCEL, sap.m.MessageBox.Action.OK],
          						onClose: function(oAction){
          							if(oAction === "OK"){
          								window.open("http://103.253.146.122/member-registration/");
          								// window.open("http://127.0.0.1:8000/member-registration/")
          							}
          							
									
								}
							}
						);
					} else {
						ErrorHandler.showErrorMessage(null,error);
						console.log(error); // or whatever
					}
				}.bind(this)
			})
		},
		readMemberDetails: function(fnSuccess, fnError){
			$.get(Config.serverURL + '/api/method/erpx_prulia.prulia_members.doctype.prulia_member.prulia_member.mobile_member_login', function(data, status, xhr){
				this.setMemberModel(data.message);
				if(fnSuccess){
					fnSuccess();
				}
			}.bind(this)).fail(function(error) {
				this.logout();
				if(fnError){
					fnError();
				}
				if(error.responseJSON){
					ErrorHandler.showErrorMessage(JSON.parse(JSON.parse(error.responseJSON._server_messages)[0]).message);
				} else {
					ErrorHandler.showErrorMessage(null,error);
					console.log(error); // or whatever
				}
			    
			}.bind(this));
		},
		setMemberModel: function(memberData){
			this._loginModel.setProperty("/memberLogon", true);
			if(memberData.profile_photo.indexOf("/files/") === 0){
				memberData.profile_photo = Config.serverURL + memberData.profile_photo;
				// memberData.profile_photo = "http://localhost:8000" + memberData.profile_photo;
			}
			this._memberModel.setData(memberData);
		},
		updateMemberDetails: function(fnSuccess, fnError){
			$.ajax({
			 	type: "POST",
			  	url: Config.serverURL + '/api/method/erpx_prulia.prulia_members.doctype.prulia_member.prulia_member.update_member_pref',
			  	data: this._memberModel.getJSON(),
			  	success: function(data, status, xhr){
			  		this.setMemberModel(data.message);
			  		if(fnSuccess){
						fnSuccess();
					}
			  		// this.readMemberDetails(fnSuccess, fnError);
					// var cookie_source = xhr.getResponseHeader('Set-Cookie');
					// this.readMemberDetails(function(){
					// 	MessageToast.show("Member successfully login");
					// });
					}.bind(this),
			  	dataType: 'json',
			  	contentType: 'application/json',
			  	error: function(error) {
					// debugger;
					this.readMemberDetails();
					if(fnError){
						fnError();
					}
					if(error.responseJSON && error.responseJSON._server_messages){
						ErrorHandler.showErrorMessage(JSON.parse(JSON.parse(error.responseJSON._server_messages)[0]).message);
					} else if(error.responseJSON && error.responseJSON.message){
						ErrorHandler.showErrorMessage(error.responseJSON.message);
					} else {
						ErrorHandler.showErrorMessage(null,error);
						console.log(error); // or whatever
					}
				}.bind(this)
			})
		},
		changePassword: function(currentPassword, newPassword, fnSuccess, fnError){
			/*Setup Frappe Cookie*/
			
			$.post(Config.serverURL + '/api/method/frappe.core.doctype.user.user.update_password',
				{ old_password: currentPassword, new_password: newPassword, logout_all_sessions: false }, function(data, status, xhr){
					if(fnSuccess){
						fnSuccess();
					}
					
			}.bind(this)).fail(function(error) {
				if(fnError){
					fnError();
				}
				if(error.responseJSON && error.responseJSON._server_messages){
					ErrorHandler.showErrorMessage(JSON.parse(JSON.parse(error.responseJSON._server_messages)[0]).message);
				} else if(error.responseJSON && error.responseJSON.message){
					ErrorHandler.showErrorMessage(error.responseJSON.message);
				} else {
					ErrorHandler.showErrorMessage(null,error);
					console.log(error); // or whatever
				}
			}.bind(this));
		},




	};
});