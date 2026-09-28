Add-Type -AssemblyName System.Drawing

$p = "C:\Users\vishaal.poobalan\.gemini\antigravity-ide\brain\11f90936-b854-4e06-929f-7e8137ec51f7\.user_uploaded\media_1790586991251.png"
$bmp = [System.Drawing.Bitmap]::FromFile($p)

# Check top rows y=0..15 across center
for ($y = 0; $y -le 15; $y++) {
    $c = $bmp.GetPixel(253, $y)
    Write-Host "y=$y : R=$($c.R) G=$($c.G) B=$($c.B)"
}

# Check x=0..15 at y=100
for ($x = 0; $x -le 15; $x++) {
    $c = $bmp.GetPixel($x, 100)
    Write-Host "x=$x : R=$($c.R) G=$($c.G) B=$($c.B)"
}

$bmp.Dispose()
