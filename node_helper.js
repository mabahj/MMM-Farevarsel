/* MagicMirror²
 * Module: MMM-Farevarsel
 *
 * By mabahj
 * MIT Licensed
 * Based on MMM-Rest by Dirk Melchers
 */
const Log = require('logger');
const NodeHelper = require('node_helper');
const Parser = require('rss-parser'); // https://www.npmjs.com/package/rss-parser

module.exports = NodeHelper.create({
    start() {
        this.parser = null;
        Log.log(`${this.name} helper started ...`);
    },

    async socketNotificationReceived(notification, payload) {
        if (notification === 'MMM_REST_REQUEST') {

            let fullUrl = '';
            if (payload.lat !== 0 && payload.lon !== 0) {
                fullUrl = `${payload.url}?lat=${payload.lat}&lon=${payload.lon}`;
                Log.debug(`${this.name}: Fetching alert for lat/lon: ${payload.lat}, ${payload.lon}`);
            } else if (payload.county !== '0') {
                fullUrl = `${payload.url}?county=${payload.county}`;
                Log.debug(`${this.name}: Fetching alert for county: ${payload.county}`);
            }

            // Error if fullUrl is still empty
            if (!fullUrl) {
                Log.error(`${this.name}: fullUrl is empty. Cannot fetch Farevarsel.`);
                return;
            }

            Log.debug(`${this.name} fullUrl: ${fullUrl}`);

            this.parser = new Parser({
                headers: {'User-Agent': 'MMM-Farevarsel https://github.com/mabahj/MMM-Farevarsel'},
                customFields: {
                    item: ['description', 'description'],
                }
            });

            try {
                const feed = await this.parser.parseURL(fullUrl);

                const alerts = feed.items.map((entry) => {
                    const sections = entry.title.split(',');
                    const alertTitle = sections[0];

                    let alertColor = sections[1];
                    if (alertColor.includes('gult')) {
                        alertColor = 'YELLOW';
                    } else if (alertColor.includes('rødt')) {
                        alertColor = 'RED';
                    } else if (alertColor.includes('oransje')) {
                        alertColor = 'ORANGE';
                    } else {
                        alertColor = '???';
                        Log.debug(`${this.name}: Unknown alert color: ${alertColor}`);
                    }

                    let { description } = entry;
                    description = description.replace('Update: ', '');
                    description = description.replace('Alert: ', '');
                    const alert = {
                        title: sections[0],
                        color: alertColor,
                        text: description
                    };
                    Log.log(`${this.name}: fetched alert: ${alert.text}`);
                    return alert;
                });

                this.sendSocketNotification('MMM_REST_RESPONSE', alerts);
            } catch (error) {
                Log.error(`${this.name}: Could not fetch Farevarsel from URL ${fullUrl}. Error: ${error.message}. More details: ${error.stack}`);
                // Return yellow alert saying that the service is unavailable:
                const alert = {
                    title: 'Error',
                    color: 'YELLOW',
                    text: 'Could not fetch alerts from met.no'
                };
                this.sendSocketNotification('MMM_REST_RESPONSE', [alert]);
            }
        }
    }
});
