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

To 'undelete' a poi, simply put a new version with the 'update' command there.

this is also done automatically in the integration test

## database model for POIs

there are two kinds of objects in our poi database:

1. a collective object (test/fixtures/database/journal.json), which has the "public" UUID of this POI
  * it is of "type:" "$object", and context=version
  * it holds the history of the objects in the array "journal". the current object is deep-copied into the object "current" for indexing.
2. for each version of the POI, an independent, full object context=version is stored. it is linked from the journal.

## Git workflow for core contributors

We keep an 'the master is always stable' workflow. So for each feature/bugfix, create a feature branch, send a pull request. At least two contributers should review and merge each pull request.

git checkout master #base your new branch on master
git checkout -b "name-your-branch"
codecodecode
git commit
git push -u origin "name-your-branch"
// from now on you can just "git push
when you're ready, go to github to your branch, and do a pull request.

## Coding style

The code style should stay consistent throughtout the codebase. This is partially ensured by preventing any commit that doesn't pass the linter (see package.json scripts.lint), but it doesn't check for nearlly every conventions used in this codebase. Those additional conventions are documented here:

### Case
  * general rule: variables (including functions) should be camelCased
  * exceptions: has we are not using classes, the convention of naming Classes/Constructor with a capital can be reused elsewhere
    * Higher-order functions may be capitalized, especially when they are a [partial](https://medium.com/@thinkfunctional/currying-partial-application-f1365d5fad3f) of another function: `_.log` or `error_.handler` have their respective partial functions named `_.Log` and `error_.Handler` after this convention.
    * Just like internal libs may have a `_` suffix (e.g `error_`) to avoid collisions, models are capitalize: e.g `Journal`, or `Version`

### Indentation
  * returning a promise shouldn't trigger an indentation for the chained actions:

    ```javascript
    // yes
    return db.get(id)
    .then(res.json.bind(res))
    .catch(error_.Handler(res))
    ```

    ```javascript
    // no
    return db.get(id)
      .then(res.json.bind(res))
      .catch(error_.Handler(res))
    ```

  * but long chained variable creation should be indented for readibility:


    ```javascript
    // yes
    const count = collection
      .map(_.property('value'))
      .reduce(sum, 0)
    ```

    ```javascript
    // no
    const count = collection
    .map(_.property('value'))
    .reduce(sum, 0)
    ```
