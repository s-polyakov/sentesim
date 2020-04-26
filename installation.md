### Server installation
1) install Python 3.7

2) create virtual environment  
`python.exe -m venv <path to folder>`  

3) istall Python libs:  
`pip install -r requirements.txt`  
`python -m nltk.downloader all`  
`pip install databases[sqlite]`

4) file config.py contains configuration parameters. 
Set url to react server in client_url attribute.  

5) start sever in console
`python.exe httpserver.py`  
or for installation on server see:  
https://docs.aiohttp.org/en/stable/deployment.html

6) building_model.py file contains code for language model building

### Client installation
1) Install node.js and yarn

2) install libs `npm i`

3) set url of the aiohttp server in package.json
"serverURL" atribute

4) Run development version
`node.exe yarn.js run start`

  
