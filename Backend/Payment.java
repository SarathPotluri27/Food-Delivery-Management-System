package com.foodapp;

public class Payment {

    int paymentId;
    String paymentMethod;
    double amount;
    String paymentStatus;

    public Payment(int paymentId,
                   String paymentMethod,
                   double amount) {

        this.paymentId = paymentId;
        this.paymentMethod = paymentMethod;
        this.amount = amount;

        // Default payment status
        this.paymentStatus = "Success";
    }

    // Display payment details
    public void displayPayment() {

        System.out.println("\n PAYMENT DETAILS ");

        System.out.println("Payment ID: " + paymentId);

        System.out.println("Payment Method: " + paymentMethod);

        System.out.println("Amount Paid: ₹" + amount);

        System.out.println("Payment Status: " + paymentStatus);
    }
}
