Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile('c:\Users\vishaal.poobalan\Downloads\files (7)\assets\login-logo-card.png')
Write-Host "Dimensions: $($bmp.Width) x $($bmp.Height)"
$cCenter = $bmp.GetPixel([int]($bmp.Width/2), [int]($bmp.Height/2))
Write-Host "Center pixel: R=$($cCenter.R) G=$($cCenter.G) B=$($cCenter.B)"
$cCorner = $bmp.GetPixel(5, 5)
Write-Host "Corner pixel: R=$($cCorner.R) G=$($cCorner.G) B=$($cCorner.B) A=$($cCorner.A)"
$bmp.Dispose()
