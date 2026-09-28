Add-Type -AssemblyName System.Drawing

$p = "c:\Users\vishaal.poobalan\Downloads\files (7)\assets\emergere-circuit-logo.png"
$b = [System.Drawing.Bitmap]::FromFile($p)

$minX = 9999; $maxX = -1; $minY = 9999; $maxY = -1
for ($y = 0; $y -lt $b.Height; $y++) {
    for ($x = 0; $x -lt $b.Width; $x++) {
        $c = $b.GetPixel($x, $y)
        if ($c.A -gt 10) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Host "Non-transparent bounds: x=$minX..$maxX, y=$minY..$maxY"
$c = $b.GetPixel([int](($minX+$maxX)/2), [int](($minY+$maxY)/2))
Write-Host "Color at center: $c"

$b.Dispose()
