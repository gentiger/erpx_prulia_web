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
	"com/erpx/site/prulia/PRULIA/utils/Member"
], function (Controller, Popover, Button, Dialog, SimpleForm, Label, Input, MessageToast, History, memberUtils) {
	"use strict";

	return Controller.extend("com.erpx.site.prulia.PRULIA.controller.App", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.erpx.site.prulia.PRULIA.view.App
		 */
		onInit: function() {
			
			// set the user model
			this.getView().setModel(memberUtils.createMemberModel(), "member");
			
			this.getOwnerComponent().getModel("appParam").setData({
				busy: false,
				showBack: false
			});
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
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.erpx.site.prulia.PRULIA.view.App
		 */
		//	onExit: function() {
		//
		//	}

		handleUserNamePress: function (event) {
			var that = this;
			var popover = new Popover({
				showHeader: false,
				placement: sap.m.PlacementType.Bottom,
				content:[
					new Button({
						text: 'Profile',
						type: sap.m.ButtonType.Transparent,
						press: function(oEvent){
							sap.ui.core.UIComponent.getRouterFor(that).navTo("About");
							popover.close();
						}
					}),
					new Button({
						text: 'Feedback',
						type: sap.m.ButtonType.Transparent,
						press: function(oEvent){
							window.open("https://form.jotform.me/80987924533469")
							popover.close();
						}
					}),
					// new Button({
					// 	text: 'Help',
					// 	type: sap.m.ButtonType.Transparent
					// }),
					new Button({
						text: 'Logout',
						type: sap.m.ButtonType.Transparent,
						press: function(oEvent){
							memberUtils.logoutMember()
							popover.close();
						}
					})
				]
			}).addStyleClass('sapMOTAPopover sapTntToolHeaderPopover');

			popover.openBy(event.getSource());
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
			sap.ui.core.UIComponent.getRouterFor(this).navTo("About");
			var viewId = this.getView().getId();
			var toolPage = sap.ui.getCore().byId(viewId + "--toolPage");
			toolPage.setSideExpanded(false);
		},
		
		handleLoginPress: function () {
			if (!this.pressDialog) {
				this.pressDialog = new Dialog({
					title: 'Member Login',
					stretch: this.getOwnerComponent().getModel("device").getProperty("/system/phone"),      
					content: new SimpleForm({
						editable:true,
						layout:"ResponsiveGridLayout",
						content: [
							new Label({
								text: "PRULIA ID"
							}),
							new Input("memberLogin-Username"),
							new Label({
								text: "Password"
							}),
							new Input("memberLogin-Password", {
								type:"Password"
							})
						]
					}),
					beginButton: new Button({
						text: 'Login',
						press: function (oEvent) {
							memberUtils.loginMember(sap.ui.getCore().byId("memberLogin-Username").getValue(), sap.ui.getCore().byId("memberLogin-Password").getValue());
							this.pressDialog.close();
							// MessageToast.show("User successful login");
						}.bind(this)
					}),
					endButton: new Button({
						text: 'Cancel',
						press: function () {
							this.pressDialog.close();
						}.bind(this)
					}),
					afterClose: function(){
						
					}.bind(this)
				});

				//to get access to the global model
				this.getView().addDependent(this.pressDialog);
			}

			this.pressDialog.open();
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
		}
	});

});