Add-Type -AssemblyName System.Drawing

$pFull = "C:\Users\vishaal.poobalan\.gemini\antigravity-ide\brain\11f90936-b854-4e06-929f-7e8137ec51f7\.user_uploaded\media_1790586991251.png"
$pNew = "C:\Users\vishaal.poobalan\.gemini\antigravity-ide\brain\11f90936-b854-4e06-929f-7e8137ec51f7\.user_uploaded\media_1790589361650.png"

$bFull = [System.Drawing.Bitmap]::FromFile($pFull)
$bNew = [System.Drawing.Bitmap]::FromFile($pNew)

Write-Host "Full image: $($bFull.Width) x $($bFull.Height)"
Write-Host "New image: $($bNew.Width) x $($bNew.Height)"

# In bNew, where is the logo card?
$minX = 9999; $maxX = -1; $minY = 9999; $maxY = -1
for ($y = 0; $y -lt $bNew.Height; $y++) {
    for ($x = 0; $x -lt $bNew.Width; $x++) {
        $c = $bNew.GetPixel($x, $y)
        if ($c.R -gt 245 -and $c.G -gt 245 -and $c.B -gt 245) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Host "In bNew, white card bounds: x=$($minX)..$($maxX) (w=$($maxX - $minX + 1)), y=$($minY)..$($maxY) (h=$($maxY - $minY + 1))"

$bFull.Dispose()
$bNew.Dispose()
