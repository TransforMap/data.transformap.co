# Contributing to this TransforMap project

These terms are considered as guidelines for the social process framing the development of this project's codebase. If you intend to contribute to this project, reach out to us via a channels suitable to the nature of your contribution.


## Use it.

To gain experience with the service use it either via the live instance at [`https://data.transformap.co/`](https://data.transformap.co/) or [by installing it](docs/installation.md) yourself.

## Read about it.

If you run into questions or problems while using it, please make yourself first comfortable with [the documentation](http://transformap.viewdocs.io/data.transformap.co/). Another good starting point for developers is [the codebase](https://lab.allmende.io/transformap/api/tree/master).

## Get involved.

Further on you may want to read or report to [the issue tracker](https://github.com/transformap/data.transformap.co/issues), which hosts discussions around malfunctions or new features of this software.
As we are embracing a community-reviewed developing model, please file code contributions as [a pull request](https://github.com/TransforMap/data.transformap.co/pulls) to the `master` branch.

## Get in touch!

For more informal requests or general enquiries, the social side channels of this project are [a TransforMap Discourse](https://discourse.transformap.co/), [the `#transformap` Freenode IRC channel](irc://irc.freenode.net/transformap) or [Twitter](https://twitter.com/transformap).


## Miscellaneous

Use the test suite! Run "npm test" after your changes.
If you have a local CouchDB running, also run the integration tests:
  start API with: "npm start"
  in another terminal: "npm run integration"
If some of the tests timeout on slow machines on the first run, just rerun them - they will be much faster on subsequent runs after everything is in memcache.


Before commiting, run "npm run lint" to get warnings about your coding style.

if you update do a new version, and it throws an Error like: Cannot find module '$newmodule', don't forget to run "npm install"

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
  `curl http://localhost:5000/place/ -d@test/fixtures/place-new-to-create-for-api.json -H 'content-type: application/json'`

read a POI:
  `curl http://localhost:5000/place/3f99cbbccb02d48b595c369a150027ec`

update a POI:
  `curl -X PUT http://localhost:5000/place/3f99cbbccb02d48b595c369a150027ec -d@test/fixtures/place-new-to-create-for-api.json -H 'content-type: application/json'`

mark a POI as deleted:
  `curl -X DELETE http://localhost:5000/place/3f99cbbccb02d48b595c369a150027ec`
