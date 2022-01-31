#!/bin/bash

tty -s || exec konsole -e "$0" "$@"

mode=directories
source=/home/Temp/From
sourceFileMask=*.png
destination=/home/Temp/To
sizes=16,24,32,48,64,128,256

if [[ $mode = "directories" ]]; then
    echo "==> Directories Mode ==>"
    node "./src/main.mjs" "$source" "$destination" "$sizes" -sfm "$sourceFileMask" -dt "{3}" -ft "{0}"
fi

if [[ $mode = "files" ]]; then
    echo "==> Files Mode ==>"
    node "./src/main.mjs" "$source" "$destination" "$sizes" -sfm "$sourceFileMask" -ft "{0} {3}"
fi

read -n 1 -s -r -p "(Press any key to end)"
