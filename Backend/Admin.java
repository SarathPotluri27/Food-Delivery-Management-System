package com.foodapp;

public class Admin {

    String username;
    String password;

    public Admin(String username, String password) {

        this.username = username;
        this.password = password;
    }

    // Validate admin login
    public boolean login(String enteredUsername,
                         String enteredPassword) {

        return username.equals(enteredUsername)
                && password.equals(enteredPassword);
    }
}
