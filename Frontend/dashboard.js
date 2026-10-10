// Global variables
let cart = [];
let orders = [];
let savedUPI = null;
let currentCategory = "";
let currentCity = "";
let currentSearch = "";

// check login
if(localStorage.getItem("isLoggedIn") !== "true"){
    window.location.href = "login.html";
}

function getCurrentUser(){
    return JSON.parse(localStorage.getItem("user"));
}

window.onload = function(){

    let user = getCurrentUser();
    if(!user) return;

    // Load food items
    loadDynamicFood();

    // Load profile
    document.getElementById("nameText").innerText = user.name;
    document.getElementById("emailText").innerText = user.email;
    document.getElementById("phoneText").innerText = user.phone;
    document.getElementById("passwordText").innerText = user.password;

    // Load cart UI
    loadCartUI(user);

    // Load orders UI
    loadOrders();

    updateCartCount();

    loadSavedCards(user);
};
/*
Hides all menu pages and shows the selected page.
If the selected page is a dashboard section (like profile, orders, payment, address, cart, aboutPage, contactPage), it hides the categories section.
If the selected page is not a dashboard section, it shows the categories section.
@parameter {string} sectionId - the id of the section to show
 */
function showSection(sectionId){

    // hide everything first
    document.querySelectorAll(".menu-page").forEach(el => el.style.display = "none");
    document.querySelectorAll(".dashboard-section").forEach(el => el.style.display = "none");

    // hide categories
    document.getElementById("categoriesSection").style.display = "none";

    // show selected
    document.getElementById(sectionId).style.display = "block";

    if(sectionId === "favorites"){
        loadFavorites();
    }

    window.scrollTo(0,0);
}

/* Search food items by name */
function searchFood(){

    currentSearch = document.getElementById("searchInput").value.toLowerCase();

    applyFilters();   // use central filter
}

function clearFilters(){

    // Reset all states
    currentCategory = "";
    currentCity = "";
    currentSearch = "";

    // Reset inputs
    document.getElementById("searchInput").value = "";
    document.getElementById("citySelect").value = "";

    // Show categories again
    document.getElementById("categoriesSection").style.display = "block";

    // Hide back button
    document.getElementById("backBtn").style.display = "none";

    // Hide "no items" message
    document.getElementById("noItemsMsg").style.display = "none";

    // Apply reset
    applyFilters();
}

/* Enable profile editing */
function editProfile(){

    document.getElementById("nameInput").value =
    document.getElementById("nameText").innerText;

    document.getElementById("emailInput").value =
    document.getElementById("emailText").innerText;

    document.getElementById("phoneInput").value =
    document.getElementById("phoneText").innerText;

    document.getElementById("passwordInput").value =
    document.getElementById("passwordText").innerText;

    document.getElementById("nameText").style.display="none";
    document.getElementById("emailText").style.display="none";
    document.getElementById("phoneText").style.display="none";
    document.getElementById("passwordText").style.display="none";

    document.getElementById("nameInput").style.display="inline";
    document.getElementById("emailInput").style.display="inline";
    document.getElementById("phoneInput").style.display="inline";
    document.getElementById("passwordInput").style.display="inline";

    document.getElementById("saveProfileBtn").style.display="inline";

}

/* Save updated profile */        
function saveProfile(){

    let user = JSON.parse(localStorage.getItem("user"));

    user.name = document.getElementById("nameInput").value;
    user.email = document.getElementById("emailInput").value;
    user.phone = document.getElementById("phoneInput").value;
    user.password = document.getElementById("passwordInput").value;

    localStorage.setItem("user", JSON.stringify(user));

    document.getElementById("nameText").innerText =
    document.getElementById("nameInput").value;

    document.getElementById("emailText").innerText =
    document.getElementById("emailInput").value;

    document.getElementById("phoneText").innerText =
    document.getElementById("phoneInput").value;

    document.getElementById("passwordText").innerText =
    document.getElementById("passwordInput").value;

    document.getElementById("nameText").style.display="inline";
    document.getElementById("emailText").style.display="inline";
    document.getElementById("phoneText").style.display="inline";
    document.getElementById("passwordText").style.display="inline";

    document.getElementById("nameInput").style.display="none";
    document.getElementById("emailInput").style.display="none";
    document.getElementById("phoneInput").style.display="none";
    document.getElementById("passwordInput").style.display="none";

    document.getElementById("saveProfileBtn").style.display="none";

}

/*
Enables editing of the address
Hides the address text and shows the address input field
Shows the save address button
*/
function editAddress(){

    document.getElementById("addressInput").value =
    document.getElementById("addressText").innerText;

    document.getElementById("addressText").style.display="none";
    document.getElementById("addressInput").style.display="inline";

    document.getElementById("saveAddressBtn").style.display="inline";

}

/*
Saves the address entered by the user
Hides the address input field and shows the address text
Hides the save address button
*/
function saveAddress(){

    let address = document.getElementById("addressInput").value;

    let user = getCurrentUser();
    localStorage.setItem("address_" + user.email, address);

    document.getElementById("addressText").innerText = address;

    document.getElementById("addressText").style.display="inline";
    document.getElementById("addressInput").style.display="none";

    document.getElementById("saveAddressBtn").style.display="none";
}

/*
Edits the payment method of the user
Prompts the user to enter a new payment method and updates the payment text if the user enters a valid payment method
*/
function editPayment(){

    let payment = prompt("Enter new payment method:");
    if(payment){
        document.getElementById("paymentText").innerText = payment;
    }

}

/* Save card and display it */
function saveCard(){

    let cardNumber = document.querySelector("#cardSection input[placeholder='Card Number']").value;
    let cardName = document.querySelector("#cardSection input[placeholder='Card Holder Name']").value;

    if(cardNumber === "" || cardName === ""){
        alert("Enter card details");
        return;
    }

    let last4 = cardNumber.slice(-4);

    let user = getCurrentUser();
    let key = "cards_" + user.email;

    let cards = JSON.parse(localStorage.getItem(key)) || [];
    cards.push({ name: cardName, number: last4 });

    localStorage.setItem(key, JSON.stringify(cards));

    renderCard(cardName, last4);
}

function renderCard(name, last4){

    let cardDisplay = document.createElement("div");
    cardDisplay.className = "saved-card";

    cardDisplay.innerHTML =
        "<p><b>Card Holder:</b> " + name + "</p>" +
        "<p><b>Card Number:</b> **** **** **** " + last4 + "</p>";

    let payBtn = document.createElement("button");
    payBtn.innerText = "Pay";
    payBtn.onclick = completePayment;

    cardDisplay.appendChild(payBtn);

    document.getElementById("savedCards").appendChild(cardDisplay);
    document.getElementById("savedCardsTitle").style.display = "block";
}

/*
Shows the selected payment method section.
Hides all payment method sections and shows the section corresponding to the selected payment method.
@parameter {string} type - the type of payment method to show (card, upi, cod)
*/
function showPayment(type){

    document.getElementById("cardSection").style.display="none";
    document.getElementById("upiSection").style.display="none";
    document.getElementById("codSection").style.display="none";
    if(type === "card"){
        document.getElementById("cardSection").style.display="block";
    }
    if(type === "upi"){
        document.getElementById("upiSection").style.display="block";
    }
    if(type === "cod"){
        document.getElementById("codSection").style.display="block";
    }

}

/*
Adds a new food item to the cart list.
Prompts the user to enter a food item and adds it to the cart list if the item is not empty.
@return {void}
*/
function addItem(){

    let item = prompt("Enter food item:");
    if(item && item.trim() !== ""){
        let li = document.createElement("li");
        li.innerHTML = item + ' <button onclick="removeItem(this)">Remove</button>';
        document.getElementById("cartList").appendChild(li);
    }

}

/* Adds a new food item to the cart list. */
function addItemFromMenu(name, img, price){

    let foods = JSON.parse(localStorage.getItem("foods")) || [];
    let item = foods.find(m => m.name.toLowerCase() === name.toLowerCase());
    //  Blocking if unavailable
    if(item && item.available === false){
        alert(name + " is currently unavailable");
        return;
    }

    let cartList = document.getElementById("cartList");
    let items = cartList.querySelectorAll("li");
    for(let liItem of items){
        let itemName = liItem.querySelector(".cart-name").innerText;

        if(itemName === name){

            let qty = liItem.querySelector(".qty");
            qty.innerText = parseInt(qty.innerText) + 1;
            showCartToast("✔ " + name + " quantity updated");
            return;
        }
    }
            
    let li = document.createElement("li");

    li.setAttribute("data-price",price);
    li.innerHTML = `
    <img src="${img}" class="cart-img">
    <span class="cart-name">${name}</span>
    <div class="qty-box">
    <button onclick="decreaseQty(this)">-</button>
    <span class="qty">1</span>
    <button onclick="increaseQty(this)">+</button>
    </div>
    <span class="cart-price">₹${price}</span>
    <button onclick="removeItem(this)">Remove</button>`;

    cartList.appendChild(li);
    updateCartCount();
    showCartToast(name + " added to cart");

    let user = getCurrentUser();
    let cartKey = "cart_" + user.email;
    let cartData = JSON.parse(localStorage.getItem(cartKey)) || [];

    let existing = cartData.find(item => item.name === name);

    if(existing){
        existing.qty += 1;
    } else {
        cartData.push({ name, img, price, qty: 1 });
    }

    localStorage.setItem(cartKey, JSON.stringify(cartData));

}

// Increase and decrease quantity
function increaseQty(btn){

    let li = btn.closest("li");
    let name = li.querySelector(".cart-name").innerText;

    let qtyElement = li.querySelector(".qty");
    let newQty = parseInt(qtyElement.innerText) + 1;

    qtyElement.innerText = newQty;

    let user = getCurrentUser();
    let cartKey = "cart_" + user.email;

    let cartData = JSON.parse(localStorage.getItem(cartKey)) || [];

    cartData.forEach(item => {
        if(item.name === name){
            item.qty = newQty;
        }
    });

    localStorage.setItem(cartKey, JSON.stringify(cartData));
}

function decreaseQty(btn){

    let li = btn.closest("li");
    let name = li.querySelector(".cart-name").innerText;

    let qtyElement = li.querySelector(".qty");
    let currentQty = parseInt(qtyElement.innerText);

    let user = getCurrentUser();
    let cartKey = "cart_" + user.email;

    let cartData = JSON.parse(localStorage.getItem(cartKey)) || [];

    if(currentQty > 1){

        let newQty = currentQty - 1;
        qtyElement.innerText = newQty;

        cartData.forEach(item => {
            if(item.name === name){
                item.qty = newQty;
            }
        });

    } else {

        li.remove();
        cartData = cartData.filter(item => item.name !== name);
    }

    localStorage.setItem(cartKey, JSON.stringify(cartData));
    updateCartCount();
}

/* Updates the cart count by counting the number of items in the cart list. */
function updateCartCount(){

    let items = document.querySelectorAll("#cartList li");
    document.getElementById("cartCount").innerText = items.length;

}

/* Removes a food item from the cart list. */
function removeItem(button){

    let li = button.closest("li");
    let name = li.querySelector(".cart-name").innerText;

    li.remove();

    let user = getCurrentUser();
    let cartKey = "cart_" + user.email;

    let cartData = JSON.parse(localStorage.getItem(cartKey)) || [];

    cartData = cartData.filter(item => item.name !== name);

    localStorage.setItem(cartKey, JSON.stringify(cartData));

    updateCartCount();
}
        
/* Hides all menu pages and shows the home menu page. */
function goHome(){

    // RESET FILTERS (IMPORTANT)
    currentCategory = "";
    currentCity = "";

    document.getElementById("citySelect").value = "";

    // Show categories again
    document.getElementById("categoriesSection").style.display = "block";

    // Hide back button
    document.getElementById("backBtn").style.display = "none";

    // Show home menu
    document.getElementById("homeMenu").style.display = "block";

    // Hide "no items" message
    document.getElementById("noItemsMsg").style.display = "none";

    // APPLY FILTERS (instead of manual show all)
    applyFilters();

    // Hide all other sections
    document.querySelectorAll(".menu-page").forEach(sec => {
        if(sec.id !== "homeMenu"){
            sec.style.display = "none";
        }
    });

    document.querySelectorAll(".dashboard-section").forEach(sec => {
        sec.style.display = "none";
    });
}

// Loads all food items from local storage into the home menu page.
function loadDynamicFood(){

    let foods = JSON.parse(localStorage.getItem("foods")) || [];

    let container = document.getElementById("homeItems");

    if(!container){
        console.error("homeItems not found");
        return;
    }

    container.innerHTML = "";

    if(foods.length === 0){
        container.innerHTML = "<p>No food items available</p>";
        return;
    }

    let user = getCurrentUser();
    let favs = JSON.parse(localStorage.getItem("favorites_" + user.email)) || [];

    foods.forEach(food => {

        let isFav = favs.includes(food.name);

        let div = document.createElement("div");
        div.className = "food-card";

        let safeCategory = (food.category || "").toLowerCase();
        let safeId = food.name.replace(/\s/g, "");

        div.setAttribute("data-category", safeCategory);
        div.setAttribute("data-city", food.location.toLowerCase());

        div.innerHTML = `
            <div class="img-container">
                <img src="${food.img}">
                <span class="fav-icon ${isFav ? 'active' : ''}" 
                      onclick="toggleFavorite('${food.name}')">

                    <svg viewBox="0 0 16 16" class="heart-icon">
                        <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
                    </svg>

                </span>
            </div>

            <h3>${food.name}</h3>
            <p>${food.restaurant}</p>

            <p>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" color="gold" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg> ${food.rating}
            </p>

            <p>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
                </svg> ${food.location}
            </p>

            <p>₹${food.price}</p>

            <div class="buttons">
                <button onclick="addItemFromMenu('${food.name}','${food.img}',${food.price})">
                    Add to Cart
                </button>
                <button onclick="openReview('${food.name}')">
                    Reviews
                </button>
            </div>

            <div id="reviews-${safeId}"></div>
        `;

        container.appendChild(div);
    });

    console.log("Foods loaded:", foods);
}

function loadSavedCards(user){

    let cards = JSON.parse(localStorage.getItem("cards_" + user.email)) || [];

    let container = document.getElementById("savedCards");
    container.innerHTML = "";

    if(cards.length === 0) return;

    document.getElementById("savedCardsTitle").style.display = "block";

    cards.forEach(card => {
        renderCard(card.name, card.number);
    });
}

function toggleFavorite(name){

    let user = getCurrentUser();
    let key = "favorites_" + user.email;

    let favs = JSON.parse(localStorage.getItem(key)) || [];

    if(favs.includes(name)){
        favs = favs.filter(f => f !== name);
    } else {
        favs.push(name);
    }

    localStorage.setItem(key, JSON.stringify(favs));

    loadDynamicFood(); // refresh icons
}

function loadFavorites(){

    let user = getCurrentUser();
    let favs = JSON.parse(localStorage.getItem("favorites_" + user.email)) || [];
    let foods = JSON.parse(localStorage.getItem("foods")) || [];

    let container = document.getElementById("favoritesList");
    container.innerHTML = "";

    let favFoods = foods.filter(f =>
        favs.some(fav => fav.toLowerCase() === f.name.toLowerCase())
    );

    if(favFoods.length === 0){
        container.innerHTML = `
            <div class="empty-box">
                <img src="https://t4.ftcdn.net/jpg/14/01/44/13/360_F_1401441358_LLWOhWUU07qGHBXDVSmp6Y6mOy6FNhBe.jpg"  >
                <p>No favorites yet</p>
            </div>
        `;
        return;
    }

    favFoods.forEach(food => {

        let div = document.createElement("div");
        div.className = "food-card";

        div.innerHTML = `
            <img src="${food.img}">
            <h3>${food.name}</h3>
            <p>${food.restaurant}</p>
            <p class="rating"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" color="gold" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg> ${food.rating}</p>
            <p class="price">₹${food.price}</p>

            <button onclick="removeFavorite('${food.name}')">
                Remove
            </button>
        `;

        container.appendChild(div);
    });
}

function removeFavorite(name){

    let user = getCurrentUser();
    let key = "favorites_" + user.email;

    let favs = JSON.parse(localStorage.getItem(key)) || [];

    favs = favs.filter(f => f.toLowerCase() !== name.toLowerCase());

    localStorage.setItem(key, JSON.stringify(favs));

    loadFavorites(); // refresh UI
}
  
/* Shows a toast message at the bottom of the page for a short duration. */
function showCartToast(message){

    let toast = document.getElementById("cartToast");
    toast.innerText = message;
    toast.classList.add("show");
    setTimeout(function(){
        toast.classList.remove("show");
    },2000);

}

/*
Checkout function.
This function is called when the user clicks on the checkout button.
It takes all items from the cart list and displays them in the checkout menu page.
The total cost of all items is calculated and displayed in the checkout menu page.
Then, the checkout menu page is displayed.
*/
function checkout(){

    let cartItems = document.querySelectorAll("#cartList li");
    let checkoutContainer = document.getElementById("checkoutItems");

    checkoutContainer.innerHTML = "";

    let total = 0;

    cartItems.forEach(item => {

        let isChecked = item.querySelector(".cart-check").checked;

        if(!isChecked) return;

        let name = item.querySelector(".cart-name").innerText;
        let price = parseInt(item.getAttribute("data-price"));
        let qty = parseInt(item.querySelector(".qty").innerText);

        let itemTotal = price * qty;
        total += itemTotal;

        let div = document.createElement("p");
        div.innerText = `${name} x ${qty} = ₹${itemTotal}`;

        checkoutContainer.appendChild(div);
    });

    document.getElementById("totalAmount").innerText = total;

    showSection("checkoutMenu");
}

function completePayment(){

    let user = getCurrentUser();
    let cart = JSON.parse(localStorage.getItem("cart_" + user.email)) || [];

    if(cart.length === 0){
        alert("Cart is empty");
        return;
    }

    let orders = JSON.parse(localStorage.getItem("orders_" + user.email)) || [];

    let totalAmount = cart.reduce((sum, item) => {
        return sum + (item.price * item.qty);
    }, 0);

    const newOrder = {
        id: Date.now(),
        items: cart,
        total: totalAmount,
        status: "Pending",
        timeline: [
            { step: "Order Placed", done: true },
            { step: "Preparing", done: false },
            { step: "Out for Delivery", done: false },
            { step: "Delivered", done: false }
        ]
    };

    orders.push(newOrder);

    localStorage.setItem("orders_" + user.email, JSON.stringify(orders));
    localStorage.removeItem("cart_" + user.email);

    document.getElementById("cartList").innerHTML = "";
    document.getElementById("cartCount").innerText = "0";

    // alert("Order placed successfully!");

    document.getElementById("successPopup").style.display = "flex";
}

function saveUPI(){

    let upi = document.getElementById("upiInput").value;

    if(upi === ""){
        alert("Enter UPI ID");
        return;
    }

    let user = getCurrentUser();
    localStorage.setItem("upi_" + user.email, upi);

    renderUPI(upi);
}

function renderUPI(upi){

    let div = document.createElement("div");
    div.className = "saved-card";

    div.innerHTML = "<p><b>UPI:</b> " + upi + "</p>";

    let payBtn = document.createElement("button");
    payBtn.innerText = "Pay";
    payBtn.type = "button";
    payBtn.onclick = completePayment;

    div.appendChild(payBtn);

    document.getElementById("savedUPISection").appendChild(div);
    document.getElementById("savedUPITitle").style.display = "block";
}

function showSavedUPI(){

    if(savedUPI){
        document.getElementById("savedUPISection").style.display = "block";
        document.getElementById("savedUPIText").innerText = savedUPI;
    }
}

function loadOrders(){

    let user = getCurrentUser();
    let orders = JSON.parse(localStorage.getItem("orders_" + user.email)) || [];

    let container = document.getElementById("ordersTable");
    container.innerHTML = "";

    if(orders.length === 0){
        container.innerHTML = `
            <div class="empty-box">
                <img src="../Images/no-orders.png" width="200">
                <p>No orders yet</p>
            </div>
        `;
        return;
    }

    orders.forEach(order => {

        let items = order.items || [];

        let itemsText = items.length > 0
            ? items.map(i => i.name + " (" + i.qty + ")").join(", ")
            : "No items";

        let div = document.createElement("div");

        div.className = "order-card";

        div.innerHTML = `
            <div class="order-top">
                <b>Order #${order.id}</b>
            </div>

            <div class="order-items">
                ${itemsText}
            </div>

            <div class="order-price">
                ₹${order.total}
            </div>

            <div class="status ${order.status.toLowerCase()}">
                ${order.status}
            </div>
        `;

        container.appendChild(div);
    });
}

/* Shows the payment menu page. */
function goToPayment(){

    showSection("payment");

}

/* Filter food items by selected city */
function filterByCity(){

    currentCity = document.getElementById("citySelect").value.toLowerCase();

    applyFilters();
}

function filterByCategory(category){

    currentCategory = category.toLowerCase();

    document.getElementById("categoriesSection").style.display = "none";
    document.getElementById("backBtn").style.display = "inline-block";

    applyFilters();
}

function applyFilters(){

    let items = document.querySelectorAll("#homeItems .food-card");

    items.forEach(item => {

        let itemCategory = (item.getAttribute("data-category") || "").toLowerCase();
        let itemCity = (item.getAttribute("data-city") || "").toLowerCase();
        let itemName = item.querySelector("h3").innerText.toLowerCase();

        let categoryMatch = currentCategory === "" || itemCategory === currentCategory;
        let cityMatch = currentCity === "" || itemCity === currentCity;
        let searchMatch = currentSearch === "" || itemName.includes(currentSearch);

        if(categoryMatch && cityMatch && searchMatch){
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }

    });
}
 
function openReview(foodName){

    let safeId = foodName.replace(/\s/g, "");
    let container = document.getElementById("reviews-" + safeId);

    let reviews = JSON.parse(localStorage.getItem("reviews")) || [];

    let foodReviews = reviews.filter(r => r.food === foodName);

    let html = "";

    if(foodReviews.length === 0){
        html = "<p>No reviews yet</p>";
    } else {
        html = foodReviews.map(r => `
            <p>
                <b>${r.user}</b> <br>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" color="gold" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg> ${r.rating}
                ${r.review}
            </p>
        `).join("");
    }

    container.innerHTML = `
        ${html}
        <button onclick="addReview('${foodName}')">Add Review</button>
    `;
}

function addReview(foodName){

    let foods = JSON.parse(localStorage.getItem("foods")) || [];

    // Find food object
    let food = foods.find(f => f.name === foodName);

    let review = prompt("Enter review:");
    let rating = prompt("Rating (1-5):");

    if(!review || !rating) return;

    let user = JSON.parse(localStorage.getItem("user")) || {};

    let reviews = JSON.parse(localStorage.getItem("reviews")) || [];

    reviews.push({
        food: foodName,
        restaurant: food ? food.restaurant : "Unknown",
        review: review,
        rating: rating,
        user: user.name || user.email
    });

    localStorage.setItem("reviews", JSON.stringify(reviews));

    openReview(foodName);
}

function loadReviews(foodName){

    let reviews = JSON.parse(localStorage.getItem("reviews")) || [];

    let container = document.getElementById("reviews-" + foodName);

    if(!container) return;

    let foodReviews = reviews.filter(r => r.food === foodName);

    container.innerHTML = foodReviews.map(r => `
        <p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" color="gold" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg> ${r.rating} - ${r.review}</p>
    `).join("");
}

// close success popup
function closePopup(){
    document.getElementById("successPopup").style.display = "none";
    goHome();
}

function logout(){
    localStorage.removeItem("isLoggedIn");
    window.location.href = "login.html";
}

function loadCartUI(user){

    let cartKey = "cart_" + user.email;
    let savedCart = JSON.parse(localStorage.getItem(cartKey)) || [];

    let cartList = document.getElementById("cartList");
    cartList.innerHTML = "";

    // EMPTY CART UI
    if(savedCart.length === 0){
        cartList.innerHTML = `
            <div class="empty-box">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-JGyBEKsrSjQWZJTJ-B8uNYsOGMbtasr3YA&s" width="400">
                <p>Your cart is empty</p>
            </div>
        `;
        return;
    }

    savedCart.forEach(item => {

        let li = document.createElement("li");

        li.setAttribute("data-price", item.price);

        li.innerHTML = `
            <input type="checkbox" class="cart-check" checked>

            <img src="${item.img}" class="cart-img">

            <span class="cart-name">${item.name}</span>

            <div class="qty-box">
                <button onclick="decreaseQty(this)">-</button>
                <span class="qty">${item.qty}</span>
                <button onclick="increaseQty(this)">+</button>
            </div>

            <span class="cart-price">₹${item.price}</span>

            <button onclick="removeItem(this)">Remove</button>
        `;

        cartList.appendChild(li);
    });
}

function saveMenuToStorage() {

  let items = document.querySelectorAll(".menu-page .food-card");

//   let oldMenu = JSON.parse(localStorage.getItem("menu")) || [];

  let menuMap = new Map();

  items.forEach(item => {

    let name = item.querySelector("h3").innerText;

    let priceText = item.querySelector(".price").innerText;
    let price = parseInt(priceText.replace("₹", ""));

    let img = item.querySelector("img").getAttribute("src");

    // preserve availability
    let existing = oldMenu.find(m => m.name === name);

    let available = existing ? existing.available : true;

    menuMap.set(name, { name, price, img, available });

  });

  let menu = Array.from(menuMap.values());

  localStorage.setItem("menu", JSON.stringify(menu));

  console.log("Menu updated:", menu);
}