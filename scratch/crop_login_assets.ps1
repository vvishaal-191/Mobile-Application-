Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\vishaal.poobalan\.gemini\antigravity-ide\brain\4ee80f6f-b41b-4643-81a4-8df829a9cb69\.user_uploaded\media_1790579054535.png"
$img = [System.Drawing.Bitmap]::FromFile($srcPath)

Write-Host "Source image size: $($img.Width) x $($img.Height)"

# Crop Header Banner (top section: 0 to 380px roughly)
$headerRect = New-Object System.Drawing.Rectangle(0, 0, $img.Width, [int]($img.Height * 0.36))
$headerBmp = $img.Clone($headerRect, $img.PixelFormat)
$headerBmp.Save("c:\Users\vishaal.poobalan\Downloads\files (7)\EmergereApp\EmergereApp\assets\login-header-bg.png", [System.Drawing.Imaging.ImageFormat]::Png)
$headerBmp.Save("c:\Users\vishaal.poobalan\Downloads\files (7)\assets\login-header-bg.png", [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Header saved: $($headerBmp.Width) x $($headerBmp.Height)"
$headerBmp.Dispose()

# Crop Bottom Waves (bottom section: 75% to 100%)
$bottomY = [int]($img.Height * 0.72)
$bottomH = $img.Height - $bottomY
$bottomRect = New-Object System.Drawing.Rectangle(0, $bottomY, $img.Width, $bottomH)
$bottomBmp = $img.Clone($bottomRect, $img.PixelFormat)
$bottomBmp.Save("c:\Users\vishaal.poobalan\Downloads\files (7)\EmergereApp\EmergereApp\assets\login-bottom-bg.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bottomBmp.Save("c:\Users\vishaal.poobalan\Downloads\files (7)\assets\login-bottom-bg.png", [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Bottom saved: $($bottomBmp.Width) x $($bottomBmp.Height)"
$bottomBmp.Dispose()

# Also save full background (with form area masked/clean or full backdrop)
$img.Save("c:\Users\vishaal.poobalan\Downloads\files (7)\EmergereApp\EmergereApp\assets\login-full-ref.png", [System.Drawing.Imaging.ImageFormat]::Png)
$img.Save("c:\Users\vishaal.poobalan\Downloads\files (7)\assets\login-full-ref.png", [System.Drawing.Imaging.ImageFormat]::Png)

$img.Dispose()
