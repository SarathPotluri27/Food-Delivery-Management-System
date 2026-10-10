let editIndex = -1;

// Check admin access
if(localStorage.getItem("isAdmin") !== "true"){
    window.location.href = "login.html";
}

window.onload = function(){

    loadOrders();  
    loadUsers();
    loadFood();
    loadOverview();
    loadReviewsAdmin();

    showSection("overview", "Dashboard");
}

function showSection(sectionId){

    document.querySelectorAll(".admin-section").forEach(sec => {
        sec.style.display = "none";
    });

    let section = document.getElementById(sectionId);

    if(section){
        section.style.display = "block";
    }

    console.log("Opening:", sectionId); // debug

    if(sectionId === "ordersSection"){
        console.log("Loading orders...");
        loadOrders();
    }

    if(sectionId === "usersSection"){
        console.log("Loading users...");
        loadUsers();
    }

    if(sectionId === "reviewsSection"){
        console.log("Loading reviews...");
        loadReviewsAdmin();
    }
}

function loadOverview(){

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let totalOrders = 0;
    let totalRevenue = 0;

    let ordersByDay = {};
    let revenueByDay = {};
    let foodCount = {};

    users.forEach(user => {

        let orders = JSON.parse(localStorage.getItem("orders_" + user.email)) || [];

        totalOrders += orders.length;

        orders.forEach(order => {

            let date = new Date(order.id).toLocaleDateString();

            // Orders count
            ordersByDay[date] = (ordersByDay[date] || 0) + 1;

            // Revenue
            let amount = Number(order.total || 0);
            totalRevenue += amount;
            revenueByDay[date] = (revenueByDay[date] || 0) + amount;

            // Popularity item
            (order.items || []).forEach(item => {
                foodCount[item.name] = (foodCount[item.name] || 0) + item.qty;
            });
        });
    });

    let topFood = Object.keys(foodCount).sort((a,b) => foodCount[b]-foodCount[a])[0] || "None";

    // Show stats
    document.getElementById("stats").innerHTML = `
        <h3>Total Orders: ${totalOrders}</h3>
        <h3>Total Revenue: ₹${totalRevenue}</h3>
        <h3>Top Item: ${topFood}</h3>
        <h3>Total Users: ${users.length}</h3>
    `;

    // Charts
    createOrdersChart(ordersByDay);
    createRevenueChart(revenueByDay);
}

function createOrdersChart(data){

    let ctx = document.getElementById("ordersChart");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: Object.keys(data),
            datasets: [{
                label: "Orders",
                data: Object.values(data)
            }]
        }
    });
}

function createRevenueChart(data){

    let ctx = document.getElementById("revenueChart");

    new Chart(ctx, {
        type: "line",
        data: {
            labels: Object.keys(data),
            datasets: [{
                label: "Revenue",
                data: Object.values(data)
            }]
        }
    });
}

function addFood(){

    let foods = JSON.parse(localStorage.getItem("foods")) || [];

    let newFood = {
        name: foodName.value,
        price: price.value,
        img: img.value,
        restaurant: restaurant.value,
        rating: rating.value,
        location: location.value,
        category: category.value.toLowerCase(),
        available: true
    };

    if(editIndex === -1){
        foods.push(newFood);
    } else {
        foods[editIndex] = newFood; // update
        editIndex = -1;
    }

    localStorage.setItem("foods", JSON.stringify(foods));

    loadFood();
    alert("Food added successfully!");
}

function loadFood(){

    let foods = JSON.parse(localStorage.getItem("foods")) || [];
    let container = document.getElementById("foodList");

    container.innerHTML = "";

    foods.forEach((f, index) => {

        let div = document.createElement("div");
        div.className = "food-card-admin";

        div.innerHTML = `
            <img src="${f.img}" alt="${f.name}">
            <div class="content">
                <h3>${f.name}</h3>
                <p>${f.restaurant}</p>
                <p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" color="gold" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg> ${f.rating}</p>
                <p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
                </svg> ${f.location}</p>
                <p>₹${f.price}</p>

                <button onclick="toggleAvailability(${index})">
                    ${f.available === false ? "Make Available" : "Make Unavailable"}
                </button>
                <button onclick="editFood(${index})">Edit</button>
                <button onclick="removeFood(${index})">Remove</button>
            </div>
        `;

        container.appendChild(div);
    });
}

function editFood(index){

    let foods = JSON.parse(localStorage.getItem("foods")) || [];

    let food = foods[index];

    document.getElementById("foodName").value = food.name;
    document.getElementById("foodPrice").value = food.price;
    document.getElementById("foodImage").value = food.img;
    document.getElementById("restaurantName").value = food.restaurant;
    document.getElementById("rating").value = food.rating;
    document.getElementById("location").value = food.location;
    document.getElementById("category").value = food.category;

    editIndex = index; 

    document.getElementById("addFood").scrollIntoView({
        behavior: "smooth"
    });
}

function removeFood(index){

    let foods = JSON.parse(localStorage.getItem("foods")) || [];

    foods.splice(index, 1);

    localStorage.setItem("foods", JSON.stringify(foods));

    loadFood();
}

function searchFoodAdmin(){

    let value = document.getElementById("foodSearch").value.toLowerCase();

    let cards = document.querySelectorAll(".food-card-admin");

    cards.forEach(card => {

        let name = card.querySelector("h3").innerText.toLowerCase();

        if(name.includes(value)){
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }

    });
}

function loadOrders(){

    let container = document.getElementById("ordersList");

    if(!container){
        console.error("ordersList not found");
        return;
    }

    container.innerHTML = "";

    let users = JSON.parse(localStorage.getItem("users")) || [];

    users.forEach(user => {

        let orders = JSON.parse(localStorage.getItem("orders_" + user.email)) || [];

        orders.forEach(order => {

            let itemsText = order.items.map(i =>
                `${i.name} (${i.qty})`
            ).join(", ");

            let div = document.createElement("div");

            div.style.background = "white";
            div.style.padding = "15px";
            div.style.marginBottom = "10px";
            div.style.borderRadius = "8px";
            div.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";

            div.innerHTML = `
                <div class="order-row">

                    <div class="order-col">
                        <b>${user.name || user.email}</b>
                    </div>

                    <div class="order-col">
                        ${itemsText}
                    </div>

                    <div class="order-col">
                        <span class="status ${order.status.toLowerCase()}">
                            ${order.status}
                        </span>

                        <button onclick="toggleStatus('${user.email}', ${order.id})">
                            Change
                        </button>
                    </div>

                </div>
            `;

            container.appendChild(div);
        });
    });
}

function loadUsers(){

    let container = document.getElementById("usersList");

    container.innerHTML = "";

    let users = JSON.parse(localStorage.getItem("users")) || [];

    users.forEach(user => {

        let orders = JSON.parse(localStorage.getItem("orders_" + user.email)) || [];

        let revenue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);

        let div = document.createElement("div");

        div.className = "user-card";

        div.innerHTML = `
            <div class="order-row">

                <div class="order-col">
                    <b>${user.name}</b><br>
                    <small>${user.email}</small>
                </div>

                <div class="order-col">
                    Orders: ${orders.length}
                </div>

                <div class="order-col">
                    ₹${revenue}
                </div>

            </div>
        `;
        container.appendChild(div);
    });
}

function updateStatus(email, itemName){

    let orders = JSON.parse(localStorage.getItem("orders_" + email)) || [];

    orders.forEach(order => {

        if(order.name === itemName){
            order.status = "Delivered";
        }

    });

    localStorage.setItem("orders_" + email, JSON.stringify(orders));

    // reload orders table
    loadOrders();
}

function loadReviewsAdmin(){

    let reviews = JSON.parse(localStorage.getItem("reviews")) || [];

    let container = document.getElementById("reviewsList");

    if(!container) return;

    container.innerHTML = "";

    if(reviews.length === 0){
        container.innerHTML = "<p>No reviews yet</p>";
        return;
    }

    reviews.forEach(r => {

        let div = document.createElement("div");

        div.innerHTML = `
            <div class="order-row">

                <div class="order-col">
                    <b>${r.user}</b>
                </div>

                <div class="order-col">
                    ${r.food} (${r.restaurant})
                </div>

                <div class="order-col">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" color="gold" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                    </svg> ${r.rating}
                </div>

                <div class="order-col">
                    <p>${r.review}</p>
                </div>

            </div>
            
        `;

        container.appendChild(div);
    });
}

function toggleStatus(email, orderId){

    let orders = JSON.parse(localStorage.getItem("orders_" + email)) || [];

    orders.forEach(order => {
        if(order.id === orderId){

            if(order.status === "Pending"){
                order.status = "Preparing";
                order.timeline[1].done = true;
            }
            else if(order.status === "Preparing"){
                order.status = "Out for Delivery";
                order.timeline[2].done = true;
            }
            else if(order.status === "Out for Delivery"){
                order.status = "Delivered";
                order.timeline[3].done = true;
            }
        }
    });

    localStorage.setItem("orders_" + email, JSON.stringify(orders));
    loadOrders();
}

function toggleAvailability(index){

    let foods = JSON.parse(localStorage.getItem("foods")) || [];

    foods[index].available = foods[index].available === false ? true : false;

    localStorage.setItem("foods", JSON.stringify(foods));

    loadFood();
}

function adminLogout(){
    localStorage.removeItem("isAdmin");
    window.location.href = "login.html";
}