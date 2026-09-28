Add-Type -AssemblyName System.Drawing

$p = "c:\Users\vishaal.poobalan\Downloads\files (7)\assets\login-top-header.png"
$bmp = [System.Drawing.Bitmap]::FromFile($p)

Write-Host "Header dimensions: $($bmp.Width) x $($bmp.Height)"

# Find text vertical bounds
# "Welcome Back" and "Sign in to continue" are light colored pixels
$textMinY = 9999; $textMaxY = -1
for ($y = 200; $y -lt 360; $y++) {
    for ($x = 100; $x -lt 400; $x++) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.R -gt 220 -and $c.G -gt 220 -and $c.B -gt 220) {
            if ($y -lt $textMinY) { $textMinY = $y }
            if ($y -gt $textMaxY) { $textMaxY = $y }
        }
    }
}

Write-Host "Text bounds in header: y=$textMinY..$textMaxY"

# At 414px width, what is the scale factor?
$scale = 414.0 / 506.0
$textRenderedTop = $textMinY * $scale
$textRenderedBottom = $textMaxY * $scale
$headerRenderedH = $bmp.Height * $scale

Write-Host "Rendered text top at 414px width: $textRenderedTop px"
Write-Host "Rendered text bottom at 414px width: $textRenderedBottom px"
Write-Host "Rendered header bottom at 414px width: $headerRenderedH px"
Write-Host "Distance from rendered text bottom to header bottom: $($headerRenderedH - $textRenderedBottom) px"

$bmp.Dispose()
