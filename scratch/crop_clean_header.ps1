Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\vishaal.poobalan\.gemini\antigravity-ide\brain\4ee80f6f-b41b-4643-81a4-8df829a9cb69\.user_uploaded\media_1790579054535.png"
$img = [System.Drawing.Bitmap]::FromFile($srcPath)

# 1. Top banner from 0 to 290px (above the logo card bottom, so the background flows naturally)
$rectHeaderClean = New-Object System.Drawing.Rectangle(0, 0, $img.Width, 275)
$bmpHeaderClean = $img.Clone($rectHeaderClean, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$bmpHeaderClean.Save("c:\Users\vishaal.poobalan\Downloads\files (7)\EmergereApp\EmergereApp\assets\login-header-top.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmpHeaderClean.Save("c:\Users\vishaal.poobalan\Downloads\files (7)\assets\login-header-top.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmpHeaderClean.Dispose()

# 2. Perfect crisp logo card cropped from 185, 215, 137, 137
$rectLogo = New-Object System.Drawing.Rectangle(185, 215, 137, 137)
$bmpLogo = $img.Clone($rectLogo, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$bmpLogo.Save("c:\Users\vishaal.poobalan\Downloads\files (7)\EmergereApp\EmergereApp\assets\login-logo-card-clean.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmpLogo.Save("c:\Users\vishaal.poobalan\Downloads\files (7)\assets\login-logo-card-clean.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmpLogo.Dispose()

# 3. Header extended down to 380px (where the wave curves complete to white background)
$rectHeader380 = New-Object System.Drawing.Rectangle(0, 0, $img.Width, 385)
$bmpHeader380 = $img.Clone($rectHeader380, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$bmpHeader380.Save("c:\Users\vishaal.poobalan\Downloads\files (7)\EmergereApp\EmergereApp\assets\login-header-full.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmpHeader380.Save("c:\Users\vishaal.poobalan\Downloads\files (7)\assets\login-header-full.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmpHeader380.Dispose()

$img.Dispose()
Write-Host "Images cropped successfully"
