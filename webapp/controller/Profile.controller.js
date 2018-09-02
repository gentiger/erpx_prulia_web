sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"com/erpx/site/prulia/PRULIA/utils/Login"
], function (Controller, JSONModel, MessageToast, Login) {
	"use strict";

	return Controller.extend("com.erpx.site.prulia.PRULIA.controller.Profile", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.erpx.site.prulia.PRULIA.view.Profile
		 */
		onInit: function() {
			this.getView().setModel(new JSONModel({
				editPersonal: false
			}),"profileParam");
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.erpx.site.prulia.PRULIA.view.Profile
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.erpx.site.prulia.PRULIA.view.Profile
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.erpx.site.prulia.PRULIA.view.Profile
		 */
		//	onExit: function() {
		//
		//	}

		changeEditMode: function(){
			var oModel = this.getView().getModel("profileParam");
			oModel.setProperty("/editPersonal", !oModel.getProperty("/editPersonal"))
		},

		updateEventPref: function(){
			this.getOwnerComponent().getModel("appParam").setProperty("/busy", true);
			Login.updateMemberDetails(function(){
				MessageToast.show("Perferences was update successfully");
				this.changeEditMode();
				this.getOwnerComponent().getModel("appParam").setProperty("/busy", false);
			}.bind(this), function(){
				this.getOwnerComponent().getModel("appParam").setProperty("/busy", false);
			}.bind(this))
		}

	});

});