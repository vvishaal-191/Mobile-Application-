Add-Type -AssemblyName System.Drawing

$p = "C:\Users\vishaal.poobalan\.gemini\antigravity-ide\brain\11f90936-b854-4e06-929f-7e8137ec51f7\.user_uploaded\media_1790589361650.png"
$bmp = [System.Drawing.Bitmap]::FromFile($p)

Write-Host "Image 2 dimensions: $($bmp.Width) x $($bmp.Height)"

# Find the blue/content area (where color is not the dark background #1a202f, i.e., R or G or B > 60)
$minX = 9999; $maxX = -1; $minY = 9999; $maxY = -1
for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $c = $bmp.GetPixel($x, $y)
        # Not dark background (dark background is around R<40, G<45, B<60)
        if ($c.R -gt 50 -or $c.G -gt 60 -or $c.B -gt 100) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Host "Blue content bounds: x=$($minX)..$($maxX) (w=$($maxX - $minX + 1)), y=$($minY)..$($maxY) (h=$($maxY - $minY + 1))"

# Check horizontal slice across middle of content
$midY = [int](($minY + $maxY) / 2)
Write-Host "At midY=$($midY):"
Write-Host "Left pixel ($minX, $midY): $($bmp.GetPixel($minX, $midY))"
Write-Host "Right pixel ($maxX, $midY): $($bmp.GetPixel($maxX, $midY))"

$bmp.Dispose()
