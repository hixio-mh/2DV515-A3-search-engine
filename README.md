# Search Engine
My solution for Web intelligence (2DV515) assignment 3 at Linnaeus University.

## Requirements
### Grade E
- [ ] Implement a basic search engine that index all pages in the Wikipedia dataset (see Datasets page)
- [ ] Search queries shall only contain single words
- [ ] Results shall be ranked using the word frequency metric
- [ ] The user shall input the search queries in a web client, and display the search results returned from the server
- [ ] Display the top 5 search results with page and rank score
- [ ] Implement the system using a REST web service where:
  - [ ] client sends a request to a server
  - [ ] the server responds with json data
  - [ ] the json data is decoded and presented in a client GUI

### Grade C-D
- [ ] It shall be possible to use search queries of more than one word
- [ ] Results shall be ranked using: `score = word_frequency + 0.8 * document_location`
- [ ] Display the top 5 search results with page and rank score

### Grade A-B
- [ ] Implement the PageRank algorithm and use it to rank the search results
- [ ] Run the algorithm for 20 iterations
- [ ] Results shall be ranked using: `score = word_frequency + 0.8 * document_location + 0.5 * pagerank`
- [ ] Display the top 5 search results with page and rank score

## Get started
#### `npm install`
Will install all dependencies for both client and server.

#### `npm start`
Will start both client and server.
