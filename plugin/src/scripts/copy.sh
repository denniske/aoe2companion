#!/bin/bash

# https://docs.expo.dev/modules/config-plugin-and-native-module-tutorial/

# ios files
for FILE in ./plugin/src/ios/static
do
        cp -R $FILE ./plugin/build/ios/static/
done