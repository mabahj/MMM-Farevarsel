/* global Log Module */

/* MagicMirror²
 * Module: MMM-Farevarsel
 *
 * By mabahj
 * MIT Licensed
 * Based on MMM-Rest by Dirk Melchers
 */

Module.register('MMM-Farevarsel', {

  // Default module config.
  defaults: {
      debug: false,
      updateInterval: 30 * 60 * 1000, // every 30 minutes. DO NOT OVERLOAD THE FREE API SERVICE FROM api.met.no !!
      animationSpeed: 2 * 1000,
      initialLoadDelay: 1 * 1000,
      url: 'https://api.met.no/weatherapi/metalerts/2.0/current.rss',
      county: '03', // Default Oslo. Two digits, so prefix with 0 if single digit See https://data.norge.no/datasets/dd05acaa-1c89-4139-8612-0ad10e75d6a6
      colorBackground: true,

  },
  // Define required scripts.
  getStyles() {
      return [
          'style.css'
      ];
  },

  debugmsg() {
      if (this.config.debug) {
          const args = [].slice.call(arguments);
          Log.info.apply(console, args);
      }
  },

  // Define start sequence.
  start() {
      Log.info(`Starting module: ${this.name}`);

      this.url = this.config.url;
      this.county = this.config.county || '0';
      this.lat = typeof this.config.lat !== 'undefined' ? this.config.lat : 0;
      this.lon = typeof this.config.lon !== 'undefined' ? this.config.lon : 0;

      // Ensure either county or (lat, lon) is provided
      if (
        (!this.county || this.county === '0') &&
        (this.lat === 0 || this.lon === 0)
      ) {
        this.county = '03'; // Default to Oslo if neither is provided
      }

      // Show county, lat, lon in debug mode
      Log.debug(`${this.name}: County: ${this.county}, Lat: ${this.lat}, Lon: ${this.lon}`);

      this.colorBackground = this.config.colorBackground;

      this.loaded = false;
      this.scheduleUpdate(this.config.initialLoadDelay);

      this.updateTimer = null;

      // Met.no data
      this.alertArray = [];
  },

  // Override dom generator.
  getDom() {
      this.debugmsg('MMM-Farevarsel: getDom');

       // create wrapper <div>
      const wrapper = document.createElement('div');

      // Loading message
      if (!this.loaded) {
          wrapper.innerHTML = 'MMM-Farevarsel loading...';
          wrapper.className = 'dimmed light small';
          return wrapper;
      }

      for (let i = 0, len = this.alertArray.length; i < len; i += 1) {
          if (i > 0) { // Add some space if multiple alerts
              const space = document.createElement('div');
              space.classList.add('someSpace');
              space.innerHTML = '&nbsp;';
              wrapper.appendChild(space);
          }
          // Create text box
          const header = document.createElement('div');
          header.className = 'medium';
          const text = document.createElement('div');
          text.className = 'small';
          // Add css for background color. XXX: Should make background color configurable - enable/disable. Maybe icon later.
          if (this.colorBackground) {
              switch (this.alertArray[i].color) {
                  case 'RED':
                      header.classList.add('redAlert');
                      text.classList.add('redAlert');
                  case 'YELLOW':
                      header.classList.add('yellowAlert');
                      text.classList.add('yellowAlert');
                  case 'ORANGE':
                      header.classList.add('orangeAlert');
                      text.classList.add('orangeAlert');
              }
          }
          // Alert title:
          header.innerHTML = this.alertArray[i].title;
          wrapper.appendChild(header);
          // Alert message
          text.innerHTML = this.alertArray[i].text;
          wrapper.appendChild(text);
      }

      return wrapper;
  },

  getData() {
      const self = this;
      this.debugmsg('MMM-Farevarsel: getData');

      this.sendSocketNotification(
          'MMM_REST_REQUEST',
          {
              url: this.url,
              county: this.county,
              lat: this.lat,
              lon: this.lon
          }
      );

      self.scheduleUpdate(self.updateInterval);
  },

  processResult(alerts) {
      this.debugmsg('MMM-Farevarsel: processResult');
      this.alertArray = alerts;

      this.loaded = true;
      if (this.alertArray.length === 0) {
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

  socketNotificationReceived(notification, alerts) {
      if (notification === 'MMM_REST_RESPONSE') {
          this.debugmsg(`received:${notification}`);
          if (alerts) {
              this.debugmsg(`process result. Alerts: ${alerts.length}`);
              this.processResult(alerts);
          }
      }
  },

  scheduleUpdate(delay) {
      let nextLoad = this.config.updateInterval;
      if (typeof delay !== 'undefined' && delay >= 0) {
          nextLoad = delay;
      }

      const self = this;
      setTimeout(() => {
          self.getData();
      }, nextLoad);
  },

});
