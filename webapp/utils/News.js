sap.ui.define([
  "sap/ui/base/Object",
  "sap/ui/model/json/JSONModel",
  "com/erpx/site/prulia/PRULIA/utils/Config",
  "com/erpx/site/prulia/PRULIA/utils/ErrorHandler"
], function(Object, JSONModel, Config, ErrorHandler) {
  "use strict";
  return Object.extend("com.erpx.site.prulia.PRULIA.util.News", {
    constructor: function(fnSuccess, fnError) {

      this.model = new JSONModel();

      // this.model.setData([{
      // 	id:"PRN000001",
      // 	title:"PRULIA Membership App Launching",
      // 	date:"08-05-2018",
      // 	type:"Content",
      // 	image:"http://103.253.146.122/files/IMG-20180420-WA0014.jpg",
      // 	content:"<div>To all Prulia members, <br><br>We are proud to announce the very first in the record, Prulia’s Mobile Application is launch!<br><br>In line with the technology, Prulia has now come to serve you better &amp; seamlessly with all new functionality. More features are coming in, stay tune.</div><div><br></div><div><br></div><hr><div><br></div>"
      // },{
      // 	id:"PRN000002",
      // 	title:"PRULIA Membership App Launching2",
      // 	date:"08-05-2018",
      // 	type:"Content",
      // 	image:"http://103.253.146.122/files/IMG-20180420-WA0014.jpg",
      // 	content:"<div>To all Prulia members, <br><br>We are proud to announce the very first in the record, Prulia’s Mobile Application is launch!<br><br>In line with the technology, Prulia has now come to serve you better &amp; seamlessly with all new functionality. More features are coming in, stay tune.</div><div><br></div><div><br></div><hr><div><br></div>"
      // },{
      // 	id:"PRN000003",
      // 	title:"PRULIA Membership App Launching3",
      // 	date:"08-05-2018",
      // 	type:"Content",
      // 	image:"http://103.253.146.122/files/IMG-20180420-WA0014.jpg",
      // 	content:"<div>To all Prulia members, <br><br>We are proud to announce the very first in the record, Prulia’s Mobile Application is launch!<br><br>In line with the technology, Prulia has now come to serve you better &amp; seamlessly with all new functionality. More features are coming in, stay tune.</div><div><br></div><div><br></div><hr><div><br></div>"
      // }]);
      $.get(Config.serverURL + '/api/method/erpx_prulia.prulia_news.doctype.prulia_newsletter.prulia_newsletter.get_newsletter_list', function(data, status, xhr){
        this.model.setData(data.message);
        if(fnSuccess){
          fnSuccess();
        }
      }.bind(this)).fail(function(error) {
        if(fnError){
          fnError();
        }
        if(error.responseJSON){
          //ErrorHandler.showErrorMessage(JSON.parse(JSON.parse(error.responseJSON._server_messages)[0]).message);
        } else {
          //ErrorHandler.showErrorMessage(null,error);
          console.log(error); // or whatever
        }
          
      }.bind(this));
    },
    getModel: function() {
      return this.model;
    },
    getTop5Model: function() {
      var top5Model = new JSONModel();
      top5Model.setData(this.model.getProperty("/").slice(0, 5));
      return top5Model;
    }
  });
});