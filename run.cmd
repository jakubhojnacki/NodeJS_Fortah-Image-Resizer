@echo off

set System=Windows
set Mode=Files

set LinuxFrom=/home/Temp/From/*.png
set LinuxTo=/home/Temp/To

set WindowsFrom=C:\Temp\From\*.png
set WindowsTo=C:\Temp\To

set Sizes=16,24,32,48,64,128,256

if "%System%" == "Linux" (
    echo "==> Linux System ==>"
    if "%Mode%" == "Folders" (
        echo "==> Folders Mode ==>"
        node "./main.js" "%LinuxFrom%" "%LinuxTo%" "%Sizes%" -dt "{3}" -ft "{0}" -d
    )
    if "%Mode%" == "Files" (
        echo "==> Files Mode ==>"
        node "./main.js" "%LinuxFrom%" "%LinuxTo%" "%Sizes%" -ft "{0} {3}" -d
    )
)

if "%System%" == "Windows" (
    echo "==> Windows System ==>"
    if "%Mode%" == "Folders" (
        echo "==> Folders Mode ==>"
        node "./main.js" "%WindowsFrom%" "%WindowsTo%" "%Sizes%" -dt "{3}" -ft "{0}" -d
    )
    if "%Mode%" == "Files" (
        echo "==> Files Mode ==>"
        node "./main.js" "%WindowsFrom%" "%WindowsTo%" "%Sizes%" -ft "{0} {3}" -d
    )
)

pause