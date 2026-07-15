param(
  [Parameter(Mandatory = $true)][string]$Slug,
  [Parameter(Mandatory = $true)][string]$Name,
  [Parameter(Mandatory = $true)][string]$HindiName,
  [Parameter(Mandatory = $true)][string]$CategoryName,
  [Parameter(Mandatory = $true)][string]$CategoryUrl,
  [Parameter(Mandatory = $true)][string]$Summary,
  [Parameter(Mandatory = $true)][string]$OfficialUrl,
  [string]$OfficialLabel = "Official Portal"
)

$ErrorActionPreference = "Stop"

$websiteRoot = Split-Path -Parent $PSScriptRoot
$targetDir = Join-Path $websiteRoot "yojana"
$targetPath = Join-Path $targetDir "$Slug.html"

if (Test-Path $targetPath) {
  throw "Page already exists: $targetPath"
}

$title = "$Name - $HindiName | All Sarkari Yojana"
$metaDescription = "$HindiName की पूरी जानकारी हिंदी में। पात्रता, लाभ, दस्तावेज, आवेदन प्रक्रिया और official website link देखें।"

$html = @"
<!DOCTYPE html>
<html lang="hi-IN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>$title</title>
  <meta name="description" content="$metaDescription" />
  <link rel="canonical" href="https://allsarkariyojana.in/yojana/$Slug.html" />
  <link rel="icon" type="image/png" href="../images/app-icon.png" />
  <link rel="stylesheet" href="../css/style.css" />
</head>
<body>
<div class="disclaimer-banner"><div class="container"><p>⚠️ यह SKYWAVE ERA TECHNOLOGY की निजी वेबसाइट है। किसी सरकारी विभाग का official portal नहीं।</p></div></div>
<header class="site-header"><div class="container"><nav class="navbar">
  <a href="../index.html" class="nav-brand"><img src="../images/app-icon.png" alt="Logo" width="42" height="42" /><span>All Sarkari Yojana<span class="brand-sub">सरकारी योजनाओं की जानकारी</span></span></a>
  <ul class="nav-links"><li><a href="../index.html">होम</a></li><li><a href="../category/all-yojana.html">सभी योजनाएं</a></li><li><a href="../search.html">खोजें</a></li><li><a href="../state/index.html">राज्य</a></li></ul>
  <button class="hamburger" aria-label="Toggle menu"><span></span><span></span><span></span></button>
</nav></div></header>
<div class="page-breadcrumb"><div class="container"><nav class="breadcrumb"><a href="../index.html">होम</a><span class="sep">›</span><a href="$CategoryUrl">$CategoryName</a><span class="sep">›</span><span>$Name</span></nav></div></div>
<section class="scheme-detail-hero"><div class="container"><span class="cat-badge">$CategoryName</span><h1>$Name</h1><p class="hindi-name">$HindiName</p><p class="short-desc">$Summary</p></div></section>
<main id="main-content"><div class="container"><div class="scheme-content-wrapper"><div class="scheme-main-content">
  <div class="content-card"><h2>📌 योजना की जानकारी</h2><p>यहां योजना का उद्देश्य और सरल परिचय लिखें। जानकारी official source से verify करें।</p><div class="info-box"><p>📢 यह जानकारी सूचनात्मक है। आवेदन और पात्रता के लिए official website पर जाएं।</p></div></div>
  <div class="content-card"><h2>✅ मुख्य लाभ</h2><ul><li>लाभ 1 लिखें</li><li>लाभ 2 लिखें</li><li>लाभ 3 लिखें</li></ul></div>
  <div class="content-card"><h2>👤 पात्रता</h2><ul><li>पात्रता 1 लिखें</li><li>पात्रता 2 लिखें</li></ul></div>
  <div class="content-card"><h2>📄 जरूरी दस्तावेज</h2><ul><li>आधार कार्ड</li><li>बैंक खाता</li><li>अन्य documents official source के अनुसार लिखें</li></ul></div>
  <div class="content-card"><h2>📝 आवेदन कैसे करें</h2><div class="steps-list"><div class="step-item"><div class="step-num">1</div><div class="step-content"><h3>Official website खोलें</h3><p><a href="$OfficialUrl" target="_blank" rel="noopener">$OfficialUrl</a> पर जाएं।</p></div></div><div class="step-item"><div class="step-num">2</div><div class="step-content"><h3>Form/registration देखें</h3><p>Official portal पर दिए गए निर्देशों के अनुसार आवेदन करें।</p></div></div></div></div>
  <div class="content-card"><h2>❓ सामान्य प्रश्न</h2><div class="faq-list"><div class="faq-item"><div class="faq-question" role="button" tabindex="0">$HindiName के लिए आवेदन कहां करें? <span class="faq-toggle">+</span></div><div class="faq-answer">Official website पर आवेदन/पात्रता जानकारी देखें।</div></div></div></div>
</div><aside class="scheme-sidebar"><div class="sidebar-card"><h3>🌐 आधिकारिक वेबसाइट</h3><a href="$OfficialUrl" target="_blank" rel="noopener noreferrer" class="official-link-btn">$OfficialLabel <span class="ext-icon">↗</span></a></div><div class="download-app-sidebar"><h3>📱 ऐप डाउनलोड करें</h3><p>सभी योजनाओं की जानकारी एक ऐप में</p><a href="https://play.google.com/store/apps/details?id=com.skywave.allsarkariyojna" target="_blank" rel="noopener" class="btn btn-accent btn-sm" style="width:100%;justify-content:center;margin-top:4px;">Google Play</a></div></aside></div></div></main>
<footer class="site-footer"><div class="container"><div class="footer-bottom"><p>© 2024 All Sarkari Yojana | SKYWAVE ERA TECHNOLOGY</p></div></div></footer>
<button id="back-to-top" aria-label="Back to top" style="position:fixed;bottom:24px;right:24px;width:44px;height:44px;background:var(--primary);color:white;border:none;border-radius:50%;cursor:pointer;opacity:0;pointer-events:none;transition:opacity .3s;z-index:999;">↑</button>
<script src="../js/main.js" defer></script>
</body>
</html>
"@

New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
Set-Content -Path $targetPath -Value $html -Encoding UTF8
Write-Host "Created $targetPath"
Write-Host "Next: add this scheme to website/data/schemes.js and website/sitemap.xml."
