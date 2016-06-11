#!/bin/bash

svgexport app_icon.svg ../android/app/src/main/res/mipmap-mdpi/ic_launcher.png 48:48
optipng -o7 ../android/app/src/main/res/mipmap-mdpi/ic_launcher.png

svgexport app_icon.svg ../android/app/src/main/res/mipmap-hdpi/ic_launcher.png 72:72
optipng -o7 ../android/app/src/main/res/mipmap-hdpi/ic_launcher.png

svgexport app_icon.svg ../android/app/src/main/res/mipmap-xhdpi/ic_launcher.png 96:96
optipng -o7 ../android/app/src/main/res/mipmap-xhdpi/ic_launcher.png

svgexport app_icon.svg ../android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png 144:144
optipng -o7 ../android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png
