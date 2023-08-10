#!/bin/bash
echo updating redisclient
npm i --package-lock-only github:/c3pobot/redisclient
echo updating botrequest
npm i --package-lock-only github:/c3pobot/botrequest
echo updating mongoclient
npm i --package-lock-only github:/c3pobot/mongoclient
echo updating logger
npm i --package-lock-only github:/c3pobot/logger
echo updating googletokenwrapper
npm i --package-lock-only github:/c3pobot/googletokenwrapper
