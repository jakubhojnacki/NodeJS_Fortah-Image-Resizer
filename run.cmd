@echo off

set mode=directories
set source=C:\Temp\From
set sourceFileMask=*.png
set destination=C:\Temp\To
set sizes=16,24,32,48,64,128,256

if "%mode%" == "directories" (
    echo "==> Directories Mode ==>"
    node "./src/main.mjs" "%source%" "%destination%" "%sizes%" -sfm "%sourceFileMask%" -dt "{3}" -ft "{0}"
)
if "%mode%" == "files" (
    echo "==> Files Mode ==>"
    node "./src/main.mjs" "%source%" "%destination%" "%sizes%" -sfm "%sourceFileMask%" -ft "{0} {3}"
)

pause
