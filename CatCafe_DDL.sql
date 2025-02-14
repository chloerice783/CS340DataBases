CREATE TABLE Customers (
    customerId INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phoneNumber VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL
);

CREATE TABLE Cats (
    catId INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    breed VARCHAR(255) NOT NULL,
    status ENUM('Available', 'Adopted', 'Fostered') NOT NULL
);

CREATE TABLE Reservations (
    reservationId INT AUTO_INCREMENT PRIMARY KEY,
    customerId INT NOT NULL,
    catId Int NOT NULL,
    date DATETIME NOT NULL,
    durationMinutes INT NOT NULL,
    guestCount INT NOT NULL,
    FOREIGN KEY (customerId) REFERENCES Customers(customerId),
	FOREIGN KEY (catId) REFERENCES Cats(catId)
);

CREATE TABLE Orders (
    orderId INT AUTO_INCREMENT PRIMARY KEY,
    customerId INT NOT NULL,
    orderTime DATETIME NOT NULL,
    orderTotal DECIMAL(4,2) NOT NULL,
    FOREIGN KEY (customerId) REFERENCES Customers(customerId)
);

CREATE TABLE MenuItems (
    menuItemId INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(4,2) NOT NULL,
    category ENUM('Food', 'Beverage', 'Misc') NOT NULL
);

  
CREATE TABLE ReservationCats (
    reservationId INT NOT NULL,
    catId INT NOT NULL,
    time DATETIME NOT NULL,
    PRIMARY KEY (reservationId, catId),
    FOREIGN KEY (reservationId) REFERENCES Reservations(reservationId),
    FOREIGN KEY (catId) REFERENCES Cats(catId)
    
);

-- Sample Data Insertions
INSERT INTO Customers (name, phoneNumber, email) VALUES
('John Smith', '111-222-3333', 'JohnSmith@example.com'),
('Mary Smith', '222-111-3333', 'MarySmith@example.com'),
('Jane Smith', '333-222-1111', 'JaneSmith@example.com');

INSERT INTO Cats (name, age, breed, status) VALUES
('Luna', 4, 'Siamese', 'Available'),
('Mittens', 5, 'Domestic Shorthair', 'Adopted'),
('Lola', 8, 'Maine Coon', 'Fostered');

INSERT INTO Reservations (customerId, catId, date, durationMinutes, guestCount) VALUES
(1, 2, '2024-07-07 17:00:00', 60, 1),
(2, 1, '2024-03-07 16:00:00', 90, 2),
(3, 3, '2025-02-01 13:00:00', 120, 3);

INSERT INTO Orders (customerId, orderTime, orderTotal) VALUES
(1,  '2024-07-07 17:30:00', 20.35),
(2,  '2024-03-07 16:25:00', 40.50),
(3,  '2025-02-01 13:30:00', 70.75);

INSERT INTO MenuItems (name, price, category) VALUES
('Latte', 6.99, 'Beverage'),
('Cheesecake', 10.99, 'Food'),
('Cake Slice', 8.99, 'Food');

INSERT INTO ReservationCats (reservationId, catId, time) VALUES
(1, 1, '2024-07-07 17:00:00'),
(2, 2, '2024-07-07 17:00:00'),
(3, 3, '2025-02-01 13:00:00');
 