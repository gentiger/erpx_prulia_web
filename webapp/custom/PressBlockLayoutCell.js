sap.ui.layout.BlockLayoutCell.extend("com.erpx.site.prulia.PRULIA.custom.PressBlockLayoutCell", { // call the new Control type "HoverButton" 
                                                // and let it inherit from sap.m.Button
	metadata: {
    	events: {
            "press" : {}  // this Button has also a "hover" event, in addition to "press" of the normal Button
        }
    },
    
    onAfterRendering : function() {
		this.addStyleClass('sapMPointer');
	},
      
    /**
	* Function is called when tap occurs on button.
	* @param {jQuery.Event} oEvent - the touch event.
	* @private
	*/
	ontap : function(oEvent) {
		// mark the event for components that needs to know if the event was handled by the button
		oEvent.setMarked();
		// fire tap event
		if (this.getVisible()) {
			// note: on mobile, the press event should be fired after the focus is on the button
			if ((oEvent.originalEvent && oEvent.originalEvent.type === "touchend")) {
					this.focus();
			}
			this.firePress({/* no parameters */});
		}
	},

	/**
	 * Handle the key down event for SPACE and ENTER.
	 * This implementation differs from that of commons button.
	 * Commons listens to the click event and ignores touchstart.
	 * @param {jQuery.Event} oEvent - the keyboard event.
	 * @private
	 */
	onkeydown : function(oEvent) {

		if (oEvent.which === jQuery.sap.KeyCodes.SPACE || oEvent.which === jQuery.sap.KeyCodes.ENTER) {
			// mark the event for components that needs to know if the event was handled by the button
			oEvent.setMarked();
			// set active button state
			// this._activeButton();
		}

		if (oEvent.which === jQuery.sap.KeyCodes.ENTER) {
			this.firePress({/* no parameters */});
		}
	},

	/**
	 * Handle the key up event for SPACE and ENTER.
	 *
	 * @param {jQuery.Event} oEvent - the keyboard event.
	 * @private
	 */
	onkeyup : function(oEvent) {
		if (oEvent.which === jQuery.sap.KeyCodes.SPACE || oEvent.which === jQuery.sap.KeyCodes.ENTER) {
			// mark the event for components that needs to know if the event was handled by the button
			oEvent.setMarked();
			// set inactive button state
			// this._inactiveButton();
		}
		if (oEvent.which === jQuery.sap.KeyCodes.SPACE) {
			this.firePress({/* no parameters */});
		}
	},

    renderer: {} // add nothing, just inherit 
  });