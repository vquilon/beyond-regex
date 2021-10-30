#!/bin/bash

# Se tiene que utilizar --force-polling debido a un fallo en windows WSL2
bundle exec jekyll serve --drafts --incremental --force-polling --livereload --config _config.yml,_dev.yml