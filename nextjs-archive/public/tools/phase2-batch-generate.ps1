# Phase 2 Batch Generator - 50 New Yojana HTML Pages
# Run from website root: .\tools\phase2-batch-generate.ps1

$ErrorActionPreference = "Stop"
$websiteRoot = if ($PSScriptRoot) { Split-Path -Parent $PSScriptRoot } else { $PWD.Path }
$yojanaDir   = Join-Path $websiteRoot "yojana"
New-Item -ItemType Directory -Path $yojanaDir -Force | Out-Null
$today = (Get-Date -Format "yyyy-MM-dd")

$schemes = @(
  @{ slug="pm-jeevan-jyoti-bima"; name="PM Jeevan Jyoti Bima Yojana"; hindi="PM Jeevan Jyoti Bima Yojana"; state="Central Govt"; cat="Bima Yojana"; catUrl="category/bima-yojana.html"; summary="Rs.436 annual premium pe Rs.2 lakh ka jeevan bima. 18-50 saal ke bank khatadharak patra."; official="https://jansuraksha.gov.in/"; label="Jan Suraksha Portal"; helpline="1800-180-1111" },
  @{ slug="sukanya-samriddhi-yojana"; name="Sukanya Samriddhi Yojana"; hindi="Sukanya Samriddhi Yojana"; state="Central Govt"; cat="Mahila Yojana"; catUrl="category/mahila-yojana.html"; summary="10 saal se kam beti ke naam 8.2% byaj dar wali kar-mukt bachat yojana."; official="https://www.indiapost.gov.in/"; label="India Post Portal"; helpline="" },
  @{ slug="atal-pension-yojana"; name="Atal Pension Yojana"; hindi="Atal Pension Yojana"; state="Central Govt"; cat="Pension Yojana"; catUrl="category/pension-yojana.html"; summary="Asanghit kshetra ke logon ko 60 varsh ke baad Rs.1000 se Rs.5000 masik guaranteed pension."; official="https://npscra.nsdl.co.in/"; label="NPS/APY Portal"; helpline="1800-110-069" },
  @{ slug="beti-bachao-beti-padhao"; name="Beti Bachao Beti Padhao"; hindi="Beti Bachao Beti Padhao Yojana"; state="Central Govt"; cat="Mahila Yojana"; catUrl="category/mahila-yojana.html"; summary="Balika janm protsahan, shiksha aur ling anupat sudhar ke liye rashtriya abhiyan."; official="https://wcd.nic.in/"; label="WCD Ministry Portal"; helpline="" },
  @{ slug="national-scholarship-portal"; name="National Scholarship Portal NSP"; hindi="Rashtriya Chhatravrirti Portal"; state="Central Govt"; cat="Shiksha Yojana"; catUrl="category/shiksha-yojana.html"; summary="Kendra sarkar ki sabhi scholarships ek portal par. Pre-matric, Post-matric, Merit-cum-Means."; official="https://scholarships.gov.in/"; label="NSP Scholarships Portal"; helpline="0120-6619540" },
  @{ slug="pm-svanidhi"; name="PM SVANidhi Yojana"; hindi="PM SVANidhi Yojana"; state="Central Govt"; cat="Rojgar Yojana"; catUrl="category/rojgar-yojana.html"; summary="Rehdi-patri street vendors ko Rs.10000 se Rs.50000 tak micro-loan."; official="https://pmsvanidhi.mohua.gov.in/"; label="PM SVANidhi Portal"; helpline="1800-11-1979" },
  @{ slug="pm-garib-kalyan-anna-yojana"; name="PM Garib Kalyan Anna Yojana"; hindi="PM Garib Kalyan Anna Yojana"; state="Central Govt"; cat="All Yojana"; catUrl="category/all-yojana.html"; summary="NFSA labhartiyon ko 5 kg anaj pratimas muft. 80 crore se adhik labhari."; official="https://dfpd.gov.in/"; label="DFPD Portal"; helpline="" },
  @{ slug="stand-up-india"; name="Stand Up India Scheme"; hindi="Stand Up India Yojana"; state="Central Govt"; cat="Rojgar Yojana"; catUrl="category/rojgar-yojana.html"; summary="SC/ST aur mahila udyamiyon ko Rs.10 lakh se Rs.1 crore tak bank se vyapar rin."; official="https://www.standupmitra.in/"; label="Stand Up Mitra Portal"; helpline="" },
  @{ slug="pm-poshan"; name="PM POSHAN Shakti Nirman"; hindi="PM POSHAN Shakti Nirman Mid-Day Meal"; state="Central Govt"; cat="Shiksha Yojana"; catUrl="category/shiksha-yojana.html"; summary="Sarkari school mein class 1-8 ke bacchon ko muft paka bhojan. Poshan star sudhar."; official="https://pmposhan.education.gov.in/"; label="PM POSHAN Portal"; helpline="" },
  @{ slug="jal-jeevan-mission"; name="Jal Jeevan Mission Har Ghar Jal"; hindi="Jal Jeevan Mission Har Ghar Nal Jal"; state="Central Govt"; cat="All Yojana"; catUrl="category/all-yojana.html"; summary="2024 tak gramin har ghar ko nal se shuddh peyjal connection dene ka rashtriya mission."; official="https://jaljeevanmission.gov.in/"; label="Jal Jeevan Mission Portal"; helpline="1800-180-5678" },
  @{ slug="up-mukhyamantri-swarojgar"; name="UP Mukhyamantri Yuva Swarojgar Yojana"; hindi="UP Mukhyamantri Yuva Swarojgar Yojana"; state="Uttar Pradesh"; cat="Rojgar Yojana"; catUrl="category/rojgar-yojana.html"; summary="UP yuvaon ko swarojgar ke liye Rs.25 lakh tak rin aur 25 percent margin money subsidy."; official="https://diupmsme.upsdc.gov.in/"; label="DIUPMSME UP Portal"; helpline="" },
  @{ slug="up-free-tablet-smartphone"; name="UP Free Tablet Smartphone Yojana"; hindi="UP Free Tablet Smartphone Yojana"; state="Uttar Pradesh"; cat="Shiksha Yojana"; catUrl="category/shiksha-yojana.html"; summary="UP ke graduation, polytechnic, ITI, class 10-12 chhatron ko muft tablet/smartphone."; official="https://digishakti.up.gov.in/"; label="DigiShakti UP Portal"; helpline="" },
  @{ slug="up-krishak-durghatna"; name="UP Krishak Durghatna Kalyan Yojana"; hindi="UP Krishak Durghatna Kalyan Yojana"; state="Uttar Pradesh"; cat="Kisan Yojana"; catUrl="category/kisan-yojana.html"; summary="UP kisan ki durghatna mein mrityu ya vikalangta par Rs.5 lakh tak muavza."; official="https://up.gov.in/"; label="UP Govt Portal"; helpline="" },
  @{ slug="up-parivarik-labh"; name="UP Rashtriya Parivarik Labh Yojana"; hindi="UP Rashtriya Parivarik Labh Yojana"; state="Uttar Pradesh"; cat="UP Yojana"; catUrl="category/up-yojana.html"; summary="BPL parivar ke mukhiya ki mrityu par Rs.30000 ekmusht aarthik sahayata."; official="https://nfbs.upsdc.gov.in/"; label="NFBS UP Portal"; helpline="" },
  @{ slug="up-mukhyamantri-abhyudaya"; name="UP Mukhyamantri Abhyudaya Yojana"; hindi="UP Mukhyamantri Abhyudaya Yojana"; state="Uttar Pradesh"; cat="Shiksha Yojana"; catUrl="category/shiksha-yojana.html"; summary="IAS/PCS/NEET/JEE aspirants ko UP sarkar se nihshulk coaching aur study material."; official="https://abhyuday.up.gov.in/"; label="Abhyudaya UP Portal"; helpline="" },
  @{ slug="up-nirashrit-mahila-pension"; name="UP Nirashrit Mahila Pension Yojana"; hindi="UP Nirashrit Mahila Pension Yojana"; state="Uttar Pradesh"; cat="Pension Yojana"; catUrl="category/pension-yojana.html"; summary="Vidhwa nirashrit mahilaon ko Rs.500 masik pension seedhe bank khate mein."; official="https://sspy-up.gov.in/"; label="SSPY UP Pension Portal"; helpline="" },
  @{ slug="mp-ladli-laxmi"; name="MP Ladli Laxmi Yojana"; hindi="MP Ladli Laxmi Yojana"; state="Madhya Pradesh"; cat="Mahila Yojana"; catUrl="category/mahila-yojana.html"; summary="MP balikon ko janm se ucch shiksha tak kul Rs.143000 ki charanabaddh sahayata."; official="https://ladlilaxmi.mp.gov.in/"; label="Ladli Laxmi MP Portal"; helpline="" },
  @{ slug="mp-kisan-kalyan"; name="MP Mukhyamantri Kisan Kalyan Yojana"; hindi="MP Mukhyamantri Kisan Kalyan Yojana"; state="Madhya Pradesh"; cat="Kisan Yojana"; catUrl="category/kisan-yojana.html"; summary="PM Kisan ke saath MP sarkar kisanon ko atirikt Rs.4000 varshik DBT sahayata deti hai."; official="https://saara.mp.gov.in/"; label="SAARA MP Portal"; helpline="" },
  @{ slug="mp-sambal"; name="MP Mukhyamantri Jan Kalyan Sambal Yojana"; hindi="MP Sambal Yojana"; state="Madhya Pradesh"; cat="Rojgar Yojana"; catUrl="category/rojgar-yojana.html"; summary="Asanghit shramikon ko prasuti, durghatna, shiksha aur anteyshti sahayata."; official="https://sambal.mp.gov.in/"; label="Sambal MP Portal"; helpline="" },
  @{ slug="mp-sikho-kamao"; name="MP Mukhyamantri Sikho Kamao Yojana"; hindi="MP Sikho Kamao Yojana"; state="Madhya Pradesh"; cat="Rojgar Yojana"; catUrl="category/rojgar-yojana.html"; summary="MP yuvaon ko on-job training ke saath Rs.8000-10000 masik stipend. 1 lakh seats."; official="https://mmsky.mp.gov.in/"; label="MMSKY MP Portal"; helpline="" },
  @{ slug="mp-mukhyamantri-awas"; name="MP Mukhyamantri Awas Yojana"; hindi="MP Mukhyamantri Awas Yojana"; state="Madhya Pradesh"; cat="Awas Yojana"; catUrl="category/awas-yojana.html"; summary="PMAY se vanchit garib parivaaron ko MP sarkar se pukka makan sahayata."; official="https://pmayg.nic.in/"; label="PMAY Gramin Portal"; helpline="" },
  @{ slug="rajasthan-chiranjeevi"; name="Rajasthan Chiranjeevi Swasthya Bima Yojana"; hindi="Rajasthan Chiranjeevi Swasthya Bima Yojana"; state="Rajasthan"; cat="Swasthya Yojana"; catUrl="category/swasthya-yojana.html"; summary="Rajasthan parivaaron ko sarkari-private aspatalon mein Rs.25 lakh tak cashless ilaaj."; official="https://chiranjeevi.rajasthan.gov.in/"; label="Chiranjeevi Portal Rajasthan"; helpline="18001806127" },
  @{ slug="rajasthan-free-mobile"; name="Indira Gandhi Free Smartphone Yojana Rajasthan"; hindi="Indira Gandhi Free Smartphone Yojana Rajasthan"; state="Rajasthan"; cat="Mahila Yojana"; catUrl="category/mahila-yojana.html"; summary="Rajasthan ki mahila mukhiyaon aur college chhatraon ko muft smartphone va 3 varsh internet."; official="https://igsy.rajasthan.gov.in/"; label="IGSY Rajasthan Portal"; helpline="" },
  @{ slug="rajasthan-palanhar"; name="Rajasthan Palanhar Yojana"; hindi="Rajasthan Palanhar Yojana"; state="Rajasthan"; cat="Mahila Yojana"; catUrl="category/mahila-yojana.html"; summary="Anath, viklang maa ki santan, parityakta bacchon ko Rs.500-1500 masik paalan-poshan sahayata."; official="https://sje.rajasthan.gov.in/"; label="SJE Rajasthan Portal"; helpline="" },
  @{ slug="rajasthan-tarbandi"; name="Rajasthan Tarbandi Yojana"; hindi="Rajasthan Tarbandi Yojana"; state="Rajasthan"; cat="Kisan Yojana"; catUrl="category/kisan-yojana.html"; summary="Kisanon ko khet ki tarbandi fencing ke liye 50 percent subsidy. Adhiktam 400 meter."; official="https://rajkisan.rajasthan.gov.in/"; label="Raj Kisan Portal"; helpline="" },
  @{ slug="rajasthan-jan-aadhaar"; name="Rajasthan Jan Aadhaar Card Yojana"; hindi="Rajasthan Jan Aadhaar Card"; state="Rajasthan"; cat="All Yojana"; catUrl="category/all-yojana.html"; summary="Rajasthan parivar pehchan ID - DBT labh, swasthya bima, chhatravrirti sab ek card se."; official="https://janaadhaar.rajasthan.gov.in/"; label="Jan Aadhaar Portal"; helpline="" },
  @{ slug="bihar-kanya-utthan"; name="Bihar Mukhyamantri Kanya Utthan Yojana"; hindi="Bihar Mukhyamantri Kanya Utthan Yojana"; state="Bihar"; cat="Mahila Yojana"; catUrl="category/mahila-yojana.html"; summary="Bihar ki balikon ko janm se snatak tak charanabaddh kul Rs.50000 tak sahayata."; official="https://medhasoft.bih.nic.in/"; label="Medhasoft Bihar Portal"; helpline="" },
  @{ slug="bihar-student-credit-card"; name="Bihar Student Credit Card Yojana"; hindi="Bihar Student Credit Card Yojana"; state="Bihar"; cat="Shiksha Yojana"; catUrl="category/shiksha-yojana.html"; summary="12th pass Bihar chhatron ko ucch shiksha ke liye Rs.4 lakh 0 percent byaj par shiksha rin."; official="https://www.7nishchay-yuvaupmission.bihar.gov.in/"; label="7 Nishchay Bihar Portal"; helpline="1800-3456-444" },
  @{ slug="bihar-har-ghar-bijli"; name="Bihar Har Ghar Bijli Yojana"; hindi="Bihar Har Ghar Bijli Yojana"; state="Bihar"; cat="All Yojana"; catUrl="category/all-yojana.html"; summary="Bihar ke har gramin aur shahari ghar ko bijli connection dene ki sarkari yojana."; official="https://hargharbijli.bsphcl.co.in/"; label="Har Ghar Bijli Bihar"; helpline="" },
  @{ slug="bihar-udyami-yojana"; name="Bihar Mukhyamantri Udyami Yojana"; hindi="Bihar Mukhyamantri Udyami Yojana"; state="Bihar"; cat="Rojgar Yojana"; catUrl="category/rojgar-yojana.html"; summary="SC/ST/OBC/Mahila/yuva udyamiyon ko Rs.10 lakh - 50 percent anudan + 50 percent byaj-mukt rin."; official="https://udyami.bihar.gov.in/"; label="Udyami Bihar Portal"; helpline="" },
  @{ slug="bihar-vridha-pension"; name="Bihar Mukhyamantri Vridhjan Pension Yojana"; hindi="Bihar Mukhyamantri Vridhjan Pension Yojana"; state="Bihar"; cat="Pension Yojana"; catUrl="category/pension-yojana.html"; summary="Bihar ke 60+ varsh ke vriddhon ko Rs.400-500 masik pension seedhe bank khate mein."; official="https://sspmis.bihar.gov.in/"; label="SSPMIS Bihar Portal"; helpline="" },
  @{ slug="maharashtra-lek-ladki"; name="Maharashtra Lek Ladki Yojana"; hindi="Maharashtra Lek Ladki Yojana"; state="Maharashtra"; cat="Mahila Yojana"; catUrl="category/mahila-yojana.html"; summary="Maharashtra mein janmi balikon ko janm se 18 varsh tak kul Rs.101000 charanabaddh sahayata."; official="https://womenchild.maharashtra.gov.in/"; label="WCD Maharashtra Portal"; helpline="" },
  @{ slug="maharashtra-mjpjay"; name="Mahatma Jyotirao Phule Jan Arogya Yojana"; hindi="Mahatma Jyotirao Phule Jan Arogya Yojana"; state="Maharashtra"; cat="Swasthya Yojana"; catUrl="category/swasthya-yojana.html"; summary="Maharashtra ke patra parivaaron ko Rs.5 lakh tak cashless health insurance."; official="https://jeevandayee.gov.in/"; label="Jeevandayee MH Portal"; helpline="155388" },
  @{ slug="maharashtra-ladki-bahin"; name="Maharashtra Mukhyamantri Ladki Bahin Yojana"; hindi="Maharashtra Mukhyamantri Ladki Bahin Yojana"; state="Maharashtra"; cat="Mahila Yojana"; catUrl="category/mahila-yojana.html"; summary="21-65 varsh ki patra mahilaon ko Rs.1500 masik aarthik sahayata seedhe bank khate mein."; official="https://ladakibahin.maharashtra.gov.in/"; label="Ladki Bahin MH Portal"; helpline="" },
  @{ slug="maharashtra-mahadbt"; name="Maharashtra MahaDBT Scholarship Portal"; hindi="Maharashtra MahaDBT Chhatravrirti Portal"; state="Maharashtra"; cat="Shiksha Yojana"; catUrl="category/shiksha-yojana.html"; summary="Maharashtra SC/ST/OBC/SBC/EBC/VJNT chhatron ki sabhi scholarships ka ekl portal."; official="https://mahadbt.maharashtra.gov.in/"; label="MahaDBT Portal"; helpline="" },
  @{ slug="maharashtra-namo-shetkari"; name="Maharashtra Namo Shetkari Maha Samman Nidhi"; hindi="Namo Shetkari Maha Samman Nidhi Yojana"; state="Maharashtra"; cat="Kisan Yojana"; catUrl="category/kisan-yojana.html"; summary="PM Kisan ke saath Maharashtra kisanon ko atirikt Rs.6000 varshik sahayata rajya sarkar se."; official="https://krishi.maharashtra.gov.in/"; label="Krishi Maharashtra Portal"; helpline="" },
  @{ slug="haryana-parivar-pehchan"; name="Haryana Parivar Pehchan Patra PPP"; hindi="Haryana Parivar Pehchan Patra PPP"; state="Haryana"; cat="All Yojana"; catUrl="category/all-yojana.html"; summary="Haryana ke sabhi parivaaron ki 8-digit unique family ID - sabhi sarkari labh automatic."; official="https://meraparivar.haryana.gov.in/"; label="Mera Parivar Haryana"; helpline="1800-2000-023" },
  @{ slug="haryana-parivar-samman-nidhi"; name="Haryana Mukhyamantri Parivar Samridhi Yojana"; hindi="Haryana Mukhyamantri Parivar Samridhi Yojana"; state="Haryana"; cat="Vittiya Yojana"; catUrl="category/vittiya-yojana.html"; summary="6 acre tak zameen wale kisan aur chhote vyapaariyon ko Rs.6000 varshik DBT sahayata."; official="https://cm-psy.haryana.gov.in/"; label="CM-PSY Haryana Portal"; helpline="" },
  @{ slug="haryana-saksham-yuva"; name="Haryana Saksham Yuva Yojana"; hindi="Haryana Saksham Yuva Yojana"; state="Haryana"; cat="Rojgar Yojana"; catUrl="category/rojgar-yojana.html"; summary="Haryana ke shikshit berozgar yuvaon ko maandey aur part-time sarkari karya ke avsar."; official="https://hreyahs.gov.in/"; label="Saksham Yuva HR Portal"; helpline="" },
  @{ slug="haryana-kanyadan"; name="Haryana Mukhyamantri Vivah Shagun Yojana"; hindi="Haryana Mukhyamantri Vivah Shagun Yojana"; state="Haryana"; cat="Mahila Yojana"; catUrl="category/mahila-yojana.html"; summary="SC/ST/OBC/BPL parivar ki beti ki shaadi par Rs.51000 tak vivah anudan shagun."; official="https://haryanascbc.gov.in/"; label="Haryana SCBC Portal"; helpline="" },
  @{ slug="gujarat-ma-amrutum"; name="Gujarat Mukhyamantri Amrutum MA Yojana"; hindi="Gujarat Mukhyamantri Amrutum Yojana"; state="Gujarat"; cat="Swasthya Yojana"; catUrl="category/swasthya-yojana.html"; summary="Gujarat ke BPL aur madhyam varg parivaaron ko Rs.5 lakh tak cashless chikitsa suvidha."; official="https://magujarat.com/"; label="MA Yojana Gujarat Portal"; helpline="" },
  @{ slug="gujarat-vahli-dikri"; name="Gujarat Vahli Dikri Yojana"; hindi="Gujarat Vahli Dikri Yojana"; state="Gujarat"; cat="Mahila Yojana"; catUrl="category/mahila-yojana.html"; summary="Gujarat ki balikon ko janm se vivah ya 18 varsh tak kul Rs.110000 ki charanabaddh sahayata."; official="https://wcd.gujarat.gov.in/"; label="WCD Gujarat Portal"; helpline="" },
  @{ slug="gujarat-ikhedut"; name="Gujarat iKhedut Portal Farmer Schemes"; hindi="Gujarat iKhedut Portal"; state="Gujarat"; cat="Kisan Yojana"; catUrl="category/kisan-yojana.html"; summary="Gujarat ke kisanon ki sabhi krishi yojanaon, subsidy aur aavedan ka ekl sarkari portal."; official="https://ikhedut.gujarat.gov.in/"; label="iKhedut Gujarat Portal"; helpline="" },
  @{ slug="wb-lakshmir-bhandar"; name="West Bengal Lakshmir Bhandar Scheme"; hindi="WB Lakshmir Bhandar Scheme"; state="West Bengal"; cat="Mahila Yojana"; catUrl="category/mahila-yojana.html"; summary="Paschim Bengal ki SC/ST mahilaon ko Rs.1000 aur samanya varg ko Rs.500 masik sahayata."; official="https://socialsecurity.wb.gov.in/"; label="WB Social Security Portal"; helpline="" },
  @{ slug="wb-kanyashree"; name="West Bengal Kanyashree Prakalpa"; hindi="WB Kanyashree Prakalpa"; state="West Bengal"; cat="Mahila Yojana"; catUrl="category/mahila-yojana.html"; summary="13-18 varsh ki chhatraon ko varshik Rs.1000 aur 18 varsh par Rs.25000 ekmushta protsahan."; official="https://wbkanyashree.gov.in/"; label="Kanyashree WB Portal"; helpline="" },
  @{ slug="wb-swasthya-sathi"; name="West Bengal Swasthya Sathi Yojana"; hindi="WB Swasthya Sathi Yojana"; state="West Bengal"; cat="Swasthya Yojana"; catUrl="category/swasthya-yojana.html"; summary="Paschim Bengal ke pratyek parivar ko Rs.5 lakh tak cashless health coverage."; official="https://swasthyasathi.gov.in/"; label="Swasthya Sathi WB Portal"; helpline="" },
  @{ slug="jharkhand-abua-awas"; name="Jharkhand Abua Awas Yojana"; hindi="Jharkhand Abua Awas Yojana"; state="Jharkhand"; cat="Awas Yojana"; catUrl="category/awas-yojana.html"; summary="PMAY se vanchit Jharkhand ke avaasghin garib parivaaron ko 3 kamron ka pukka makan."; official="https://aay.jharkhand.gov.in/"; label="Abua Awas Jharkhand"; helpline="" },
  @{ slug="jharkhand-savitribai-kishori"; name="Jharkhand Savitribai Phule Kishori Samridhi Yojana"; hindi="Jharkhand Savitribai Kishori Samridhi Yojana"; state="Jharkhand"; cat="Mahila Yojana"; catUrl="category/mahila-yojana.html"; summary="Jharkhand ki class 8-12 ki balikon ko Rs.2500-5000 varshik shiksha protsahan rashi."; official="https://jharkhand.gov.in/"; label="Jharkhand Govt Portal"; helpline="" },
  @{ slug="karnataka-gruha-jyoti"; name="Karnataka Gruha Jyoti Scheme"; hindi="Karnataka Gruha Jyoti Scheme"; state="Karnataka"; cat="All Yojana"; catUrl="category/all-yojana.html"; summary="Karnataka ke har ghar ko pratimas 200 unit tak bijli bilkul muft."; official="https://gruha.karnataka.gov.in/"; label="Gruha Jyoti Karnataka"; helpline="" },
  @{ slug="karnataka-anna-bhagya"; name="Karnataka Anna Bhagya Scheme"; hindi="Karnataka Anna Bhagya Scheme"; state="Karnataka"; cat="All Yojana"; catUrl="category/all-yojana.html"; summary="Karnataka ke BPL ration cardholders ko prati vyakti pratimas atirikt muft chawal."; official="https://ahara.kar.nic.in/"; label="Ahara Karnataka Portal"; helpline="" }
)

function New-YojanaPage {
  param($s)
  $targetPath = Join-Path $yojanaDir "$($s.slug).html"
  if (Test-Path $targetPath) {
    Write-Host "  [SKIP] $($s.slug).html" -ForegroundColor Yellow
    return
  }

  $helplineBlock = if ($s.helpline) { "<div class='sidebar-card'><h3>Helpline</h3><p>$($s.helpline)</p></div>" } else { "" }

  $lines = [System.Collections.Generic.List[string]]::new()
  $lines.Add("<!DOCTYPE html>")
  $lines.Add("<html lang=`"hi-IN`">")
  $lines.Add("<head>")
  $lines.Add("  <meta charset=`"UTF-8`" />")
  $lines.Add("  <meta name=`"viewport`" content=`"width=device-width, initial-scale=1.0`" />")
  $lines.Add("  <title>$($s.name) - $($s.hindi) | All Sarkari Yojana</title>")
  $lines.Add("  <meta name=`"description`" content=`"$($s.hindi) ki poori jaankari Hindi mein. Patrata, labh, dastavej, aavedan prakriya. $($s.summary)`" />")
  $lines.Add("  <meta name=`"keywords`" content=`"$($s.name), $($s.hindi), sarkari yojana, government scheme`" />")
  $lines.Add("  <link rel=`"canonical`" href=`"https://allsarkariyojana.in/yojana/$($s.slug).html`" />")
  $lines.Add("  <meta property=`"og:type`" content=`"article`" />")
  $lines.Add("  <meta property=`"og:title`" content=`"$($s.name) - Poori Jaankari`" />")
  $lines.Add("  <meta property=`"og:description`" content=`"$($s.summary)`" />")
  $lines.Add("  <meta property=`"og:url`" content=`"https://allsarkariyojana.in/yojana/$($s.slug).html`" />")
  $lines.Add("  <meta property=`"og:image`" content=`"https://allsarkariyojana.in/images/app-icon.png`" />")
  $lines.Add("  <meta name=`"twitter:card`" content=`"summary_large_image`" />")
  $lines.Add("  <link rel=`"icon`" type=`"image/png`" href=`"../images/app-icon.png`" />")
  $lines.Add("  <link rel=`"stylesheet`" href=`"../css/style.css`" />")
  $lines.Add("  <script type=`"application/ld+json`">")
  $lines.Add("  {")
  $lines.Add('    "@context": "https://schema.org",')
  $lines.Add('    "@type": "Article",')
  $lines.Add("    `"headline`": `"$($s.name)`",")
  $lines.Add("    `"description`": `"$($s.summary)`",")
  $lines.Add('    "author": {"@type": "Organization", "name": "SKYWAVE ERA TECHNOLOGY"},')
  $lines.Add('    "publisher": {"@type": "Organization", "name": "All Sarkari Yojana"},')
  $lines.Add("    `"datePublished`": `"$today`",")
  $lines.Add("    `"dateModified`": `"$today`"")
  $lines.Add("  }")
  $lines.Add("  </script>")
  $lines.Add("</head>")
  $lines.Add("<body>")
  $lines.Add("<div class=`"disclaimer-banner`"><div class=`"container`"><p>Disclaimer: Yeh SKYWAVE ERA TECHNOLOGY ki niji informational website hai. Yeh $($s.state) ka official portal nahi hai.</p></div></div>")
  $lines.Add("<header class=`"site-header`"><div class=`"container`"><nav class=`"navbar`">")
  $lines.Add("  <a href=`"../index.html`" class=`"nav-brand`"><img src=`"../images/app-icon.png`" alt=`"All Sarkari Yojana`" width=`"42`" height=`"42`" /><span>All Sarkari Yojana<span class=`"brand-sub`">Sarkari Yojanaon ki Jaankari</span></span></a>")
  $lines.Add("  <ul class=`"nav-links`"><li><a href=`"../index.html`">Home</a></li><li><a href=`"../category/kisan-yojana.html`">Kisan</a></li><li><a href=`"../category/mahila-yojana.html`">Mahila</a></li><li><a href=`"../category/rojgar-yojana.html`">Rojgar</a></li><li><a href=`"../state/index.html`">State</a></li><li><a href=`"../category/all-yojana.html`">Sabhi Yojana</a></li></ul>")
  $lines.Add("  <div class=`"nav-cta`"><a href=`"https://play.google.com/store/apps/details?id=com.skywave.allsarkariyojna`" target=`"_blank`" rel=`"noopener`" class=`"btn btn-accent btn-sm`">App</a></div>")
  $lines.Add("  <button class=`"hamburger`" aria-label=`"Toggle menu`"><span></span><span></span><span></span></button>")
  $lines.Add("</nav></div></header>")
  $lines.Add("<div class=`"page-breadcrumb`"><div class=`"container`"><nav class=`"breadcrumb`" aria-label=`"Breadcrumb`"><a href=`"../index.html`">Home</a><span class=`"sep`">›</span><a href=`"../$($s.catUrl)`">$($s.cat)</a><span class=`"sep`">›</span><span>$($s.name)</span></nav></div></div>")
  $lines.Add("<section class=`"scheme-detail-hero`"><div class=`"container`"><span class=`"cat-badge`">$($s.cat)</span><h1>$($s.name)</h1><p class=`"hindi-name`">$($s.hindi)</p><p class=`"short-desc`">$($s.summary)</p></div></section>")
  $lines.Add("<main id=`"main-content`"><div class=`"container`"><div class=`"scheme-content-wrapper`">")
  $lines.Add("  <div class=`"scheme-main-content`">")
  $lines.Add("    <div class=`"content-card`"><h2>Yojana ka Uddeshya (Objective)</h2><p>$($s.hindi) ($($s.state)) ek sarkari yojana hai. $($s.summary)</p><div class=`"info-box`"><p>Note: Aavedan ke liye <a href=`"$($s.official)`" target=`"_blank`" rel=`"noopener`">$($s.official)</a> par jayen.</p></div></div>")
  $lines.Add("    <div class=`"content-card`"><h2>Mukhya Labh (Benefits)</h2><ul><li>Patra labhartiyon ko sahayata milti hai.</li><li>Vistrit labh ke liye official website dekhen.</li><li>DBT ke madhyam se seedhe bank khate mein (jahan laagu).</li></ul></div>")
  $lines.Add("    <div class=`"content-card`"><h2>Patrata (Eligibility)</h2><ul><li>Patrata ki jaankari official portal par uplabdh hai.</li><li>Aavedan se pahle eligibility criteria zaroor padhen.</li></ul></div>")
  $lines.Add("    <div class=`"content-card`"><h2>Zaroori Dastavej (Documents)</h2><ul><li>Aadhaar Card</li><li>Bank Khata Passbook (Aadhaar-linked)</li><li>Aay Praman Patra (yadi laagu)</li><li>Ration Card ya Nivas Praman</li><li>Anya dastavej official website par dekhen</li></ul></div>")
  $lines.Add("    <div class=`"content-card`"><h2>Aavedan Kaise Karen (How to Apply)</h2><div class=`"steps-list`"><div class=`"step-item`"><div class=`"step-num`">1</div><div class=`"step-content`"><h3>Official Portal Kholen</h3><p><a href=`"$($s.official)`" target=`"_blank`" rel=`"noopener`">$($s.official)</a> par jayen.</p></div></div><div class=`"step-item`"><div class=`"step-num`">2</div><div class=`"step-content`"><h3>Patrata Jachen</h3><p>Portal par eligibility criteria padhen.</p></div></div><div class=`"step-item`"><div class=`"step-num`">3</div><div class=`"step-content`"><h3>Registration Karen</h3><p>Online register karen ya CSC jayen.</p></div></div><div class=`"step-item`"><div class=`"step-num`">4</div><div class=`"step-content`"><h3>Dastavej Jama Karen</h3><p>Dastavej upload kar aavedan submit karen.</p></div></div></div></div>")
  $lines.Add("    <div class=`"content-card`"><h2>Samanya Prashna (FAQ)</h2><div class=`"faq-list`"><div class=`"faq-item`"><div class=`"faq-question`" role=`"button`" tabindex=`"0`">$($s.hindi) ke liye kaun patra hai? <span class=`"faq-toggle`">+</span></div><div class=`"faq-answer`">Patrata ke liye $($s.official) par jayen.</div></div><div class=`"faq-item`"><div class=`"faq-question`" role=`"button`" tabindex=`"0`">$($s.hindi) ka labh kaise milega? <span class=`"faq-toggle`">+</span></div><div class=`"faq-answer`">$($s.summary)</div></div></div></div>")
  $lines.Add("  </div>")
  $lines.Add("  <aside class=`"scheme-sidebar`">")
  $lines.Add("    <div class=`"sidebar-card`"><h3>Official Website</h3><a href=`"$($s.official)`" target=`"_blank`" rel=`"noopener noreferrer`" class=`"official-link-btn`">$($s.label) <span class=`"ext-icon`">-&gt;</span></a></div>")
  if ($helplineBlock) { $lines.Add("    $helplineBlock") }
  $lines.Add("    <div class=`"download-app-sidebar`"><h3>App Download Karen</h3><p>Sabhi sarkari yojanaon ki jaankari ek app mein</p><a href=`"https://play.google.com/store/apps/details?id=com.skywave.allsarkariyojna`" target=`"_blank`" rel=`"noopener`" class=`"btn btn-accent btn-sm`" style=`"width:100%;justify-content:center;margin-top:4px;`">Google Play</a></div>")
  $lines.Add("  </aside>")
  $lines.Add("</div></div></main>")
  $lines.Add("<footer class=`"site-footer`"><div class=`"container`"><div class=`"footer-bottom`"><p>All Sarkari Yojana | SKYWAVE ERA TECHNOLOGY | <a href=`"../legal/disclaimer.html`">Disclaimer</a></p></div></div></footer>")
  $lines.Add("<button id=`"back-to-top`" aria-label=`"Back to top`" style=`"position:fixed;bottom:24px;right:24px;width:44px;height:44px;background:var(--primary);color:white;border:none;border-radius:50%;cursor:pointer;opacity:0;pointer-events:none;transition:opacity .3s;z-index:999;`">^</button>")
  $lines.Add("<script src=`"../js/main.js`" defer></script>")
  $lines.Add("</body>")
  $lines.Add("</html>")

  [System.IO.File]::WriteAllLines($targetPath, $lines, [System.Text.Encoding]::UTF8)
  Write-Host "  [OK] $($s.slug).html" -ForegroundColor Green
}

Write-Host "`n=== PHASE 2 BATCH GENERATOR ===" -ForegroundColor Cyan
Write-Host "Output: $yojanaDir`n"

$count = 0
foreach ($s in $schemes) {
  New-YojanaPage $s
  $count++
}

$newFiles = Get-ChildItem $yojanaDir -Filter "*.html" | Where-Object { $_.LastWriteTime -gt (Get-Date).AddMinutes(-5) }
Write-Host "`n=== DONE: $count entries processed, $($newFiles.Count) new files created ===" -ForegroundColor Cyan
