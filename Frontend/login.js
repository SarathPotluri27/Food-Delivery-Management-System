// Function to open dashboard page
function goToDashboard(event){
    event.preventDefault();

    let email = document.querySelector("input[type='email']").value.trim().toLowerCase();
    let password = document.querySelector("input[type='password']").value.trim();

    if(email === "" || password === ""){
        alert("Please enter email and password");
        return;
    }

    let adminEmail = "admin@food.com";
    let adminPassword = "admin123";

    if(email === adminEmail && password === adminPassword){
        localStorage.setItem("isAdmin", "true");
        window.location.href = "admin.html";
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let foundUser = users.find(u => 
        u.email.toLowerCase() === email && u.password === password
    );

    if(foundUser){
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("currentUser", foundUser.email); // IMPORTANT CHANGE
        localStorage.setItem("user", JSON.stringify(foundUser));

        window.location.href = "dashboard.html";
    } else {
        alert("Invalid email or password");
    }
}