package com.foodapp;

// Importing array list and scanner package 
import java.util.ArrayList;
import java.util.Scanner;

public class MainApp {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        Menu menu = new Menu();

        Cart cart = new Cart();

        // Stores all customers
        ArrayList<Customer> customers = new ArrayList<>();
        
        // Central order storage
        ArrayList<Order> allOrders = new ArrayList<>();

        // Default admin login
        Admin admin = new Admin("admin", "admin123");

        // Default menu items
        menu.addItem(new Item(1, "Pizza", "Dominos", 200));
        menu.addItem(new Item(2, "Burger", "KFC", 150));
        menu.addItem(new Item(3, "Pasta", "Pizza Hut", 180));

        int mainChoice;

        do {

            System.out.println("\n FOOD DELIVERY SYSTEM ");
            
            System.out.println("1. Customer");
            System.out.println("2. Admin");
            System.out.println("0. Exit");

            System.out.print("Enter Choice: ");

            mainChoice = sc.nextInt();
            sc.nextLine();

            switch (mainChoice) {

                // CUSTOMER PANEL
                case 1:

                    Customer currentCustomer = null;

                    System.out.println("\n1. Login");
                    System.out.println("2. Signup");

                    System.out.print("Enter Choice: ");

                    int authChoice = sc.nextInt();
                    sc.nextLine();

                    // CUSTOMER SIGNUP
                    if (authChoice == 2) {

                        System.out.print("Enter Username: ");
                        String username = sc.nextLine();

                        System.out.print("Enter Password: ");
                        String password = sc.nextLine();

                        boolean userExists = false;

                        // Check duplicate username
                        for (Customer existingCustomer : customers) {

                            if (existingCustomer.username.equals(username)) {

                                userExists = true;
                                break;
                            }
                        }

                        try {

                            // Throw exception if username exists
                            if (userExists) {

                                throw new Exception("Username Already Exists");
                            }

                            System.out.print("Enter Full Name: ");
                            String fullName = sc.nextLine();

                            System.out.print("Enter Email: ");
                            String email = sc.nextLine();

                            System.out.print("Enter Phone Number: ");
                            String phoneNumber = sc.nextLine();

                            System.out.print("Enter Address: ");
                            String address = sc.nextLine();

                            Customer customer = new Customer(
                                    username,
                                    password,
                                    fullName,
                                    email,
                                    phoneNumber,
                                    address
                            );

                            customers.add(customer);

                            System.out.println("Signup Successful");

                        } catch (Exception e) {

                            // Handle signup exception
                            System.out.println(e.getMessage());
                        }
                    }

                    // LOGIN
                    System.out.print("Enter Username: ");
                    String loginUsername = sc.nextLine();

                    System.out.print("Enter Password: ");
                    String loginPassword = sc.nextLine();

                    // Validate customer login
                    for (Customer customer : customers) {

                        if (customer.username.equals(loginUsername)
                                && customer.password.equals(loginPassword)) {

                            currentCustomer = customer;
                            break;
                        }
                    }

                    try {

                        // Throw exception if login failed
                        if (currentCustomer == null) {

                            throw new Exception("Invalid Username or Password");
                        }

                    } catch (Exception e) {

                        // Handle login exception
                        System.out.println(e.getMessage());

                        break;
                    }

                    System.out.println("Login Successful");

                    int customerChoice;

                    do {

                        System.out.println("\n CUSTOMER PANEL ");

                        System.out.println("1. View Menu");
                        System.out.println("2. Search Item");
                        System.out.println("3. View Cart");
                        System.out.println("4. View Liked Items");
                        System.out.println("5. View Order History");
                        System.out.println("6. View Profile");
                        System.out.println("0. Back");

                        System.out.print("Enter Choice: ");

                        customerChoice = sc.nextInt();
                        sc.nextLine();

                        switch (customerChoice) {

                            // VIEW MENU
                            case 1:

                                menu.displayMenu();

                                System.out.print("\nEnter Item ID: ");

                                int itemId = sc.nextInt();
                                sc.nextLine();

                                Item selectedItem =
                                        menu.getItemById(itemId);

                                if (selectedItem == null) {

                                    System.out.println("Invalid Item");

                                    break;
                                }

                                System.out.println("\n1. Add To Cart");
                                System.out.println("2. Order Now");
                                System.out.println("3. Like Item");
                                System.out.println("4. Add Review & Rating");

                                System.out.print("Enter Choice: ");

                                int itemChoice = sc.nextInt();
                                sc.nextLine();

                                // ADD TO CART
                                if (itemChoice == 1) {

                                    System.out.print("Enter Quantity: ");

                                    int quantity = sc.nextInt();
                                    sc.nextLine();

                                    try {

                                        // Handle invalid quantity
                                        cart.addToCart(
                                                selectedItem,
                                                quantity
                                        );

                                    } catch (Exception e) {

                                        System.out.println(e.getMessage());
                                    }
                                }

                                // ORDER NOW
                                else if (itemChoice == 2) {

                                    System.out.print("Enter Quantity: ");

                                    int quantity = sc.nextInt();
                                    sc.nextLine();

                                    try {

                                        ArrayList<CartItem> directItems = new ArrayList<>();

                                        directItems.add(
                                                new CartItem(
                                                        selectedItem,
                                                        quantity
                                                )
                                        );

                                        System.out.println("\n1. UPI");
                                        System.out.println("2. Card");
                                        System.out.println("3. Cash On Delivery");

                                        System.out.print("Choose Payment Method: ");

                                        int paymentChoice = sc.nextInt();
                                        sc.nextLine();

                                        String paymentMethod = "";

                                        switch (paymentChoice) {

                                            case 1:

                                                paymentMethod = "UPI";
                                                break;

                                            case 2:

                                                paymentMethod = "Card";
                                                break;

                                            case 3:

                                                paymentMethod = "Cash On Delivery";
                                                break;

                                            default:

                                                paymentMethod = "Unknown";
                                        }
                                        
                                        Payment payment = new Payment(
                                                1,
                                                paymentMethod,
                                                selectedItem.price * quantity
                                        );
                                        
                                        Order order = new Order(
                                                currentCustomer.username,
                                                directItems,
                                                payment
                                        );

                                        order.displayOrder();
                                        
                                        currentCustomer.addOrder(order);
                                        
                                        payment.displayPayment();
                                        
                                        allOrders.add(order);

                                    } catch (Exception e) {

                                        // Handle empty order exception
                                        System.out.println(
                                                e.getMessage()
                                        );
                                    }
                                }

                                // LIKE ITEM
                                else if (itemChoice == 3) {

                                    currentCustomer.likeItem(selectedItem);
                                }

                                // REVIEW & RATING
                                else if (itemChoice == 4) {

                                    System.out.print("Enter Review: ");

                                    String review = sc.nextLine();

                                    System.out.print("Enter Rating (1-5): ");

                                    int rating = sc.nextInt();
                                    sc.nextLine();

                                    try {

                                        selectedItem.addReview(review);

                                        // Handle invalid rating
                                        selectedItem.addRating(rating);

                                        System.out.println("Review Added Successfully");

                                    } catch (Exception e) {

                                        System.out.println(
                                                e.getMessage()
                                        );
                                    }
                                }

                                break;

                            // SEARCH ITEM
                            case 2:

                                System.out.print("Enter Item Name: ");

                                String keyword = sc.nextLine();

                                menu.searchItem(keyword);

                                break;

                            // VIEW CART
                            case 3:

                                cart.viewCart();

                                if (!cart.getCartItems().isEmpty()) {

                                    System.out.println("\n1. Remove Item");
                                    System.out.println("2. Place Order");
                                    System.out.println("0. Back");

                                    System.out.print("Enter Choice: ");

                                    int cartChoice = sc.nextInt();
                                    sc.nextLine();

                                    // REMOVE ITEM
                                    if (cartChoice == 1) {

                                        System.out.print("Enter Item ID To Remove: ");

                                        int removeId = sc.nextInt();
                                        sc.nextLine();

                                        try {

                                            // Handle invalid remove item
                                            cart.removeItem(removeId);

                                        } catch (Exception e) {

                                            System.out.println(e.getMessage());
                                        }
                                    }

                                    // PLACE ORDER
                                    else if (cartChoice == 2) {

                                        try {

                                        	System.out.println("\n1. UPI");
                                        	System.out.println("2. Card");
                                        	System.out.println("3. Cash On Delivery");

                                        	System.out.print("Choose Payment Method: ");

                                        	int paymentChoice = sc.nextInt();
                                        	sc.nextLine();

                                        	String paymentMethod = "";

                                        	switch (paymentChoice) {

                                        	    case 1:

                                        	        paymentMethod = "UPI";
                                        	        break;

                                        	    case 2:

                                        	        paymentMethod = "Card";
                                        	        break;

                                        	    case 3:

                                        	        paymentMethod = "Cash On Delivery";
                                        	        break;

                                        	    default:

                                        	        paymentMethod = "Unknown";
                                        	}

                                        	Payment payment = new Payment(
                                        	        1,
                                        	        paymentMethod,
                                        	        0
                                        	);

                                        	Order cartOrder = new Order(
                                        	        currentCustomer.username,
                                        	        cart.getCartItems(),
                                        	        payment
                                        	);

                                        	// Set actual total amount
                                        	payment.amount = cartOrder.total;

                                        	payment.displayPayment();

                                        	// Store order centrally
                                        	allOrders.add(cartOrder);

                                            cartOrder.displayOrder();

                                            currentCustomer.addOrder(
                                                    cartOrder
                                            );

                                            cart.clearCart();

                                        } catch (Exception e) {

                                            // Handle empty cart order
                                            System.out.println(e.getMessage());
                                        }
                                    }
                                }

                                break;

                            // VIEW LIKED ITEMS
                            case 4:

                                currentCustomer.viewLikedItems();

                                break;

                            // VIEW ORDER HISTORY
                            case 5:

                                currentCustomer.viewOrderHistory();

                                break;
                                
                            // VIEW PROFILE
                            case 6:

                                currentCustomer.viewProfile();

                                break;

                            case 0:

                                System.out.println("Returning...");
                                break;

                            default:

                                System.out.println("Invalid Choice");
                        }

                    } while (customerChoice != 0);

                    break;

                // ADMIN PANEL
                case 2:

                    System.out.print("Enter Admin Username: ");

                    String adminUsername = sc.nextLine();

                    System.out.print("Enter Admin Password: ");

                    String adminPassword = sc.nextLine();

                    try {

                        // Validate admin login
                        if (!admin.login(
                                adminUsername,
                                adminPassword
                        )) {

                            throw new Exception("Invalid Admin Credentials");
                        }

                    } catch (Exception e) {

                        System.out.println(e.getMessage());

                        break;
                    }

                    int adminChoice;

                    do {

                        System.out.println("\n ADMIN PANEL ");

                        System.out.println("1. Add Item");
                        System.out.println("2. View Menu");
                        System.out.println("3. Update Order Status");
                        System.out.println("0. Back");

                        System.out.print("Enter Choice: ");

                        adminChoice = sc.nextInt();
                        sc.nextLine();

                        switch (adminChoice) {

                            // ADD ITEM
                            case 1:

                                menu.addItemDynamically(sc);

                                break;

                            // VIEW MENU
                            case 2:

                                menu.displayMenu();

                                break;
                                
                            // UPDATE ORDER STATUS
                            case 3:

                                if (allOrders.isEmpty()) {

                                    System.out.println("No Orders Available");

                                    break;
                                }

                                // Display all orders
                                for (Order order : allOrders) {

                                    System.out.println(
                                            "Order ID: " + order.orderId +
                                            " | Customer: " + order.customerName +
                                            " | Status: " + order.status
                                    );
                                }

                                System.out.print("Enter Order ID: ");

                                int orderId = sc.nextInt();
                                sc.nextLine();

                                System.out.println("\n1. Preparing");
                                System.out.println("2. Out For Delivery");
                                System.out.println("3. Delivered");
                                System.out.println("4. Cancelled");

                                System.out.print("Choose Status: ");

                                int statusChoice = sc.nextInt();
                                sc.nextLine();

                                String newStatus = "";

                                switch (statusChoice) {

                                    case 1:

                                        newStatus = "Preparing";
                                        break;

                                    case 2:

                                        newStatus = "Out For Delivery";
                                        break;

                                    case 3:

                                        newStatus = "Delivered";
                                        break;

                                    case 4:

                                        newStatus = "Cancelled";
                                        break;
                                }

                                // Update order status
                                for (Order order : allOrders) {

                                    if (order.orderId == orderId) {

                                        order.updateStatus(newStatus);
                                    }
                                }

                                break;

                            case 0:

                                System.out.println("Returning...");
                                break;

                            default:

                                System.out.println("Invalid Choice");
                        }

                    } while (adminChoice != 0);

                    break;

                case 0:

                    System.out.println("Thank You");
                    break;

                default:

                    System.out.println("Invalid Choice");
            }

        } while (mainChoice != 0);

        sc.close();
    }
}