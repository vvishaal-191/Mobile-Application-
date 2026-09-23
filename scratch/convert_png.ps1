Add-Type -AssemblyName System.Drawing
$inPath = (Resolve-Path "assets/neumorphic-login-logo.jpg").Path
$outPath1 = Join-Path (Resolve-Path "assets").Path "neumorphic-login-logo.png"
$outPath2 = Join-Path (Resolve-Path "EmergereApp/EmergereApp/assets").Path "neumorphic-login-logo.png"

$img = [System.Drawing.Image]::FromFile($inPath)
$img.Save($outPath1, [System.Drawing.Imaging.ImageFormat]::Png)
$img.Save($outPath2, [System.Drawing.Imaging.ImageFormat]::Png)
$img.Dispose()
Write-Host "Done converting PNG!"
