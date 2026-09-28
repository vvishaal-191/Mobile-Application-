Add-Type -AssemblyName System.Drawing

$p = "C:\Users\vishaal.poobalan\.gemini\antigravity-ide\brain\11f90936-b854-4e06-929f-7e8137ec51f7\.user_uploaded\media_1790589361650.png"
$bmp = [System.Drawing.Bitmap]::FromFile($p)

Write-Host "Width=$($bmp.Width), Height=$($bmp.Height)"

# Sample 4 corners and edges
Write-Host "Top-Left (0,0): $($bmp.GetPixel(0,0))"
Write-Host "Top-Right ($($bmp.Width-1),0): $($bmp.GetPixel($bmp.Width-1, 0))"
Write-Host "Bottom-Left (0,$($bmp.Height-1)): $($bmp.GetPixel(0, $bmp.Height-1))"
Write-Host "Bottom-Right ($($bmp.Width-1),$($bmp.Height-1)): $($bmp.GetPixel($bmp.Width-1, $bmp.Height-1))"
Write-Host "Top-Center ($([int]($bmp.Width/2)), 5): $($bmp.GetPixel([int]($bmp.Width/2), 5))"
Write-Host "Center ($([int]($bmp.Width/2)), $([int]($bmp.Height/2))): $($bmp.GetPixel([int]($bmp.Width/2), [int]($bmp.Height/2)))"

# Check if there is dark border or rounded corner device frame at top or sides
for ($y = 0; $y -lt 30; $y += 5) {
    $c = $bmp.GetPixel(5, $y)
    Write-Host "x=5, y=$($y) - R=$($c.R) G=$($c.G) B=$($c.B)"
}

$bmp.Dispose()
