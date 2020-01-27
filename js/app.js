const countriesEl = document.getElementById("countries");
const toggleBtn = document.getElementById("toggle");
const filterBtn = document.getElementById("filter");
const regionFilters = filterBtn.querySelectorAll("li");
const searchEl = document.getElementById("search");
const modal = document.getElementById("modal");
const overlay = document.getElementById("overlay");
const closeBtn = document.getElementById("close");

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
            <strong>Currency converter:</strong><br>
            <span id="rate"></span> <button id="exchange">
            <i class="fas fa-exchange-alt"></i>
          </button><br>
            <select id="fromNativeCode">
          <option value=${country.currencies[0].code}>${country.currencies[0].code}</option>
          <option value="PLN">PLN</option>
        </select>
             <input type="number" id="fromNativeAmount" placeholder="0" value="1" >
           <select id="toPlnCode">
          <option value="PLN">PLN</option>
          <option value=${country.currencies[0].code}>${country.currencies[0].code}</option>
        </select>
        <input type="number" id="toPlnAmount" placeholder="0" /> 
        </p>
        <p>
            <strong>Languages:</strong>
            ${country.languages.map(language => language.name).join(", ")}
        </p>
    `;

  // Currency converter

  const fromNativeCode = document.getElementById("fromNativeCode");
  const fromNativeAmount = document.getElementById("fromNativeAmount");
  const toPlnCode = document.getElementById("toPlnCode");
  const toPlnAmount = document.getElementById("toPlnAmount");
  const exchange = document.getElementById("exchange");

  fromNativeCode.addEventListener("change", calculate);
  fromNativeAmount.addEventListener("input", calculate);
  toPlnCode.addEventListener("change", calculate);
  toPlnAmount.addEventListener("input", calculate);

  exchange.addEventListener("click", () => {
    const temp = fromNativeCode.value;
    fromNativeCode.value = toPlnCode.value;
    toPlnCode.value = temp;
    calculate();
  });

  function calculate() {
    const displayRate = document.getElementById("rate");
    const from_currency = fromNativeCode.value;
    const to_currency = toPlnCode.value;

    fetch(`https://api.exchangerate-api.com/v4/latest/${from_currency}`)
      .then(res => res.json())
      .then(res => {
        const rate = res.rates[to_currency];
        displayRate.innerText = `1 ${from_currency} = ${rate} ${to_currency}`;
        toPlnAmount.value = (fromNativeAmount.value * rate).toFixed(2);
      });
  }

  calculate();
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
