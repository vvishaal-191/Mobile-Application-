Add-Type -AssemblyName System.Drawing

$src = [System.Drawing.Bitmap]::FromFile('c:\Users\vishaal.poobalan\Downloads\files (7)\assets\login-logo-card.png')
# Find where the white card begins
# Scan along row y=68
for ($x = 0; $x -lt $src.Width; $x += 2) {
    $p = $src.GetPixel($x, 68)
    if ($p.R -gt 240 -and $p.G -gt 240) {
        Write-Host "White starts at x=$x"
        break
    }
}
for ($x = $src.Width - 1; $x -ge 0; $x -= 2) {
    $p = $src.GetPixel($x, 68)
    if ($p.R -gt 240 -and $p.G -gt 240) {
        Write-Host "White ends at x=$x"
        break
    }
}
for ($y = 0; $y -lt $src.Height; $y += 2) {
    $p = $src.GetPixel(73, $y)
    if ($p.R -gt 240 -and $p.G -gt 240) {
        Write-Host "White starts at y=$y"
        break
    }
}
for ($y = $src.Height - 1; $y -ge 0; $y -= 2) {
    $p = $src.GetPixel(73, $y)
    if ($p.R -gt 240 -and $p.G -gt 240) {
        Write-Host "White ends at y=$y"
        break
    }
}
$src.Dispose()
