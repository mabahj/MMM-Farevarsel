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
            const fullUrl = `${payload.url}?county=${payload.county}`;
            console.error('fullUrl', fullUrl);

            this.parser = new Parser({
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
                });

                this.sendSocketNotification('MMM_REST_RESPONSE', alerts);
            } catch (error) {
                Log.error(`Could not fetch Farevarsel. Error: ${error.message}`);
            }
        }
    }
});
