Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName PresentationCore, PresentationFramework, WindowsBase

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')

function Join-RepoPath {
    param([Parameter(Mandatory = $true)][string] $RelativePath)
    return Join-Path $repoRoot $RelativePath
}

function Ensure-Directory {
    param([Parameter(Mandatory = $true)][string] $Path)
    $directory = Split-Path -Parent $Path
    if (-not (Test-Path $directory)) {
        New-Item -ItemType Directory -Path $directory | Out-Null
    }
}

function Brush {
    param([Parameter(Mandatory = $true)][string] $Color)
    return [System.Windows.Media.BrushConverter]::new().ConvertFromString($Color)
}

function Pen {
    param(
        [Parameter(Mandatory = $true)][string] $Color,
        [Parameter(Mandatory = $true)][double] $Width
    )
    return [System.Windows.Media.Pen]::new((Brush $Color), $Width)
}

function New-LinearBrush {
    param(
        [Parameter(Mandatory = $true)][string[]] $Colors,
        [double] $Angle = 0
    )
    $brush = [System.Windows.Media.LinearGradientBrush]::new()
    $brush.StartPoint = [System.Windows.Point]::new(0, 0)
    $brush.EndPoint = [System.Windows.Point]::new(1, 1)
    $brush.RelativeTransform = [System.Windows.Media.RotateTransform]::new($Angle, 0.5, 0.5)
    for ($i = 0; $i -lt $Colors.Length; $i++) {
        $offset = if ($Colors.Length -eq 1) { 1 } else { $i / ($Colors.Length - 1) }
        $brush.GradientStops.Add([System.Windows.Media.GradientStop]::new((Brush $Colors[$i]).Color, $offset))
    }
    return $brush
}

function Save-VisualPng {
    param(
        [Parameter(Mandatory = $true)][System.Windows.Media.DrawingVisual] $Visual,
        [Parameter(Mandatory = $true)][int] $Width,
        [Parameter(Mandatory = $true)][int] $Height,
        [Parameter(Mandatory = $true)][string] $Path
    )
    Ensure-Directory $Path
    $bitmap = [System.Windows.Media.Imaging.RenderTargetBitmap]::new($Width, $Height, 96, 96, [System.Windows.Media.PixelFormats]::Pbgra32)
    $bitmap.Render($Visual)
    $encoder = [System.Windows.Media.Imaging.PngBitmapEncoder]::new()
    $encoder.Frames.Add([System.Windows.Media.Imaging.BitmapFrame]::Create($bitmap))
    $stream = [System.IO.File]::Create($Path)
    try {
        $encoder.Save($stream)
    }
    finally {
        $stream.Dispose()
    }
}

function Save-VisualJpeg {
    param(
        [Parameter(Mandatory = $true)][System.Windows.Media.DrawingVisual] $Visual,
        [Parameter(Mandatory = $true)][int] $Width,
        [Parameter(Mandatory = $true)][int] $Height,
        [Parameter(Mandatory = $true)][string] $Path,
        [int] $Quality = 92
    )
    Ensure-Directory $Path
    $bitmap = [System.Windows.Media.Imaging.RenderTargetBitmap]::new($Width, $Height, 96, 96, [System.Windows.Media.PixelFormats]::Pbgra32)
    $bitmap.Render($Visual)
    $encoder = [System.Windows.Media.Imaging.JpegBitmapEncoder]::new()
    $encoder.QualityLevel = $Quality
    $encoder.Frames.Add([System.Windows.Media.Imaging.BitmapFrame]::Create($bitmap))
    $stream = [System.IO.File]::Create($Path)
    try {
        $encoder.Save($stream)
    }
    finally {
        $stream.Dispose()
    }
}

$adAPath = [System.Windows.Media.Geometry]::Parse('M237 672 363 404c10-20 24-30 43-30h55l147 298h-88l-28-61H366l-28 61H237Zm159-131h65l-33-72-32 72Z')
$adDPath = [System.Windows.Media.Geometry]::Parse('M539 374h138c91 0 157 61 157 149 0 87-66 149-157 149H492l47-72h133c46 0 77-31 77-77 0-47-31-77-77-77h-87l-46-72Z')

function Draw-AdMark {
    param(
        [Parameter(Mandatory = $true)][System.Windows.Media.DrawingContext] $Context,
        [Parameter(Mandatory = $true)][double] $Scale
    )
    $markBrush = New-LinearBrush @('#0D47FF', '#008BFF', '#00F0FF') -Angle 4
    $nodeBrush = New-LinearBrush @('#00F0FF', '#70F8FF') -Angle -18
    $Context.DrawGeometry($markBrush, $null, $adAPath)
    $Context.DrawGeometry($markBrush, $null, $adDPath)
    $Context.DrawLine((Pen '#00F0FF' (26 * $Scale)), [System.Windows.Point]::new(340, 633), [System.Windows.Point]::new(428, 506))
    $Context.DrawEllipse($nodeBrush, $null, [System.Windows.Point]::new(340, 633), 32, 32)
    $Context.DrawEllipse($nodeBrush, $null, [System.Windows.Point]::new(428, 506), 36, 36)
    $Context.DrawEllipse((Brush '#0D47FF'), $null, [System.Windows.Point]::new(681, 634), 34, 34)
    $Context.DrawEllipse((Brush '#00B2FF'), $null, [System.Windows.Point]::new(681, 634), 17, 17)
}

function New-IconVisual {
    param([Parameter(Mandatory = $true)][int] $Size)
    $visual = [System.Windows.Media.DrawingVisual]::new()
    $context = $visual.RenderOpen()
    $scale = $Size / 1024
    try {
        $context.DrawRectangle((New-LinearBrush @('#0F172A', '#061735', '#020712') -Angle 2), $null, [System.Windows.Rect]::new(0, 0, $Size, $Size))
        $glow = [System.Windows.Media.RadialGradientBrush]::new()
        $glow.Center = [System.Windows.Point]::new(0.68, 0.24)
        $glow.GradientOrigin = [System.Windows.Point]::new(0.68, 0.24)
        $glow.RadiusX = 0.72
        $glow.RadiusY = 0.72
        $glow.GradientStops.Add([System.Windows.Media.GradientStop]::new((Brush '#6600B2FF').Color, 0))
        $glow.GradientStops.Add([System.Windows.Media.GradientStop]::new((Brush '#220D47FF').Color, 0.58))
        $glow.GradientStops.Add([System.Windows.Media.GradientStop]::new((Brush '#00020712').Color, 1))
        $context.DrawRectangle($glow, $null, [System.Windows.Rect]::new(0, 0, $Size, $Size))
        $context.PushTransform([System.Windows.Media.ScaleTransform]::new($scale, $scale))
        Draw-AdMark $context $scale
        $context.Pop()
    }
    finally {
        $context.Close()
    }
    return $visual
}

function New-ForegroundVisual {
    param([Parameter(Mandatory = $true)][int] $Size)
    $visual = [System.Windows.Media.DrawingVisual]::new()
    $context = $visual.RenderOpen()
    $scale = $Size / 1024
    try {
        $context.PushTransform([System.Windows.Media.ScaleTransform]::new($scale, $scale))
        Draw-AdMark $context $scale
        $context.Pop()
    }
    finally {
        $context.Close()
    }
    return $visual
}

function Draw-Text {
    param(
        [Parameter(Mandatory = $true)][System.Windows.Media.DrawingContext] $Context,
        [Parameter(Mandatory = $true)][string] $Text,
        [Parameter(Mandatory = $true)][double] $X,
        [Parameter(Mandatory = $true)][double] $Y,
        [Parameter(Mandatory = $true)][double] $Size,
        [string] $Color = '#FFFFFFFF',
        [System.Windows.FontWeight] $Weight = [System.Windows.FontWeights]::Regular
    )
    $typeface = [System.Windows.Media.Typeface]::new(
        [System.Windows.Media.FontFamily]::new('Segoe UI'),
        [System.Windows.FontStyles]::Normal,
        $Weight,
        [System.Windows.FontStretches]::Normal
    )
    $formatted = [System.Windows.Media.FormattedText]::new(
        $Text,
        [System.Globalization.CultureInfo]::InvariantCulture,
        [System.Windows.FlowDirection]::LeftToRight,
        $typeface,
        $Size,
        (Brush $Color),
        1.0
    )
    $Context.DrawText($formatted, [System.Windows.Point]::new($X, $Y))
}

function New-FeatureGraphicVisual {
    $visual = [System.Windows.Media.DrawingVisual]::new()
    $context = $visual.RenderOpen()
    try {
        $context.DrawRectangle((New-LinearBrush @('#020712', '#061735', '#020712') -Angle 0), $null, [System.Windows.Rect]::new(0, 0, 1024, 500))
        $glow = [System.Windows.Media.RadialGradientBrush]::new()
        $glow.Center = [System.Windows.Point]::new(0.32, 0.42)
        $glow.RadiusX = 0.55
        $glow.RadiusY = 0.82
        $glow.GradientStops.Add([System.Windows.Media.GradientStop]::new((Brush '#5A00B2FF').Color, 0))
        $glow.GradientStops.Add([System.Windows.Media.GradientStop]::new((Brush '#160D47FF').Color, 0.68))
        $glow.GradientStops.Add([System.Windows.Media.GradientStop]::new((Brush '#00020712').Color, 1))
        $context.DrawRectangle($glow, $null, [System.Windows.Rect]::new(0, 0, 1024, 500))

        $context.PushTransform([System.Windows.Media.TranslateTransform]::new(-80, -130))
        $context.PushTransform([System.Windows.Media.ScaleTransform]::new(0.52, 0.52))
        Draw-AdMark $context 0.62
        $context.Pop()
        $context.Pop()

        Draw-Text $context 'Ace Domain' 416 112 72 '#FFFFFFFF' ([System.Windows.FontWeights]::Bold)
        Draw-Text $context 'Meet the World' 420 192 34 '#FF00B2FF' ([System.Windows.FontWeights]::SemiBold)
        Draw-Text $context 'Global chats, communities, discovery,' 422 260 25 '#FFE5EDF8' ([System.Windows.FontWeights]::Regular)
        Draw-Text $context 'and Ace AI in one premium social app.' 422 296 25 '#FFE5EDF8' ([System.Windows.FontWeights]::Regular)

        $context.DrawLine((Pen '#6600B2FF' 2), [System.Windows.Point]::new(414, 350), [System.Windows.Point]::new(910, 350))
        Draw-Text $context 'BLACK-FIRST  |  MOBILE-FIRST  |  SOCIAL-FIRST' 414 374 18 '#BFFFFFFF' ([System.Windows.FontWeights]::SemiBold)
    }
    finally {
        $context.Close()
    }
    return $visual
}

$iosIconPath = Join-RepoPath 'ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png'
$publicIosIconPath = Join-RepoPath 'public/store-assets/ace-domain-ios-icon-1024.png'
$publicPlayIconPath = Join-RepoPath 'public/store-assets/ace-domain-play-icon-512.png'
$publicFeatureGraphicPath = Join-RepoPath 'public/store-assets/ace-domain-feature-graphic-1024x500.jpg'

Save-VisualPng (New-IconVisual 1024) 1024 1024 $iosIconPath
Save-VisualPng (New-IconVisual 1024) 1024 1024 $publicIosIconPath
Save-VisualPng (New-IconVisual 512) 512 512 $publicPlayIconPath
Save-VisualJpeg (New-FeatureGraphicVisual) 1024 500 $publicFeatureGraphicPath

$androidIconSizes = @{
    'android/app/src/main/res/mipmap-mdpi/ic_launcher.png' = 48
    'android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png' = 48
    'android/app/src/main/res/mipmap-hdpi/ic_launcher.png' = 72
    'android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png' = 72
    'android/app/src/main/res/mipmap-xhdpi/ic_launcher.png' = 96
    'android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png' = 96
    'android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png' = 144
    'android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png' = 144
    'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png' = 192
    'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png' = 192
}

$androidForegroundSizes = @{
    'android/app/src/main/res/mipmap-mdpi/ic_launcher_foreground.png' = 108
    'android/app/src/main/res/mipmap-hdpi/ic_launcher_foreground.png' = 162
    'android/app/src/main/res/mipmap-xhdpi/ic_launcher_foreground.png' = 216
    'android/app/src/main/res/mipmap-xxhdpi/ic_launcher_foreground.png' = 324
    'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_foreground.png' = 432
}

foreach ($entry in $androidIconSizes.GetEnumerator()) {
    $path = Join-RepoPath $entry.Key
    Save-VisualPng (New-IconVisual $entry.Value) $entry.Value $entry.Value $path
}

foreach ($entry in $androidForegroundSizes.GetEnumerator()) {
    $path = Join-RepoPath $entry.Key
    Save-VisualPng (New-ForegroundVisual $entry.Value) $entry.Value $entry.Value $path
}

Write-Host 'Ace Domain store and native icon assets generated.'
