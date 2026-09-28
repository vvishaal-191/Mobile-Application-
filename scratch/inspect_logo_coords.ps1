Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\vishaal.poobalan\.gemini\antigravity-ide\brain\11f90936-b854-4e06-929f-7e8137ec51f7\.user_uploaded\media_1790586991251.png"

if (-not (Test-Path -Path $srcPath)) {
    Write-Error "Source image not found: $srcPath"
    exit 1
}

$img = [System.Drawing.Bitmap]::FromFile($srcPath)

try {
    Write-Host "Full image: Width = $($img.Width), Height = $($img.Height)"

    Write-Host "Scanning vertical center line (x=253):"
    for ($y = 0; $y -lt $img.Height; $y += 20) {
        $pixel = $img.GetPixel(253, $y)
        Write-Host "y=$y R=$($pixel.R) G=$($pixel.G) B=$($pixel.B)"
    }
}
finally {
    $img.Dispose()
}