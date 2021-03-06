/* global Module */

/* Magic Mirror
 * Module: MMM-Farevarsel
 *
 * By mabahj
 * MIT Licensed
 * Based on MMM-Rest by Dirk Melchers  
 */

Module.register("MMM-Farevarsel",{

	// Default module config.
	defaults: {
    debug: false,
    updateInterval: 30 * 60 * 1000,   // every 30 minutes. DO NOT OVERLOAD THE FREE API SERVICE FROM api.met.no !!
		animationSpeed: 2 * 1000,
		initialLoadDelay: 1* 1000,
    url: 'https://api.met.no/weatherapi/metalerts/1.1/',
    county: "03", // Default Oslo. Two digits, so prefix with 0 if single digit See https://register.geonorge.no/sosi-kodelister/fylkesnummer-alle
    colorBackground: true,


	},
	// Define required scripts.
	getStyles: function() {
		return [
      'style.css'
    ];
  },
    
	getScripts: function() {
    return [
		  this.file("node_modules/rss-parser/dist/rss-parser.js")
    ];
	},
    
    debugmsg: function() {
        if (this.config.debug) {
            var args = [].slice.call(arguments);
            Log.info.apply(console, args);
        }
    },
    
	// Define start sequence.
	start: function() {
		Log.info("Starting module: " + this.name);
        
    this.url = this.config.url;
    this.county = this.config.county;
    this.colorBackground = this.config.colorBackground;
        
		this.loaded = false;
		this.scheduleUpdate(this.config.initialLoadDelay);

		this.updateTimer = null;
            
    // Met.no data
    this.alertArray=[];
	},

	// Override dom generator.
	getDom: function() {
    var self = this;

    this.debugmsg('MMM-Farevarsel: getDom');
		var wrapper = document.createElement("div");  // create wrapper <div>
          
    // Loading message
		if (!this.loaded) {
			wrapper.innerHTML = "MMM-Farevarsel Loading...";
			wrapper.className = "dimmed light small";
			return wrapper;
		}
         
    for(var i = 0, len = this.alertArray.length; i<len; i+=1){      
      if (i>0) { // Add some space if multiple alerts
        let space=document.createElement("div");
        space.classList.add("someSpace")
        space.innerHTML="&nbsp;";
        wrapper.appendChild(space);
      }      
      // Create text box
      let header=document.createElement("div");
      header.className="medium";
      let text=document.createElement("div");
      text.className="small";      
      // Add css for background color. XXX: Should make background color configurable - enable/disable. Maybe icon later.
      if (this.colorBackground) {
        switch(this.alertArray[i].color){
          case "RED":
            header.classList.add("redAlert")
            text.classList.add("redAlert")
          case "YELLOW":
            header.classList.add("yellowAlert")
            text.classList.add("yellowAlert")
          case "ORANGE":
            header.classList.add("orangeAlert")
            text.classList.add("orangeAlert")
        }
      }
      // Alert title:
      header.innerHTML=this.alertArray[i].title;
      wrapper.appendChild(header);
      // Alert message
      text.innerHTML=this.alertArray[i].text;
      wrapper.appendChild(text);
        
    }
      

        
		return wrapper;
	},


	getData: function() {

    var self = this;
    this.debugmsg('MMM-Farevarsel: getData');
    
    this.sendSocketNotification(
        'MMM_REST_REQUEST',
        {
            url: this.url,
            county: this.county
        }
    );
        
    self.scheduleUpdate(self.updateInterval);
	},

  processResult: function(alerts) {
    this.debugmsg('MMM-Farevarsel: processResult');
    this.alertArray=alerts;
    
    this.loaded = true;
    if (this.alertArray.length == 0) {
      if (!this.hidden) { // Only hide if not already hidden
        this.debugmsg('MMM-Farevarsel: No current alerts. Hiding.');
        this.hide();
      }
      
    } else {        
	    if (this.hidden) {
        this.show();
      }
      this.updateDom(this.config.animationSpeed);
    }
	},
    
    
  socketNotificationReceived: function(notification, alerts) {
      if (notification === 'MMM_REST_RESPONSE' ) {
          this.debugmsg('received:' + notification);
          if(alerts){
              this.debugmsg("process result. Alerts: "+alerts.length);
              this.processResult(alerts);
          }
      }
  },
    



	scheduleUpdate: function(delay) {
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}

		var self = this;
		setTimeout(function() {
			self.getData();
		}, nextLoad);
        
	},



});
