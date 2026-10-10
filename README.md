## Project Overview

The **Food Delivery Management System** is a software development project designed to organize the core operations of a food delivery platform. It consists of three independently developed components: a frontend interface, a Java backend, and a MySQL database.

The frontend provides a user interface for exploring restaurants, viewing food menus, managing carts, and interacting with order-related features. The Java backend focuses on implementing business logic using object-oriented programming principles, while the MySQL database is designed to store and manage information about users, restaurants, menu items, orders, payments, and deliveries.

Currently, these three components are developed separately and have not yet been integrated into a single application. The project establishes the foundation for future integration and demonstrates practical experience with frontend development, Java programming, and relational database management.

## System Architecture

The project is organized into three main components.

### 1. Frontend Development

**Technologies:** HTML, CSS, JavaScript

The frontend provides the user interface and visual elements of the food delivery platform.

Key areas include:

* Customer and administrator interfaces.
* Restaurant and food menu displays.
* Shopping cart and order-related interfaces.
* User-friendly layouts and interactive elements.
* Order management interfaces.

The frontend is currently developed independently and is not connected to the Java backend or MySQL database.

### 2. Backend Development

**Technology:** Java

The backend focuses on the business logic and object-oriented design of the application.

The planned or implemented components may include:

* Customer management.
* Administrator operations.
* Restaurant and menu management.
* Cart and quantity management.
* Order placement and order history.
* Payment and delivery management.
* Exception handling and Java collections.

The Java components are currently developed separately from the frontend and database.

### 3. Database Design

**Technology:** MySQL

The database component models the relationships between the major entities of a food delivery platform.

The database schema includes tables for:

* Users
* Address
* Restaurant
* Menu_Item
* Orders
* Order_Item
* Payment
* Delivery
* Delivery_Partner

These tables support the planned storage and management of customer details, restaurant information, menu items, orders, payments, and deliveries.

The MySQL database is currently maintained separately from the Java backend.

## Current Development Status

| Component                        | Technology            | Status                                         |
| -------------------------------- | --------------------- | ---------------------------------------------- |
| Frontend                         | HTML, CSS, JavaScript | Developed separately                           |
| Backend                          | Java                  | Developed separately                           |
| Database                         | MySQL                 | Schema and SQL operations developed separately |
| Frontend–Backend Integration     | To be implemented     | Pending                                        |
| Backend–Database Integration     | To be implemented     | Pending                                        |
| Complete Application Integration | To be implemented     | Future enhancement                             |

## 🚀 Getting Started

### Prerequisites

Install the following tools:

* Java Development Kit (JDK)
* MySQL Server
* MySQL Workbench (optional)
* Eclipse IDE or another Java IDE
* A modern web browser
* Git

### Running the Frontend

1. Navigate to the frontend directory.
2. Open the main HTML file in a web browser.
3. Explore the available pages and interface features.

The frontend currently operates independently, so its data and interactions are not automatically connected to the Java backend or MySQL database.

### Running the Backend

1. Open the backend project in Eclipse or your preferred Java IDE.
2. Configure the JDK.
3. Review the Java package structure.
4. Run the main Java class.
5. Test the implemented business logic.

### Setting Up the Database

1. Start MySQL Server.
2. Open MySQL Workbench or another MySQL client.
3. Create the project database.
4. Execute the SQL schema script.
5. Run the sample data and query scripts, if provided.

**Note:** The three components must be integrated before data can flow between the frontend, backend, and database as part of a single application.
