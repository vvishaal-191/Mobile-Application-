Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\vishaal.poobalan\.gemini\antigravity-ide\brain\11f90936-b854-4e06-929f-7e8137ec51f7\.user_uploaded\media_1790586991251.png"
$src = [System.Drawing.Bitmap]::FromFile($srcPath)

$cropW = 506
$cropH = 385

$rect = New-Object System.Drawing.Rectangle(0, 0, $cropW, $cropH)
$cropped = $src.Clone($rect, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

$out1 = "c:\Users\vishaal.poobalan\Downloads\files (7)\assets\login-top-header.png"
$out2 = "c:\Users\vishaal.poobalan\Downloads\files (7)\EmergereApp\EmergereApp\assets\login-top-header.png"

$cropped.Save($out1, [System.Drawing.Imaging.ImageFormat]::Png)
$cropped.Save($out2, [System.Drawing.Imaging.ImageFormat]::Png)

Write-Host "Pristine header saved: $($cropped.Width) x $($cropped.Height)"

$cropped.Dispose()
$src.Dispose()
