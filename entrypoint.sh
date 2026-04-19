#!/bin/sh
set -e

if [ "${TEST_ENV}" = "production" ]; then
  echo "Pre-flight: checking ${BASE_URL} ..."
  wget -q --spider "${BASE_URL}" || {
    echo "Target unreachable: ${BASE_URL}"
    exit 1
  }
fi

if [ -n "${BROWSER}" ]; then
  exec npm test -- --project="${BROWSER}"
else
  exec npm test
fi