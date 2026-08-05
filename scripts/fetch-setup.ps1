# Copy after you rebuild the installer (from the project root):
#   copy ..\dist\installer\ReyTweaksSetup.exe public\download\ReyTweaksSetup.exe
Add-Type -AssemblyName System.IO.Compression.FileSystem
New-Item -ItemType Directory -Force -Path "public\download" | Out-Null
Copy-Item "..\dist\installer\ReyTweaksSetup.exe" "public\download\ReyTweaksSetup.exe" -Force
Get-Item "public\download\ReyTweaksSetup.exe" | Select-Object Name, Length
