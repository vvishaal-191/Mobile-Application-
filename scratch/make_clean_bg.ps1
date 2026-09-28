Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\vishaal.poobalan\.gemini\antigravity-ide\brain\11f90936-b854-4e06-929f-7e8137ec51f7\.user_uploaded\media_1790586991251.png"
$src = [System.Drawing.Bitmap]::FromFile($srcPath)

$w = 506
$h = 360 # down to the wave transition

$bg = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

# Copy src to bg
for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        $bg.SetPixel($x, $y, $src.GetPixel($x, $y))
    }
}

# The card and text in src are at x=165..340, y=95..325
# Let's see: at each row y from 90 to 328:
# We interpolate smoothly between x=160 and x=345
for ($y = 90; $y -le 328; $y++) {
    $cL = $src.GetPixel(160, $y)
    $cR = $src.GetPixel(345, $y)
    
    for ($x = 161; $x -lt 345; $x++) {
        $t = ($x - 160) / (345.0 - 160.0)
        $r = [int]($cL.R * (1 - $t) + $cR.R * $t)
        $g = [int]($cL.G * (1 - $t) + $cR.G * $t)
        $b = [int]($cL.B * (1 - $t) + $cR.B * $t)
        $bg.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $r, $g, $b))
    }
}

$testOut = "c:\Users\vishaal.poobalan\Downloads\files (7)\scratch\test_clean_bg.png"
$bg.Save($testOut, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Clean background saved to $testOut"

$bg.Dispose()
$src.Dispose()
