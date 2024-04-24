#!/bin/bash

ps -ef | grep "node medbot.js" | grep -v grep | awk '{print $2}' | xargs kill
