// Function to toggle password visibility
function togglePassword() {
    var pass = document.getElementById("password");

    if (pass.type === "password") {
        pass.type = "text";
    } 
    else {
        pass.type = "password";
    }
}

// Function to toggle confirm-password visibility
function toggleConfirmPassword() {
    var pass = document.getElementById("confirm-password");

    if (pass.type === "password") {
        pass.type = "text";
    } 
    else {
        pass.type = "password";
    }
}

// Function to show success popup
function showSuccess(event){
    event.preventDefault();

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let password = document.getElementById("password").value.trim();

    // validation (optional but good)
    if(name === "" || email === "" || phone === "" || password === ""){
        alert("Please fill all fields");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    // check if user already exists
    let exists = users.find(u => u.email === email);

    if(exists){
        alert("User already exists");
        return;
    }

    // store user
    let newUser = {
        name,
        email,
        phone,
        password
    };

    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));

    alert("Signup successful!");

    window.location.href = "login.html";
}

/* Redirect user to login page after successful signup */
function goToLogin(){

    window.location.href = "login.html";
}