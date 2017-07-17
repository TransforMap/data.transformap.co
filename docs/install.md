# Installation instructions

for [`transformap-api`](../README.md).

## Get started

This repository requires a number of dependencies which the following will help you to set up. You will need to use your operating systems terminal. First make sure to [have `git` installed](http://git-scm.com/downloads) by following the link and selecting your operating system, if necessary.

### Get the Node.js Version Manager

Second you will need a Node.js JavaScript interpreter to run the source code.

Install the [Node Version Manager `nvm`](https://github.com/creationix/nvm) by using the proposed [install script](https://github.com/creationix/nvm#install-script):

    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.30.2/install.sh | bash

The `nvm` command is now ready to manage different [Node.js versions](https://nodejs.org/en/download/). Install a [Long Term Support](https://en.wikipedia.org/wiki/Long-term_support) version with

    nvm install 6

Refer to the [usage documentation](https://github.com/creationix/nvm/blob/master/README.markdown#usage) for more details.

check if you are using the latest version of node with

    nvm ls
    
It should point to any 6.\*, like this:

    ->       v6.9.1
             system
    default -> 6 (-> v6.9.1)
    node -> stable (-> v6.9.1) (default)
    stable -> 6.9 (-> v6.9.1) (default)
    iojs -> N/A (default)
    
If it does not, change to a current one, e.g.

    nvm use node
    
It should return
    
    Now using node v6.9.1 (npm v3.10.8)

### Get the code and change into its directory

Next navigate to an appropriate location and clone this repository into a subdirectory. Enter it.

    git clone https://github.com/transformap/transformap-api.git
    cd transformap-api

## Use as is

For basic usage read on. For development skip this section.

### Install the dependencies

    npm install --production

### Run it!

    npm start

The service should now be running.

## Development

[To contribute](../CONTRIBUTING.md) or adapt this application you will want to set up a development environment instead.

### Install the development dependencies

    npm install --dev

### 4. Run a development environment

    npm run watch

The Node Package Manager will now take care of reloading your deamon once the source code changes.
