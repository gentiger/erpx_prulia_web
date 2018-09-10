sap.ui.define([
  "sap/ui/base/Object",
  "sap/ui/model/json/JSONModel",
  "sap/m/Dialog",
  "sap/m/VBox",
  "sap/m/Label",
  "sap/m/Button",
  "sap/m/Select",
  "sap/m/Switch",
  "sap/m/MessageStrip",
  "sap/m/MessageToast",
  "sap/ui/core/Item",
  "sap/ui/layout/form/SimpleForm",
  "com/erpx/site/prulia/PRULIA/utils/Config",
  "com/erpx/site/prulia/PRULIA/utils/ErrorHandler",
  "com/erpx/site/prulia/PRULIA/utils/Login"
], function(Object, JSONModel, Dialog, VBox, Label, Button, Select, Switch, MessageStrip, MessageToast, Item, SimpleForm, Config, ErrorHandler, Login) {
  "use strict";
  var oInstance;
  var oNews = Object.extend("com.erpx.site.prulia.PRULIA.utils.Event",{
    _eventModel: undefined,
    getModel: function(fnSuccess, fnError) {
      var that = this;
      return new Promise(
          function(resolve, reject) {
            if(that._eventModel !== undefined){
              resolve(that._eventModel)
            } else {
              that.updateEventModel(function(){
                resolve(that._eventModel)
              }, function(){
                reject()
              })
            }
          })
    },
    updateEventModel: function(fnSuccess, fnError){
      $.get(Config.serverURL + '/api/method/erpx_prulia.prulia_events.doctype.prulia_event.prulia_event.get_event_list_web', function(data, status, xhr){
          var oEventItem = [];
          if(data.message !== undefined){
            oEventItem = data.message;
          }
          this._manageEventImage(oEventItem); 
          if(this._eventModel === undefined){
            this._eventModel = new JSONModel(oEventItem);
          } else {
            this._eventModel.setData(oEventItem);
          }
          
          fnSuccess(this._eventModel);
        }.bind(this)).fail(function(error) {
          ErrorHandler.handleAjaxError(error);
          fnError();
        }.bind(this));
    },

    _manageEventImage: function(aEvent){
      for(var i = 0; i < aEvent.length; i++){
          if(aEvent[i].event_image === undefined || aEvent[i].event_image === null){
            aEvent[i].event_image = 'css/images/PruliaImage.png'
          } else if(aEvent[i].event_image.indexOf("/files/") === 0){
            if(Config.serverURL === "http://127.0.0.1:8080"){
              aEvent[i].event_image = "http://127.0.0.1:8000" + aEvent[i].event_image;
            } else {
              aEvent[i].event_image = Config.serverURL + aEvent[i].event_image;
            }
          } 

          aEvent[i].start_date_time = new Date(aEvent[i].start_date_time);
          aEvent[i].end_date_time = new Date(aEvent[i].end_date_time);
        }
    },

    openEventPreferenceDialog: function(oController, bCreate, oBindingObject, oMemberModel){
      var that = this;
      var oBindingModel = new JSONModel(oBindingObject);
      // var oMemberModel = Login.getMemberModel();
      if (!this.eventPrefDialog) {
        this.eventPrefDialog = new Dialog({
          title: bCreate ? "Register Event":"Update Event Preference",
          stretch: oController.getOwnerComponent().getModel("device").getProperty("/system/phone"),      
          content: new VBox({
            items: [ 
              // new MessageStrip({
              //   text:additionalMsg,
              //   enableFormattedText:true,
              //   type: "Information",
              //   showIcon: true,
              //   visible: additionalMsg ? true : false 
              // }).addStyleClass("sapUiResponsiveMargin"),
              new SimpleForm({
                editable: true,
                layout:"ResponsiveGridLayout",
                content: [
                  new Label({
                    text: "Meal Option"
                  }),
                  new Select({
                    selectedKey: "{/meal_option}",
                    items:[
                      new Item({
                        key:"Non-Vegetarian",
                        text:"Non-Vegetarian"
                      }),
                      new Item({
                        key:"Vegetarian",
                        text:"Vegetarian"
                      })
                    ]
                  }),
                  new Label({
                    text: "Shirt Size",
                    visible: "{=${/display_shirt_option} === 1}"
                  }),
                  new Select({
                    selectedKey: "{/shirt_size}",
                    visible: "{=${/display_shirt_option} === 1}",
                    items:[
                      new Item({
                        key:"XS",
                        text:"Extra Small (XS)"
                      }),
                      new Item({
                        key:"S",
                        text:"Small (S)"
                      }),
                      new Item({
                        key:"M",
                        text:"Medium (M)"
                      }),
                      new Item({
                        key:"L",
                        text:"Large (L)"
                      }),
                      new Item({
                        key:"XL",
                        text:"Extra Large (XL)"
                      }),
                      new Item({
                        key:"XXL",
                        text:"Double Extra Large (XXL)"
                      }),
                      new Item({
                        key:"XXXL",
                        text:"Triple Extra Large (XXXL)"
                      })
                    ]
                  }),
                  new Label({
                    text: "Accomodation",
                    visible: "{=${/display_accomodation_option} === 1}"
                  }),
                  new Switch({
                    customTextOn:"Yes", 
                    customTextOff:"No",
                    state: "{/accomodation}",
                    visible: "{=${/display_accomodation_option} === 1}"
                  })
                ]
              })
            ]
          }),
          beginButton: new Button({
            text: bCreate ? 'Register' : "Update",
            press: function (oEvent) {
              oController.getOwnerComponent().getModel("appParam").setProperty("/busy", true);
              this.createAttendance(bCreate, this.eventPrefDialog.getModel(), oMemberModel).done(
                  function(data, status, xhr){
                    if(data.message === "success"){
                      MessageToast.show("Perferences was update successfully");
                    } else {
                      MessageToast.show(JSON.parse(JSON.parse(data._server_messages)[0]).message)
                    }
                    
                  }
              ).fail(
                  function(error){
                    ErrorHandler.handleAjaxError(error);
                  }
              ).always(function(){
                this.updateEventModel(function(){
                  oController.getOwnerComponent().getModel("appParam").setProperty("/busy", false);
                }, function(){
                  oController.getOwnerComponent().getModel("appParam").setProperty("/busy", false);
                })
              }.bind(this))
              // this.login(
              //   sap.ui.getCore().byId("memberLogin-Username").getValue(), 
              //   sap.ui.getCore().byId("memberLogin-Password").getValue(), 
              //   function(){
              //     Event.getInstance().updateEventModel(function(){
              //       MessageToast.show("Member successfully login");
              //       oController.getOwnerComponent().getModel("appParam").setProperty("/busy", false);
              //     }.bind(this),
              //     function(){
              //       oController.getOwnerComponent().getModel("appParam").setProperty("/busy", false);
              //     }.bind(this))
                  
              //   }.bind(this), function(){
              //     oController.getOwnerComponent().getModel("appParam").setProperty("/busy", false);
              //   }.bind(this));
              this.eventPrefDialog.close();
              // MessageToast.show("User successful login");
            }.bind(this)
          }),
          endButton: new Button({
            text: 'Cancel',
            press: function () {
              this.eventPrefDialog.close();
            }.bind(this)
          }),
          afterClose: function(){
            this.eventPrefDialog.destroy();
            this.eventPrefDialog = undefined;
          }.bind(this)
        });
      };
      //to get access to the global model
      oController.getView().addDependent(this.eventPrefDialog);
      this.eventPrefDialog.setModel(oBindingModel);
      this.eventPrefDialog.open();
    },

    createAttendance: function(bCreate, oEventRegistration, oMemberModel) {
      if(bCreate){
        var oPostData = {
          "member": oMemberModel.getProperty("/name"),
          "member_name": oMemberModel.getProperty("/full_name"),
          "event": oEventRegistration.getProperty("/name"),
          "meal": oEventRegistration.getProperty("/meal_option"),
          "shirt": oEventRegistration.getProperty("/shirt_size"),
          "accomodation" : oEventRegistration.getProperty("/accomodation") === true ? "Yes" : "No"
        }
        return $.post(Config.serverURL + '/api/method/erpx_prulia.prulia_events.doctype.prulia_event.prulia_event.add_attendance', oPostData)
      } else {
        var oPostData = {
          "attendee_name": oEventRegistration.getProperty("/attendee_name"),
          "meal_option": oEventRegistration.getProperty("/meal_option"),
          "shirt_size": oEventRegistration.getProperty("/shirt_size"),
          "accomodation" : oEventRegistration.getProperty("/accomodation") === true ? "Yes" : "No"
        }
        return $.ajax({
          type: "POST",
          url: Config.serverURL + '/api/method/erpx_prulia.prulia_events.doctype.prulia_event.prulia_event.update_event_attendee',
          data: JSON.stringify(oPostData),
          dataType: 'json',
          contentType: 'application/json'
        })

        // return $.post(Config.serverURL + '/api/method/erpx_prulia.prulia_events.doctype.prulia_event.prulia_event.update_event_attendee', JSON.stringify(oPostData));
      }

      
    },
    deleteEventRegistration: function(oEventRegistration, oMember){
      return $.ajax({
        type: "POST",
        url: Config.serverURL + '/api/method/erpx_prulia.prulia_events.doctype.prulia_event.prulia_event.del_attendance',
        data: JSON.stringify({member: oMember.getProperty("/name") , event: oEventRegistration.getObject().name}),
        dataType: 'json',
        contentType: 'application/json'
      })
    }
  });
  return {
        getInstance: function () {
            if (!oInstance) {
                oInstance = new oNews();
            }
            return oInstance;
        }
    };
});