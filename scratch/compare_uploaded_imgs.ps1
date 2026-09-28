Add-Type -AssemblyName System.Drawing

$p1 = "C:\Users\vishaal.poobalan\.gemini\antigravity-ide\brain\11f90936-b854-4e06-929f-7e8137ec51f7\.user_uploaded\media_1790586991251.png"
$p2 = "C:\Users\vishaal.poobalan\.gemini\antigravity-ide\brain\11f90936-b854-4e06-929f-7e8137ec51f7\.user_uploaded\media_1790587697516.png"

$b1 = [System.Drawing.Bitmap]::FromFile($p1)
$b2 = [System.Drawing.Bitmap]::FromFile($p2)

Write-Host "Img 1 (prev prompt): $($b1.Width) x $($b1.Height)"
Write-Host "Img 2 (current prompt): $($b2.Width) x $($b2.Height)"

$b1.Dispose()
$b2.Dispose()
