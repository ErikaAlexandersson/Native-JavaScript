let validUserName;
//vänder förstasidan
let signInButton = document.querySelector("#sign-in-btn");
let backFaceHeader = document.querySelector(".backface-header");
let flip = document.querySelector("#flip");
let flipRecepies = document.querySelector(".recepies");
signInButton.addEventListener("click", () => {
  flip.style.transform = "rotateY(-180deg)";
  flipRecepies.style.opacity = "100";
  let welcome = document.createTextNode(
    "Welcome " + localStorage.getItem("userName") + "!"
  );
  backFaceHeader.appendChild(welcome);
});

let grocerylist = document.querySelector("#grocerylist");

//-----------------------Inloggning---------------------------------------------

let validEmail;
let validPassword;

//För att validera att alla fälten är ifyllda
let userName = document.querySelector("#username");
userName.addEventListener("input", (event) => {
  validUserName = event.target.value;
  localStorage.setItem("userName", validUserName);
});
let password = document.querySelector("#password");
password.addEventListener("input", (event) => {
  validPassword = event.target.value;
});

//-----------------------Carousell---------------------------------------------
let input = document.querySelector("#searchbar2");
let searchInfo;
let recepieResult = document
  .querySelector("#searchbar2")
  .addEventListener("input", (event) => {
    searchInfo = event.target.value;
  });

let carouselSlide = document.querySelector("#carousel-slide");

//Alla parametrar till att flytta korten
let left = document.querySelector(".left-arrow");
let counter = 0;
let size;
let sizePx;
let compStyles = window.getComputedStyle(carouselSlide);
sizePx = compStyles.getPropertyValue("width");
size = parseInt(sizePx);

function Next() {
  let right = document.querySelectorAll(".right-arrow");
  //tar bort sista knappen
  if (right.length - 1 === counter) {
    return;
  } else {
    let sizePx;
    let compStyles = window.getComputedStyle(carouselSlide);
    sizePx = compStyles.getPropertyValue("width");
    size = parseInt(sizePx);
    carouselSlide.style.transition = "transform 0.2s ease-in-out";
    counter++;
    carouselSlide.style.transform = "translateX(" + -size * counter + "px)";
    deleteChart();
    sendNutritionRequest();
  }
}
let lefty = document.querySelectorAll(".left-arrow");
function previous() {
  let sizePx;
  let compStyles = window.getComputedStyle(carouselSlide);
  if (counter === 0) {
    return;
  }
  if (counter >= 1) {
    sizePx = compStyles.getPropertyValue("width");
    size = parseInt(sizePx);
    carouselSlide.style.transition = "transform 0.4s ease-in-out";
    counter--;
    carouselSlide.style.transform = "translateX(" + -size * counter + "px)";
    deleteChart();
    sendNutritionRequest();
  }
}

let recepieSlide = document.querySelector(".recepie-slide");
//Rensa alla recept
function clearRecepies() {
  for (let b = carouselSlide.children.length - 1; b >= 0; b--) {
    carouselSlide.children[b].parentNode.removeChild(carouselSlide.children[b]);
  }
  //Nollställer karusellen
  carouselSlide.style.transform = "translateX(0)";
  counter = 0;
  sendApiRequest();
}

let rightArrowClick;
let leftArrowClick;
document.addEventListener("click", function (e) {
  e = e || window.event;
  let target = e.target;
  if (target.className === "right-arrow") {
    rightArrowClick = target.className;
    Next(rightArrowClick);
  }
  if (target.className === "left-arrow") {
    leftArrowClick = target.className;
    previous(leftArrowClick);
  }
});
let backSideSearch = document
  .querySelector("#searchbar2")
  .addEventListener("input", (event) => {
    searchInfo = event.target.value;
  });

let search2 = document.querySelector("#search-button2");

//Kickar igång hela kalaset
search2.addEventListener("click", () => {
  nutristionsButton.style.display = "block";
  clearRecepies();
  sendApiRequest();
});
let recepieArray;

// Fetch funktionen
function sendApiRequest() {
  let YOUR_APP_ID = "f316c367";
  let YOUR_API_KEY = "209131d0c229f629c823bd2904b1b72f";
  fetch(
    `https://api.edamam.com/api/recipes/v2/?q=${searchInfo}&app_id=${YOUR_APP_ID}&app_key=${YOUR_API_KEY}&type=public`
  )
    .then((response) => response.json())
    .then((result) => {
      recepieArray = result;
      //skapa <div> element
      for (let a = 0; recepieArray.hits.length > a; a++) {
        let createRecepieSlide = document.createElement("div");
        createRecepieSlide.className = "recepie-slide";
        carouselSlide.appendChild(createRecepieSlide);

        //Överskrift till recepts
        let recepieHeader = document.createElement("h1");
        recepieHeader.className = "recepieheader";
        recepieHeader.appendChild(
          document.createTextNode(recepieArray.hits[a].recipe.label)
        );
        createRecepieSlide.appendChild(recepieHeader);

        //Bild till recept
        let recepieimage = document.createElement("div");
        createRecepieSlide.appendChild(recepieimage);
        recepieimage.className = "recepieimage";
        let leftArrow = document.createElement("span");
        leftArrow.className = "left-arrow";
        leftArrow.appendChild(document.createTextNode("<"));
        recepieimage.appendChild(leftArrow);
        let foodImage = recepieArray.hits[a].recipe.image;
        let img = document.createElement("img");
        img.setAttribute("src", foodImage);
        recepieimage.appendChild(img);
        let rightArrow = document.createElement("span");
        rightArrow.className = "right-arrow";
        rightArrow.appendChild(document.createTextNode(">"));
        recepieimage.appendChild(rightArrow);
        let addToChart = document.createElement("p");
        addToChart.appendChild(document.createTextNode("Add items to list"));
        addToChart.className = "add-to-chart";
        createRecepieSlide.appendChild(addToChart);

        //Inköpslista till recept
        let recepieQuantity;
        let recepieText;
        let recepieMeasure;
        let recepielist = document.createElement("ul");
        recepielist.className = "recepielist";
        createRecepieSlide.appendChild(recepielist);
        for (i = 0; i < recepieArray.hits[a].recipe.ingredients.length; i++) {
          recepieQuantity = recepieArray.hits[a].recipe.ingredients[i].quantity;
          recepieText = recepieArray.hits[a].recipe.ingredients[i].food;
          recepieMeasure = recepieArray.hits[a].recipe.ingredients[i].measure;
          let allIngredients =
            recepieQuantity + " " + recepieMeasure + " " + recepieText;

          listMaker = document.createElement("li");
          listMaker.className = "ingredient-list";
          grocerySpan = document.createElement("span");
          grocerySpan.className = "span-move-to-list";
          span = document.createElement("span");
          listMaker.appendChild(span);
          listMaker.appendChild(grocerySpan);
          span.appendChild(
            document.createTextNode(
              recepieArray.hits[a].recipe.ingredientLines[i]
            )
          );
          grocerySpan.innerHTML = allIngredients;
          recepielist.appendChild(listMaker);
          let button = document.createElement("button");
          button.appendChild(document.createTextNode("✓"));
          button.className = "delete";
          listMaker.appendChild(button);
        }
        let recepielink = recepieArray.hits[a].recipe.url;
        let link = document.createElement("a");
        link.setAttribute("href", recepielink);
        link.setAttribute("target", "_blank");
        link.innerHTML = "Get the full recepie";
        createRecepieSlide.appendChild(link);
      }
      input.value = "";
      let lefty = document.querySelectorAll(".left-arrow");
      lefty[0].style.opacity = "0";
      let righty = document.querySelectorAll(".right-arrow");
      let lastRighty = righty.length - 1;
      righty[lastRighty].style.opacity = "0";
    });
}

// Till chartJS

let nutristionsButton = document.querySelector(".nutristions-button");
nutristionsButton.addEventListener("click", () => {
  nutristionsButton.style.display = "none";
  sendNutritionRequest();
});

let outsideConfig;
function getConfig(config) {
  outsideConfig = config;
}

let outsideChart;
function getChart(chart) {
  outsideChart = chart;
}

function deleteChart() {
  outsideChart.destroy();
}

let myChart = document.querySelector(".mychart").getContext("2d");
let config;
let chart;
let fat;
let fatRDI;
let carbs;
let carbsRDI;
let protein;
let proteinRDI;

function sendNutritionRequest() {
  let YOUR_APP_ID = "f316c367";
  let YOUR_API_KEY = "209131d0c229f629c823bd2904b1b72f";
  fetch(
    `https://api.edamam.com/api/recipes/v2/?q=${searchInfo}&app_id=${YOUR_APP_ID}&app_key=${YOUR_API_KEY}&type=public`
  )
    .then((response) => response.json())
    .then((result) => {
      recepieArray = result;
    });

  fat = recepieArray.hits[counter].recipe.digest[0].total;
  fatRDI = recepieArray.hits[counter].recipe.digest[0].daily;
  carbs = recepieArray.hits[counter].recipe.digest[1].total;
  carbsRDI = recepieArray.hits[counter].recipe.digest[1].daily;
  protein = recepieArray.hits[counter].recipe.digest[2].total;
  proteinRDI = recepieArray.hits[counter].recipe.digest[2].daily;

  config = {
    type: "bar", // Olika typer, går att ändra
    data: {
      labels: ["Fat", "Carbs", "Protein"],
      datasets: [
        {
          label: "Total gram",
          data: [fat, carbs, protein],
          backgroundColor: ["#CFD56D", "#6D7BD5", "#D56D6E"],
          borderWidth: 1,
          borderColor: "white",
        },
        {
          label: "RDI",
          data: [fatRDI, carbsRDI, proteinRDI],
          backgroundColor: ["#A8C58A"],
          borderWidth: 1,
          borderColor: "white",
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: true,
          title: {
            display: true,
            labels: {
              color: "white",
            },
            text: "Nuitritions",
            fontSize: 12,
          },
        },
      },
    },
  };
  getConfig(config);
  chart = new Chart(myChart, config);
  getChart(chart);
}
//Flyttar recept till inköpslistan
let saveToMyPage = document.querySelector(".save-to-my-list");

document.addEventListener("click", function (e) {
  e = e || window.event;
  let target = e.target;
  if (target.parentNode.className === "ingredient-list") {
    let groceryItem = target.parentNode.childNodes[1].textContent;
    moveToMylist(groceryItem);
    saveToMyPage.style.display = "inline";
  }
});

let measure;

let ingredietnsWhitoutNumber;
let moveTolist = document.querySelector(".span-move-to-list");
// Hitta li elementet och lägga till på listan

function moveToMylist(groceryItem) {
  let ingredietnsToPost = {};
  let li = document.createElement("li");
  li.className = "lists";
  grocerylist.appendChild(li);
  //Bara få siffran från receptet
  var num = groceryItem.match(/\d+/g);
  measure = num[0];
  ingredietnsToPost.count = measure;
  // Bara få texten från receptet
  var letter = groceryItem.match(/[a-zA-Z]+/g);
  ingredietnsWhitoutNumber = letter.join(" ");
  ingredietnsToPost.name = ingredietnsWhitoutNumber;
  getVariabels(ingredietnsToPost);
  li.appendChild(document.createTextNode(groceryItem));
}

function getVariabels(ingredietnsToPost) {
  saveToMyPage.addEventListener("click", () => {
    saveToMyPage.style.display = "none";
    let myBasket = document.querySelector("#my-basket");
    myBasket.style.display = "inline";
    postToMyPage(ingredietnsToPost);
  });
}

function postToMyPage(ingredietnsToPost) {
  fetch("http://localhost:5555", {
    body: JSON.stringify(ingredietnsToPost),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });
  fetch("http://localhost:5555")
    .then((result) => result.json())
    .then((response) => {
      console.log(response);
    });
}
