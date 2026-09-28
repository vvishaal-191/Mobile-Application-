Add-Type -AssemblyName System.Drawing

$p = "C:\Users\vishaal.poobalan\.gemini\antigravity-ide\brain\11f90936-b854-4e06-929f-7e8137ec51f7\.user_uploaded\media_1790586991251.png"
$bmp = [System.Drawing.Bitmap]::FromFile($p)

Write-Host "Width=$($bmp.Width), Height=$($bmp.Height)"

# Inspect the wave bottom at y=350, 360, 370, 380, 390
for ($y = 340; $y -le 390; $y += 5) {
    $cLeft = $bmp.GetPixel(30, $y)
    $cMid = $bmp.GetPixel(253, $y)
    $cRight = $bmp.GetPixel(476, $y)
    Write-Host "y=$y | Left: ($($cLeft.R),$($cLeft.G),$($cLeft.B)) | Mid: ($($cMid.R),$($cMid.G),$($cMid.B)) | Right: ($($cRight.R),$($cRight.G),$($cRight.B))"
}

$bmp.Dispose()
