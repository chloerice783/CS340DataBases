-- Update customer information
UPDATE Customers 
SET name = :newName, phoneNumber = :newPhone, email = :newEmail
WHERE customerId = :customerId;

-- Delete a customer
DELETE FROM Customers 
WHERE customerId = :customerId;

-- Retrieve all customers
SELECT * FROM Customers;

-- Insert a new reservation
INSERT INTO Reservations (customerId, date, durationMinutes, guestCount)
VALUES (:customerId, :reservationDate, :reservationDuration, :guestCount);

-- Update reservation details
UPDATE Reservations 
SET date = :newDate, durationMinutes = :newDuration, guestCount = :newGuestCount
WHERE reservationId = :reservationId;

-- Delete a reservation
DELETE FROM Reservations 
WHERE reservationId = :reservationId;

-- Retrieve all reservations
SELECT * FROM Reservations;

-- Insert a new order
INSERT INTO Orders (customerId, orderTime, orderTotal)
VALUES (:customerId, :orderTime, :orderTotal);

-- Update order total
UPDATE Orders 
SET orderTotal = :newTotal
WHERE orderId = :orderId;

-- Delete an order
DELETE FROM Orders 
WHERE orderId = :orderId;

-- Retrieve all orders
SELECT * FROM Orders;

-- Insert a new menu item
INSERT INTO MenuItems (name, price, category)
VALUES (:itemName, :itemPrice, :itemCategory);

-- Update menu item details
UPDATE MenuItems 
SET name = :newName, price = :newPrice, category = :newCategory
WHERE menuItemId = :menuItemId;

-- Delete a menu item
DELETE FROM MenuItems 
WHERE menuItemId = :menuItemId;

-- Retrieve all menu items
SELECT * FROM MenuItems;

-- Insert a new cat record
INSERT INTO Cats (name, age, breed, status)
VALUES (:catName, :catAge, :catBreed, :catStatus);

-- Update cat information
UPDATE Cats 
SET name = :newName, age = :newAge, breed = :newBreed, status = :newStatus
WHERE catId = :catId;

-- Delete a cat record
DELETE FROM Cats 
WHERE catId = :catId;

-- Retrieve all cats
SELECT * FROM Cats;
