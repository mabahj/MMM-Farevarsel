
# Module: MMM-Farevarsel

The `MMM-Farevarsel` module is a [MagicMirror²](https://github.com/MagicMirrorOrg/MagicMirror) addon. This module displays weather alerts (text based) from the Norwegian Meteorological Institute (<https://api.met.no/>). I used [TuxDiver's MMM-Rest](https://github.com/Tuxdiver/MMM-Rest) as a starting point for this module.

**The alerts only cover Norwegian areas and are (therefore) only in Norwegian**

The alert data is from MET Norway and is licensed under the [Norwegian Licence for Open Government Data (NLOD) 2.0 and Creative Commons 4.0 BY International](https://api.met.no/doc/License).

![Farevarsel Displays](screenshot.png)

## Installation

Run the following commands

````console
cd ~/MagicMirror/modules
git clone https://github.com/mabahj/MMM-Farevarsel
cd MMM-Farevarsel
npm install
````

Do not forget the "npm install" at the end - it fetches the required sub dependencies.

## Updating

````console
cd ~/MagicMirror/modules/MMM-Farevarsel
git pull
npm install
````

## Changelog

- 2025-05-26: Added support for lat/lon, which can be used instead of county.
- 2024-09-10: Review: Remove deprecated dependency 'request' and little changes like formatting and typos. No functional changes.
- 2024-09-09: Updated to 2.0 API, the previous was depreciated. Added user agent, as required by met.no. Added some county information in the README.md and improved information when it failed (server side error log).
- 2019-11-11: First attempt at creating a (this) MagicMirror Module.

## Known Issues

- I am not a software developer. There are probably a lot of things that can fail. But it works just fine for me. PRs welcome. :)
- This module shows the alerts that are valid for your location (lat/lon) or county. Your weather app (e.g. Yr) may also show alerts for neighbouring areas, so it may list alerts that this module does not show.

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:

````javascript
  {
    module: 'MMM-Farevarsel',
    position: 'top_bar',      // This can be any of the regions. I think.
    config: {
      //county: '02',            // See below for counties.
      lat: 61.6360, lon: 8.3146,  // Galdhøpiggen. Use county or lat/lon.
      colorBackground: true,
    },
  },
````

When there are no alerts for your location, the module hides itself. Most of the time the module is therefore not visible, which is normal.

To check that the module works, you can temporarily point it to met.no's test feed by adding this to `config`:

````javascript
      url: 'https://api.met.no/weatherapi/metalerts/2.0/test.rss',
````

Note that the test feed may also be empty. Remove the `url` line again when you are done testing.

## Configuration options

The following properties can be configured. None of these are required, but **lat/lon** is recommended, otherwise you get alerts for Oslo.

<table width="100%">
  <!-- why, markdown... -->
  <thead>
    <tr>
      <th>Option</th>
         <th>Default</th>
      <th width="100%">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td valign="top"><code>lat</code></td>
      <td></td>
      <td>Latitude position for alerts. Only Norway is supported. Use lat/lon or county, not both.<br>
        <br><b>Example:</b> <code>61.6360</code>
      </td>
    </tr>
    <tr>
      <td valign="top"><code>lon</code></td>
      <td></td>
      <td>Longitude position for alerts. Only Norway is supported. Use lat/lon or county, not both.<br>
        <br><b>Example:</b> <code>8.3146</code>
      </td>
    </tr>
    <tr>
      <td valign="top"><code>county</code></td>
      <td><code>'03'</code></td>
      <td><strong>(Latitude and longitude is recommended instead of county.)</strong><br>
      The county (in Norway) to fetch weather alerts for. Two digits are required, so prefix with 0 if single digit.
      See https://data.norge.no/datasets/dd05acaa-1c89-4139-8612-0ad10e75d6a6 for a list of counties. Default is '03' for Oslo.<br>This field is a string, so it must be enclosed in quotation marks: E.g. '02' or “02”.
        <table>
        <tr><th>Code as of 2024-01-01</th><th>County (fylke)</th></tr>
        <tr><td>03</td><td>Oslo</td></tr>
        <tr><td>11</td><td>Rogaland</td></tr>
        <tr><td>15</td><td>Møre og Romsdal</td></tr>
        <tr><td>18</td><td>Nordland</td></tr>
        <tr><td>31</td><td>Østfold</td></tr>
        <tr><td>32</td><td>Akershus</td></tr>
        <tr><td>33</td><td>Buskerud</td></tr>
        <tr><td>34</td><td>Innlandet</td></tr>
        <tr><td>39</td><td>Vestfold</td></tr>
        <tr><td>40</td><td>Telemark</td></tr>
        <tr><td>42</td><td>Agder</td></tr>
        <tr><td>46</td><td>Vestland</td></tr>
        <tr><td>50</td><td>Trøndelag</td></tr>
        <tr><td>55</td><td>Troms</td></tr>
        <tr><td>56</td><td>Finnmark</td></tr>
        </table>
      </td>
    </tr>
    <tr>
      <td valign="top"><code>colorBackground</code></td>
      <td><code>true</code></td>
      <td>Options: true or false<br>
            Show or do not show a background color matching the official alert level. Yellow, Orange or Red.
            </td>
    </tr>
    <tr>
      <td valign="top"><code>updateInterval</code></td>
      <td><code>1800000</code></td>
      <td>How often to fetch alerts, in milliseconds. Default is 30 minutes. Please do not set this much lower, met.no is a free service.<br>
        <br><b>Example:</b> <code>3600000</code> (60 min)
      </td>
    </tr>
    <tr>
      <td valign="top"><code>initialLoadDelay</code></td>
      <td><code>1000</code></td>
      <td>How long to wait for the first load<br>
        <br><b>Example:</b> <code>60000</code> (60 s)
      </td>
    </tr>
    <tr>
      <td valign="top"><code>animationSpeed</code></td>
      <td><code>2000</code></td>
      <td>Fadeover effect for dom updates<br>
        <br><b>Example:</b> <code>1000</code>
      </td>
    </tr>
    <tr>
      <td valign="top"><code>debug</code></td>
      <td><code>false</code></td>
      <td>Options: true or false<br>
            Write extra log messages to the browser console.
            </td>
    </tr>
    <tr>
      <td valign="top"><code>url</code></td>
      <td>(Do not set this)</td>
      <td>Only for testing, see <a href="#using-the-module">Using the module</a>: <code>'https://api.met.no/weatherapi/metalerts/2.0/test.rss'</code><br></td>
    </tr>
  </tbody>
</table>
