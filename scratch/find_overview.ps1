$lines = Get-Content 'c:\Users\vishaal.poobalan\Downloads\files (7)\preview_app.html'
$start = 7580
$end = 7700
for ($idx = ($start - 1); $idx -lt $end; $idx++) {
    $ln = $lines[$idx]
    if ($ln -match 'overview|quick-grid|quick-action|Pending|Approved|Rejected|Team Members') {
        $lineNum = $idx + 1
        Write-Host "$lineNum : $($ln.Trim())"
    }
}
