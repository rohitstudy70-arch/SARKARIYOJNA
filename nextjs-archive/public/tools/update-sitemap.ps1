$today = "2026-06-20"
$base = "https://allsarkariyojana.in"
$sitemapPath = "d:\abhiAllSarkariYojana\AllSarkariYojana\website\sitemap.xml"

$content = [System.IO.File]::ReadAllText($sitemapPath, [System.Text.Encoding]::UTF8)

$newEntries = ""
$yojanaFiles = Get-ChildItem "d:\abhiAllSarkariYojana\AllSarkariYojana\website\yojana\" -Filter "*.html" | Select-Object -ExpandProperty BaseName

foreach ($f in $yojanaFiles) {
    $pattern = "/yojana/$f.html"
    if ($content -notmatch [regex]::Escape($pattern)) {
        $entry  = "  <url>" + "`n"
        $entry += "    <loc>$base/yojana/$f.html</loc>" + "`n"
        $entry += "    <lastmod>$today</lastmod>" + "`n"
        $entry += "    <changefreq>monthly</changefreq>" + "`n"
        $entry += "    <priority>0.8</priority>" + "`n"
        $entry += "  </url>" + "`n"
        $newEntries += $entry
    }
}

$newStatePages = @("tamil-nadu","andhra-pradesh","telangana","odisha","punjab","uttarakhand","chhattisgarh","assam","himachal-pradesh","kerala")
foreach ($s in $newStatePages) {
    $pattern = "/state/$s.html"
    if ($content -notmatch [regex]::Escape($pattern)) {
        $entry  = "  <url>" + "`n"
        $entry += "    <loc>$base/state/$s.html</loc>" + "`n"
        $entry += "    <lastmod>$today</lastmod>" + "`n"
        $entry += "    <changefreq>monthly</changefreq>" + "`n"
        $entry += "    <priority>0.85</priority>" + "`n"
        $entry += "  </url>" + "`n"
        $newEntries += $entry
    }
}

$closeTag = "</urlset>"
$newContent = $content -replace [regex]::Escape($closeTag), ($newEntries + $closeTag)
[System.IO.File]::WriteAllText($sitemapPath, $newContent, [System.Text.Encoding]::UTF8)

$count = (Select-String -Path $sitemapPath -Pattern "<loc>").Count
Write-Host "Sitemap updated. Total URLs: $count"
