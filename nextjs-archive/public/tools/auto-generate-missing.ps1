# auto-generate-missing.ps1
# Reads data/schemes.js and generates HTML pages for ANY scheme that lacks a page.
# Usage (from website root):  .\tools\auto-generate-missing.ps1
# Usage (from tools folder):  cd ..\; .\tools\auto-generate-missing.ps1
#
# WORKFLOW:
#   1. Add new entries to data/schemes.js
#   2. Run this script
#   3. New pages appear in yojana/
#   No other steps needed for basic page creation.

[CmdletBinding()]
param([switch]$Force)

$ErrorActionPreference = "Stop"
$websiteRoot   = if ($PSScriptRoot) { Split-Path -Parent $PSScriptRoot } else { $PWD.Path }
$yojanaDir     = Join-Path $websiteRoot "yojana"
$schemesJsPath = Join-Path $websiteRoot "data\schemes.js"
$today         = (Get-Date -Format "yyyy-MM-dd")

if (-not (Test-Path $schemesJsPath)) { throw "schemes.js not found at $schemesJsPath" }
New-Item -ItemType Directory -Path $yojanaDir -Force | Out-Null

# Read with UTF-8 to preserve Hindi/Devanagari text
$lines    = [System.IO.File]::ReadAllLines($schemesJsPath, [System.Text.Encoding]::UTF8)
$generated = 0
$skipped   = 0

foreach ($line in $lines) {
    $line = $line.Trim()
    if ($line -notmatch '\bid:') { continue }

    # Parse fields from the one-liner JS object (keys are unquoted: id: "value")
    $id       = if ($line -match '\bid:\s*"([^"]+)"')             { $Matches[1] } else { continue }
    $name     = if ($line -match '\bname:\s*"([^"]+)"')            { $Matches[1] } else { $id }
    $hindi    = if ($line -match '\bhindiName:\s*"([^"]+)"')       { $Matches[1] } else { $name }
    $state    = if ($line -match '\bstate:\s*"([^"]+)"')           { $Matches[1] } else { "India" }
    $cat      = if ($line -match '\bcategory:\s*"([^"]+)"')        { $Matches[1] } else { "Yojana" }
    $catSlug  = if ($line -match '\bcategorySlug:\s*"([^"]+)"')    { $Matches[1] } else { "all-yojana" }
    $summary  = if ($line -match '\bsummary:\s*"([^"]+)"')         { $Matches[1] } else { "" }
    $official = if ($line -match '\bofficialUrl:\s*"([^"]+)"')     { $Matches[1] } else { "https://india.gov.in/" }
    $helpline  = if ($line -match '\bhelpline:\s*"([^"]+)"')     { $Matches[1] } else { "" }
    $stateSlug = if ($line -match '\bstateSlug:\s*"([^"]+)"')    { $Matches[1] } else { "central-schemes" }
    $keywords  = if ($line -match '\bkeywords:\s*"([^"]+)"')     { $Matches[1] } else { "$name $hindi" }

    $targetPath = Join-Path $yojanaDir "$id.html"
    if ((Test-Path $targetPath) -and -not $Force) { $skipped++; continue }

    $catUrl     = "category/$catSlug.html"
    $canonical  = "https://allsarkariyojana.in/yojana/$id.html"
    $helpBlock  = if ($helpline) { "<div class=`"sidebar-card`"><h3>Helpline</h3><p><strong>$helpline</strong></p></div>" } else { "" }

    $out = [System.Collections.Generic.List[string]]::new()
    $out.Add("<!DOCTYPE html>")
    $out.Add("<html lang=`"hi-IN`">")
    $out.Add("<head>")
    $out.Add("  <meta charset=`"UTF-8`" />")
    $out.Add("  <meta name=`"viewport`" content=`"width=device-width, initial-scale=1.0`" />")
    $out.Add("  <title>$name - $hindi | All Sarkari Yojana</title>")
    $out.Add("  <meta name=`"description`" content=`"$hindi - patrata, labh, dastavej aur aavedan prakriya ki poori jaankari. $summary`" />")
    $out.Add("  <meta name=`"keywords`" content=`"$keywords, $hindi, sarkari yojana, $state`" />")
    $out.Add("  <link rel=`"canonical`" href=`"$canonical`" />")
    $out.Add("  <meta property=`"og:type`" content=`"article`" />")
    $out.Add("  <meta property=`"og:title`" content=`"$name - $hindi`" />")
    $out.Add("  <meta property=`"og:description`" content=`"$summary`" />")
    $out.Add("  <meta property=`"og:url`" content=`"$canonical`" />")
    $out.Add("  <meta property=`"og:image`" content=`"https://allsarkariyojana.in/images/app-icon.png`" />")
    $out.Add("  <meta name=`"twitter:card`" content=`"summary_large_image`" />")
    $out.Add("  <meta name=`"twitter:title`" content=`"$name - $hindi`" />")
    $out.Add("  <meta name=`"twitter:description`" content=`"$summary`" />")
    $out.Add("  <meta property=`"og:locale`" content=`"hi_IN`" />")
    $out.Add("  <meta property=`"og:site_name`" content=`"All Sarkari Yojana`" />")
    $out.Add("  <meta name=`"robots`" content=`"index, follow`" />")
    $out.Add("  <link rel=`"icon`" type=`"image/png`" href=`"../images/app-icon.png`" />")
    $out.Add("  <link rel=`"stylesheet`" href=`"../css/style.css`" />")
    $out.Add('  <script type="application/ld+json">')
    $out.Add("  {")
    $out.Add('    "@context": "https://schema.org",')
    $out.Add('    "@type": "GovernmentService",')
    $out.Add("    `"name`": `"$name`",")
    $out.Add("    `"alternateName`": `"$hindi`",")
    $out.Add("    `"description`": `"$summary`",")
    $out.Add("    `"url`": `"$canonical`",")
    $out.Add("    `"provider`": {`"@type`": `"GovernmentOrganization`", `"name`": `"$state`"},")
    $out.Add('    "serviceType": "Government Welfare Scheme",')
    $out.Add('    "areaServed": {"@type": "Country", "name": "India"},')
    $out.Add('    "inLanguage": "hi",')
    $out.Add("    `"dateModified`": `"$today`"")
    $out.Add("  }")
    $out.Add("  </script>")
    $out.Add('  <script type="application/ld+json">')
    $out.Add("  {")
    $out.Add('    "@context": "https://schema.org",')
    $out.Add('    "@type": "BreadcrumbList",')
    $out.Add('    "itemListElement": [')
    $out.Add('      {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://allsarkariyojana.in/"},')
    $out.Add("      {`"@type`": `"ListItem`", `"position`": 2, `"name`": `"$cat`", `"item`": `"https://allsarkariyojana.in/$catUrl`"},")
    $out.Add("      {`"@type`": `"ListItem`", `"position`": 3, `"name`": `"$name`", `"item`": `"$canonical`"}")
    $out.Add("    ]")
    $out.Add("  }")
    $out.Add("  </script>")
    $out.Add('  <script type="application/ld+json">')
    $out.Add("  {")
    $out.Add('    "@context": "https://schema.org",')
    $out.Add('    "@type": "FAQPage",')
    $out.Add('    "mainEntity": [')
    $out.Add("      {`"@type`": `"Question`", `"name`": `"$hindi ke liye kaun patra hai?`", `"acceptedAnswer`": {`"@type`": `"Answer`", `"text`": `"Patrata ki jaankari ke liye $official par jayen.`"}},")
    $out.Add("      {`"@type`": `"Question`", `"name`": `"$hindi ka labh kaise milega?`", `"acceptedAnswer`": {`"@type`": `"Answer`", `"text`": `"$summary`"}},")
    $out.Add("      {`"@type`": `"Question`", `"name`": `"$hindi ka aavedan kahan karen?`", `"acceptedAnswer`": {`"@type`": `"Answer`", `"text`": `"$official par online aavedan karen ya najdiki CSC / sarkari karyalay se sampark karen.`"}}")
    $out.Add("    ]")
    $out.Add("  }")
    $out.Add("  </script>")
    $out.Add("</head>")
    $out.Add("<body>")
    $out.Add("<div class=`"disclaimer-banner`"><div class=`"container`"><p><strong>Disclaimer:</strong> Yeh SKYWAVE ERA TECHNOLOGY ki niji informational website hai. Kisi bhi sarkari vibhag ka official portal nahi hai.</p></div></div>")
    $out.Add("<header class=`"site-header`"><div class=`"container`"><nav class=`"navbar`">")
    $out.Add("  <a href=`"../index.html`" class=`"nav-brand`"><img src=`"../images/app-icon.png`" alt=`"All Sarkari Yojana`" width=`"42`" height=`"42`" /><span>All Sarkari Yojana<span class=`"brand-sub`">Sarkari Yojanaon ki Jaankari</span></span></a>")
    $out.Add("  <ul class=`"nav-links`"><li><a href=`"../index.html`">Home</a></li><li><a href=`"../category/kisan-yojana.html`">Kisan</a></li><li><a href=`"../category/mahila-yojana.html`">Mahila</a></li><li><a href=`"../category/rojgar-yojana.html`">Rojgar</a></li><li><a href=`"../state/index.html`">State</a></li><li><a href=`"../category/all-yojana.html`">Sabhi Yojana</a></li></ul>")
    $out.Add("  <div class=`"nav-cta`"><a href=`"https://play.google.com/store/apps/details?id=com.skywave.allsarkariyojna`" target=`"_blank`" rel=`"noopener`" class=`"btn btn-accent btn-sm`">App</a></div>")
    $out.Add("  <button class=`"hamburger`" aria-label=`"Toggle menu`"><span></span><span></span><span></span></button>")
    $out.Add("</nav></div></header>")
    $out.Add("<div class=`"page-breadcrumb`"><div class=`"container`"><nav class=`"breadcrumb`" aria-label=`"Breadcrumb`"><a href=`"../index.html`">Home</a><span class=`"sep`">&#8250;</span><a href=`"../$catUrl`">$cat</a><span class=`"sep`">&#8250;</span><span>$name</span></nav></div></div>")
    $out.Add("<section class=`"scheme-detail-hero`"><div class=`"container`">")
    $out.Add("  <span class=`"cat-badge`">$cat</span>")
    $out.Add("  <h1>$name</h1>")
    $out.Add("  <p class=`"hindi-name`">$hindi</p>")
    $out.Add("  <p class=`"short-desc`">$summary</p>")
    $out.Add("</div></section>")
    $out.Add("<main id=`"main-content`"><div class=`"container`"><div class=`"scheme-content-wrapper`">")
    $out.Add("  <div class=`"scheme-main-content`">")
    $out.Add("    <div class=`"content-card`"><h2>Yojana ka Uddeshya (Objective)</h2>")
    $out.Add("      <p><strong>$hindi</strong> ($state) ek sarkari yojana hai.</p>")
    $out.Add("      <p>$summary</p>")
    $out.Add("      <div class=`"info-box`"><p>Note: Aavedan aur patrata ke liye <a href=`"$official`" target=`"_blank`" rel=`"noopener`">$official</a> par jayen.</p></div>")
    $out.Add("    </div>")
    $out.Add("    <div class=`"content-card`"><h2>Mukhya Labh (Benefits)</h2>")
    $out.Add("      <ul><li>Patra labhartiyon ko sahayata milti hai.</li><li>$summary</li><li>DBT ke madhyam se seedhe bank khate mein (jahan laagu).</li></ul>")
    $out.Add("    </div>")
    $out.Add("    <div class=`"content-card`"><h2>Patrata (Eligibility)</h2>")
    $out.Add("      <ul><li>Patrata ki jaankari official portal par uplabdh hai.</li><li>Aavedan se pahle eligibility criteria zaroor padhen.</li><li>$state ke niwasi patra ho sakte hain.</li></ul>")
    $out.Add("    </div>")
    $out.Add("    <div class=`"content-card`"><h2>Zaroori Dastavej (Documents)</h2>")
    $out.Add("      <ul><li>Aadhaar Card</li><li>Bank Khata Passbook (Aadhaar-linked)</li><li>Nivas Praman Patra</li><li>Aay Praman Patra (yadi laagu)</li><li>Anya dastavej official website par dekhen.</li></ul>")
    $out.Add("    </div>")
    $out.Add("    <div class=`"content-card`"><h2>Aavedan Kaise Karen (How to Apply)</h2>")
    $out.Add("      <div class=`"steps-list`">")
    $out.Add("        <div class=`"step-item`"><div class=`"step-num`">1</div><div class=`"step-content`"><h3>Official Portal Kholen</h3><p><a href=`"$official`" target=`"_blank`" rel=`"noopener`">$official</a> par jayen.</p></div></div>")
    $out.Add("        <div class=`"step-item`"><div class=`"step-num`">2</div><div class=`"step-content`"><h3>Patrata Jachen</h3><p>Portal par diye eligibility criteria padhen aur janchen ki aap patra hain.</p></div></div>")
    $out.Add("        <div class=`"step-item`"><div class=`"step-num`">3</div><div class=`"step-content`"><h3>Registration / Aavedan Karen</h3><p>Online register karen ya najdiki CSC / sarkari karyalay jayen.</p></div></div>")
    $out.Add("        <div class=`"step-item`"><div class=`"step-num`">4</div><div class=`"step-content`"><h3>Dastavej Upload Karen</h3><p>Aavashyak dastavej upload ya jama karen aur aavedan submit karen.</p></div></div>")
    $out.Add("      </div>")
    $out.Add("    </div>")
    $out.Add("    <div class=`"content-card`"><h2>Samanya Prashna (FAQ)</h2>")
    $out.Add("      <div class=`"faq-list`">")
    $out.Add("        <div class=`"faq-item`"><div class=`"faq-question`" role=`"button`" tabindex=`"0`">$hindi ke liye kaun patra hai? <span class=`"faq-toggle`">+</span></div><div class=`"faq-answer`">Patrata ki jaankari ke liye $official par jayen.</div></div>")
    $out.Add("        <div class=`"faq-item`"><div class=`"faq-question`" role=`"button`" tabindex=`"0`">$hindi ka labh kaise milega? <span class=`"faq-toggle`">+</span></div><div class=`"faq-answer`">$summary</div></div>")
    $out.Add("        <div class=`"faq-item`"><div class=`"faq-question`" role=`"button`" tabindex=`"0`">$hindi ka aavedan kahan karen? <span class=`"faq-toggle`">+</span></div><div class=`"faq-answer`">$official par online aavedan karen ya najdiki CSC / Block Office se sampark karen.</div></div>")
    $out.Add("      </div>")
    $out.Add("    </div>")
    $out.Add("    <div class=`"content-card related-section`">")
    $out.Add("      <h2>&#128279; Sambandhi Yojanaen</h2>")
    $out.Add("      <div id=`"related-schemes`" data-current=`"$id`" data-cat=`"$catSlug`" data-state=`"$stateSlug`"></div>")
    $out.Add("    </div>")
    $out.Add("  </div>")
    $out.Add("  <aside class=`"scheme-sidebar`">")
    $out.Add("    <div class=`"sidebar-card`"><h3>Official Website</h3><a href=`"$official`" target=`"_blank`" rel=`"noopener noreferrer`" class=`"official-link-btn`">Official Portal <span class=`"ext-icon`">&#8599;</span></a></div>")
    if ($helpBlock) { $out.Add("    $helpBlock") }
    $out.Add("    <div class=`"download-app-sidebar`"><h3>App Download Karen</h3><p>Sabhi sarkari yojanaon ki jaankari ek app mein</p><a href=`"https://play.google.com/store/apps/details?id=com.skywave.allsarkariyojna`" target=`"_blank`" rel=`"noopener`" class=`"btn btn-accent btn-sm`" style=`"width:100%;justify-content:center;margin-top:4px;`">Google Play</a></div>")
    $out.Add("  </aside>")
    $out.Add("</div></div></main>")
    $out.Add("<footer class=`"site-footer`"><div class=`"container`"><div class=`"footer-bottom`"><p>&#169; 2024 All Sarkari Yojana | SKYWAVE ERA TECHNOLOGY | <a href=`"../legal/disclaimer.html`">Disclaimer</a></p></div></div></footer>")
    $out.Add("<button id=`"back-to-top`" aria-label=`"Back to top`" style=`"position:fixed;bottom:24px;right:24px;width:44px;height:44px;background:var(--primary);color:white;border:none;border-radius:50%;cursor:pointer;opacity:0;pointer-events:none;transition:opacity .3s;z-index:999;`">&#8593;</button>")
    $out.Add('<script src="../data/schemes.js"></script>')
    $out.Add('<script src="../js/main.js" defer></script>')
    $out.Add("</body>")
    $out.Add("</html>")

    [System.IO.File]::WriteAllLines($targetPath, $out, [System.Text.Encoding]::UTF8)
    Write-Host "  [OK] $id.html" -ForegroundColor Green
    $generated++
}

Write-Host ""
Write-Host "=== auto-generate-missing complete ===" -ForegroundColor Cyan
Write-Host "  Generated : $generated new pages" -ForegroundColor Green
Write-Host "  Skipped   : $skipped existing pages" -ForegroundColor Yellow
Write-Host "  Output    : $yojanaDir" -ForegroundColor White
