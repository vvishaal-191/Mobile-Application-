Add-Type -AssemblyName System.Drawing

$p = "c:\Users\vishaal.poobalan\Downloads\files (7)\scratch\test_clean_bg.png"
$bmp = [System.Drawing.Bitmap]::FromFile($p)

Write-Host "Clean BG dims: $($bmp.Width) x $($bmp.Height)"

# Check rows y=20, 100, 200, 300 across center x=253
for ($y = 20; $y -lt $bmp.Height; $y += 40) {
    $c = $bmp.GetPixel(253, $y)
    Write-Host "y=$y : R=$($c.R) G=$($c.G) B=$($c.B)"
}

# Bottom row
$bLeft = $bmp.GetPixel(10, $bmp.Height - 1)
$bMid = $bmp.GetPixel(253, $bmp.Height - 1)
$bRight = $bmp.GetPixel(490, $bmp.Height - 1)
Write-Host "Bottom row: Left=$bLeft, Mid=$bMid, Right=$bRight"

$bmp.Dispose()
