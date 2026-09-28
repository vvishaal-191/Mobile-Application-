Add-Type -AssemblyName System.Drawing

$p = "c:\Users\vishaal.poobalan\Downloads\files (7)\assets\emergere-circuit-logo.png"
$b = [System.Drawing.Bitmap]::FromFile($p)
Write-Host "emergere-circuit-logo.png: $($b.Width) x $($b.Height)"
Write-Host "Corner: $($b.GetPixel(0,0))"
Write-Host "Center: $($b.GetPixel(256, 256))"

$b.Dispose()
