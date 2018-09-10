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
    },
    handleAjaxError: function(oError){
      if(oError.responseJSON && oError.responseJSON._server_messages){
        this.showErrorMessage(JSON.parse(JSON.parse(oError.responseJSON._server_messages)[0]).message);
      } else if(oError.responseJSON && oError.responseJSON.message){
        this.showErrorMessage(oError.responseJSON.message);
      } else if(oError.responseJSON && oError.responseJSON.exc){
        this.showErrorMessage(null, JSON.parse(oError.responseJSON.exc)[0]);
      } else {
        this.showErrorMessage(null,oError);
        console.log(oError); // or whatever
      }
    }
  }
  
});