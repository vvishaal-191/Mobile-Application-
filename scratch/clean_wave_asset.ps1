Add-Type -AssemblyName System.Drawing

$paths = @(
    "c:\Users\vishaal.poobalan\Downloads\files (7)\assets\login-bottom-wave.png",
    "c:\Users\vishaal.poobalan\Downloads\files (7)\EmergereApp\EmergereApp\assets\login-bottom-wave.png"
)

foreach ($p in $paths) {
    if (Test-Path $p) {
        $bmp = [System.Drawing.Bitmap]::FromFile($p)
        Write-Host "Original: $($bmp.Width) x $($bmp.Height)"
        if ($bmp.Height -gt 230) {
            $cropY = 16
            $newH = $bmp.Height - $cropY
            $rect = New-Object System.Drawing.Rectangle(0, $cropY, $bmp.Width, $newH)
            $cropped = $bmp.Clone($rect, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
            $bmp.Dispose()
            $cropped.Save($p, [System.Drawing.Imaging.ImageFormat]::Png)
            $cropped.Dispose()
            Write-Host "Saved cleaned wave to $p (height=$newH)"
        } else {
            $bmp.Dispose()
            Write-Host "Already cropped: $p"
        }
    }
}
