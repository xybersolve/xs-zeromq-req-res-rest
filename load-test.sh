#!/usr/bin/env bash

ab -k -c 350 -n 20000 http://127.0.0.1:8686/ping
