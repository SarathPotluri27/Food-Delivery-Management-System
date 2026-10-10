package com.foodapp;

public class CartItem {

    Item item;
    int quantity;

    public CartItem(Item item, int quantity) {
        this.item = item;
        this.quantity = quantity;
    }

    // Calculate subtotal
    public double getSubtotal() {
        return item.price * quantity;
    }
}