Add-Type -AssemblyName System.Drawing

$pFull = "C:\Users\vishaal.poobalan\.gemini\antigravity-ide\brain\11f90936-b854-4e06-929f-7e8137ec51f7\.user_uploaded\media_1790586991251.png"
$pNew = "C:\Users\vishaal.poobalan\.gemini\antigravity-ide\brain\11f90936-b854-4e06-929f-7e8137ec51f7\.user_uploaded\media_1790589361650.png"

$bFull = [System.Drawing.Bitmap]::FromFile($pFull)
$bNew = [System.Drawing.Bitmap]::FromFile($pNew)

# Find where bNew logo card is vs bFull logo card
# In bNew, logo card was at x=111..256, y=88..201
# In bFull, logo card was at x=180..326, y=114..250
# Notice: 180 - 111 = 69, 114 - 88 = 26
# If bNew is an offset crop of bFull: offset (69, 26)
$matchCount = 0
for ($y = 100; $y -lt 150; $y++) {
    for ($x = 120; $x -lt 240; $x++) {
        $cNew = $bNew.GetPixel($x, $y)
        $cFull = $bFull.GetPixel($x + 69, $y + 26)
        if ($cNew.R -eq $cFull.R -and $cNew.G -eq $cFull.G -and $cNew.B -eq $cFull.B) {
            $matchCount++
        }
    }
}
Write-Host "Matches: $matchCount / $((150-100)*(240-120))"

$bFull.Dispose()
$bNew.Dispose()
