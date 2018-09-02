sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("com.erpx.site.prulia.PRULIA.controller.NewsDetail", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.erpx.site.prulia.PRULIA.view.NewsDetail
		 */
			
		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("NewsDetail").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function (oEvent) {
			this.getOwnerComponent().getModel("appParam").setProperty("/showBack", true);
			this.getOwnerComponent().getModel("appParam").setProperty("/busy", true);
			var newsID = oEvent.getParameter("arguments").newsid;
			var oNews = this.getOwnerComponent().getNewsInstance().getModel(function(){
				this.getView().setModel(oNews,"News");
				for(var i = 0; i < oNews.getProperty("/").length; i++){
					if(oNews.getProperty("/")[i].name === newsID){
						break;
					}
				}
				this.getView().bindElement({
					path: "/" + i,
					model: "News",
					events : {
						change: this._onBindingChange.bind(this),
					}
				});

				this.getOwnerComponent().getModel("appParam").setProperty("/busy", false);
			}.bind(this),
			function(error){
				this.getOwnerComponent().getModel("appParam").setProperty("/busy", false);
				console.log(error);
			}.bind(this));
			
			// this.getOwnerComponent().getModel("appParam").setProperty("/busy", true);
			// var oNews = this.getOwnerComponent().getNewsInstance().getModel(function(){
			// 	this.getView().setModel(oNews,"News");
			// 	this.getOwnerComponent().getModel("appParam").setProperty("/busy", false);
			// }.bind(this),
			// function(error){
			// 	this.getView().byId("newsContainer").setBusy(false);
			// 	console.log(error);
			// }.bind(this));

		},
		_onBindingChange : function (oEvent) {
			// No data for the binding
			if (!this.getView().getElementBinding("News")) {
				sap.ui.core.UIComponent.getRouterFor(this).getTargets().display("notFound");
			}
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.erpx.site.prulia.PRULIA.view.NewsDetail
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.erpx.site.prulia.PRULIA.view.NewsDetail
		 */
		// onAfterRendering: function() {
			
		// },

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.erpx.site.prulia.PRULIA.view.NewsDetail
		 */
		//	onExit: function() {
		//
		//	}
	});
});