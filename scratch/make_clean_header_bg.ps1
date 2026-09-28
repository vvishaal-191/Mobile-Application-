Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\vishaal.poobalan\.gemini\antigravity-ide\brain\11f90936-b854-4e06-929f-7e8137ec51f7\.user_uploaded\media_1790586991251.png"
$src = [System.Drawing.Bitmap]::FromFile($srcPath)

$w = 506
$h = 385 # down to where the wave transitions to white

$bg = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

# Copy src to bg
for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        $bg.SetPixel($x, $y, $src.GetPixel($x, $y))
    }
}

# The card and text in src were at x=165..340, y=95..330
# We seamlessly interpolate between x=150 and x=355 for y=80..340
for ($y = 80; $y -le 340; $y++) {
    $cL = $src.GetPixel(150, $y)
    $cR = $src.GetPixel(355, $y)
    for ($x = 151; $x -lt 355; $x++) {
        $t = ($x - 150) / (355.0 - 150.0)
        $r = [int]($cL.R * (1 - $t) + $cR.R * $t)
        $g = [int]($cL.G * (1 - $t) + $cR.G * $t)
        $b = [int]($cL.B * (1 - $t) + $cR.B * $t)
        $bg.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $r, $g, $b))
    }
}

# Save to assets
$out1 = "c:\Users\vishaal.poobalan\Downloads\files (7)\assets\login-top-header.png"
$out2 = "c:\Users\vishaal.poobalan\Downloads\files (7)\EmergereApp\EmergereApp\assets\login-top-header.png"
$out3 = "c:\Users\vishaal.poobalan\Downloads\files (7)\assets\login-header-bg.png"
$out4 = "c:\Users\vishaal.poobalan\Downloads\files (7)\EmergereApp\EmergereApp\assets\login-header-bg.png"

$bg.Save($out1, [System.Drawing.Imaging.ImageFormat]::Png)
$bg.Save($out2, [System.Drawing.Imaging.ImageFormat]::Png)
$bg.Save($out3, [System.Drawing.Imaging.ImageFormat]::Png)
$bg.Save($out4, [System.Drawing.Imaging.ImageFormat]::Png)

Write-Host "Seamless background saved: $($bg.Width) x $($bg.Height)"

$bg.Dispose()
$src.Dispose()
