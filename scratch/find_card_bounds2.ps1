Add-Type -AssemblyName System.Drawing

$p = "C:\Users\vishaal.poobalan\.gemini\antigravity-ide\brain\11f90936-b854-4e06-929f-7e8137ec51f7\.user_uploaded\media_1790587697516.png"
$bmp = [System.Drawing.Bitmap]::FromFile($p)
Write-Host "Uploaded 2nd Image: $($bmp.Width) x $($bmp.Height)"

# Find white card bounds (logo card)
$minX = 9999; $maxX = -1; $minY = 9999; $maxY = -1
for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $c = $bmp.GetPixel($x, $y)
        # White card pixel (near white)
        if ($c.R -gt 240 -and $c.G -gt 240 -and $c.B -gt 240) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Host "White card bounds: x=$minX..$maxX (w=$($maxX - $minX + 1)), y=$minY..$maxY (h=$($maxY - $minY + 1))"

$bmp.Dispose()
