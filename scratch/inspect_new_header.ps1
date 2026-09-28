Add-Type -AssemblyName System.Drawing

$p = "c:\Users\vishaal.poobalan\Downloads\files (7)\assets\login-top-header.png"
$bmp = [System.Drawing.Bitmap]::FromFile($p)
Write-Host "Generated Header: $($bmp.Width) x $($bmp.Height)"

# Check logo card bounds in generated header
$minX = 9999; $maxX = -1; $minY = 9999; $maxY = -1
for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.R -gt 240 -and $c.G -gt 240 -and $c.B -gt 240) {
            # Check if near center (to avoid wave if wave is white)
            if ($x -gt 150 -and $x -lt 350 -and $y -lt 180) {
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
                if ($y -lt $minY) { $minY = $y }
                if ($y -gt $maxY) { $maxY = $y }
            }
        }
    }
}

Write-Host "New logo card bounds in header: x=$minX..$maxX (w=$($maxX - $minX + 1)), y=$minY..$maxY (h=$($maxY - $minY + 1))"

# Check text bounds (Welcome back is white text)
$tMinY = 9999; $tMaxY = -1
for ($y = 170; $y -lt 250; $y++) {
    for ($x = 100; $x -lt 400; $x++) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.R -gt 230 -and $c.G -gt 230 -and $c.B -gt 230) {
            if ($y -lt $tMinY) { $tMinY = $y }
            if ($y -gt $tMaxY) { $tMaxY = $y }
        }
    }
}
Write-Host "Text area: y=$tMinY..$tMaxY"

$bmp.Dispose()
