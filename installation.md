## Istallation instruction

Application consits of two parts: server and client. 

Server part is located is _server_ folder. It was writen in **aiohttp** and use sqlite database as document storage.
docstorage.db file contains examples of documents. Database can be changed in config.py file. See attribute:   
`db_connection = "sqlite:///docstorage.db"`   

building_model.py file contains code for language model building

Client part was writen in React. It is located in the root of folder. Build folder 
contains production version of client


### Server installation
1) install Python 3.7

2) create virtual environment  
`python.exe -m venv <path to folder>` 
and activate it 
 
3) install Python libs:  
`pip install -r requirements.txt`  
`python -m nltk.downloader all`  
`pip install databases[sqlite]`

4) file config.py contains configuration parameters. 
Set url of react server in client_url attribute.   

5) start sever standalone
`python.exe httpserver_con.py`    
Use httpserver.py for NGINX or Gunicorn production mode. See https://docs.aiohttp.org/en/stable/deployment.html
 

### Client installation
1) Install node.js and yarn

2) install libs `npm i`

3) set url of the aiohttp server in public/config.js file for 
development version or in build/config.js in production version

4) Production version was tested using npm serve. 
See https://www.npmjs.com/package/serve  
`serve -s build`


  
