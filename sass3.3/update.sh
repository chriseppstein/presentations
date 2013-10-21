#!/bin/sh

set -v

bundle exec sass --compass --sourcemap --update --force -t expanded sass:static/css
bundle exec sass --compass --sourcemap --update --force -t expanded static/deck:static/deck
