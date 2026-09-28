Add-Type -AssemblyName System.Drawing

$p = "c:\Users\vishaal.poobalan\Downloads\files (7)\assets\emergere-circuit-logo.png"
$b = [System.Drawing.Bitmap]::FromFile($p)

for ($y = 100; $y -lt 300; $y += 10) {
    for ($x = 100; $x -lt 400; $x += 10) {
        $c = $b.GetPixel($x, $y)
        if ($c.A -gt 150) {
            Write-Host "Pixel ($x, $y): A=$($c.A) R=$($c.R) G=$($c.G) B=$($c.B)"
            break
        }
    }
}

$b.Dispose()
