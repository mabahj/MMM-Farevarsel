
# Module: MMM-Farevarsel
The `MMM-Farevarsel` module is a <a href="https://github.com/MichMich/MagicMirror">MagicMirror</a> addon. This module displays weather alerts (text based) from the Norwegian Meteorological Institute (https://api.met.no/). I used [TuxDiver's MMM-Rest](https://github.com/Tuxdiver/MMM-Rest) as a starting point for this module.

**The alerts only cover  Norwegian areas and are (therefore) only in Norwegian**

![Farevarsel Displays](https://raw.githubusercontent.com/wiki/mabahj/MMM-Farevarsel/images/screenshot.png)

## Installation
1. Navigate into your MagicMirror's 'modules' folder and execute 'git clone https://github.com/mabahj/MMM-Farevarsel.git'
2. cd 'cd MMM-Farevarsel'
3. Execute 'npm install' to install the node dependencies.


## Changelog
2019-11-11: First attempt at creating a (this) Magic Mirror Module.


## Known Issues
- I am not a software developer. There are probably a lot of things that can fail. 

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
      <td>02</ts>
      <td>The county (in Norway) to fetch weather alerts for. Two digits are required, so prefix with 0 if single digit
      See https://register.geonorge.no/sosi-kodelister/fylkesnummer-alle for a list of counties. Default is Oslo.<br>
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
  </tbody>
</table>
