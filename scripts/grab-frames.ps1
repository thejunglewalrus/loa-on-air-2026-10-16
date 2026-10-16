# Grab the on-screen graphics from the 2026-10-16 Lost Ark On Air VOD as still frames.
# Section downloads only (never the whole 2h VOD). 1080p60 HLS stream (format 312) via yt-dlp + ffmpeg.
# Run from the repo root:  powershell -ExecutionPolicy Bypass -File scripts\grab-frames.ps1
# If YouTube demands sign-in, add:  --cookies-from-browser firefox
$ErrorActionPreference = 'Continue'
$yt  = 'C:\Bin\yt-dlp.exe'
$ff  = 'C:\Bin\ffmpeg.exe'
$url = 'https://www.youtube.com/watch?v=wZ0rwJWBLec'
$root = Split-Path -Parent $PSScriptRoot
New-Item -ItemType Directory -Force "$root\clips" | Out-Null
New-Item -ItemType Directory -Force "$root\frames" | Out-Null

# name, window (transcript cue +-15s), sample interval (seconds)
$sections = @(
  @{ name = 'hero';       span = '*00:29:55-00:30:20'; every = 5 },
  @{ name = 'dps';        span = '*00:36:35-00:37:45'; every = 4 },
  @{ name = 'nicedan';    span = '*01:10:05-01:10:50'; every = 4 },
  @{ name = 'gold';       span = '*01:17:45-01:18:45'; every = 4 },
  @{ name = 'population'; span = '*01:24:15-01:24:45'; every = 3 },
  @{ name = 'rasamoa';    span = '*01:29:35-01:31:10'; every = 6 },
  @{ name = 'package';    span = '*01:52:00-01:52:35'; every = 3 }
)

foreach ($s in $sections) {
  $clip = "$root\clips\$($s.name).mp4"
  if (-not (Test-Path $clip)) {
    Write-Host "== downloading $($s.name) $($s.span)"
    & $yt -f 'bv*[height<=1080][ext=mp4]/bv*[height<=1080]' --download-sections $s.span --force-keyframes-at-cuts --no-part -o $clip $url
  } else {
    Write-Host "== $($s.name): clip exists, skipping download"
  }
  if (Test-Path $clip) {
    Write-Host "== extracting frames for $($s.name) every $($s.every)s"
    & $ff -hide_banner -loglevel error -y -i $clip -vf "fps=1/$($s.every)" -q:v 2 "$root\frames\$($s.name)_%02d.jpg"
  } else {
    Write-Host "!! $($s.name): no clip downloaded"
  }
}
Write-Host "== done"
Get-ChildItem "$root\frames" | Select-Object Name, Length | Format-Table -AutoSize
