#!/bin/bash

# ios files
for FILE in ./plugin/src/ios/static
do
        cp -R $FILE ./plugin/build/ios/static/
done