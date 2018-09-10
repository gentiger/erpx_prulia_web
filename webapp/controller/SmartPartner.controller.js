sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"com/erpx/site/prulia/PRULIA/utils/SmartPartner"
], function (Controller, SmartPartner) {
	"use strict";

	return Controller.extend("com.erpx.site.prulia.PRULIA.controller.SmartPartner", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.erpx.site.prulia.PRULIA.view.News
		 */
			
		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("SmartPartner").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function (oEvent) {
			this.getOwnerComponent().getModel("appParam").setProperty("/showBack", true);
			this.getOwnerComponent().getModel("appParam").setProperty("/busy", true);
			SmartPartner.getInstance().getModel().then(
				function(oModel){
					this.getView().setModel(oModel,"SmartPartner");
					this.getOwnerComponent().getModel("appParam").setProperty("/busy", false);
				}.bind(this),
				function(error){
					this.getOwnerComponent().getModel("appParam").setProperty("/busy", false);
					console.log(error);
				}.bind(this)
			)
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.erpx.site.prulia.PRULIA.view.News
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.erpx.site.prulia.PRULIA.view.News
		 */
		onAfterRendering: function() {
			
		},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.erpx.site.prulia.PRULIA.view.News
		 */
		//	onExit: function() {
		//
		//	}

		handleSmartPartnerTilePress: function(oEvent){
			var oSmartPartnerTileObject = oEvent.getSource().getBindingContext("SmartPartner").getObject();
			if(oSmartPartnerTileObject.type==="Link"){
				window.open(oSmartPartnerTileObject.link)
			} else {
				sap.ui.core.UIComponent.getRouterFor(this).navTo("SmartPartnerDetail", {
					smartpartnerid: oSmartPartnerTileObject.name
				});
			}
		}
	});
});