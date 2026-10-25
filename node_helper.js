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

const USER_AGENT = 'MMM-Farevarsel https://github.com/mabahj/MMM-Farevarsel';

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
                headers: {'User-Agent': USER_AGENT},
                customFields: {
                    item: ['description', 'description'],
                }
            });

            try {
                const feed = await this.parser.parseURL(fullUrl);

                const alerts = await Promise.all(feed.items.map(async (entry) => {
                    const sections = entry.title.split(',');

                    let alertColor = '???';
                    if (sections[1].includes('gult')) {
                        alertColor = 'YELLOW';
                    } else if (sections[1].includes('rødt')) {
                        alertColor = 'RED';
                    } else if (sections[1].includes('oransje')) {
                        alertColor = 'ORANGE';
                    } else {
                        // Marine alerts have no level in the title, but the CAP document has it.
                        alertColor = await this.getColorFromCap(entry.link);
                    }

                    let { description } = entry;
                    description = description.replace('Update: ', '');
                    description = description.replace('Alert: ', '');
                    const alert = {
                        title: sections[0],
                        color: alertColor,
                        text: description
                    };
                    Log.log(`MMM-Farevarsel fetched alert: ${alert.text}`);
                    return alert;
                }));

                this.sendSocketNotification('MMM_REST_RESPONSE', alerts);
            } catch (error) {
                Log.error(`Could not fetch Farevarsel. Error: ${error.message}`);
            }
        }
    },

    // Reads the color from the CAP awareness_level parameter, e.g. "2; yellow; Moderate".
    async getColorFromCap(capUrl) {
        const colors = {yellow: 'YELLOW', orange: 'ORANGE', red: 'RED'};
        try {
            const response = await fetch(capUrl, {headers: {'User-Agent': USER_AGENT}});
            const cap = await response.text();
            const match = cap.match(/<valueName>awareness_level<\/valueName>\s*<value>\s*\d+;\s*(\w+)/);
            if (match && colors[match[1].toLowerCase()]) {
                return colors[match[1].toLowerCase()];
            }
            Log.debug(`${this.name}: No known alert color in CAP: ${capUrl}`);
        } catch (error) {
            Log.error(`${this.name}: Could not fetch CAP ${capUrl}. Error: ${error.message}`);
        }
        return '???';
    }
});
