# American Society of Pharmacogonsy Map of Principal Investigators
![Deploy](https://github.com/chasemc/asp_map/workflows/Deploy/badge.svg?branch=master)
## Purpose

The American Society of Pharmacognosy (ASP) wanted to create a living, interactive resource to aid students in finding principal investigators that they might want to conduct research with, have as advisors for graduate school, etc. Obviously this extends to more scenarios than that and I (Chase) personally hope it will make it easier for ASP members to actively seek out collaborations and find underrepresented/underrecognized members to invite as speakers, collaborate with, etc.

The rest of this document is dedicated to explaining how the map is created and how other societies can replicate what we've done. 

## Overview:

*Note: Some knowledge of javascript and html/css will be very benefecial*

## The Google Sheet

The map pulls data from a google sheet populated from a Google form sent to society members. For security, the data is hand-copied over into a separate 'tab' of the google sheet. A python script `script.py` gets this sheet and converts it into json format for the application to read (saved to `data/gsheet.json`). This is done nightly/on changes to the google sheet. 
TODO: Add screenshots of this process.


- Copy the Google Form from [https://drive.google.com/drive/folders/1JH_8xBAulxabQMqHZHdstOP3Zsuhp5Mu](https://drive.google.com/drive/folders/1JH_8xBAulxabQMqHZHdstOP3Zsuhp5Mu) (requires your own google account/google drive)
  - ![image](https://user-images.githubusercontent.com/18691127/73891080-086e3f00-4839-11ea-9392-ea5ed7903bef.png)


- If you want to change the names of any sections (ie "First Name", "University/Company", etc.) you will have to modify script.py and possibly app.js
  - ![image](https://user-images.githubusercontent.com/18691127/73892730-48cfbc00-483d-11ea-96f1-8a501e219891.png)

- Navigate to your new Google Form and click "Responses" and "Select response destination", select a name and destination for the Google Sheet responses will be saved to.
  - ![image](https://user-images.githubusercontent.com/18691127/73888497-597b3480-4833-11ea-8142-de6390369f02.png)

- Navigate to "Responses" and click the Sheets icon to navigate to the Sheet you just created.
  - ![image](https://user-images.githubusercontent.com/18691127/73888504-5da75200-4833-11ea-931a-5a74f617cf7d.png)

- You should see a Google Sheet that looks like this:
  - ![image](https://user-images.githubusercontent.com/18691127/73892090-87fd0d80-483b-11ea-956b-50700cd6266c.png)

- We could pull data directly from the responses saved here but then we would be at the mercy of respondants, and potentially unwarranted responses. For that reason, create a new sheet named "website" as shown below:
  - ![image](https://user-images.githubusercontent.com/18691127/73892085-85021d00-483b-11ea-876b-2775a4c7ef8d.png)

- Rows from sheet "Form Responses 1" will be copied manually into sheet "website" when approved.
  - ![image](https://user-images.githubusercontent.com/18691127/73888708-baa30800-4833-11ea-96eb-4d93557fd1c3.png)

- The google sheet must be published so the python script `script.py` can read it. 
  - ![image](https://user-images.githubusercontent.com/18691127/73888746-cbec1480-4833-11ea-9208-5c26ada1b992.png)

- Select "Link", "Entire Document", and "Microsoft Excel (xlsx)". Then click "Publish".  Make sure "Automatically republish when changes are made" is selected.
  - ![image](https://user-images.githubusercontent.com/18691127/73888751-ce4e6e80-4833-11ea-8ded-a48dd8a9ecbe.png)

- After clicking "Publish" you should get a link. Copy this and then paste it into `script.py`.
  - ![image](https://user-images.githubusercontent.com/18691127/73888758-d1495f00-4833-11ea-861d-9dee4cf2232c.png)
  - ![image](https://user-images.githubusercontent.com/18691127/73892503-c0e9b200-483c-11ea-874e-2128865a8584.png)

Running `script.py` will retrieve the google sheet and overwrite `data/gsheet.json`.



## The HTML

`index.html`
This is all pretty standard html. This is where you can change the display of headers and links like `Natural Product Investigators` and `Return to www.pharmacognosy.us`.
All the local assets are loaded here. If you use a CDN you can replace those css and js links here.

## The Javascript

The important javascript can be found in `assets/js/app.js`

You can and should do your homework and look at map tile servers. Then replace the url and attribution in the code:

```{js}
var usgsImagery = L.tileLayer("http://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}", {
  maxZoom: 15,
  attribution: '&copy; Map services and data available from U.S. Geological Survey, National Geospatial Program. &copy'
});
```

If you decided on using your own columns in the google spreadsheet you will need to adjust `assets/js/app.js` accordingly. The relevant sections include inside the two functions:

```{js}
function addPoints(data) {...}
```

AND

```{js}
function syncSidebar() {...}
```
