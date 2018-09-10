sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"com/erpx/site/prulia/PRULIA/utils/Login",
	"com/erpx/site/prulia/PRULIA/utils/News"
], function (Controller, MessageToast, Login, News) {
	"use strict";

	return Controller.extend("com.erpx.site.prulia.PRULIA.controller.Main", {
		
		onInit: function(){
			
			
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("Main").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function (oEvent) {
			this.getOwnerComponent().getModel("appParam").setProperty("/showBack", false);
			this.getView().byId("newsContainer").setBusy(true);
			News.getInstance().getTop5Model().then(
				function(oModel){
					this.getView().setModel(oModel,"News");
				}.bind(this),
				function(error){
					console.log(error);
				}.bind(this)
			).always(function(){
				this.getView().byId("newsContainer").setBusy(false);
			}.bind(this))
		},
		
		handlePresidentMessagePress: function(event){
			sap.ui.core.UIComponent.getRouterFor(this).navTo("PresidentMessage");
		},
		
		handleCommitteePress: function(event){
			sap.ui.core.UIComponent.getRouterFor(this).navTo("Committee");
		},
		handleAboutPress: function(event){
			sap.ui.core.UIComponent.getRouterFor(this).navTo("About");
		},
		handleMembershipPress: function(event){
			sap.ui.core.UIComponent.getRouterFor(this).navTo("Membership");
		},
		handleUsefulLinkPress: function(event){
			window.open(event.getSource().data("openUrl"));    
		},
		handlePhotoAlbumPress: function(event){
			window.open("https://www.flickr.com/photos/146651706@N07/albums/")
		},
		handleLoginPress: function(event){
			this.getOwnerComponent().getModel("appParam").setProperty("/busy", true);
			Login.login(
				this.getView().byId("idIptUsername").getValue(), 
				this.getView().byId("idIptPassword").getValue(), 
				function(){
					MessageToast.show("Member successfully login");
					this.getOwnerComponent().getModel("appParam").setProperty("/busy", false);
				}.bind(this), function(){
					this.getOwnerComponent().getModel("appParam").setProperty("/busy", false);
				}.bind(this));
			this.getView().byId("idIptUsername").setValue("");
			this.getView().byId("idIptPassword").setValue("");
		},
		handleForgotPasswordPress: function () {
			Login.open_forget_password_dialog(this);
		},
		handleNewsPress: function(){
			sap.ui.core.UIComponent.getRouterFor(this).navTo("News");
		},
		handleEventPress: function(){
			sap.ui.core.UIComponent.getRouterFor(this).navTo("Event");
		},
		handleSmartPartnerPress: function(){
			sap.ui.core.UIComponent.getRouterFor(this).navTo("SmartPartner");
		},
		handleNewsTilePress: function(oEvent){
			var oNewsTileObject = oEvent.getSource().getBindingContext("News").getObject();
			if(oNewsTileObject.type==="Link"){
				window.open(oNewsTileObject.link)
			} else {
				sap.ui.core.UIComponent.getRouterFor(this).navTo("NewsDetail", {
					newsid: oNewsTileObject.name
				});
			}
		}
	});
});