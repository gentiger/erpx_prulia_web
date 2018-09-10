sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/m/Popover',
	'sap/m/Button',
	'sap/m/Dialog',
	'sap/ui/layout/form/SimpleForm',
	'sap/m/Label',
	'sap/m/Input',
	'sap/m/MessageToast',
	"sap/ui/core/routing/History",
	"com/erpx/site/prulia/PRULIA/utils/Login",
	"com/erpx/site/prulia/PRULIA/utils/Member",
	"com/erpx/site/prulia/PRULIA/utils/Event"
], function (Controller, Popover, Button, Dialog, SimpleForm, Label, Input, MessageToast, History, Login, Member, Event) {
	"use strict";

	return Controller.extend("com.erpx.site.prulia.PRULIA.controller.App", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.erpx.site.prulia.PRULIA.view.App
		 */
		onInit: function() {
			
			// set the user model
			this.getView().setModel(Login.getLoginModel(), "login");
			this.getView().setModel(Login.getMemberModel(), "member");
			this.getOwnerComponent().getModel("appParam").setData({
				busy: true,
				showBack: false
			});

			Login.check_if_cookie_valid(function(){
				Login.readMemberDetails(function(){
					MessageToast.show("Welcome Back!");
					this.getOwnerComponent().getModel("appParam").setProperty("/busy", false);
				}.bind(this), function(){
					this.getOwnerComponent().getModel("appParam").setProperty("/busy", false);
				}.bind(this));
				// this.getView().setModel(new Member().getModel(),"member");
			}.bind(this), 
			function(){
				this.getOwnerComponent().getModel("appParam").setProperty("/busy", false);
			}.bind(this));
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.erpx.site.prulia.PRULIA.view.App
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.erpx.site.prulia.PRULIA.view.App
		 */
		// onAfterRendering: function() {
			
		// },

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.erpx.site.prulia.PRULIA.view.App
		 */
		//	onExit: function() {
		//
		//	}

		handleUserNamePress: function (event) {
			var that = this;
			if(this.popover === undefined){
				this.popover = new Popover({
					showHeader: false,
					placement: sap.m.PlacementType.Bottom,
					content:[
						new Button({
							text: 'Profile',
							type: sap.m.ButtonType.Transparent,
							press: this.handleProfilePress.bind(this)
						}),
						new Button({
							text: 'Change Password',
							type: sap.m.ButtonType.Transparent,
							press: this.handleChangePasswordPress.bind(this)
						}),
						new Button({
							text: 'Feedback',
							type: sap.m.ButtonType.Transparent,
							press: this.handleFeedbackPress.bind(this)
						}),
						new Button({
							text: 'Logout',
							type: sap.m.ButtonType.Transparent,
							press: this.handleLogoutPress.bind(this)
						})
					]
				}).addStyleClass('sapMOTAPopover sapTntToolHeaderPopover');
			}
			this.popover.openBy(event.getSource());
		},
		
		handleFacebookPress: function (event){
			window.open("https://www.facebook.com/prulia.staff")
		},
		
		handleHomeSelect: function(event){
			sap.ui.core.UIComponent.getRouterFor(this).navTo("Main");
			var viewId = this.getView().getId();
			var toolPage = sap.ui.getCore().byId(viewId + "--toolPage");
			toolPage.setSideExpanded(false);
		},
		
		handleNewsSelect: function(event){
			sap.ui.core.UIComponent.getRouterFor(this).navTo("News");
			var viewId = this.getView().getId();
			var toolPage = sap.ui.getCore().byId(viewId + "--toolPage");
			toolPage.setSideExpanded(false);
		},
		
		handleLoginPress: function () {
			Login.open_login_dialog(this);
		},

		handleProfilePress: function(){
			sap.ui.core.UIComponent.getRouterFor(this).navTo("Profile");
			this._closePopoverSideNav();
		},
		handleFeedbackPress: function(){
			window.open("https://form.jotform.me/80987924533469");
			this._closePopoverSideNav();
		},
		handleLogoutPress: function(oEvent){
			this.getOwnerComponent().getModel("appParam").setProperty("/busy", true);
			Login.logout(function(){
				Event.getInstance().updateEventModel(function(){
					MessageToast.show("Member successfully logout");
					this.getOwnerComponent().getModel("appParam").setProperty("/busy", false);
				}.bind(this),
				function(){
					this.getOwnerComponent().getModel("appParam").setProperty("/busy", false);
				}.bind(this))
				
			}.bind(this),
			function(){
				this.getOwnerComponent().getModel("appParam").setProperty("/busy", false);
			}.bind(this))
			this._closePopoverSideNav();
		},

		handleEventSelect: function(){
			sap.ui.core.UIComponent.getRouterFor(this).navTo("Event");
			var viewId = this.getView().getId();
			var toolPage = sap.ui.getCore().byId(viewId + "--toolPage");
			toolPage.setSideExpanded(false);
		},

		onSideNavButtonPress: function(oEvent){
			var viewId = this.getView().getId();
			var toolPage = sap.ui.getCore().byId(viewId + "--toolPage");

			// this._setToggleButtonTooltip(sideExpanded);

			toolPage.setSideExpanded(!toolPage.getSideExpanded());
		},
		
		handleBackButtonPress: function(oEvent){
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("Main", {}, true);
			}
		},
		handleChangePasswordPress: function () {
			if (!this.changePasswordDialog) {
				this.changePasswordDialog = new Dialog({
					title: 'Change Password',
					stretch: this.getOwnerComponent().getModel("device").getProperty("/system/phone"),      
					content: new SimpleForm({
						editable:true,
						layout:"ResponsiveGridLayout",
						content: [
							new Label({
								text: "Current Password"
							}),
							new Input("changePassword-CurrPass", {
								type:"Password"
							}),
							new Label({
								text: "New Password"
							}),
							new Input("changePassword-NewPass", {
								type:"Password"
							})
						]
					}),
					beginButton: new Button({
						text: 'Update Password',
						press: function (oEvent) {
							this.getOwnerComponent().getModel("appParam").setProperty("/busy", true);
							Login.changePassword(
								sap.ui.getCore().byId("changePassword-CurrPass").getValue(), 
								sap.ui.getCore().byId("changePassword-NewPass").getValue(), 
								function(){
									MessageToast.show("Member successfully login");
									this.getOwnerComponent().getModel("appParam").setProperty("/busy", false);
								}.bind(this), function(){
									this.getOwnerComponent().getModel("appParam").setProperty("/busy", false);
								}.bind(this));
							this.changePasswordDialog.close();
							// MessageToast.show("User successful login");
						}.bind(this)
					}),
					endButton: new Button({
						text: 'Cancel',
						press: function () {
							this.changePasswordDialog.close();
						}.bind(this)
					}),
					afterClose: function(){
						this.changePasswordDialog.destroy();
						this.changePasswordDialog = undefined;
					}.bind(this)
				});

				//to get access to the global model
				this.getView().addDependent(this.changePasswordDialog);
			}

			this.changePasswordDialog.open();
			this._closePopoverSideNav();
		},

		_closePopoverSideNav: function(){
			if(this.popover){
				this.popover.close();
			}
			var viewId = this.getView().getId();
			var toolPage = sap.ui.getCore().byId(viewId + "--toolPage");
			if(toolPage){
				toolPage.setSideExpanded(false);
			}
			
		}
	});

});