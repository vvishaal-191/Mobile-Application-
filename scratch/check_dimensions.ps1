Add-Type -AssemblyName System.Drawing
$filePath = "C:\Users\vishaal.poobalan\.gemini\antigravity-ide\brain\4ee80f6f-b41b-4643-81a4-8df829a9cb69\.user_uploaded\media_1790579054535.png"
$img = [System.Drawing.Image]::FromFile($filePath)
Write-Host "Width: $($img.Width), Height: $($img.Height)"
$img.Dispose()
