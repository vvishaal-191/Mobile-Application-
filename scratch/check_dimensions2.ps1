Add-Type -AssemblyName System.Drawing
$filePath1 = "C:\Users\vishaal.poobalan\.gemini\antigravity-ide\brain\4ee80f6f-b41b-4643-81a4-8df829a9cb69\.user_uploaded\media_1790579531813.png"
$filePath2 = "C:\Users\vishaal.poobalan\.gemini\antigravity-ide\brain\4ee80f6f-b41b-4643-81a4-8df829a9cb69\.user_uploaded\media_1790579548355.png"
$img1 = [System.Drawing.Image]::FromFile($filePath1)
$img2 = [System.Drawing.Image]::FromFile($filePath2)
Write-Host "Img1: Width: $($img1.Width), Height: $($img1.Height)"
Write-Host "Img2: Width: $($img2.Width), Height: $($img2.Height)"
$img1.Dispose()
$img2.Dispose()
