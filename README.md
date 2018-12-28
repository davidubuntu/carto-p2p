# Madrid P2P Apartments

Simple web application that shows a map of Madrid and a widget with information about the neighbourhoods with most of the P2P apartments

* Web server with Node (Express)
* Getting Data from Carto
* Two approaches
  * Map Carto.js
  * Widget UI apartments Filter 
* Coded with: No framework, only simple JavaScript, DOM and CSS

## Decisions and Steps

### Decisions

I decided to create a webpack js application using a very simple configuration. I used main index.js file and style.css to achieve the main purpose of the web. Using highchart to create a widget, carto.js and leaflet to create the map.

I decided to stay in a single file while a good aproach will be to separate widget file and map so that the app could be scalable. 

I used some carto widget css classes to mantain the Carto  UI styles but overriding some details with my own styles and fonts to give my own aproach to the web.

Also i used the same colors for points of each neighbourhood  in the map and the bar of each of them  in the widget to make easier the taking decitions and be more understable



### Steps
1) Webpack Simple Configuration
2) Build Express Node Server to serve web 
3) Routing sends the user to index html when accesing /
4) First simple carto.js map
6) Added bar higchart.js as a widget 
7) Connecting higchart widget with carto.js dataView and refreshing each time data is updated. 

## Prerequisites
* Npm (6.4.1)
* Node js (10.13.0)
* Webpack (4.28.2)

### Installing

To get a development env running are necessary to follow the next steps:

Clone the repository in a local folder
```
git clone https://github.com/davidubuntu/carto-p2p.git
```
```
cd carto-p2p
```
Install Node dependencies
```
npm install
```
If found any vulnerabilty in console run 
```
npm audit fix
```

Run npm  local dev environment

```
npm start
```
Local environment will be opened at 

```
http://localhost:8080/
```


## Using the app

You can visualize  P2P apartments symbolized with differet colors for each neighbourhood. 
If you click over a bar chart you will be able to filter the data visualization in the map for the neighbourhood selected. Clicking in the button will reset the visualization in the map showing all neighbourhoods info again.
Also the inormation of the widget will be updated while panning the map.


## Built With

* [Carto.js](https://carto.com/developers/carto-js/)
* [Highcahrt.js](https://www.highcharts.com/)
* [Git] Versioning

## Authors

* **David Díez Rodríguez** 

## Acknowledgments

* Thanks to the carto examples which insipired me to code this simple web
* I am insipirated by Carto technology which make me realize about powerful and beauty o GIS visualization