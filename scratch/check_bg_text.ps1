Add-Type -AssemblyName System.Drawing

$p = "c:\Users\vishaal.poobalan\Downloads\files (7)\assets\login-header-bg.png"
$b = [System.Drawing.Bitmap]::FromFile($p)

Write-Host "Dims: $($b.Width) x $($b.Height)"
# Let's check if there is text in login-header-bg.png
# Sample where "Welcome Back" would be (y=260..320)
$whitePixels = 0
for ($y = 260; $y -lt 320; $y++) {
    for ($x = 100; $x -lt 400; $x++) {
        $c = $b.GetPixel($x, $y)
        if ($c.R -gt 240 -and $c.G -gt 240 -and $c.B -gt 240) {
            $whitePixels++
        }
    }
}
Write-Host "White pixels in text area: $whitePixels"

$b.Dispose()
