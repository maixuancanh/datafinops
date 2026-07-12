[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)][string]$RawVideo,
    [string]$NarrationAudio,
    [string]$Subtitles = (Join-Path $PSScriptRoot 'narration.srt'),
    [string]$Output = (Join-Path $PSScriptRoot 'artifacts/datafinops-demo.mp4'),
    [int]$MaxDurationSeconds = 270
)

$ErrorActionPreference = 'Stop'
foreach ($command in @('ffmpeg', 'ffprobe')) {
    if (-not (Get-Command $command -ErrorAction SilentlyContinue)) { throw "$command is required on PATH." }
}
if (-not (Test-Path -LiteralPath $RawVideo)) { throw "Raw video not found: $RawVideo" }
if (-not (Test-Path -LiteralPath $Subtitles)) { throw "Subtitle file not found: $Subtitles" }
if ($NarrationAudio -and -not (Test-Path -LiteralPath $NarrationAudio)) { throw "Narration audio not found: $NarrationAudio" }

$outputDirectory = Split-Path $Output -Parent
if ($outputDirectory) { New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null }
$escapedSubtitles = (Resolve-Path -LiteralPath $Subtitles).Path.Replace('\', '/').Replace(':', '\:').Replace("'", "\'")
$videoFilter = "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,fps=30,subtitles='$escapedSubtitles'"
$arguments = @('-y', '-i', (Resolve-Path -LiteralPath $RawVideo).Path)
if ($NarrationAudio) {
    $arguments += @('-i', (Resolve-Path -LiteralPath $NarrationAudio).Path, '-map', '0:v:0', '-map', '1:a:0', '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11')
} else {
    $arguments += @('-map', '0:v:0', '-map', '0:a?')
}
$arguments += @('-vf', $videoFilter, '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-shortest', $Output)
& ffmpeg @arguments
if ($LASTEXITCODE -ne 0) { throw "FFmpeg render failed with exit code $LASTEXITCODE." }

$probe = & ffprobe -v error -select_streams v:0 -show_entries stream=width,height -show_entries format=duration -of json $Output | ConvertFrom-Json
if ($probe.streams[0].width -ne 1920 -or $probe.streams[0].height -ne 1080) {
    throw "Rendered video must be 1920x1080; got $($probe.streams[0].width)x$($probe.streams[0].height)."
}
$duration = [double]$probe.format.duration
if ($duration -gt $MaxDurationSeconds) { throw "Rendered video is $duration seconds; limit is $MaxDurationSeconds." }
Write-Host "Rendered DataFinOps demo: $Output ($([math]::Round($duration, 2)) seconds, 1920x1080)"
