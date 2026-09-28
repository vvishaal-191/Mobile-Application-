Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\vishaal.poobalan\.gemini\antigravity-ide\brain\4ee80f6f-b41b-4643-81a4-8df829a9cb69\.user_uploaded\media_1790579054535.png"

if (-not (Test-Path -Path $srcPath)) {
    Write-Error "Source image not found: $srcPath"
    exit 1
}

$img = [System.Drawing.Bitmap]::FromFile($srcPath)

try {
    Write-Host "Full image: Width = $($img.Width), Height = $($img.Height)"

    for ($y = 180; $y -lt 450; $y += 5) {
        $pixel = $img.GetPixel(253, $y)
        Write-Host "y=$y R=$($pixel.R) G=$($pixel.G) B=$($pixel.B)"
    }
}
finally {
    $img.Dispose()
}