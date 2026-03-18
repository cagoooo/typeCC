# 🔑 API Key 安全盤查腳本 (PowerShell 版)
# 用於檢查專案中是否含有硬編碼的 Google API Key (AIzaSy...)

$pattern = "AIzaSy[0-9A-Za-z_-]{33}"
$found = @()
$excludeDirs = @(".git", "node_modules", "dist")

Write-Host "🔍 開始盤查專案文件..." -ForegroundColor Cyan

Get-ChildItem -Recurse -File | Where-Object { 
    $filePath = $_.FullName
    $relPath = Resolve-Path -Path $filePath -Relative
    $skip = $false
    foreach ($dir in $excludeDirs) {
        if ($relPath -like "*\$dir\*" -or $relPath -like ".\$dir\*") { $skip = $true; break }
    }
    $_.Extension -match "\.(html|js|json|md|py|yml)$" -and -not $skip
} | ForEach-Object {
    $content = Get-Content $_.FullName -ErrorAction SilentlyContinue
    if ($content) {
        $matches = [regex]::Matches($content, $pattern)
        foreach ($match in $matches) {
            $lineNum = (Select-String -Path $_.FullName -Pattern ($match.Value -replace '\[','\[' -replace '\]','\]') | Select-Object -First 1).LineNumber
            $found += "$($_.FullName):$($lineNum)"
        }
    }
}

if ($found.Count -gt 0) {
    Write-Host "⚠️  警告：發現疑似洩漏的 API Key！" -ForegroundColor Red
    foreach ($item in $found) {
        Write-Host "  $item" -ForegroundColor Yellow
    }
    exit 1
} else {
    Write-Host "✅ 盤查完成：未發現硬編碼的金鑰。" -ForegroundColor Green
    exit 0
}
