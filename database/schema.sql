CREATE DATABASE inventory;
USE inventory;

CREATE TABLE user_groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_name VARCHAR(100) NOT NULL
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'power_user', 'normal_user') DEFAULT 'normal_user',
    group_id INT,
    FOREIGN KEY (group_id) REFERENCES user_groups(id)
);

CREATE TABLE resources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resource_type ENUM('desktop', 'workstation', 'server', 'switch', 'printer', 'scanner') NOT NULL,
    serial_number VARCHAR(100) UNIQUE,
    assigned_user_id INT NULL,
    assigned_group_id INT NULL,
    FOREIGN KEY (assigned_user_id) REFERENCES users(id),
    FOREIGN KEY (assigned_group_id) REFERENCES user_groups(id)
);

CREATE TABLE complaints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resource_id INT NOT NULL,
    user_id INT NOT NULL,
    issue_description TEXT,
    status ENUM('open', 'in_progress', 'resolved') DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resource_id) REFERENCES resources(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);