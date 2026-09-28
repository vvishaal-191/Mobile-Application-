Add-Type -AssemblyName System.Drawing

$p = "C:\Users\vishaal.poobalan\.gemini\antigravity-ide\brain\11f90936-b854-4e06-929f-7e8137ec51f7\.user_uploaded\media_1790586991251.png"
$bmp = [System.Drawing.Bitmap]::FromFile($p)

Write-Host "Width=$($bmp.Width), Height=$($bmp.Height)"

# Find form card bounds in original full screenshot
# Form card is white (R>245, G>245, B>245) with borders around x=20..486
# Center at x=253
for ($y = 350; $y -lt 900; $y += 20) {
    $c = $bmp.GetPixel(253, $y)
    Write-Host "y=$y : R=$($c.R) G=$($c.G) B=$($c.B)"
}

$bmp.Dispose()
