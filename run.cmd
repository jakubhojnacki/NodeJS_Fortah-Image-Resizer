@echo off

set Mode=Files
set Source=C:\Temp\From\*.png
set Destination=C:\Temp\To
set Sizes=16,24,32,48,64,128,256

if "%Mode%" == "Folders" (
    echo "==> Folders Mode ==>"
    node "./src/main.mjs" "%Source%" "%Destination%" "%Sizes%" -dt "{3}" -ft "{0}" -d
)
if "%Mode%" == "Files" (
    echo "==> Files Mode ==>"
    node "./src/main.mjs" "%Source%" "%Destination%" "%Sizes%" -ft "{0} {3}" -d
)

pause