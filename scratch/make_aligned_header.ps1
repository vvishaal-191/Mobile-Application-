Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\vishaal.poobalan\.gemini\antigravity-ide\brain\11f90936-b854-4e06-929f-7e8137ec51f7\.user_uploaded\media_1790586991251.png"
$src = [System.Drawing.Bitmap]::FromFile($srcPath)
Write-Host "Source: $($src.Width) x $($src.Height)"

# In media_1790586991251.png:
# Logo card is at: x=180, y=114, w=146, h=136
# Text area is at: x=50, y=260, w=406, h=70
# Bottom wave transition is at: x=0, y=330, w=506, h=60

# We want a new header of size 506 x 300 where:
# 1. Clean blue gradient backdrop from y=0 to y=300
# 2. Logo card is shifted UP to y=35 (shifted up by 79px)
# 3. Text area is shifted UP to y=182 (shifted up by 78px)
# 4. Wave transition is at y=250..300

$newW = 506
$newH = 295
$newBmp = New-Object System.Drawing.Bitmap($newW, $newH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($newBmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

# 1. Draw top blue background (from x=0..506, y=0..110) repeated / stretched down to y=250
# In src, rows y=0..110 are pure smooth blue gradient
$rectBgSrc = New-Object System.Drawing.Rectangle(0, 0, 506, 110)
$rectBgDst = New-Object System.Drawing.Rectangle(0, 0, 506, 250)
$g.DrawImage($src, $rectBgDst, $rectBgSrc, [System.Drawing.GraphicsUnit]::Pixel)

# 2. Draw wave transition at bottom (from src y=330..370 to dst y=250..295)
$rectWaveSrc = New-Object System.Drawing.Rectangle(0, 330, 506, 40)
$rectWaveDst = New-Object System.Drawing.Rectangle(0, 250, 506, 45)
$g.DrawImage($src, $rectWaveDst, $rectWaveSrc, [System.Drawing.GraphicsUnit]::Pixel)

# 3. Draw Logo Card at new position y=35 (from src y=114..250)
$rectLogoSrc = New-Object System.Drawing.Rectangle(180, 114, 146, 136)
$rectLogoDst = New-Object System.Drawing.Rectangle(180, 35, 146, 136)
$g.DrawImage($src, $rectLogoDst, $rectLogoSrc, [System.Drawing.GraphicsUnit]::Pixel)

# 4. Draw "Welcome Back" and "Sign in to continue" at new position y=180 (from src y=260..328)
$rectTextSrc = New-Object System.Drawing.Rectangle(50, 260, 406, 68)
$rectTextDst = New-Object System.Drawing.Rectangle(50, 178, 406, 68)
$g.DrawImage($src, $rectTextDst, $rectTextSrc, [System.Drawing.GraphicsUnit]::Pixel)

$g.Dispose()

# Save new header
$outPath1 = "c:\Users\vishaal.poobalan\Downloads\files (7)\EmergereApp\EmergereApp\assets\login-top-header.png"
$outPath2 = "c:\Users\vishaal.poobalan\Downloads\files (7)\assets\login-top-header.png"
$newBmp.Save($outPath1, [System.Drawing.Imaging.ImageFormat]::Png)
$newBmp.Save($outPath2, [System.Drawing.Imaging.ImageFormat]::Png)

Write-Host "New aligned header saved: $($newBmp.Width) x $($newBmp.Height)"
$newBmp.Dispose()
$src.Dispose()
