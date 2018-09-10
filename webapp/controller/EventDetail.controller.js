sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/format/DateFormat",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"com/erpx/site/prulia/PRULIA/utils/Event",
	"com/erpx/site/prulia/PRULIA/utils/Login",
  	"com/erpx/site/prulia/PRULIA/utils/ErrorHandler",
], function (Controller, DateFormat, MessageBox, MessageToast, Event, Login, ErrorHandler) {
	"use strict";

	return Controller.extend("com.erpx.site.prulia.PRULIA.controller.EventDetail", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.erpx.site.prulia.PRULIA.view.NewsDetail
		 */
			
		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("EventDetail").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function (oEvent) {
			this.getOwnerComponent().getModel("appParam").setProperty("/showBack", true);
			this.getOwnerComponent().getModel("appParam").setProperty("/busy", true);
			var eventID = oEvent.getParameter("arguments").eventid;
			Event.getInstance().getModel().then(
				function(oModel){
					this.getView().setModel(oModel,"Event");
					for(var i = 0; i < oModel.getProperty("/").length; i++){
						if(oModel.getProperty("/")[i].name === eventID){
							break;
						}
					}
					this.getView().bindElement({
						path: "/" + i,
						model: "Event",
						events : {
							change: this._onBindingChange.bind(this),
						}
					});

					this.getOwnerComponent().getModel("appParam").setProperty("/busy", false);
				}.bind(this),
				function(error){
					this.getOwnerComponent().getModel("appParam").setProperty("/busy", false);
					console.log(error);
				}.bind(this)
			)
		},
		_onBindingChange : function (oEvent) {
			// No data for the binding
			if (!this.getView().getElementBinding("Event")) {
				sap.ui.core.UIComponent.getRouterFor(this).getTargets().display("notFound");
			}
		},

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

		eventDateFormatter: function(start_date, end_date){
			var oDateTimeFormat = DateFormat.getDateInstance({pattern : "dd MMM yyyy, h:mm a" });
			var oTimeFormat = DateFormat.getDateInstance({pattern : "h:mm a" });
			if(start_date !== null && end_date!== null){
				if(start_date.toDateString() === end_date.toDateString()){
					return oDateTimeFormat.format(start_date) + " - " + oTimeFormat.format(end_date);
				} else {
					return oDateTimeFormat.format(start_date) + " - " + oDateTimeFormat.format(end_date);
				}
			}
		},
		handleRegisterEvent: function(oEvent){
			if(!Login.getLoginModel().getProperty("/memberLogon")){
				Login.open_login_dialog(this, "Please kindly login to proceed event registration");
			} else {
				var oNewRegisterEntry = $.extend(true, {}, this.getView().getElementBinding("Event").getBoundContext().getObject());
				oNewRegisterEntry.meal_option = Login.getMemberModel().getProperty("/meal_option");
		        oNewRegisterEntry.shirt_size = Login.getMemberModel().getProperty("/shirt_size");
		      	oNewRegisterEntry.accomodation = true;
				Event.getInstance().openEventPreferenceDialog(this, true, oNewRegisterEntry, Login.getMemberModel());
			}
		},
		handleChangeEvent: function(oEvent){
			var oNewRegisterEntry = $.extend(true, {}, this.getView().getElementBinding("Event").getBoundContext().getObject());
	  		oNewRegisterEntry.accomodation = oNewRegisterEntry.accomodation === "Yes" ? true : false;
			Event.getInstance().openEventPreferenceDialog(this, false, oNewRegisterEntry, Login.getMemberModel());
		},
		handleDeleteEvent: function(oEvent){
			var that =  this;
			MessageBox.confirm("Are you sure you want to withdraw your registration?", {
		        // icon: MessageBox.Icon.QUESTION,
		        title: "Withdraw Registration",
		        actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
		        contentWidth: "100px",
		        onClose: function(oAction){
		        	// console.log(oAction)
		        	
		        	if(oAction === sap.m.MessageBox.Action.YES){
		        		this.getOwnerComponent().getModel("appParam").setProperty("/busy", true);
		        		Event.getInstance().deleteEventRegistration(this.getView().getElementBinding("Event").getBoundContext(), Login.getMemberModel()).then(function(){
		        			MessageToast.show("Your registration was withdraw successfully");
		        		}.bind(this)).fail(function(error){
		        			ErrorHandler.handleAjaxError(error);
		        		}.bind(this)).always(function(){
		        			Event.getInstance().updateEventModel(function(){
			                  that.getOwnerComponent().getModel("appParam").setProperty("/busy", false);
			                }, function(){
			                  that.getOwnerComponent().getModel("appParam").setProperty("/busy", false);
			                })
		        		}.bind(this))
		        	}
		        }.bind(this)
		    });
		}
	});
});