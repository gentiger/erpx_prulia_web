sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/erpx/site/prulia/PRULIA/model/models",
	"sap/ui/core/IconPool",
	"com/erpx/site/prulia/PRULIA/utils/News"
], function (UIComponent, Device, models, IconPool, News) {
	"use strict";

	return UIComponent.extend("com.erpx.site.prulia.PRULIA.Component", {

		metadata: {
			manifest: "json"
		},

		_news: undefined,

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			
			IconPool.addIcon("facebook", "fa", {
		        fontFamily : "FontAwesome",
		        content : "f39e" 
    		});
    		
    		IconPool.addIcon("president", "pu", {
		        fontFamily : "public-font-icons",
		        content : "eb8b" 
    		});
    		
    		IconPool.addIcon("committee", "pu", {
		        fontFamily : "public-font-icons",
		        content : "eb81" 
    		});
    		
    		IconPool.addIcon("membership", "pu", {
		        fontFamily : "public-font-icons",
		        content : "E9A2" 
    		});
    		
    		IconPool.addIcon("training", "pu", {
		        fontFamily : "public-font-icons",
		        content : "EB72" 
    		});
    		
    		IconPool.addIcon("event", "pu", {
		        fontFamily : "public-font-icons",
		        content : "E98D" 
    		});
    		
    		IconPool.addIcon("photoalbum", "pu", {
		        fontFamily : "public-font-icons",
		        content : "EB99" 
    		});

    		
		},

		getNewsInstance: function(fnSuccess, fnError){
			if(this._news === undefined){
				this._news = new News()
			}
			return this._news;
		}
	});
});