$filePath = 'c:\Users\vishaal.poobalan\Downloads\files (7)\preview_app.html'
$content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)
$allLines = $content -split "`r`n|`n"
$startRemove = 5445   # 0-indexed line 5446
$endRemove = 6343     # 0-indexed line 6344

$keep = @()
for ($i = 0; $i -lt $allLines.Length; $i++) {
    if ($i -ge $startRemove -and $i -le $endRemove) { continue }
    $keep += $allLines[$i]
}

[System.IO.File]::WriteAllText($filePath, ($keep -join "`r`n"), [System.Text.Encoding]::UTF8)
Write-Host "Done. Total lines now: $($keep.Length)"
