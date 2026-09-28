Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\vishaal.poobalan\.gemini\antigravity-ide\brain\4ee80f6f-b41b-4643-81a4-8df829a9cb69\.user_uploaded\media_1790579054535.png"
$img = [System.Drawing.Bitmap]::FromFile($srcPath)

Write-Host "Width: $($img.Width), Height: $($img.Height)"

# Top banner: From 0 to 365px
$rectBanner = New-Object System.Drawing.Rectangle(0, 0, $img.Width, 365)
$bmpBanner = $img.Clone($rectBanner, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$bmpBanner.Save("c:\Users\vishaal.poobalan\Downloads\files (7)\EmergereApp\EmergereApp\assets\login-top-header.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmpBanner.Save("c:\Users\vishaal.poobalan\Downloads\files (7)\assets\login-top-header.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmpBanner.Dispose()

# Logo area (centered white card with circuit logo)
# In 507x1024, let's find the logo card bounding box:
# Center is x = 507 / 2 = 253.5. Card is approx 140x140 at y around 210 to 350.
$rectLogo = New-Object System.Drawing.Rectangle(180, 215, 145, 145)
$bmpLogo = $img.Clone($rectLogo, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$bmpLogo.Save("c:\Users\vishaal.poobalan\Downloads\files (7)\EmergereApp\EmergereApp\assets\login-logo-card.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmpLogo.Save("c:\Users\vishaal.poobalan\Downloads\files (7)\assets\login-logo-card.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmpLogo.Dispose()

# Bottom waves: From 730 to 1024
$rectBottom = New-Object System.Drawing.Rectangle(0, 730, $img.Width, 294)
$bmpBottom = $img.Clone($rectBottom, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$bmpBottom.Save("c:\Users\vishaal.poobalan\Downloads\files (7)\EmergereApp\EmergereApp\assets\login-bottom-wave.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmpBottom.Save("c:\Users\vishaal.poobalan\Downloads\files (7)\assets\login-bottom-wave.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmpBottom.Dispose()

$img.Dispose()
Write-Host "All assets cropped successfully!"
