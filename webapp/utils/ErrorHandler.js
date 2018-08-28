sap.ui.define([
  "sap/m/MessageBox"
], function(MessageBox) {
  "use strict";
  return {
    showErrorMessage: function(sMessage, sDetails) {
      var sLMessage = sMessage;
      if(sLMessage === null || sLMessage.length === 0){
        sLMessage = "Opps, there is a system error. Please contact PRULIA Admin for assistance"
      }
      MessageBox.show(sLMessage, {
        icon: MessageBox.Icon.ERROR,
        title: "Error",
        actions: [sap.m.MessageBox.Action.CLOSE],
        details: sDetails,
        contentWidth: "100px"
      });
    }
  }
});