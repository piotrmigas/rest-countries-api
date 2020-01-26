window.addEventListener("load", function() {
  document.body.classList.add("all-loaded");
});

const countriesEl = document.getElementById("countries");
const toggleBtn = document.getElementById("toggle");
const filterBtn = document.getElementById("filter");
const regionFilters = filterBtn.querySelectorAll("li");
const searchEl = document.getElementById("search");
const modal = document.getElementById("modal");
const overlay = document.getElementById("overlay");
const closeBtn = document.getElementById("close");
const spinner = document.querySelector(".spinner");

getCountries();

async function getCountries() {
  const res = await fetch("https://restcountries.eu/rest/v2/all");
  const countries = await res.json();
  displayCountries(countries);
}

function displayCountries(countries) {
  countriesEl.innerHTML = "";

  countries.forEach(country => {
    const countryEl = document.createElement("div");
    countryEl.classList.add("card");

    countryEl.innerHTML = `
            <div>
                <img src="${country.flag}" alt="" />
            </div>
            <div class="card-body">
                <h3 class="country-name">${country.name}</h3>
                <p>
                    <strong>Population:</strong>
                    ${country.population.toLocaleString("en-US")}
                </p>
                <p class="country-region">
                    <strong>Region:</strong>
                    ${country.region}
                </p>
                <p>
                    <strong>Capital:</strong>
                    ${country.capital}
                </p>
            </div>
        `;

    // Modal

    countryEl.addEventListener("click", () => {
      showCountryDetails(country);
      modal.classList.add("is-visible");
      overlay.classList.add("is-visible");
    });

    countriesEl.appendChild(countryEl);
  });
}

function showCountryDetails(country) {
  const modalBody = modal.querySelector(".modal-body");
  const modalImg = modal.querySelector("img");

  modalImg.src = country.flag;

  modalBody.innerHTML = `
        <h2>${country.name}</h2>
        <p>
            <strong>Native Name:</strong>
            ${country.nativeName}
        </p>
        <p>
            <strong>Dialing Code:</strong>
            +${country.callingCodes[0]}
        </p>
        <p>
            <strong>Population:</strong>
            ${country.population.toLocaleString("en-US")}
        </p>
        <p>
            <strong>Region:</strong>
            ${country.region}
        </p>
        <p>
            <strong>Sub Region:</strong>
            ${country.subregion}
        </p>
        <p>
            <strong>Capital:</strong>
            ${country.capital}
        </p>
        <p>
            <strong>Top Level Domain:</strong>
            ${country.topLevelDomain[0]}
        </p>
        <p>
            <strong>Currencies:</strong>
            ${country.currencies
              .filter(c => c.name)
              .map(c => `${c.name} (${c.code})`)
              .join(", ")}
        </p>
        <p>
            <strong>Languages:</strong>
            ${country.languages.map(language => language.name).join(", ")}
        </p>
    `;
}

// Theme switch

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Filters

filterBtn.addEventListener("click", () => {
  filterBtn.classList.toggle("open");
});

// Close button

closeBtn.addEventListener("click", () => {
  modal.classList.remove("is-visible");
  overlay.classList.remove("is-visible");
});

// Click overlay

overlay.addEventListener("click", function() {
  modal.classList.remove("is-visible");
  overlay.classList.remove("is-visible");
});

searchEl.addEventListener("input", e => {
  const { value } = e.target;
  const countryName = document.querySelectorAll(".country-name");

  countryName.forEach(name => {
    if (name.innerText.toLowerCase().includes(value.toLowerCase())) {
      // .card -> .card-body -> .country-name
      name.parentElement.parentElement.style.display = "block";
    } else {
      name.parentElement.parentElement.style.display = "none";
    }
  });
});

// Add a filter

regionFilters.forEach(filter => {
  filter.addEventListener("click", () => {
    const value = filter.innerText;
    const countryRegion = document.querySelectorAll(".country-region");

    countryRegion.forEach(region => {
      if (region.innerText.includes(value) || value === "All") {
        // .card -> .card-body -> .country-region
        region.parentElement.parentElement.style.display = "block";
      } else {
        region.parentElement.parentElement.style.display = "none";
      }
    });
  });
});
