# Contributing to this TransforMap project

These terms are considered as guidelines. Follow them according to your understanding.

## Get in touch!

- Discourse
- Twitter
- IRC

## Get involved.

- Issues
- Pull Requests

## Miscellaneous

Use the test suite! Run "npm test" after your changes.
Before commiting, run "npm run lint" to get warnings about your coding style.

## file responsibilities

in the controllers, controller/poi/poi.js handles the whole request life cycle
  => parse the request
  => sends the response

lib files (controllers/poi/lib/poi.js) communicates with models and the database

content manipulation should be done in the model

libs call the model, model does content manipulation, returns data to be posted in the db
lib takes the data returned by the model and POSTs it into the DB

## testing the API functions

add a new POI:
  curl http://localhost:8726/poi/ -d@test/fixtures/poi-new-to-create-for-api.json -H 'content-type: application/json'

read a POI:
  curl http://localhost:8726/poi/3f99cbbccb02d48b595c369a150027ec

## database model for POIs

there are two kinds of objects in our poi database:

1. a collective object (test/fixtures/databaseobject-view.json), which has the "public" UUID of this POI
  * it is of "type:" "objects"
  * it holds the history of the objects in the array "journal". the current object is deep-copied into the object "current" for indexing.
2. for each version of the POI, an independent, full object type=version is stored. it is linked from the journal.
