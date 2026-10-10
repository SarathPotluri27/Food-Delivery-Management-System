package com.foodapp;

import java.util.ArrayList;

public class Item {

    int id;
    String name;
    String restaurantName;
    double price;

    // Stores all reviews
    ArrayList<String> reviews = new ArrayList<>();

    // Stores all ratings
    ArrayList<Integer> ratings = new ArrayList<>();

    public Item(int id, String name, String restaurantName, double price) {

        this.id = id;
        this.name = name;
        this.restaurantName = restaurantName;
        this.price = price;
    }

    // Add customer review
    public void addReview(String review) {

        reviews.add(review);
    }

    // Add customer rating
    public void addRating(int rating) throws Exception {

        // Exception handling for invalid rating
        if (rating < 1 || rating > 5) {

            throw new Exception("Rating should be between 1 and 5");
        }

        ratings.add(rating);
    }

    // Calculate average rating
    public double getAverageRating() {

        if (ratings.isEmpty()) {
            return 0;
        }

        int total = 0;
        for (int rating : ratings) {
            total += rating;
        }

        return (double) total / ratings.size();
    }

    // Display item details
    public void display() {

        System.out.println(
                id + ". " + name +
                " | Restaurant: " + restaurantName +
                " | Price: ₹" + price +
                " | Rating: " + String.format("%.1f", getAverageRating())
        );
    }
}
