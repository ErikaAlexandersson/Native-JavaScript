let groceryArray = fetch("http://localhost:5555")
  .then((result) => result.json())
  .then((response) => {
    groceryArray = response;

    console.log(groceryArray);
    let groceries = document.querySelector(".groceries");
    groceries.innerHTML = "";

    for (i = 0; groceryArray.length > i; i++) {
      //Skapar alla element
      let myPageli = document.createElement("li");
      myPageli.className = "list-item";
      let myPageAmount = document.createElement("div");
      myPageAmount.className = "amount";
      let minus = document.createElement("p");
      minus.appendChild(document.createTextNode("-"));
      minus.className = "minus";
      let pluss = document.createElement("p");
      pluss.appendChild(document.createTextNode("+"));
      pluss.className = "pluss";
      let measureNumber = document.createElement("p");
      measureNumber.className = "number";
      measureNumber.appendChild(document.createTextNode(groceryArray[i].count));
      let myPageGroceryItem = document.createElement("p");
      myPageGroceryItem.className = "grocery-name";
      let myPageGroceryId = document.createElement("p");
      myPageGroceryId.className = "id";
      myPageGroceryId.appendChild(document.createTextNode(groceryArray[i].id));
      let deleteItem = document.createElement("div");
      deleteItem.className = "delete-item";
      deleteItem.innerHTML = "🗑️";
      //lägger till dem i rätt ordning
      groceries.appendChild(myPageli);
      myPageli.appendChild(myPageAmount);
      myPageAmount.appendChild(minus);
      myPageAmount.appendChild(measureNumber);
      myPageAmount.appendChild(pluss);
      myPageGroceryItem.appendChild(
        document.createTextNode(groceryArray[i].name)
      );
      myPageli.appendChild(myPageGroceryItem);
      myPageli.appendChild(myPageGroceryId);
      myPageli.appendChild(deleteItem);
    }

    //Välkomsttext med localStorage
    let h1 = document.querySelector("#mypage-header");
    let userName = localStorage.getItem("userName");
    h1.appendChild(document.createTextNode(userName + "´s" + " grocerylist"));

    // För att ändra mängd av vara
    document.addEventListener("click", function (e) {
      e = e || window.event;
      if (e.target.className === "pluss") {
        let currentNumber;
        e.target.parentNode.childNodes[1].style.color = "red";
        let addNumber = Number(e.target.parentNode.childNodes[1].textContent);
        let targetedID = e.target.parentNode.parentNode.children[2].textContent;
        addNumber++;
        let updateObject = {};
        currentNumber = addNumber;
        updateObject.id = targetedID;
        updateObject.count = currentNumber;
        uppdatelistItem(updateObject, targetedID);
        e.target.parentNode.childNodes[1].innerHTML = addNumber;
      }
      if (e.target.className === "minus") {
        let currentNumber;
        e.target.parentNode.childNodes[1].style.color = "red";
        let addNumber = Number(e.target.parentNode.childNodes[1].textContent);
        let targetedID = e.target.parentNode.parentNode.children[2].textContent;
        if (addNumber === 0) {
          return;
        } else {
          addNumber--;
          let updateObject = {};
          currentNumber = addNumber;
          updateObject.id = targetedID;
          updateObject.count = currentNumber;
          uppdatelistItem(updateObject, targetedID);
          e.target.parentNode.childNodes[1].innerHTML = addNumber;
        }
      }
    });

    function uppdatelistItem(updateObject, targetedID) {
      // PUT för att byta ut information, vill ha ID
      fetch(`http://localhost:5555/${targetedID}`, {
        body: JSON.stringify(updateObject),
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
      });
    }
    //För att ta bort en vara
    document.addEventListener("click", function (e) {
      e = e || window.event;
      if (e.target.className === "delete-item") {
        let deleteItem = e.target.parentNode.children[2].textContent;
        deletelistItem(deleteItem);
        e.target.parentNode.children[0].className = "amount-display-none";
        e.target.parentNode.children[1].className = "line-through";
        e.target.parentNode.children[3].style.display = "none";
      }
    });

    document.addEventListener("click", function (e) {
      e = e || window.event;
      if (e.target.className === "get-item-back") {
        e.target.parentNode.children[0].className = "amount";
        e.target.parentNode.children[1].className = "grocery-name";
        e.target.parentNode.children[3].style.display = "block";
        e.target.parentNode.children[4].style.display = "none";
      }
    });

    let uppdateBtn = document.querySelector(".uppdate-btn");
    uppdateBtn.addEventListener("click", () => {
      let grocerylist = document.querySelector(".groceries");
      grocerylist.innerHTML = "";
      refreshPage();
    });
    function refreshPage() {
      fetch("http://localhost:5555")
        .then((result) => result.json())
        .then((response) => {
          groceryArray = response;

          console.log(groceryArray);

          for (i = 0; groceryArray.length > i; i++) {
            let groceries = document.querySelector(".groceries");
            //Skapar alla element
            let myPageli = document.createElement("li");
            myPageli.className = "list-item";
            let myPageAmount = document.createElement("div");
            myPageAmount.className = "amount";
            let minus = document.createElement("p");
            minus.appendChild(document.createTextNode("-"));
            minus.className = "minus";
            let pluss = document.createElement("p");
            pluss.appendChild(document.createTextNode("+"));
            pluss.className = "pluss";
            let measureNumber = document.createElement("p");
            measureNumber.className = "number";
            measureNumber.appendChild(
              document.createTextNode(groceryArray[i].count)
            );
            let myPageGroceryItem = document.createElement("p");
            myPageGroceryItem.className = "grocery-name";
            let myPageGroceryId = document.createElement("p");
            myPageGroceryId.className = "id";
            myPageGroceryId.appendChild(
              document.createTextNode(groceryArray[i].id)
            );
            let deleteItem = document.createElement("div");
            deleteItem.className = "delete-item";
            deleteItem.innerHTML = "🗑️";
            //lägger till dem i rätt ordning
            groceries.appendChild(myPageli);
            myPageli.appendChild(myPageAmount);
            myPageAmount.appendChild(minus);
            myPageAmount.appendChild(measureNumber);
            myPageAmount.appendChild(pluss);
            myPageGroceryItem.appendChild(
              document.createTextNode(groceryArray[i].name)
            );
            myPageli.appendChild(myPageGroceryItem);
            myPageli.appendChild(myPageGroceryId);
            myPageli.appendChild(deleteItem);
          }
        });
    }

    function deletelistItem(deleteItem) {
      //DElETE för att ta bort, vill bara ha ID -
      fetch(`http://localhost:5555/${deleteItem}`, {
        method: "DELETE",
      }).then((response) => {});
    }
  }); //Avslutar hela kalaset
