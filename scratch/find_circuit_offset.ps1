Add-Type -AssemblyName System.Drawing

$pFull = "C:\Users\vishaal.poobalan\.gemini\antigravity-ide\brain\11f90936-b854-4e06-929f-7e8137ec51f7\.user_uploaded\media_1790586991251.png"
$pNew = "C:\Users\vishaal.poobalan\.gemini\antigravity-ide\brain\11f90936-b854-4e06-929f-7e8137ec51f7\.user_uploaded\media_1790589361650.png"

$bFull = [System.Drawing.Bitmap]::FromFile($pFull)
$bNew = [System.Drawing.Bitmap]::FromFile($pNew)

# Find circuit icon blue pixels in bNew and bFull
# Inside the logo card is the blue circuit logo (R around 0..20, G around 80..120, B around 220..255)
$firstBlueNewX = -1; $firstBlueNewY = -1
for ($y = 0; $y -lt $bNew.Height; $y++) {
    for ($x = 0; $x -lt $bNew.Width; $x++) {
        $c = $bNew.GetPixel($x, $y)
        if ($c.B -gt 200 -and $c.R -lt 50 -and $c.G -gt 50 -and $c.G -lt 150) {
            $firstBlueNewX = $x; $firstBlueNewY = $y
            break
        }
    }
    if ($firstBlueNewX -ne -1) { break }
}

$firstBlueFullX = -1; $firstBlueFullY = -1
for ($y = 0; $y -lt $bFull.Height; $y++) {
    for ($x = 0; $x -lt $bFull.Width; $x++) {
        $c = $bFull.GetPixel($x, $y)
        if ($c.B -gt 200 -and $c.R -lt 50 -and $c.G -gt 50 -and $c.G -lt 150) {
            $firstBlueFullX = $x; $firstBlueFullY = $y
            break
        }
    }
    if ($firstBlueFullX -ne -1) { break }
}

Write-Host "First circuit pixel in bNew: ($firstBlueNewX, $firstBlueNewY)"
Write-Host "First circuit pixel in bFull: ($firstBlueFullX, $firstBlueFullY)"

$dx = $firstBlueFullX - $firstBlueNewX
$dy = $firstBlueFullY - $firstBlueNewY
Write-Host "Offset dx=$dx, dy=$dy"

$bFull.Dispose()
$bNew.Dispose()
