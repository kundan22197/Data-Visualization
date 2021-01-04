# Data-Visualization-of-Aiddata



## Running the code

To run the website, execute the command `python3 -m http.server` in this directory and then go to http://0.0.0.0:8000/ in your browser.

## Contents

* `index.html` contains the basic HTML structure and links to the CSS and JS files.

* `style.css` contains CSS rules.

* `d3` contains the D3 library.

* `data` contains datasets used by the visualizations.

* `main.js` loads the datasets and then calls the visualization functions.

* `visualizations` contains the code to make the visualizations. 


On loading the html body, we call the getData function in main.js which uses the Fetch API call and makes a GET request to [https://health.data.ny.gov/resource/gnzp-ekau.json?$where=ccs_diagnosis_description like '%25CANCER%25'&$limit=1000]. The obtained data is used to create the visualizations.


