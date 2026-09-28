const fs = require('fs');

// We can read raw PNG chunks or use a simple script
// Let's use PowerShell with a script file
const psCode = `
Add-Type -AssemblyName System.Drawing
$path = 'C:\\Users\\vishaal.poobalan\\.gemini\\antigravity-ide\\brain\\11f90936-b854-4e06-929f-7e8137ec51f7\\.user_uploaded\\media_1790587697516.png'
$bmp = [System.Drawing.Bitmap]::FromFile($path)
Write-Host "Image 2 dims: $($bmp.Width) x $($bmp.Height)"

$cx = [int]($bmp.Width / 2)
for ($y = 0; $y -lt $bmp.Height; $y += 15) {
    $c = $bmp.GetPixel($cx, $y)
    Write-Host "y=$y R=$($c.R) G=$($c.G) B=$($c.B)"
}
$bmp.Dispose()
`;

fs.writeFileSync('scratch/sample_img2.ps1', psCode);
console.log('Written sample_img2.ps1');
