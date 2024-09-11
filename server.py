# importing the requests library
import requests

# api-endpoint
URL = "http://www.google.com/search"

# location given here
location = "delhi technological university"

# defining a params dict for the parameters to be sent to the API
PARAMS = {'address':location}

# sending get request and saving the response as response object
r = requests.get(url = URL,params='youtube')

# extracting data in json format
data = r.text
print(data)