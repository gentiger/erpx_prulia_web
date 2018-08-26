sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"com/erpx/site/prulia/PRULIA/utils/News",
	"com/erpx/site/prulia/PRULIA/utils/Member"
], function (Controller, News, Member) {
	"use strict";

	return Controller.extend("com.erpx.site.prulia.PRULIA.controller.Main", {
		
		onInit: function(){
			this.getView().setModel(new News().getModel(),"News");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("Main").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function (oEvent) {
			this.getView().getModel("appParam").setProperty("/showBack", false);
		},
		
		onBeforeRendering: function() {
			this.getView().getModel("appParam").setProperty("/busy", true);
		},
		
		onAfterRendering: function() {
			this.getView().getModel("appParam").setProperty("/busy", false);
		},
		
		onPress: function(){
			alert("Hellos")
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
			sap.ui.core.UIComponent.getRouterFor(this).navTo("UsefulLink");
		},
		handlePhotoAlbumPress: function(event){
			window.open("https://www.flickr.com/photos/146651706@N07/albums/")
		},
		handleLoginPress: function(event){
			Member.loginMember(this.getView().byId("idIptUsername").getValue(), this.getView().byId("idIptPassword").getValue());
		}
	});
});