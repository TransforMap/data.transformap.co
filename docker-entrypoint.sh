#!/bin/bash
COUCHDB_SCHEME=${COUCHDB_SCHEME:-'http'}
COUCHDB_HOST=${COUCHDB_HOST:-'localhost'}
COUCHDB_PORT=${COUCHDB_PORT:-'5984'}
COUCHDB_USER=${COUCHDB_USER:-'transformap'}
COUCHDB_PASS=${COUCHDB_PASS:-$(cat /proc/sys/kernel/random/uuid)}
COUCHDB_URL_TEMPLATE="$COUCHDB_SCHEME://$COUCHDB_HOST:$COUCHDB_PORT"
COUCHDB_URL=${COUCHDB_URL:-$COUCHDB_URL_TEMPLATE}
echo "COUCHDB_SCHEME=${COUCHDB_SCHEME}"
echo "COUCHDB_HOST=${COUCHDB_HOST}"
echo "COUCHDB_PORT=${COUCHDB_PORT}"
echo "COUCHDB_USER=${COUCHDB_USER}"
echo "COUCHDB_PASS=${COUCHDB_PASS}"
echo "COUCHDB_URL_TEMPLATE=${COUCHDB_URL_TEMPLATE}"
echo "COUCHDB_URL=${COUCHDB_URL}"
request=$(curl -skX GET "${COUCHDB_URL}/_config/admins/")
response="{}"
if [ request = response ]; then
  curl -skX PUT ${COUCHDB_URL}/_config/admins/${COUCHDB_USER} -d '"${COUCHDB_PASS}"'
fi
npm start