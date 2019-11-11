/* Magic Mirror
 * Module: MMM-Farevarsel
 *
 * By mabahj
 * MIT Licensed
 * Based on MMM-Rest by Dirk Melchers  
 */
var NodeHelper = require('node_helper');
var request = require('request');
var Parser = require('rss-parser'); // https://www.npmjs.com/package/rss-parser

module.exports = NodeHelper.create({
    start: function () {
        this.parser = null;
        console.log(this.name + ' helper started ...');
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === 'MMM_REST_REQUEST') {
            var that = this;
            let fullUrl=payload.url+'?county='+payload.county;
            // FIXME: Have to to figure out how to add user agent (https://api.met.no/conditions_service.html)
            request({
                url: fullUrl,
                method: 'GET'
            }, function(error, response, body) {
                //console.log("MMM_REST response:"+response.statusCode);
                if (!error && response.statusCode == 200) {
                    this.parser = new Parser({
                      customFields: {
                        item: ['description','description'],
                      }
                    });

                    this.parser.parseString(response.body, function(err, feed) {
                      //console.log(feed.title);
                      alerts=[];
                      feed.items.forEach(function(entry) {                        
                        let sections=entry.title.split(',');
                        let alertTitle=sections[0];
                        
                        let alertColor=sections[1];
                        if (alertColor.indexOf("gult") != -1) {
                          alertColor="YELLOW";
                        } else if (alertColor.indexOf("rødt") != -1) {
                          alertColor="RED";
                        } else if (alertColor.indexOf("oransje") != -1) {
                          alertColor="ORANGE";
                        } else {
                          alertColor="???";
                        }
                          
                          
                        let description=entry.description
                        description=description.replace("Update: ", "");  // Remove prefix we do not need
                        description=description.replace("Alert: ", "");   // Remove prefix we do not need
                        let alert={
                          title: sections[0],
                          color: alertColor,
                          text:  description
                        }
                        alerts.push(alert);
                        console.log("MMM-Farevarsel fetched alert:" + alert.text);                       
                        
                      })                      
                      that.sendSocketNotification('MMM_REST_RESPONSE', alerts);
                      
                      
                    });

                }
            });
        }
    }
});
