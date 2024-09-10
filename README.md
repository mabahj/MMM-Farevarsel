
# Module: MMM-Farevarsel
The `MMM-Farevarsel` module is a <a href="https://github.com/MichMich/MagicMirror">MagicMirror</a> addon. This module displays weather alerts (text based) from the Norwegian Meteorological Institute (https://api.met.no/). I used [TuxDiver's MMM-Rest](https://github.com/Tuxdiver/MMM-Rest) as a starting point for this module.

**The alerts only cover  Norwegian areas and are (therefore) only in Norwegian**

![Farevarsel Displays](screenshot.png)

## Installation
Run the following commands
````console
pi@raspberrypi:~ $ cd ~/MagicMirror/modules
pi@raspberrypi:~/MagicMirror/modules $ git clone https://github.com/mabahj/MMM-Farevarsel.git
pi@raspberrypi:~/MagicMirror/modules $ cd MMM-Farevarsel
pi@raspberrypi:~/MagicMirror/modules/MMM-Farevarsel $ npm install
````
Do not forget the "npm install" at the end - it fetches the required sub dependencies.

## Changelog
2019-11-11: First attempt at creating a (this) Magic Mirror Module.</br>
2024-09-09: Updated to 2.0 API, the previous was depreciated. Added user agent, as required by met.no. Added some county information in the README.md and improved information when it failed (server side error log)


## Known Issues
- I am not a software developer. There are probably a lot of things that can fail. But it work just fine for me.
- It depends on some deprecated modules with (or without) security issues. I run this internally only, but you may have other considerations. PRs welcome. :)

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
  {
    module: 'MMM-Farevarsel',
    position: 'top_bar',      // This can be any of the regions. I think.
    config: {
      county: 02,             // See below
      colorBackground: true,
    },
  }
]
````

## Configuration options

The following properties can be configured. Non of these are required, but <b>county</b> is probably valuable to set unless you live in Oslo.

<table width="100%">
  <!-- why, markdown... -->
  <thead>
    <tr>
      <th>Option</th>
         <th>Default</th>
      <th width="100%">Description</th>
    </tr>
  <thead>
  <tbody>
    <tr>
      <td valign="top"><code>county</code></td>
      <td>03</ts>
      <td>The county (in Norway) to fetch weather alerts for. Two digits are required, so prefix with 0 if single digit
      See https://data.norge.no/datasets/dd05acaa-1c89-4139-8612-0ad10e75d6a6 for a list of counties. Default is Oslo.<br>
        <table>
        <tr><th>Code as of 2024-09-09</th><th>Country (fylke)</th></th>
        <tr><td>03</td><td>Oslo</td></tr>
        <tr><td>11</td><td>Rogaland</td></tr>
        <tr><td>15</td><td>Møre og Romsdal</td></tr>
        <tr><td>18</td><td>Nordland</td></tr>
        <tr><td>30</td><td>Viken</td></tr>
        <tr><td>34</td><td>Innlandet</td></tr>
        <tr><td>38</td><td>Vestfold og Telemark</td></tr>
        <tr><td>42</td><td>Agder</td></tr>
        <tr><td>46</td><td>Vestland</td></tr>
        <tr><td>50</td><td>Trøndelag</td></tr>
        <tr><td>54</td><td>Troms og Finnmark</td></tr>
        </table>
      <tr>
      </td>
    </tr>
    <tr>
      <td valign="top"><code>colorBackground</code></td>
      <td>true</td>
      <td>Options: true or false<br>
            Show or do not show a background color matching the official alert level. Yellow, Orange or Red.
            </td>
    </tr>
    <tr>
      <td valign="top"><code>initialLoadDelay</code></td>
      <td>1000</td>
      <td>How long to wait for the first load<br>
        <br><b>Example:</b> <code>60000</code> (60 s)
      </td>
    </tr>
    <tr>
      <td valign="top"><code>animationSpeed</code></td>
      <td>20000</td>
      <td>Fadeover effect for dom updates<br>
        <br><b>Example:</b> <code>1000</code>
      </td>
    </tr>
    <tr>
      <td valign="top"><code>url</code></td>
      <td>(Do not set this)</td>
      <td>Set to <code>https://api.met.no/weatherapi/metalerts/2.0/test.rss</code> for testing.<br></td>
    </tr>
  </tbody>
</table>

