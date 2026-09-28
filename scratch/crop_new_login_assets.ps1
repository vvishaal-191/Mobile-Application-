Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\vishaal.poobalan\.gemini\antigravity-ide\brain\11f90936-b854-4e06-929f-7e8137ec51f7\.user_uploaded\media_1790586991251.png"

if (-not (Test-Path $srcPath)) {
    Write-Error "Source image not found: $srcPath"
    exit 1
}

$img = [System.Drawing.Bitmap]::FromFile($srcPath)
Write-Host "Source image size: $($img.Width) x $($img.Height)"

# 1. Top banner with logo and "Welcome Back / Sign in to continue":
# The wave curve goes down to y ~ 370px.
$rectBanner = New-Object System.Drawing.Rectangle(0, 0, $img.Width, 370)
$bmpBanner = $img.Clone($rectBanner, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$bmpBanner.Save("c:\Users\vishaal.poobalan\Downloads\files (7)\EmergereApp\EmergereApp\assets\login-top-header.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmpBanner.Save("c:\Users\vishaal.poobalan\Downloads\files (7)\assets\login-top-header.png", [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Top header saved: $($bmpBanner.Width) x $($bmpBanner.Height)"
$bmpBanner.Dispose()

# 2. Logo Card alone:
# In 506x1024, let's find exact bounds around x=180..326, y=115..250
$rectLogo = New-Object System.Drawing.Rectangle(180, 114, 146, 136)
$bmpLogo = $img.Clone($rectLogo, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$bmpLogo.Save("c:\Users\vishaal.poobalan\Downloads\files (7)\EmergereApp\EmergereApp\assets\login-logo-card.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmpLogo.Save("c:\Users\vishaal.poobalan\Downloads\files (7)\assets\login-logo-card.png", [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Logo card saved: $($bmpLogo.Width) x $($bmpLogo.Height)"
$bmpLogo.Dispose()

# 3. Bottom waves:
# From y=780 to 1024 (height = 244)
$rectBottom = New-Object System.Drawing.Rectangle(0, 780, $img.Width, ($img.Height - 780))
$bmpBottom = $img.Clone($rectBottom, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$bmpBottom.Save("c:\Users\vishaal.poobalan\Downloads\files (7)\EmergereApp\EmergereApp\assets\login-bottom-wave.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmpBottom.Save("c:\Users\vishaal.poobalan\Downloads\files (7)\assets\login-bottom-wave.png", [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Bottom waves saved: $($bmpBottom.Width) x $($bmpBottom.Height)"
$bmpBottom.Dispose()

# 4. Save full reference image
$img.Save("c:\Users\vishaal.poobalan\Downloads\files (7)\EmergereApp\EmergereApp\assets\login-full-ref.png", [System.Drawing.Imaging.ImageFormat]::Png)
$img.Save("c:\Users\vishaal.poobalan\Downloads\files (7)\assets\login-full-ref.png", [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Full reference saved."

$img.Dispose()
Write-Host "All assets cropped successfully!"
