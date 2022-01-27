#!/bin/bash

Mode=Files
Source=/home/Temp/From/*.png
Destination=/home/Temp/To
Sizes=16,24,32,48,64,128,256

if [[ $Mode -eq "Folders" ]]
then
    echo "==> Folders Mode ==>"
    node "./src/main.mjs" "%Source%" "%Destination%" "%Sizes%" -dt "{3}" -ft "{0}" -d
fi

if [[ $Mode -eq "Files" ]]
then
    echo "==> Files Mode ==>"
    node "./src/main.mjs" "%Source%" "%Destination%" "%Sizes%" -ft "{0} {3}" -d
fi

read -p "Press enter to finish"    