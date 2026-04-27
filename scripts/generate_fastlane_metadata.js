const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const out = path.join(root, 'fastlane');
const privacyUrl = 'https://www.termsfeed.com/live/b68be62d-c73b-4b00-b34d-3d002cacaac4';
const supportUrl = 'https://t.me/Chepman32';
const appStoreName = 'Video Color Editor - Grado';

const apiKeyId = 'STDG5D3U5A';
const issuerId = '5c3aee75-98b2-489d-b18e-c273d41d1e02';
const appIdentifier = 'com.grado.app';
const appleId = 'popadoga47@icloud.com';

const locales = {
  'ar-SA': {
    subtitle: 'ألوان سينمائية للفيديو',
    promo: 'حوّل لقطاتك إلى فيديوهات سينمائية بسرعة. اختر فلترًا، اضبط القوة، ونظّم مشاريعك وصدّر النتيجة إلى الصور.',
    description: `Grado يحوّل مقاطعك اليومية إلى فيديوهات ذات لون سينمائي بدون تعقيد برامج المونتاج الكبيرة.

استورد فيديو من الصور، جرّب الدرجات اللونية مباشرة، وعدّل القوة حتى تحصل على الإحساس المناسب. صُمم Grado لصناع المحتوى، المسافرين، أصحاب الريلز، وأي شخص يريد فيديو أجمل بسرعة.

لماذا Grado؟
• 12 مظهرًا لونيًا: Cinematic وVintage وNoir وSunset وEmerald وLavender وBleach وArctic وNeon وSketch وVHS وOriginal
• معاينة فيديو سلسة قبل التصدير
• شريط ألوان للتبديل السريع بين الفلاتر
• تحكم دقيق بقوة الفلتر من لمسة واحدة
• خط زمني للانتقال إلى أي لحظة في الفيديو
• مشاريع محفوظة لمتابعة العمل لاحقًا
• مجلدات، تكرار، إعادة تسمية وسلة مهملات لتنظيم أعمالك
• صور معاينة تلقائية أو غلاف مخصص للمشروع
• تصدير عالي الجودة إلى الصور
• اختيار MP4 للتوافق أو HEVC/MOV لكفاءة أعلى
• يعمل على الجهاز لمعالجة الفيديو دون سير عمل معقد

استخدم Grado لرفع مستوى فيديوهات السفر، الطعام، اللياقة، الأزياء، السيارات، اليوميات، القصص، واللقطات القصيرة. بدلًا من تعديل عشرات الإعدادات، ابدأ من مظهر جاهز ثم اضبط شدته ليبدو الفيديو طبيعيًا أو جريئًا كما تريد.

افتح فيديو، اختر اللون، صدّر. هذه هي طريقة Grado السريعة لصناعة فيديو يبدو جاهزًا للنشر.`,
    keywords: 'فيديو,فلتر,ألوان,تلوين,سينمائي,مونتاج,ريلز,تيك توك,انستغرام,تحرير',
    release: 'إطلاق Grado الأول لتحسين ألوان الفيديو وتصديره.'
  },
  cs: {
    subtitle: 'Filmové barvy pro video',
    promo: 'Dodej videím filmový vzhled během chvilky. Vyber filtr, nastav intenzitu, organizuj projekty a exportuj do Fotek.',
    description: `Grado promění běžná videa ve filmově laděné záběry bez složitých editorů.

Vyber video z Fotek, prohlížej barevné styly v reálném čase a dolaď intenzitu přesně podle nálady. Grado je pro tvůrce reels, cestovatele, vlogery i každého, kdo chce rychle lepší barvy.

Co získáš:
• 12 barevných stylů: Cinematic, Vintage, Noir, Sunset, Emerald, Lavender, Bleach, Arctic, Neon, Sketch, VHS a Original
• plynulý náhled videa před exportem
• rychlý pás filtrů s barevnými vzorky
• přesné nastavení intenzity jedním posuvníkem
• časovou osu pro skok na libovolný moment
• uložené projekty pro pozdější úpravy
• složky, duplikace, přejmenování a koš pro pořádek
• automatické náhledy projektu nebo vlastní obálku
• kvalitní export přímo do Fotek
• volbu MP4 pro kompatibilitu nebo HEVC/MOV pro efektivnější soubor
• zpracování na zařízení bez zbytečného pracovního postupu

Grado se hodí pro cestování, jídlo, fitness, módu, auta, denní vlogy, stories i krátká sociální videa. Začni hotovým barevným stylem a pak ho jemně přizpůsob, aby výsledek vypadal přirozeně nebo výrazně.

Otevři video, vyber barvu, exportuj. Tak rychle Grado pomáhá vytvořit video připravené ke sdílení.`,
    keywords: 'video,filtr,barvy,grading,film,reels,tiktok,instagram,upravy,editor',
    release: 'První vydání Grado pro barevné úpravy a export videa.'
  },
  da: {
    subtitle: 'Filmfarver til video',
    promo: 'Giv dine videoer et filmisk look på få øjeblikke. Vælg filter, juster styrke, organiser projekter og gem i Fotos.',
    description: `Grado giver dine hverdagsvideoer et filmisk farvelook uden tunge redigeringsværktøjer.

Importer en video fra Fotos, se farvestilarter live, og juster intensiteten, indtil stemningen passer. Grado er lavet til creators, rejser, reels, korte klip og alle, der vil have bedre video hurtigt.

Funktioner:
• 12 kuraterede looks: Cinematic, Vintage, Noir, Sunset, Emerald, Lavender, Bleach, Arctic, Neon, Sketch, VHS og Original
• glat videoforhåndsvisning før eksport
• hurtigt filterbånd med farveprøver
• præcis intensitetskontrol
• tidslinje til at hoppe til den rigtige scene
• gemte projekter, så du kan fortsætte senere
• mapper, duplikering, omdøbning og papirkurv
• automatiske projektcovers eller dit eget coverbillede
• eksport i høj kvalitet til Fotos
• MP4 for bred kompatibilitet eller HEVC/MOV for mere effektiv video
• behandling på enheden med en enkel arbejdsgang

Brug Grado til rejser, mad, fitness, mode, biler, hverdagsklip, stories og korte sociale videoer. Start med et færdigt look, og finjuster styrken, så resultatet bliver naturligt, dramatisk eller stiliseret.

Åbn en video, vælg farven, eksportér. Grado gør det hurtigt at få et klip, der føles klar til deling.`,
    keywords: 'video,filter,farver,grading,film,reels,tiktok,instagram,redigering,editor',
    release: 'Første version af Grado til videofarver og eksport.'
  },
  'de-DE': {
    subtitle: 'Filmfarben für Videos',
    promo: 'Gib deinen Videos schnell einen cineastischen Look. Filter wählen, Stärke anpassen, Projekte ordnen und in Fotos exportieren.',
    description: `Grado verwandelt Alltagsvideos in cineastische Clips, ohne dass du ein schweres Schnittprogramm öffnen musst.

Importiere ein Video aus Fotos, sieh die Farblooks direkt in der Vorschau und passe die Intensität an, bis die Stimmung stimmt. Grado ist für Creator, Reels, Reisen, Vlogs und kurze Social-Videos gemacht.

Das kann Grado:
• 12 kuratierte Looks: Cinematic, Vintage, Noir, Sunset, Emerald, Lavender, Bleach, Arctic, Neon, Sketch, VHS und Original
• flüssige Videovorschau vor dem Export
• schnelles Filterband mit Farbfeldern
• präziser Intensitätsregler
• Timeline zum Springen an jede Stelle
• gespeicherte Projekte zum späteren Weiterarbeiten
• Ordner, Duplizieren, Umbenennen und Papierkorb
• automatische Projektvorschaubilder oder eigenes Cover
• hochwertiger Export direkt in Fotos
• MP4 für Kompatibilität oder HEVC/MOV für effizientere Dateien
• Verarbeitung auf dem Gerät mit einfachem Workflow

Nutze Grado für Reisevideos, Food-Clips, Fitness, Mode, Autos, Alltag, Stories und kurze Posts. Starte mit einem fertigen Farblook und dosiere ihn so, dass das Ergebnis natürlich, dramatisch oder bewusst stilisiert wirkt.

Video öffnen, Farbe wählen, exportieren. Grado macht Farbgrading schnell, klar und bereit zum Teilen.`,
    keywords: 'video,filter,farben,grading,film,reels,tiktok,instagram,bearbeiten,editor',
    release: 'Erste Version von Grado für Video-Farblooks und Export.'
  },
  el: {
    subtitle: 'Κινηματογραφικά χρώματα',
    promo: 'Δώσε στα βίντεό σου κινηματογραφικό look γρήγορα. Διάλεξε φίλτρο, ρύθμισε ένταση, οργάνωσε projects και εξήγαγε.',
    description: `Το Grado μετατρέπει καθημερινά βίντεο σε πιο κινηματογραφικά clips χωρίς περίπλοκο editor.

Εισάγεις βίντεο από τις Φωτογραφίες, βλέπεις τα χρωματικά looks άμεσα και ρυθμίζεις την ένταση μέχρι να πετύχεις τη σωστή αίσθηση. Είναι φτιαγμένο για creators, reels, ταξίδια, vlogs και σύντομα social videos.

Τι προσφέρει:
• 12 επιμελημένα looks: Cinematic, Vintage, Noir, Sunset, Emerald, Lavender, Bleach, Arctic, Neon, Sketch, VHS και Original
• ομαλή προεπισκόπηση πριν την εξαγωγή
• γρήγορη κορδέλα φίλτρων με δείγματα χρώματος
• ακριβής έλεγχος έντασης
• timeline για άλμα σε οποιαδήποτε στιγμή
• αποθηκευμένα projects για συνέχεια αργότερα
• φάκελοι, αντιγραφή, μετονομασία και κάδος
• αυτόματες προεπισκοπήσεις ή δικό σου cover
• εξαγωγή υψηλής ποιότητας στις Φωτογραφίες
• MP4 για συμβατότητα ή HEVC/MOV για αποδοτικότερα αρχεία
• επεξεργασία στη συσκευή με απλή ροή

Χρησιμοποίησε το Grado για ταξίδια, φαγητό, fitness, μόδα, αυτοκίνητα, καθημερινές στιγμές, stories και μικρά clips. Ξεκίνα από έτοιμο look και κάν' το όσο φυσικό ή έντονο θέλεις.

Άνοιξε βίντεο, διάλεξε χρώμα, εξήγαγε. Το Grado κάνει το color grading γρήγορο και έτοιμο για κοινοποίηση.`,
    keywords: 'βίντεο,φίλτρο,χρώμα,grading,ταινία,reels,tiktok,instagram,editor',
    release: 'Πρώτη έκδοση του Grado για χρώμα και εξαγωγή βίντεο.'
  },
  'en-GB': {
    subtitle: 'Cinematic video colours',
    promo: 'Give videos a cinematic colour grade fast. Pick a look, tune intensity, organise projects and export polished clips to Photos.',
    description: `Grado turns everyday clips into cinematic videos without the weight of a full editing suite.

Import a video from Photos, preview colour grades as you watch, and fine-tune intensity until the mood feels right. Grado is built for creators, reels, travel edits, vlog moments and short videos that need stronger visual style fast.

What you can do with Grado:
• Choose from 12 curated looks: Cinematic, Vintage, Noir, Sunset, Emerald, Lavender, Bleach, Arctic, Neon, Sketch, VHS and Original
• Preview filters directly on your video before export
• Swipe through a colour ribbon made for quick visual selection
• Adjust filter intensity with precise control
• Scrub the timeline to inspect any moment
• Save projects and continue edits later
• Organise work with folders, duplicate projects, rename items and recover from Trash
• Generate project thumbnails or pick a custom preview image
• Export finished videos to Photos in high quality
• Choose MP4 for compatibility or HEVC/MOV for efficient output
• Work on-device with a simple offline colour workflow

Use Grado for travel, food, fitness, fashion, cars, daily clips, stories, reels and social posts. Instead of tuning dozens of technical controls, start from a strong colour direction and make it softer or bolder with one slider.

Open a video. Choose the colour. Export the result. Grado gives your clips a cleaner, more intentional look in minutes.`,
    keywords: 'video,filter,colour,grading,cinematic,reels,tiktok,instagram,edit,editor',
    release: 'Initial Grado release for video colour grading and export.'
  },
  'en-US': {
    subtitle: 'Cinematic video colors',
    promo: 'Give videos a cinematic color grade fast. Pick a look, tune intensity, organize projects and export polished clips to Photos.',
    description: `Grado turns everyday clips into cinematic videos without the weight of a full editing suite.

Import a video from Photos, preview color grades as you watch, and fine-tune intensity until the mood feels right. Grado is built for creators, reels, travel edits, vlog moments and short videos that need stronger visual style fast.

What you can do with Grado:
• Choose from 12 curated looks: Cinematic, Vintage, Noir, Sunset, Emerald, Lavender, Bleach, Arctic, Neon, Sketch, VHS and Original
• Preview filters directly on your video before export
• Swipe through a color ribbon made for quick visual selection
• Adjust filter intensity with precise control
• Scrub the timeline to inspect any moment
• Save projects and continue edits later
• Organize work with folders, duplicate projects, rename items and recover from Trash
• Generate project thumbnails or pick a custom preview image
• Export finished videos to Photos in high quality
• Choose MP4 for compatibility or HEVC/MOV for efficient output
• Work on-device with a simple offline color workflow

Use Grado for travel, food, fitness, fashion, cars, daily clips, stories, reels and social posts. Instead of tuning dozens of technical controls, start from a strong color direction and make it softer or bolder with one slider.

Open a video. Choose the color. Export the result. Grado gives your clips a cleaner, more intentional look in minutes.`,
    keywords: 'video,filter,color,grading,cinematic,reels,tiktok,instagram,edit,editor',
    release: 'Initial Grado release for video color grading and export.'
  },
  'es-MX': {
    subtitle: 'Color cine para videos',
    promo: 'Dale a tus videos un color cinematográfico rápido. Elige un filtro, ajusta intensidad, organiza proyectos y exporta.',
    description: `Grado convierte tus clips diarios en videos con color cinematográfico sin usar un editor complicado.

Importa un video desde Fotos, previsualiza los estilos de color mientras lo reproduces y ajusta la intensidad hasta lograr el ambiente correcto. Grado está pensado para creadores, reels, viajes, vlogs y videos cortos con más estilo.

Con Grado puedes:
• elegir entre 12 looks: Cinematic, Vintage, Noir, Sunset, Emerald, Lavender, Bleach, Arctic, Neon, Sketch, VHS y Original
• ver los filtros directamente sobre tu video antes de exportar
• cambiar rápido con una cinta visual de colores
• ajustar la intensidad con precisión
• recorrer la línea de tiempo para revisar cualquier momento
• guardar proyectos y continuar después
• organizar con carpetas, duplicar, renombrar y recuperar desde la papelera
• generar miniaturas o elegir una portada personalizada
• exportar videos en alta calidad a Fotos
• usar MP4 para compatibilidad o HEVC/MOV para archivos más eficientes
• trabajar en el dispositivo con un flujo de color simple

Usa Grado para viajes, comida, fitness, moda, autos, clips diarios, stories, reels y publicaciones sociales. Empieza con una dirección de color fuerte y hazla más suave o más intensa con un solo control.

Abre un video. Elige el color. Exporta el resultado. Grado hace que tus clips se vean más intencionales en minutos.`,
    keywords: 'video,filtro,color,grading,cine,reels,tiktok,instagram,editar,editor',
    release: 'Primera versión de Grado para color y exportación de video.'
  },
  fi: {
    subtitle: 'Elokuvavärit videoihin',
    promo: 'Anna videoille elokuvamainen värilook nopeasti. Valitse suodatin, säädä tehoa, järjestä projektit ja vie Kuvat-sovellukseen.',
    description: `Grado muuttaa arjen videot elokuvamaisemmiksi ilman raskasta editointiohjelmaa.

Tuo video Kuvat-sovelluksesta, esikatsele värityylejä suoraan videolla ja säädä voimakkuus sopivaksi. Grado on tehty sisällöntuottajille, reelseihin, matkavideoihin, vlogeihin ja lyhyisiin someklippeihin.

Ominaisuudet:
• 12 valittua lookia: Cinematic, Vintage, Noir, Sunset, Emerald, Lavender, Bleach, Arctic, Neon, Sketch, VHS ja Original
• sujuva videon esikatselu ennen vientiä
• nopea värinauha suodattimien valintaan
• tarkka intensiteetin säätö
• aikajana minkä tahansa kohdan tarkistamiseen
• tallennetut projektit myöhempää jatkamista varten
• kansiot, kopiointi, nimeäminen ja roskakori
• automaattiset projektikuvat tai oma kansikuva
• laadukas vienti Kuvat-sovellukseen
• MP4 yhteensopivuuteen tai HEVC/MOV tehokkaampaan tiedostoon
• laitteella toimiva yksinkertainen värityönkulku

Käytä Gradoa matkoihin, ruokaan, treeniin, muotiin, autoihin, arkeen, storyihin ja lyhyisiin somevideoihin. Aloita vahvasta värisuunnasta ja tee siitä yhdellä säätimellä luonnollinen tai rohkea.

Avaa video, valitse väri ja vie valmis klippi. Grado tekee videoista viimeistellympiä nopeasti.`,
    keywords: 'video,suodatin,väri,grading,elokuva,reels,tiktok,instagram,editointi',
    release: 'Grado julkaistaan videoiden väritykseen ja vientiin.'
  },
  'fr-FR': {
    subtitle: 'Couleurs cinéma vidéo',
    promo: 'Donne vite un rendu cinéma à tes vidéos. Choisis un filtre, règle l’intensité, organise tes projets et exporte vers Photos.',
    description: `Grado transforme tes clips du quotidien en vidéos au rendu cinéma, sans la lourdeur d’un logiciel de montage complet.

Importe une vidéo depuis Photos, prévisualise les étalonnages en direct et ajuste l’intensité jusqu’à obtenir l’ambiance voulue. Grado est conçu pour les créateurs, reels, voyages, vlogs et vidéos courtes qui doivent gagner en style.

Avec Grado, tu peux :
• choisir parmi 12 looks : Cinematic, Vintage, Noir, Sunset, Emerald, Lavender, Bleach, Arctic, Neon, Sketch, VHS et Original
• prévisualiser les filtres directement sur la vidéo
• parcourir un ruban de couleurs rapide
• régler précisément l’intensité du filtre
• utiliser la timeline pour inspecter chaque moment
• enregistrer des projets et les reprendre plus tard
• organiser avec dossiers, duplication, renommage et corbeille
• générer des aperçus ou choisir une image de couverture
• exporter en haute qualité vers Photos
• choisir MP4 pour la compatibilité ou HEVC/MOV pour un fichier plus efficace
• travailler sur l’appareil avec un flux couleur simple

Utilise Grado pour voyages, cuisine, fitness, mode, voitures, clips quotidiens, stories, reels et posts sociaux. Pars d’une direction couleur forte, puis rends-la plus douce ou plus marquée avec un seul curseur.

Ouvre une vidéo. Choisis la couleur. Exporte. Grado donne à tes clips un look plus net et plus intentionnel en quelques minutes.`,
    keywords: 'video,filtre,couleur,etalonnage,cinema,reels,tiktok,instagram,montage',
    release: 'Première version de Grado pour étalonner et exporter des vidéos.'
  },
  he: {
    subtitle: 'צבע קולנועי לווידאו',
    promo: 'תנו לווידאו מראה קולנועי במהירות. בחרו פילטר, כוונו עוצמה, ארגנו פרויקטים וייצאו לתמונות.',
    description: `Grado הופכת סרטונים יומיומיים לקליפים עם צבע קולנועי, בלי עורך וידאו כבד ומסובך.

ייבאו וידאו מתמונות, צפו בסגנונות הצבע בזמן אמת וכוונו את העוצמה עד שהאווירה מרגישה נכון. Grado מתאימה ליוצרי תוכן, reels, נסיעות, ולוגים וסרטונים קצרים לרשתות.

מה אפשר לעשות:
• לבחור מתוך 12 מראות: Cinematic, Vintage, Noir, Sunset, Emerald, Lavender, Bleach, Arctic, Neon, Sketch, VHS ו-Original
• לראות את הפילטר ישירות על הווידאו לפני הייצוא
• לעבור מהר בין פילטרים ברצועת צבעים
• לכוון עוצמה בדיוק
• לגרור על ציר הזמן ולבדוק כל רגע
• לשמור פרויקטים ולהמשיך אחר כך
• לארגן בתיקיות, לשכפל, לשנות שם ולשחזר מהאשפה
• ליצור תמונות תצוגה או לבחור קאבר מותאם
• לייצא באיכות גבוהה לתמונות
• לבחור MP4 לתאימות או HEVC/MOV לקובץ יעיל יותר
• לעבוד על המכשיר בתהליך צבע פשוט

השתמשו ב-Grado לנסיעות, אוכל, כושר, אופנה, רכבים, רגעים יומיומיים, stories וקליפים קצרים. מתחילים ממראה צבע חזק ומעדנים או מחזקים אותו עם סליידר אחד.

פותחים וידאו, בוחרים צבע, מייצאים. Grado נותנת לקליפים מראה נקי ומכוון יותר בתוך דקות.`,
    keywords: 'וידאו,פילטר,צבע,עריכה,קולנועי,reels,tiktok,instagram,editor',
    release: 'גרסה ראשונה של Grado לצבע וייצוא וידאו.'
  },
  hi: {
    subtitle: 'वीडियो के लिए फिल्मी रंग',
    promo: 'अपने वीडियो को जल्दी सिनेमैटिक लुक दें। फिल्टर चुनें, इंटेंसिटी सेट करें, प्रोजेक्ट व्यवस्थित करें और Photos में एक्सपोर्ट करें।',
    description: `Grado रोज़मर्रा के वीडियो को सिनेमैटिक रंग देता है, बिना भारी एडिटिंग ऐप की जटिलता के।

Photos से वीडियो इम्पोर्ट करें, रंगों की लाइव प्रीव्यू देखें और इंटेंसिटी को तब तक एडजस्ट करें जब तक मूड सही न लगे। Grado creators, reels, travel edits, vlogs और short social videos के लिए बनाया गया है।

Grado में आप कर सकते हैं:
• 12 curated looks चुनें: Cinematic, Vintage, Noir, Sunset, Emerald, Lavender, Bleach, Arctic, Neon, Sketch, VHS और Original
• एक्सपोर्ट से पहले अपने वीडियो पर फिल्टर प्रीव्यू करें
• कलर रिबन से तेजी से फिल्टर बदलें
• एक स्लाइडर से सटीक इंटेंसिटी कंट्रोल करें
• timeline scrub करके कोई भी moment देखें
• projects सेव करें और बाद में जारी रखें
• folders, duplicate, rename और Trash से recover करें
• automatic thumbnails या custom preview image चुनें
• finished videos को high quality में Photos में save करें
• compatibility के लिए MP4 या efficient output के लिए HEVC/MOV चुनें
• device पर simple offline color workflow के साथ काम करें

Grado travel, food, fitness, fashion, cars, daily clips, stories और reels के लिए उपयोगी है। एक मजबूत color direction से शुरू करें और उसे natural या bold बनाने के लिए सिर्फ intensity बदलें।

वीडियो खोलें, रंग चुनें, export करें. Grado आपके clips को minutes में share-ready look देता है।`,
    keywords: 'video,filter,color,grading,cinematic,reels,tiktok,instagram,edit',
    release: 'वीडियो color grading और export के लिए Grado की पहली release.'
  },
  hu: {
    subtitle: 'Filmes színek videókhoz',
    promo: 'Adj filmes színvilágot a videóidnak gyorsan. Válassz szűrőt, állíts intenzitást, rendezd projektjeid és exportálj.',
    description: `A Grado hétköznapi klipekből filmesebb videókat készít, bonyolult vágóprogram nélkül.

Importálj videót a Fotókból, nézd meg a színstílusokat élő előnézetben, majd állítsd be az intenzitást a kívánt hangulathoz. A Grado tartalomkészítőknek, reels videókhoz, utazáshoz, vlogokhoz és rövid közösségi klipekhez készült.

Fő funkciók:
• 12 gondosan válogatott look: Cinematic, Vintage, Noir, Sunset, Emerald, Lavender, Bleach, Arctic, Neon, Sketch, VHS és Original
• szűrők előnézete közvetlenül a videón
• gyors színszalag a vizuális választáshoz
• pontos intenzitás-szabályzás
• idővonal bármely pillanat ellenőrzéséhez
• mentett projektek későbbi folytatáshoz
• mappák, duplikálás, átnevezés és kuka
• automatikus projektképek vagy saját borító
• kiváló minőségű export a Fotókba
• MP4 kompatibilitáshoz vagy HEVC/MOV hatékonyabb kimenethez
• eszközön futó egyszerű színmunkafolyamat

Használd utazáshoz, ételhez, fitneszhez, divathoz, autókhoz, napi klipekhez, storykhoz és social posztokhoz. Indulj egy erős színirányból, majd egy csúszkával tedd természetesebbé vagy merészebbé.

Nyisd meg a videót, válassz színt, exportálj. A Grado percek alatt tudatosabb megjelenést ad a klipjeidnek.`,
    keywords: 'video,szuro,szin,grading,film,reels,tiktok,instagram,szerkesztes',
    release: 'A Grado első kiadása videók színezéséhez és exportjához.'
  },
  id: {
    subtitle: 'Warna sinematik video',
    promo: 'Beri video tampilan sinematik dengan cepat. Pilih filter, atur intensitas, kelola proyek, lalu ekspor ke Foto.',
    description: `Grado mengubah klip sehari-hari menjadi video bernuansa sinematik tanpa editor yang rumit.

Impor video dari Foto, lihat pratinjau warna saat diputar, lalu sesuaikan intensitas sampai terasa pas. Grado dibuat untuk creator, reels, video perjalanan, vlog, dan konten pendek yang butuh gaya visual lebih kuat.

Yang bisa kamu lakukan:
• pilih 12 look: Cinematic, Vintage, Noir, Sunset, Emerald, Lavender, Bleach, Arctic, Neon, Sketch, VHS, dan Original
• pratinjau filter langsung di video sebelum ekspor
• geser ribbon warna untuk memilih filter cepat
• atur intensitas filter secara presisi
• scrub timeline untuk melihat momen mana pun
• simpan proyek dan lanjutkan nanti
• kelola dengan folder, duplikasi, rename, dan Trash
• buat thumbnail otomatis atau pilih gambar preview sendiri
• ekspor video berkualitas tinggi ke Foto
• pilih MP4 untuk kompatibilitas atau HEVC/MOV untuk output efisien
• bekerja di perangkat dengan alur warna sederhana

Gunakan Grado untuk travel, makanan, fitness, fashion, mobil, klip harian, stories, reels, dan posting sosial. Mulai dari arah warna yang kuat, lalu buat lebih natural atau bold dengan satu slider.

Buka video, pilih warna, ekspor. Grado membuat klipmu terlihat lebih rapi dan siap dibagikan dalam menit.`,
    keywords: 'video,filter,warna,grading,sinematik,reels,tiktok,instagram,edit',
    release: 'Rilis pertama Grado untuk color grading dan ekspor video.'
  },
  it: {
    subtitle: 'Colori cinema per video',
    promo: 'Dai ai video un look cinematografico in fretta. Scegli un filtro, regola l’intensità, organizza progetti ed esporta.',
    description: `Grado trasforma i clip quotidiani in video dal look cinematografico senza la complessità di un editor completo.

Importa un video da Foto, guarda l’anteprima dei colori mentre lo riproduci e regola l’intensità finché l’atmosfera è giusta. Grado è pensato per creator, reels, viaggi, vlog e video brevi con più stile.

Con Grado puoi:
• scegliere tra 12 look: Cinematic, Vintage, Noir, Sunset, Emerald, Lavender, Bleach, Arctic, Neon, Sketch, VHS e Original
• vedere i filtri direttamente sul video prima dell’esportazione
• scorrere una ribbon di colori per scegliere rapidamente
• regolare l’intensità con precisione
• usare la timeline per controllare ogni momento
• salvare progetti e riprenderli più tardi
• organizzare con cartelle, duplicare, rinominare e recuperare dal Cestino
• generare anteprime o scegliere una copertina personalizzata
• esportare in alta qualità su Foto
• scegliere MP4 per compatibilità o HEVC/MOV per file più efficienti
• lavorare sul dispositivo con un flusso colore semplice

Usa Grado per viaggi, food, fitness, moda, auto, clip quotidiani, stories, reels e post social. Parti da una direzione colore forte e rendila più naturale o audace con un solo controllo.

Apri un video, scegli il colore, esporta. Grado dà ai tuoi clip un aspetto più curato in pochi minuti.`,
    keywords: 'video,filtro,colore,grading,cinema,reels,tiktok,instagram,editing',
    release: 'Prima versione di Grado per colore ed esportazione video.'
  },
  ja: {
    subtitle: '動画にシネマカラー',
    promo: '動画をすばやくシネマ風の色に。フィルターを選び、強さを調整し、プロジェクトを整理して写真へ書き出せます。',
    description: `Gradoは、毎日の動画を本格的なシネマカラーのクリップに変えるためのシンプルなアプリです。

写真から動画を読み込み、再生しながらカラーグレードをプレビューし、雰囲気に合わせて強さを調整できます。Reels、旅行、Vlog、ショート動画、SNS投稿をすばやく仕上げたいクリエイターに向いています。

Gradoでできること:
• Cinematic、Vintage、Noir、Sunset、Emerald、Lavender、Bleach、Arctic、Neon、Sketch、VHS、Originalの12種類のルック
• 書き出し前に動画上でフィルターを直接プレビュー
• 色のリボンで直感的にフィルター選択
• フィルター強度を細かく調整
• タイムラインで任意の瞬間を確認
• プロジェクトを保存して後から再編集
• フォルダ、複製、名前変更、ゴミ箱で整理
• 自動サムネイルまたはカスタムプレビュー画像
• 高品質で写真へ書き出し
• 互換性重視のMP4、効率重視のHEVC/MOVを選択
• デバイス上で完結するシンプルなカラー作業

旅行、料理、フィットネス、ファッション、車、日常、ストーリー、Reelsなどに使えます。強い色の方向性から始めて、1つのスライダーで自然にも大胆にも調整できます。

動画を開く。色を選ぶ。書き出す。Gradoなら、共有したくなる動画の雰囲気を短時間で作れます。`,
    keywords: '動画,フィルター,色,カラーグレーディング,シネマ,reels,tiktok,編集',
    release: '動画のカラーグレーディングと書き出しに対応したGradoの初回リリース。'
  },
  ko: {
    subtitle: '영상에 시네마 컬러',
    promo: '영상을 빠르게 시네마틱 컬러로 완성하세요. 필터 선택, 강도 조절, 프로젝트 정리, 사진 앱 내보내기까지.',
    description: `Grado는 복잡한 편집 앱 없이 일상 영상을 시네마틱한 색감의 클립으로 바꿔줍니다.

사진 앱에서 영상을 가져오고, 재생하면서 컬러 그레이드를 미리 본 뒤 분위기에 맞게 강도를 조절하세요. Grado는 크리에이터, 릴스, 여행 영상, 브이로그, 짧은 소셜 비디오에 맞게 설계되었습니다.

주요 기능:
• Cinematic, Vintage, Noir, Sunset, Emerald, Lavender, Bleach, Arctic, Neon, Sketch, VHS, Original 등 12가지 룩
• 내보내기 전 영상 위에서 필터 미리보기
• 색상 리본으로 빠른 필터 선택
• 정밀한 필터 강도 조절
• 타임라인으로 원하는 순간 확인
• 프로젝트 저장 후 나중에 이어서 편집
• 폴더, 복제, 이름 변경, 휴지통 정리
• 자동 프로젝트 썸네일 또는 사용자 지정 커버
• 고품질 영상으로 사진 앱에 저장
• 호환성을 위한 MP4 또는 효율적인 HEVC/MOV 선택
• 기기 안에서 끝나는 간단한 컬러 워크플로

여행, 음식, 피트니스, 패션, 자동차, 일상 클립, 스토리, 릴스, 소셜 게시물에 사용해 보세요. 강한 색감 방향에서 시작해 한 슬라이더로 자연스럽게 또는 더 과감하게 만들 수 있습니다.

영상을 열고, 색을 고르고, 내보내세요. Grado는 몇 분 안에 더 의도적인 영상을 만들어줍니다.`,
    keywords: '영상,필터,색감,컬러그레이딩,시네마틱,reels,tiktok,편집',
    release: '영상 컬러 그레이딩과 내보내기를 위한 Grado 첫 출시.'
  },
  ms: {
    subtitle: 'Warna sinematik video',
    promo: 'Berikan video rupa sinematik dengan pantas. Pilih penapis, laras intensiti, susun projek dan eksport ke Foto.',
    description: `Grado menukar klip harian kepada video bergaya sinematik tanpa editor yang rumit.

Import video daripada Foto, pratonton warna ketika dimainkan, dan laraskan intensiti sehingga mood terasa tepat. Grado dibuat untuk creator, reels, travel edit, vlog dan video pendek yang perlukan gaya visual lebih kuat.

Dengan Grado anda boleh:
• pilih 12 rupa: Cinematic, Vintage, Noir, Sunset, Emerald, Lavender, Bleach, Arctic, Neon, Sketch, VHS dan Original
• pratonton penapis terus pada video sebelum eksport
• guna ribbon warna untuk pilihan pantas
• laras intensiti penapis dengan tepat
• scrub timeline untuk semak mana-mana saat
• simpan projek dan sambung kemudian
• susun dengan folder, duplikasi, nama semula dan Trash
• jana thumbnail projek atau pilih preview sendiri
• eksport video berkualiti tinggi ke Foto
• pilih MP4 untuk keserasian atau HEVC/MOV untuk output lebih cekap
• bekerja pada peranti dengan aliran warna yang mudah

Gunakan Grado untuk travel, makanan, fitness, fesyen, kereta, klip harian, stories, reels dan post sosial. Mulakan dengan arah warna yang kuat, kemudian jadikan lebih natural atau bold dengan satu slider.

Buka video, pilih warna, eksport. Grado menjadikan klip anda lebih kemas dan sedia dikongsi dalam beberapa minit.`,
    keywords: 'video,penapis,warna,grading,sinematik,reels,tiktok,instagram,edit',
    release: 'Keluaran pertama Grado untuk warna video dan eksport.'
  },
  'nl-NL': {
    subtitle: 'Filmkleuren voor video',
    promo: 'Geef video’s snel een filmische kleurlook. Kies een filter, stel intensiteit in, organiseer projecten en exporteer.',
    description: `Grado verandert gewone clips in video’s met een filmische kleurlook, zonder zware montagesoftware.

Importeer een video uit Foto’s, bekijk kleurstijlen live en pas de intensiteit aan tot de sfeer klopt. Grado is gemaakt voor creators, reels, reizen, vlogs en korte social video’s die snel meer stijl nodig hebben.

Wat je kunt doen:
• kies uit 12 looks: Cinematic, Vintage, Noir, Sunset, Emerald, Lavender, Bleach, Arctic, Neon, Sketch, VHS en Original
• preview filters direct op je video voor export
• swipe door een snelle kleurribbon
• regel filterintensiteit nauwkeurig
• scrub de tijdlijn om elk moment te bekijken
• sla projecten op en ga later verder
• organiseer met mappen, dupliceren, hernoemen en prullenbak
• genereer projectminiaturen of kies een eigen cover
• exporteer in hoge kwaliteit naar Foto’s
• kies MP4 voor compatibiliteit of HEVC/MOV voor efficiëntere bestanden
• werk op je apparaat met een eenvoudige kleurworkflow

Gebruik Grado voor reizen, eten, fitness, mode, auto’s, dagelijkse clips, stories, reels en social posts. Begin met een sterke kleurstijl en maak die subtieler of krachtiger met één schuifregelaar.

Open een video, kies de kleur, exporteer. Grado geeft je clips in minuten een nettere, bewuste look.`,
    keywords: 'video,filter,kleur,grading,film,reels,tiktok,instagram,bewerken',
    release: 'Eerste release van Grado voor videokleur en export.'
  },
  no: {
    subtitle: 'Filmfarger for video',
    promo: 'Gi videoene dine et filmatisk fargeuttrykk raskt. Velg filter, juster styrke, organiser prosjekter og eksporter.',
    description: `Grado gjør hverdagsklipp om til videoer med filmatisk farge, uten et tungt redigeringsprogram.

Importer en video fra Bilder, forhåndsvis fargelooks mens den spilles av, og juster intensiteten til stemningen sitter. Grado er laget for skapere, reels, reiser, vlogger og korte sosiale videoer.

Dette får du:
• 12 kuraterte looks: Cinematic, Vintage, Noir, Sunset, Emerald, Lavender, Bleach, Arctic, Neon, Sketch, VHS og Original
• forhåndsvis filter direkte på videoen før eksport
• raskt fargebånd for visuell valg
• presis kontroll av filterstyrke
• tidslinje for å sjekke hvilket som helst øyeblikk
• lagrede prosjekter du kan fortsette senere
• mapper, duplisering, navneendring og papirkurv
• automatiske prosjektbilder eller eget cover
• eksport i høy kvalitet til Bilder
• MP4 for kompatibilitet eller HEVC/MOV for mer effektiv video
• enkel fargeflyt på enheten

Bruk Grado til reise, mat, trening, mote, biler, daglige klipp, stories, reels og sosiale innlegg. Start med en tydelig fargeretning og gjør den mer naturlig eller dristig med én skyveknapp.

Åpne videoen, velg farge, eksporter. Grado gjør klippene dine mer gjennomførte på få minutter.`,
    keywords: 'video,filter,farge,grading,film,reels,tiktok,instagram,redigere',
    release: 'Første versjon av Grado for videofarger og eksport.'
  },
  pl: {
    subtitle: 'Filmowe kolory wideo',
    promo: 'Nadaj filmowy kolor swoim wideo w kilka chwil. Wybierz filtr, ustaw intensywność, organizuj projekty i eksportuj.',
    description: `Grado zmienia codzienne klipy w wideo o filmowym kolorze bez ciężkiego programu do montażu.

Importuj film ze Zdjęć, oglądaj podgląd kolorów na żywo i dopasuj intensywność do nastroju. Grado jest dla twórców, reelsów, podróży, vlogów i krótkich filmów społecznościowych.

Co oferuje Grado:
• 12 gotowych wyglądów: Cinematic, Vintage, Noir, Sunset, Emerald, Lavender, Bleach, Arctic, Neon, Sketch, VHS i Original
• podgląd filtrów bezpośrednio na wideo przed eksportem
• szybka wstęga kolorów do wyboru stylu
• precyzyjna regulacja intensywności
• oś czasu do sprawdzania dowolnego momentu
• zapisane projekty do dalszej pracy
• foldery, duplikowanie, zmiana nazw i kosz
• automatyczne miniatury projektu lub własna okładka
• eksport wysokiej jakości do Zdjęć
• MP4 dla zgodności lub HEVC/MOV dla wydajniejszego pliku
• prosta praca z kolorem na urządzeniu

Używaj Grado do podróży, jedzenia, fitnessu, mody, samochodów, codziennych klipów, stories, reelsów i postów. Zacznij od mocnego kierunku kolorystycznego i jednym suwakiem zrób efekt naturalny albo odważny.

Otwórz wideo, wybierz kolor, eksportuj. Grado nadaje klipom bardziej dopracowany wygląd w kilka minut.`,
    keywords: 'wideo,filtr,kolor,grading,film,reels,tiktok,instagram,edycja',
    release: 'Pierwsze wydanie Grado do kolorowania i eksportu wideo.'
  },
  'pt-BR': {
    subtitle: 'Cores de cinema no vídeo',
    promo: 'Dê cor cinematográfica aos vídeos em instantes. Escolha filtro, ajuste intensidade, organize projetos e exporte para Fotos.',
    description: `Grado transforma clipes do dia a dia em vídeos com cor cinematográfica, sem a complexidade de um editor completo.

Importe um vídeo de Fotos, pré-visualize os looks de cor enquanto assiste e ajuste a intensidade até chegar ao clima certo. Grado foi feito para criadores, reels, viagens, vlogs e vídeos curtos que precisam de mais estilo rapidamente.

Com Grado você pode:
• escolher entre 12 looks: Cinematic, Vintage, Noir, Sunset, Emerald, Lavender, Bleach, Arctic, Neon, Sketch, VHS e Original
• ver filtros diretamente no vídeo antes de exportar
• navegar por uma faixa de cores rápida
• ajustar a intensidade do filtro com precisão
• usar a linha do tempo para revisar qualquer momento
• salvar projetos e continuar depois
• organizar com pastas, duplicar, renomear e recuperar da Lixeira
• gerar miniaturas ou escolher uma capa personalizada
• exportar vídeos em alta qualidade para Fotos
• escolher MP4 para compatibilidade ou HEVC/MOV para saída eficiente
• trabalhar no dispositivo com um fluxo simples de cor

Use Grado para viagens, comida, fitness, moda, carros, clipes diários, stories, reels e posts sociais. Comece com uma direção de cor forte e deixe mais natural ou mais marcante com um só controle.

Abra um vídeo, escolha a cor, exporte. Grado deixa seus clipes com aparência mais limpa e intencional em minutos.`,
    keywords: 'video,filtro,cor,grading,cinema,reels,tiktok,instagram,editar,editor',
    release: 'Primeira versão do Grado para cor e exportação de vídeo.'
  },
  ro: {
    subtitle: 'Culori de film în video',
    promo: 'Dă rapid videoclipurilor un look cinematografic. Alege filtru, reglează intensitatea, organizează proiecte și exportă.',
    description: `Grado transformă clipurile de zi cu zi în videoclipuri cu aspect cinematografic, fără un editor complicat.

Importă un video din Poze, previzualizează culorile în timp ce rulează și ajustează intensitatea până când atmosfera este potrivită. Grado este creat pentru creatori, reels, călătorii, vloguri și videoclipuri scurte pentru social media.

Ce poți face:
• alege dintre 12 look-uri: Cinematic, Vintage, Noir, Sunset, Emerald, Lavender, Bleach, Arctic, Neon, Sketch, VHS și Original
• previzualizează filtrele direct pe video înainte de export
• folosește o bandă rapidă de culori
• ajustează precis intensitatea filtrului
• derulează timeline-ul pentru orice moment
• salvează proiecte și continuă mai târziu
• organizează cu foldere, duplicare, redenumire și coș
• generează miniaturi sau alege o copertă personalizată
• exportă la calitate înaltă în Poze
• alege MP4 pentru compatibilitate sau HEVC/MOV pentru fișiere eficiente
• lucrează pe dispozitiv cu un flux simplu de culoare

Folosește Grado pentru călătorii, mâncare, fitness, modă, mașini, clipuri zilnice, stories, reels și postări sociale. Pornește de la o direcție de culoare puternică și ajusteaz-o natural sau îndrăzneț cu un singur slider.

Deschide un video, alege culoarea, exportă. Grado oferă clipurilor un look mai curat și mai intenționat în câteva minute.`,
    keywords: 'video,filtru,culoare,grading,film,reels,tiktok,instagram,editare',
    release: 'Prima versiune Grado pentru culoare video și export.'
  },
  ru: {
    subtitle: 'Киноцвет для видео',
    promo: 'Быстро придайте видео кинематографичный цвет. Выберите фильтр, настройте силу, организуйте проекты и экспортируйте.',
    description: `Grado превращает обычные ролики в видео с кинематографичным цветом без сложного видеоредактора.

Импортируйте видео из Фото, смотрите цветовые стили прямо при воспроизведении и регулируйте интенсивность до нужного настроения. Grado создан для авторов, reels, путешествий, влогов и коротких видео для соцсетей.

Возможности Grado:
• 12 готовых образов: Cinematic, Vintage, Noir, Sunset, Emerald, Lavender, Bleach, Arctic, Neon, Sketch, VHS и Original
• предпросмотр фильтров прямо на видео перед экспортом
• быстрая цветовая лента для выбора стиля
• точная настройка интенсивности фильтра
• таймлайн для проверки любого момента
• сохраненные проекты для продолжения позже
• папки, дублирование, переименование и корзина
• автоматические превью проектов или своя обложка
• экспорт высокого качества в Фото
• MP4 для совместимости или HEVC/MOV для более эффективного файла
• обработка на устройстве с простым цветовым процессом

Используйте Grado для путешествий, еды, фитнеса, моды, автомобилей, повседневных клипов, stories, reels и соцсетей. Начните с сильного цветового направления и сделайте его мягче или смелее одним ползунком.

Откройте видео, выберите цвет, экспортируйте. Grado помогает за минуты сделать ролик более аккуратным и готовым к публикации.`,
    keywords: 'видео,фильтр,цвет,грейдинг,кино,reels,tiktok,instagram,монтаж',
    release: 'Первый выпуск Grado для цветокоррекции и экспорта видео.'
  },
  sv: {
    subtitle: 'Filmfärger för video',
    promo: 'Ge dina videor en filmisk färglook snabbt. Välj filter, justera styrka, organisera projekt och exportera till Bilder.',
    description: `Grado gör vardagsklipp till videor med filmisk färg utan ett tungt redigeringsprogram.

Importera en video från Bilder, förhandsvisa färglooks direkt och justera intensiteten tills känslan sitter. Grado är byggt för kreatörer, reels, resor, vloggar och korta sociala videor som behöver starkare visuell stil snabbt.

Med Grado kan du:
• välja bland 12 looks: Cinematic, Vintage, Noir, Sunset, Emerald, Lavender, Bleach, Arctic, Neon, Sketch, VHS och Original
• förhandsvisa filter direkt på videon före export
• svepa genom ett snabbt färgband
• justera filterintensitet med precision
• använda tidslinjen för att granska valfritt ögonblick
• spara projekt och fortsätta senare
• organisera med mappar, duplicering, namnbyte och papperskorg
• skapa automatiska miniatyrer eller välja egen cover
• exportera i hög kvalitet till Bilder
• välja MP4 för kompatibilitet eller HEVC/MOV för effektivare fil
• arbeta på enheten med ett enkelt färgflöde

Använd Grado för resor, mat, träning, mode, bilar, vardagsklipp, stories, reels och sociala inlägg. Börja med en tydlig färgriktning och gör den mer naturlig eller djärv med ett reglage.

Öppna en video, välj färg, exportera. Grado gör dina klipp mer genomtänkta på några minuter.`,
    keywords: 'video,filter,färg,grading,film,reels,tiktok,instagram,redigera',
    release: 'Första versionen av Grado för videofärg och export.'
  },
  th: {
    subtitle: 'สีภาพยนตร์สำหรับวิดีโอ',
    promo: 'แต่งสีวิดีโอให้ดูเป็นภาพยนตร์อย่างรวดเร็ว เลือกฟิลเตอร์ ปรับความเข้ม จัดโปรเจกต์ แล้วส่งออกไปยังรูปภาพ',
    description: `Grado เปลี่ยนคลิปทั่วไปให้เป็นวิดีโอที่มีสีสไตล์ภาพยนตร์ โดยไม่ต้องใช้แอปตัดต่อที่ซับซ้อน

นำเข้าวิดีโอจากรูปภาพ ดูพรีวิวสีบนวิดีโอจริง และปรับความเข้มให้เข้ากับอารมณ์ที่ต้องการ Grado เหมาะกับครีเอเตอร์ reels วิดีโอท่องเที่ยว vlog และคลิปสั้นสำหรับโซเชียล

สิ่งที่ทำได้ใน Grado:
• เลือก 12 ลุค: Cinematic, Vintage, Noir, Sunset, Emerald, Lavender, Bleach, Arctic, Neon, Sketch, VHS และ Original
• พรีวิวฟิลเตอร์บนวิดีโอก่อนส่งออก
• เลือกฟิลเตอร์เร็วด้วยแถบสี
• ปรับความเข้มของฟิลเตอร์อย่างละเอียด
• เลื่อน timeline เพื่อดูช่วงใดก็ได้
• บันทึกโปรเจกต์และกลับมาแก้ต่อภายหลัง
• จัดการด้วยโฟลเดอร์ ทำซ้ำ เปลี่ยนชื่อ และถังขยะ
• สร้างภาพพรีวิวโปรเจกต์หรือเลือกภาพปกเอง
• ส่งออกวิดีโอคุณภาพสูงไปยังรูปภาพ
• เลือก MP4 เพื่อความเข้ากันได้ หรือ HEVC/MOV เพื่อไฟล์ที่มีประสิทธิภาพ
• ทำงานบนอุปกรณ์ด้วยขั้นตอนแต่งสีที่ง่าย

ใช้ Grado กับวิดีโอท่องเที่ยว อาหาร ฟิตเนส แฟชั่น รถยนต์ คลิปประจำวัน stories reels และโพสต์โซเชียล เริ่มจากโทนสีที่ชัดเจน แล้วปรับให้ธรรมชาติหรือโดดเด่นขึ้นด้วยสไลเดอร์เดียว

เปิดวิดีโอ เลือกสี แล้วส่งออก Grado ช่วยให้คลิปดูตั้งใจและพร้อมแชร์ในไม่กี่นาที`,
    keywords: 'วิดีโอ,ฟิลเตอร์,สี,แต่งสี,ภาพยนตร์,reels,tiktok,instagram,ตัดต่อ',
    release: 'Grado เวอร์ชันแรกสำหรับแต่งสีและส่งออกวิดีโอ'
  },
  tr: {
    subtitle: 'Videoya sinema rengi',
    promo: 'Videolarına hızla sinematik renk ver. Filtre seç, yoğunluğu ayarla, projeleri düzenle ve Fotoğraflar’a aktar.',
    description: `Grado, günlük klipleri karmaşık bir editör kullanmadan sinematik renkli videolara dönüştürür.

Fotoğraflar’dan video içe aktar, renk görünümlerini oynatırken önizle ve yoğunluğu doğru hisse ulaşana kadar ayarla. Grado; içerik üreticileri, reels, seyahat videoları, vloglar ve kısa sosyal videolar için tasarlandı.

Grado ile:
• 12 görünüm seçebilirsin: Cinematic, Vintage, Noir, Sunset, Emerald, Lavender, Bleach, Arctic, Neon, Sketch, VHS ve Original
• dışa aktarmadan önce filtreleri videonun üzerinde görebilirsin
• hızlı renk şeridiyle filtre değiştirebilirsin
• filtre yoğunluğunu hassas şekilde ayarlayabilirsin
• zaman çizelgesinde istediğin ana gidebilirsin
• projeleri kaydedip sonra devam edebilirsin
• klasörler, çoğaltma, yeniden adlandırma ve çöp kutusu ile düzen kurabilirsin
• otomatik küçük resim veya özel kapak seçebilirsin
• videoları yüksek kalitede Fotoğraflar’a aktarabilirsin
• uyumluluk için MP4 veya verimli çıktı için HEVC/MOV seçebilirsin
• cihaz üzerinde basit bir renk akışıyla çalışabilirsin

Grado’yu seyahat, yemek, fitness, moda, araba, günlük klipler, stories, reels ve sosyal paylaşımlar için kullan. Güçlü bir renk yönünden başla, tek kaydırıcıyla daha doğal ya da daha cesur hale getir.

Videoyu aç, rengi seç, dışa aktar. Grado kliplerine dakikalar içinde daha bilinçli bir görünüm verir.`,
    keywords: 'video,filtre,renk,grading,sinema,reels,tiktok,instagram,duzenleme',
    release: 'Video rengi ve dışa aktarma için Grado ilk sürümü.'
  },
  uk: {
    subtitle: 'Кіноколір для відео',
    promo: 'Швидко надайте відео кінематографічний колір. Оберіть фільтр, налаштуйте силу, впорядкуйте проєкти й експортуйте.',
    description: `Grado перетворює звичайні кліпи на відео з кінематографічним кольором без складного редактора.

Імпортуйте відео з Фото, переглядайте кольорові стилі під час відтворення та налаштовуйте інтенсивність до потрібного настрою. Grado створено для авторів, reels, подорожей, влогів і коротких відео для соцмереж.

Можливості:
• 12 готових образів: Cinematic, Vintage, Noir, Sunset, Emerald, Lavender, Bleach, Arctic, Neon, Sketch, VHS і Original
• попередній перегляд фільтрів прямо на відео перед експортом
• швидка кольорова стрічка для вибору стилю
• точне налаштування інтенсивності
• таймлайн для перевірки будь-якого моменту
• збережені проєкти для продовження пізніше
• папки, дублювання, перейменування та кошик
• автоматичні прев’ю або власна обкладинка
• експорт високої якості у Фото
• MP4 для сумісності або HEVC/MOV для ефективнішого файлу
• робота на пристрої з простим кольоровим процесом

Використовуйте Grado для подорожей, їжі, фітнесу, моди, авто, щоденних кліпів, stories, reels і соцмереж. Почніть із сильного кольорового напряму й одним повзунком зробіть його природнішим або сміливішим.

Відкрийте відео, оберіть колір, експортуйте. Grado допомагає за хвилини зробити кліп акуратнішим і готовим до публікації.`,
    keywords: 'відео,фільтр,колір,грейдинг,кіно,reels,tiktok,instagram,монтаж',
    release: 'Перший випуск Grado для кольору та експорту відео.'
  },
  vi: {
    subtitle: 'Màu điện ảnh cho video',
    promo: 'Tạo màu điện ảnh cho video thật nhanh. Chọn bộ lọc, chỉnh cường độ, sắp xếp dự án và xuất sang Ảnh.',
    description: `Grado biến những clip thường ngày thành video có màu điện ảnh mà không cần trình chỉnh sửa phức tạp.

Nhập video từ Ảnh, xem trước màu trực tiếp khi phát và chỉnh cường độ đến khi đúng cảm xúc. Grado dành cho creator, reels, du lịch, vlog và video ngắn cần phong cách rõ hơn.

Bạn có thể:
• chọn 12 look: Cinematic, Vintage, Noir, Sunset, Emerald, Lavender, Bleach, Arctic, Neon, Sketch, VHS và Original
• xem bộ lọc trực tiếp trên video trước khi xuất
• lướt ribbon màu để chọn nhanh
• chỉnh cường độ bộ lọc chính xác
• scrub timeline để xem bất kỳ khoảnh khắc nào
• lưu dự án và tiếp tục sau
• sắp xếp bằng thư mục, nhân bản, đổi tên và Thùng rác
• tạo thumbnail tự động hoặc chọn ảnh bìa riêng
• xuất video chất lượng cao sang Ảnh
• chọn MP4 để tương thích hoặc HEVC/MOV để hiệu quả hơn
• xử lý trên thiết bị với quy trình màu đơn giản

Dùng Grado cho du lịch, đồ ăn, fitness, thời trang, xe, clip hằng ngày, stories, reels và bài đăng mạng xã hội. Bắt đầu với một hướng màu mạnh, rồi làm tự nhiên hơn hoặc nổi bật hơn bằng một thanh trượt.

Mở video, chọn màu, xuất. Grado giúp clip của bạn trông chỉn chu và sẵn sàng chia sẻ trong vài phút.`,
    keywords: 'video,boloc,mau,grading,dienanh,reels,tiktok,instagram,edit',
    release: 'Bản phát hành đầu tiên của Grado cho chỉnh màu và xuất video.'
  },
  'zh-Hans': {
    subtitle: '给视频电影感调色',
    promo: '快速为视频加入电影感色彩。选择滤镜、调节强度、整理项目，并将成片导出到照片。',
    description: `Grado 可以把日常视频变成更有电影感的短片，不需要复杂的视频剪辑软件。

从照片导入视频，边播放边预览不同调色效果，再用强度控制把氛围调到刚刚好。Grado 适合创作者、Reels、旅行剪辑、Vlog 和需要快速提升质感的短视频。

Grado 支持：
• 12 种精选风格：Cinematic、Vintage、Noir、Sunset、Emerald、Lavender、Bleach、Arctic、Neon、Sketch、VHS 和 Original
• 导出前直接在视频上预览滤镜
• 使用颜色带快速切换风格
• 精准调节滤镜强度
• 拖动时间轴检查任意片段
• 保存项目，之后继续编辑
• 用文件夹、复制、重命名和废纸篓整理作品
• 自动生成项目缩略图，也可选择自定义封面
• 高质量导出到照片
• 选择 MP4 获得更好兼容性，或选择 HEVC/MOV 获得更高效率
• 在设备上完成简单的离线调色流程

你可以用 Grado 处理旅行、美食、健身、穿搭、汽车、日常、Stories、Reels 和社交平台短片。先选择一个明确的色彩方向，再用一个滑杆让效果更自然或更大胆。

打开视频，选择颜色，导出成片。Grado 让你的短片在几分钟内更干净、更有意图感。`,
    keywords: '视频,滤镜,调色,颜色,电影感,reels,tiktok,instagram,剪辑,编辑',
    release: 'Grado 首个版本，支持视频调色与导出。'
  }
};

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function write(file, value) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, `${value.replace(/\r\n/g, '\n').trim()}\n`, 'utf8');
}

function countChars(value) {
  return Array.from(value).length;
}

function validate(locale, item) {
  const checks = [
    ['subtitle', item.subtitle, 30],
    ['promotional_text', item.promo, 170],
    ['description', item.description, 4000],
    ['keywords', item.keywords, 100],
  ];

  for (const [field, value, limit] of checks) {
    const length = countChars(value);
    if (length > limit) {
      throw new Error(`${locale} ${field} is ${length}/${limit}`);
    }
  }
}

function writeFastlaneFiles() {
  ensureDir(out);
  write(path.join(out, 'Appfile'), `app_identifier "${appIdentifier}"\napple_id "${appleId}"`);
  write(path.join(out, 'README.md'), `# Grado Fastlane Metadata

Generated App Store Connect metadata for Grado.

Upload metadata:

\`\`\`
fastlane ios upload_metadata
\`\`\`
`);
  write(path.join(out, 'Fastfile'), `default_platform(:ios)

platform :ios do
  desc "Upload Grado metadata to App Store Connect"
  lane :upload_metadata do
    ensure_app_info_localizations

    api_key = app_store_connect_api_key(
      key_id: "${apiKeyId}",
      issuer_id: "${issuerId}",
      key_filepath: "./fastlane/AuthKey_${apiKeyId}.p8",
      in_house: false
    )

    deliver(
      api_key: api_key,
      app_identifier: "${appIdentifier}",
      submit_for_review: false,
      skip_screenshots: true,
      skip_binary_upload: true,
      skip_app_version_update: true,
      force: true,
      overwrite_screenshots: false,
      run_precheck_before_submit: false,
      ignore_language_directory_validation: true
    )
  end

  desc "Create or update Grado App Info localizations before metadata upload"
  lane :ensure_app_info_localizations do
    Spaceship::ConnectAPI.token = Spaceship::ConnectAPI::Token.create(
      key_id: "${apiKeyId}",
      issuer_id: "${issuerId}",
      filepath: File.expand_path("./AuthKey_${apiKeyId}.p8")
    )
    app = Spaceship::ConnectAPI::App.find("${appIdentifier}")
    edit = app.fetch_edit_app_info
    UI.user_error!("No editable App Info") unless edit

    existing = edit.get_app_info_localizations.each_with_object({}) do |localization, memo|
      memo[localization.locale] = localization
    end

    Dir.glob(File.expand_path("./metadata/*", __dir__)).sort.each do |locale_dir|
      next unless File.directory?(locale_dir)
      locale = File.basename(locale_dir)
      next if locale == "review_information"

      name = File.read(File.join(locale_dir, "name.txt")).strip
      subtitle = File.read(File.join(locale_dir, "subtitle.txt")).strip
      privacy_url = File.read(File.join(locale_dir, "privacy_url.txt")).strip
      attributes = {
        locale: locale,
        name: name,
        subtitle: subtitle,
        privacyPolicyUrl: privacy_url,
        privacyChoicesUrl: privacy_url,
        privacyPolicyText: "Privacy Policy: #{privacy_url}"
      }

      if existing[locale]
        UI.message "Updating App Info #{locale}"
        Spaceship::ConnectAPI.patch_app_info_localization(
          app_info_localization_id: existing[locale].id,
          attributes: attributes.reject { |key, _| key == :locale }
        )
      else
        UI.message "Creating App Info #{locale}"
        body = {
          data: {
            type: "appInfoLocalizations",
            attributes: attributes,
            relationships: {
              appInfo: {
                data: {
                  type: "appInfos",
                  id: edit.id
                }
              }
            }
          }
        }
        Spaceship::ConnectAPI.tunes_request_client.post("v1/appInfoLocalizations", body)
      end
    end
  end

  desc "Set privacyChoicesUrl = privacyPolicyUrl on every EDIT AppInfo localization"
  lane :fix_privacy_choices do
    Spaceship::ConnectAPI.token = Spaceship::ConnectAPI::Token.create(
      key_id: "${apiKeyId}",
      issuer_id: "${issuerId}",
      filepath: File.expand_path("./AuthKey_${apiKeyId}.p8")
    )
    app = Spaceship::ConnectAPI::App.find("${appIdentifier}")
    edit = app.fetch_edit_app_info
    UI.user_error!("No editable App Info") unless edit
    edit.get_app_info_localizations.each do |l|
      next if l.privacy_policy_url.to_s.empty?
      next if l.privacy_choices_url == l.privacy_policy_url
      UI.message "Patching #{l.locale}: privacyChoicesUrl -> #{l.privacy_policy_url}"
      Spaceship::ConnectAPI.patch_app_info_localization(
        app_info_localization_id: l.id,
        attributes: { privacyChoicesUrl: l.privacy_policy_url }
      )
    end
    UI.success "Done patching privacyChoicesUrl for all localizations"
  end

  desc "Audit EDIT AppInfo localizations: print name/subtitle/privacy_* for each locale"
  lane :audit_app_info do
    Spaceship::ConnectAPI.token = Spaceship::ConnectAPI::Token.create(
      key_id: "${apiKeyId}",
      issuer_id: "${issuerId}",
      filepath: File.expand_path("./AuthKey_${apiKeyId}.p8")
    )
    app = Spaceship::ConnectAPI::App.find("${appIdentifier}")
    edit = app.fetch_edit_app_info
    UI.user_error!("No editable App Info") unless edit
    missing = { name: [], subtitle: [], privacy_policy_url: [], privacy_choices_url: [], privacy_policy_text: [] }
    edit.get_app_info_localizations.sort_by(&:locale).each do |l|
      UI.message format(
        "%-7s name=%s sub=%s ppUrl=%s pcUrl=%s ppText=%s",
        l.locale,
        l.name.to_s.empty? ? "empty" : "ok",
        l.subtitle.to_s.empty? ? "empty" : "ok",
        l.privacy_policy_url.to_s.empty? ? "empty" : "ok",
        l.privacy_choices_url.to_s.empty? ? "empty" : "ok",
        l.privacy_policy_text.to_s.empty? ? "empty" : "ok"
      )
      missing[:name] << l.locale if l.name.to_s.empty?
      missing[:subtitle] << l.locale if l.subtitle.to_s.empty?
      missing[:privacy_policy_url] << l.locale if l.privacy_policy_url.to_s.empty?
      missing[:privacy_choices_url] << l.locale if l.privacy_choices_url.to_s.empty?
      missing[:privacy_policy_text] << l.locale if l.privacy_policy_text.to_s.empty?
    end
    UI.important "Summary of missing fields:"
    missing.each { |k, v| UI.message "  #{k}: #{v.empty? ? 'none' : v.join(', ')}" }
  end

  desc "Set privacyPolicyText = privacyPolicyUrl on every EDIT AppInfo localization"
  lane :fix_privacy_policy_text do
    Spaceship::ConnectAPI.token = Spaceship::ConnectAPI::Token.create(
      key_id: "${apiKeyId}",
      issuer_id: "${issuerId}",
      filepath: File.expand_path("./AuthKey_${apiKeyId}.p8")
    )
    app = Spaceship::ConnectAPI::App.find("${appIdentifier}")
    edit = app.fetch_edit_app_info
    UI.user_error!("No editable App Info") unless edit
    edit.get_app_info_localizations.each do |l|
      next if l.privacy_policy_url.to_s.empty?
      next unless l.privacy_policy_text.to_s.empty?
      text = "Privacy Policy: #{l.privacy_policy_url}"
      UI.message "Patching #{l.locale}: privacyPolicyText"
      Spaceship::ConnectAPI.patch_app_info_localization(
        app_info_localization_id: l.id,
        attributes: { privacyPolicyText: text }
      )
    end
    UI.success "Done patching privacyPolicyText for all localizations"
  end

  desc "Upload Grado screenshots to App Store Connect"
  lane :upload_screenshots do
    api_key = app_store_connect_api_key(
      key_id: "${apiKeyId}",
      issuer_id: "${issuerId}",
      key_filepath: "./fastlane/AuthKey_${apiKeyId}.p8",
      in_house: false
    )

    deliver(
      api_key: api_key,
      app_identifier: "${appIdentifier}",
      submit_for_review: false,
      skip_metadata: true,
      skip_screenshots: false,
      skip_binary_upload: true,
      skip_app_version_update: true,
      force: true,
      overwrite_screenshots: true,
      run_precheck_before_submit: false,
      ignore_language_directory_validation: true
    )
  end
end`);
}

function main() {
  if (Object.keys(locales).length !== 30) {
    throw new Error(`Expected 30 locales, got ${Object.keys(locales).length}`);
  }

  writeFastlaneFiles();
  const metadataDir = path.join(out, 'metadata');
  ensureDir(metadataDir);

  for (const [locale, item] of Object.entries(locales)) {
    validate(locale, item);
    const dir = path.join(metadataDir, locale);
    write(path.join(dir, 'name.txt'), appStoreName);
    write(path.join(dir, 'subtitle.txt'), item.subtitle);
    write(path.join(dir, 'promotional_text.txt'), item.promo);
    write(path.join(dir, 'description.txt'), item.description);
    write(path.join(dir, 'keywords.txt'), item.keywords);
    write(path.join(dir, 'release_notes.txt'), item.release);
    write(path.join(dir, 'privacy_url.txt'), privacyUrl);
    write(path.join(dir, 'support_url.txt'), supportUrl);
  }

  const reviewDir = path.join(metadataDir, 'review_information');
  write(path.join(reviewDir, 'first_name.txt'), 'Anton');
  write(path.join(reviewDir, 'last_name.txt'), 'Chepur');
  write(path.join(reviewDir, 'email_address.txt'), appleId);
  write(path.join(reviewDir, 'phone_number.txt'), '+7 999 123 4567');

  ensureDir(path.join(out, 'screenshots'));
  ensureDir(path.join(out, 'screenshots_ipad_backup'));
  ensureDir(path.join(out, 'screenshots_iphone_backup'));

  console.log(`Generated metadata for ${Object.keys(locales).length} locales in ${out}`);
}

main();
