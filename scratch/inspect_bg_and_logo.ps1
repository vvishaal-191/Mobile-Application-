Add-Type -AssemblyName System.Drawing

$pBg = "c:\Users\vishaal.poobalan\Downloads\files (7)\assets\login-header-bg.png"
$bBg = [System.Drawing.Bitmap]::FromFile($pBg)
Write-Host "login-header-bg.png : $($bBg.Width) x $($bBg.Height)"

# Sample points in login-header-bg.png
Write-Host "Top-center: $($bBg.GetPixel(253, 20))"
Write-Host "Center: $($bBg.GetPixel(253, 150))"
Write-Host "Bottom-center: $($bBg.GetPixel(253, 350))"

# Check if login-header-bg has text or logo
$hasWhiteCard = $false
for ($y = 50; $y -lt 250; $y += 5) {
    for ($x = 150; $x -lt 350; $x += 5) {
        $c = $bBg.GetPixel($x, $y)
        if ($c.R -gt 250 -and $c.G -gt 250 -and $c.B -gt 250) {
            $hasWhiteCard = $true
        }
    }
}
Write-Host "Has white card in center: $hasWhiteCard"

$pLogo = "c:\Users\vishaal.poobalan\Downloads\files (7)\assets\login-logo-card-clean.png"
$bLogo = [System.Drawing.Bitmap]::FromFile($pLogo)
Write-Host "login-logo-card-clean.png : $($bLogo.Width) x $($bLogo.Height)"
Write-Host "Corner pixel: $($bLogo.GetPixel(0,0))"
Write-Host "Center pixel: $($bLogo.GetPixel(68, 68))"

$bBg.Dispose()
$bLogo.Dispose()
