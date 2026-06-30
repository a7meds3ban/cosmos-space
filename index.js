// ===== نظام التبويبات =====
document.querySelectorAll('.side-nav a').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelectorAll('.side-nav a').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
        const tab = this.dataset.tab;
        const target = document.getElementById('section-' + tab);
        if (target) target.classList.add('active');
    });
});



// ========================================
//  جلب بيانات الإطلاقات من SpaceDevs API
// ========================================
async function fetchLaunches() {

    const container = document.getElementById("launches-container");

    if (!container) return;

    container.innerHTML = '<div class="loading-text">🚀 Loading Launches...</div>';

    try {

        const response = await fetch(
            "https://ll.thespacedevs.com/2.3.0/launches/upcoming/?limit=9"
        );

        const data = await response.json();
        container.innerHTML = "";

        data.results.forEach(launch => {
            // ===============================
            // Featured Launch (أول إطلاق)
            // ===============================
            const featured = data.results[0];

            document.getElementById("featured-name").textContent =
                featured.name || "Unknown Mission";

            document.getElementById("featured-rocket").textContent =
                featured.rocket?.configuration?.name || "Unknown Rocket";

            document.getElementById("featured-provider").innerHTML =
                `<i class="fas fa-building" style="margin-right:10px;color:#6f7fa0;"></i>
    ${featured.launch_service_provider?.name || "Unknown Agency"}`;

            const launchDate = new Date(featured.net);

            document.getElementById("featured-date").textContent =
                launchDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                });

            document.getElementById("featured-time").textContent =
                launchDate.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit"
                }) + " UTC";

            document.getElementById("featured-location").textContent =
                featured.pad?.location?.name || "Unknown Location";

            // الدولة
            document.getElementById("featured-country").textContent =
                featured.pad?.location?.country?.name || "Unknown";


            document.getElementById("featured-description").textContent =
                featured.mission?.description || "No description available.";

            // الصورة
            const featuredImage =
                typeof featured.image === "string"
                    ? featured.image
                    : featured.image?.image_url ||
                    featured.image?.thumbnail_url ||
                    featured.rocket?.configuration?.image_url ||
                    "assets/images/rocket-placeholder.jpg";

            document.getElementById("featured-image").src = featuredImage;



            const image =
                launch.image?.image_url ||
                launch.image?.thumbnail_url ||
                "assets/images/rocket-placeholder.jpg";

            const mission =
                launch.name || "Unknown Mission";

            const rocket =
                launch.rocket?.configuration?.name || "Unknown Rocket";

            const agency =
                launch.launch_service_provider?.name || "Unknown Agency";

            const location =
                launch.pad?.location?.name || "Unknown Location";

            const date = new Date(launch.net).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
            });


            container.innerHTML += `
            
     <div class="launch-card">

    <div class="launch-image">
        <img src="${image}" alt="${mission}">
        <span class="launch-status">${launch.status?.abbrev || "GO"}</span>
    </div>

    <div class="launch-body">

                    <h3>${mission}</h3>

                    <p class="rocket">
                        <i class="fas fa-rocket"></i>
                        ${rocket}
                    </p>

                    <p class="agency">
                        <i class="fas fa-building"></i>
                        ${agency}
                    </p>

                    <p class="location">
                        <i class="fas fa-location-dot"></i>
                        ${location}
                    </p>

                    <p class="date">
                        <i class="fas fa-calendar"></i>
                        ${date}
                    </p>

                </div>

            </div>

            `;

        });

    }

    catch (error) {

        console.log(error);

        container.innerHTML =
            "<div class='loading-text'>Failed To Load Launches</div>";

    }

}

// ========================================
//  استدعاء الدالة عند تحميل الصفحة
// ========================================
document.addEventListener('DOMContentLoaded', function () {
    // ... الكود القديم للتبويبات (لو موجود) ...

    // جلب الإطلاقات
    fetchLaunches();
});




const API_KEY = "Cv2hNbYC411uZbAptnJUUt3eRhmYLEEqcNFfR6y9";

async function loadAPOD(date = "") {

    try {

        let url =
            `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;

        if (date) {
            url += `&date=${date}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        // ===== صورة أو فيديو =====
        const mediaContainer =
            document.querySelector(".space-image");

        if (data.media_type === "image") {

            mediaContainer.innerHTML = `
        <img id="apod-image"
             src="${data.url}"
             alt="${data.title}">
    `;

        } else if (data.media_type === "video") {

            mediaContainer.innerHTML = `
        <div class="video-placeholder">
            <i class="fas fa-video"></i>
            <h3>Video Content</h3>
            <a href="${data.url}" target="_blank">
                Watch Video
            </a>
        </div>
    `;
        }

        // ===== العنوان =====
        document.getElementById("apod-title").textContent =
            data.title;

        // ===== الوصف =====
        document.getElementById("apod-description").textContent =
            data.explanation;

        // ===== التاريخ =====
        document.getElementById("apod-date").textContent =
            data.date;

        document.getElementById("detail-date").textContent =
            data.date;

        const topDate =
            document.getElementById("apod-date-display");

        if (topDate) {
            topDate.textContent = data.date;
        }

        // ===== نوع الملف =====
        document.getElementById("detail-type").textContent =
            data.media_type;

        // ===== الكوبي رايت =====
        document.getElementById("apod-copyright").textContent =
            data.copyright
                ? `Copyright: ${data.copyright}`
                : "Copyright: NASA";

        // ===== تحديث الـ Date Picker =====
        const datePicker =
            document.getElementById("datePicker");

        if (datePicker) {
            datePicker.value = data.date;
        }

        console.log("NASA APOD Loaded ✅");

    } catch (error) {

        console.error("NASA APOD Error ❌", error);

    }
}


// تحميل صورة اليوم تلقائياً
loadAPOD();


// ===== زر Load =====
document.getElementById("loadBtn")
    .addEventListener("click", () => {

        const selectedDate =
            document.getElementById("datePicker").value;

        if (selectedDate) {
            loadAPOD(selectedDate);
        }
    });


// ===== زر Today =====
document.getElementById("todayBtn")
    .addEventListener("click", () => {

        loadAPOD();

    });


let planets = [];

// ========================================
// إنشاء كروت الكواكب
// ========================================
function createPlanetCards(planets) {

    const container = document.getElementById("planets-grid");

    container.innerHTML = "";

    planets.forEach(planet => {

        container.innerHTML += `

        <div class="planet-card"
             onclick="loadPlanetByName('${planet.englishName}')">

            <img
                src="assets/images/planets/${planet.englishName.toLowerCase()}.png"
                alt="${planet.englishName}">

            <span>${planet.englishName}</span>

        </div>

        `;

    });

}


// ========================================
// جلب الكواكب من الـ API
// ========================================
async function fetchPlanets() {

    try {

        const response = await fetch(
            "https://api.le-systeme-solaire.net/rest/bodies/?filter[]=isPlanet,eq,true"
        );

        const data = await response.json();

        planets = data.bodies;

        createPlanetCards(planets);

        // هنضيفها بعد شوية
        // loadPlanet(planets.find(p => p.englishName === "Earth"));

    }

    catch (err) {

        console.error(err);

    }

}


// ========================================
// تشغيل القسم
// ========================================
fetchPlanets();






const comparisonData = [

    {
        name: "Mercury",
        distance: "0.39",
        diameter: "4,879",
        mass: "0.055",
        orbit: "88 days",
        moons: 0,
        type: "Terrestrial",
        color: "mercury"
    },

    {
        name: "Venus",
        distance: "0.72",
        diameter: "12,104",
        mass: "0.815",
        orbit: "225 days",
        moons: 0,
        type: "Terrestrial",
        color: "venus"
    },

    {
        name: "Earth",
        distance: "1.00",
        diameter: "12,742",
        mass: "1.000",
        orbit: "1.0 years",
        moons: 1,
        type: "Terrestrial",
        color: "earth"
    },

    {
        name: "Mars",
        distance: "1.52",
        diameter: "6,779",
        mass: "0.107",
        orbit: "1.9 years",
        moons: 2,
        type: "Terrestrial",
        color: "mars"
    },

    {
        name: "Jupiter",
        distance: "5.20",
        diameter: "139,822",
        mass: "317.8",
        orbit: "11.9 years",
        moons: 95,
        type: "Gas Giant",
        color: "jupiter"
    },

    {
        name: "Saturn",
        distance: "9.54",
        diameter: "116,464",
        mass: "95.2",
        orbit: "29.5 years",
        moons: 146,
        type: "Gas Giant",
        color: "saturn"
    },

    {
        name: "Uranus",
        distance: "19.19",
        diameter: "50,724",
        mass: "14.5",
        orbit: "84 years",
        moons: 28,
        type: "Ice Giant",
        color: "uranus"
    },

    {
        name: "Neptune",
        distance: "30.07",
        diameter: "49,244",
        mass: "17.1",
        orbit: "164.8 years",
        moons: 16,
        type: "Ice Giant",
        color: "neptune"
    }

];

const body = document.getElementById("comparison-body");

body.innerHTML = "";

comparisonData.forEach(p => {

    let badge = "badge-terrestrial";

    if (p.type === "Gas Giant") badge = "badge-gas";
    if (p.type === "Ice Giant") badge = "badge-ice";

    body.innerHTML += `

<tr>

<td>

<div class="planet-name">

<div class="planet-dot dot-${p.color}"></div>

${p.name}

</div>

</td>

<td>${p.distance}</td>

<td>${p.diameter}</td>

<td>${p.mass}</td>

<td>${p.orbit}</td>

<td>${p.moons}</td>

<td>

<span class="type-badge ${badge}">

${p.type}

</span>

</td>

</tr>

`;

});




