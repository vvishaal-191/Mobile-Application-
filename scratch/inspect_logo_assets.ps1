Add-Type -AssemblyName System.Drawing

$files = @('login-logo-card.png', 'login-logo-card-clean.png', 'emergere-circuit-logo.png', 'login-header-bg.png')

foreach ($f in $files) {
    $p = "c:\Users\vishaal.poobalan\Downloads\files (7)\assets\$f"
    if (Test-Path $p) {
        $b = [System.Drawing.Bitmap]::FromFile($p)
        Write-Host "$f : $($b.Width) x $($b.Height), Format=$($b.PixelFormat)"
        $b.Dispose()
    } else {
        Write-Host "$f : NOT FOUND"
    }
}
