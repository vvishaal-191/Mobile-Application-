Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\vishaal.poobalan\.gemini\antigravity-ide\brain\11f90936-b854-4e06-929f-7e8137ec51f7\.user_uploaded\media_1790586991251.png"
$src = [System.Drawing.Bitmap]::FromFile($srcPath)

$w = 506
$h = 320 # Clean height for top header

# 1. Start with the clean seamless background (interpolated middle so zero card/text remains)
$bmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        $bmp.SetPixel($x, $y, $src.GetPixel($x, $y))
    }
}

# Seamlessly fill middle from x=150 to x=355 for y=80..320
for ($y = 80; $y -lt $h; $y++) {
    $cL = $src.GetPixel(150, $y)
    $cR = $src.GetPixel(355, $y)
    for ($x = 151; $x -lt 355; $x++) {
        $t = ($x - 150) / (355.0 - 150.0)
        $r = [int]($cL.R * (1 - $t) + $cR.R * $t)
        $g = [int]($cL.G * (1 - $t) + $cR.G * $t)
        $b = [int]($cL.B * (1 - $t) + $cR.B * $t)
        $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $r, $g, $b))
    }
}

# 2. Now use Graphics to draw the card near the top (y=28) and text below it!
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

# Draw soft drop shadow for the card
$cardW = 120
$cardH = 120
$cardX = [int](($w - $cardW) / 2) # 193
$cardY = 28 # Near the top of the page!

$radius = 28

# Helper function to create rounded rect path
function Get-RoundedRectanglePath([float]$x, [float]$y, [float]$width, [float]$height, [float]$radius) {
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $diameter = $radius * 2
    $arc = New-Object System.Drawing.RectangleF($x, $y, $diameter, $diameter)
    
    # Top left
    $path.AddArc($arc, 180, 90)
    # Top right
    $arc.X = $x + $width - $diameter
    $path.AddArc($arc, 270, 90)
    # Bottom right
    $arc.Y = $y + $height - $diameter
    $path.AddArc($arc, 0, 90)
    # Bottom left
    $arc.X = $x
    $path.AddArc($arc, 90, 90)
    $path.CloseFigure()
    return $path
}

# Draw shadow
for ($i = 6; $i -ge 1; $i--) {
    $alpha = [int](15 - $i * 2)
    if ($alpha -gt 0) {
        $shadowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb($alpha, 0, 40, 160))
        $shadowPath = Get-RoundedRectanglePath ($cardX - $i/2) ($cardY + $i*1.5) ($cardW + $i) ($cardH + $i) ($radius + $i/2)
        $g.FillPath($shadowBrush, $shadowPath)
        $shadowPath.Dispose()
        $shadowBrush.Dispose()
    }
}

# Draw pristine white card
$cardPath = Get-RoundedRectanglePath $cardX $cardY $cardW $cardH $radius
$cardBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$g.FillPath($cardBrush, $cardPath)

# Draw subtle inner border for card
$borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(40, 0, 100, 255), 1.2)
$g.DrawPath($borderPen, $cardPath)

# Draw the circuit logo inside the card
# The circuit logo is in emergere-circuit-logo.png (512x512 transparent PNG)
$circuitPath = "c:\Users\vishaal.poobalan\Downloads\files (7)\assets\emergere-circuit-logo.png"
if (Test-Path $circuitPath) {
    $circuitImg = [System.Drawing.Bitmap]::FromFile($circuitPath)
    $logoPad = 22
    $logoDst = New-Object System.Drawing.RectangleF(($cardX + $logoPad), ($cardY + $logoPad), ($cardW - 2*$logoPad), ($cardH - 2*$logoPad))
    $g.DrawImage($circuitImg, $logoDst)
    $circuitImg.Dispose()
}

# Draw "Welcome Back"
$fontFamily = New-Object System.Drawing.FontFamily("Segoe UI")
$fontTitle = New-Object System.Drawing.Font($fontFamily, 24, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$fontSub = New-Object System.Drawing.Font($fontFamily, 14, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)

$strFormat = New-Object System.Drawing.StringFormat
$strFormat.Alignment = [System.Drawing.StringAlignment]::Center
$strFormat.LineAlignment = [System.Drawing.StringAlignment]::Center

# Title shadow & text
$textY = $cardY + $cardH + 18 # 28 + 120 + 18 = 166
$rectTitleShadow = New-Object System.Drawing.RectangleF(0, ($textY + 1), $w, 32)
$shadowTextBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(80, 0, 30, 120))
$g.DrawString("Welcome Back", $fontTitle, $shadowTextBrush, $rectTitleShadow, $strFormat)

$rectTitle = New-Object System.Drawing.RectangleF(0, $textY, $w, 32)
$textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$g.DrawString("Welcome Back", $fontTitle, $textBrush, $rectTitle, $strFormat)

# Subtitle shadow & text
$subY = $textY + 34 # 200
$rectSubShadow = New-Object System.Drawing.RectangleF(0, ($subY + 1), $w, 22)
$g.DrawString("Sign in to continue", $fontSub, $shadowTextBrush, $rectSubShadow, $strFormat)

$rectSub = New-Object System.Drawing.RectangleF(0, $subY, $w, 22)
$subTextBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(240, 255, 255, 255))
$g.DrawString("Sign in to continue", $fontSub, $subTextBrush, $rectSub, $strFormat)

$g.Dispose()

$outTest = "c:\Users\vishaal.poobalan\Downloads\files (7)\scratch\test_top_aligned_header.png"
$bmp.Save($outTest, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "New top-aligned header generated at $outTest"

$bmp.Dispose()
$src.Dispose()
