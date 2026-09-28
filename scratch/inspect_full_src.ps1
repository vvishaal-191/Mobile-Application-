Add-Type -AssemblyName System.Drawing

$p = "C:\Users\vishaal.poobalan\.gemini\antigravity-ide\brain\11f90936-b854-4e06-929f-7e8137ec51f7\.user_uploaded\media_1790586991251.png"
$bmp = [System.Drawing.Bitmap]::FromFile($p)

Write-Host "Full src dims: $($bmp.Width) x $($bmp.Height)"

# Let's inspect rows from y=250 to y=420 at x=253 (center)
for ($y = 250; $y -lt 420; $y += 10) {
    $c = $bmp.GetPixel(253, $y)
    Write-Host "y=$y : R=$($c.R) G=$($c.G) B=$($c.B)"
}

# Where does the white form card start in the original full image?
for ($y = 300; $y -lt 450; $y++) {
    $c = $bmp.GetPixel(253, $y)
    if ($c.R -gt 250 -and $c.G -gt 250 -and $c.B -gt 250) {
        Write-Host "White form card at center starts at y=$y"
        break
    }
}

$bmp.Dispose()
