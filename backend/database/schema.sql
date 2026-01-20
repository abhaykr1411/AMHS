CREATE TABLE roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  role_name VARCHAR(50) UNIQUE
);

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE,
  password VARCHAR(255),
  full_name VARCHAR(100),
  role_id INT,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE project_groups (
  id INT PRIMARY KEY AUTO_INCREMENT,
  group_name VARCHAR(100)
);

-- FIXED: Added ON DELETE CASCADE to prevent errors when deleting users
CREATE TABLE user_groups (
  user_id INT,
  group_id INT,
  PRIMARY KEY(user_id, group_id),
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY(group_id) REFERENCES project_groups(id) ON DELETE CASCADE
);

CREATE TABLE resource_types (
  id INT PRIMARY KEY AUTO_INCREMENT,
  type_name VARCHAR(50)
);

-- FIXED: Added ON DELETE SET NULL for better handling
CREATE TABLE resources (
  id INT PRIMARY KEY AUTO_INCREMENT,
  resource_code VARCHAR(50) UNIQUE,
  resource_type_id INT,
  description TEXT,
  assigned_user_id INT NULL,
  assigned_group_id INT NULL,
  FOREIGN KEY(resource_type_id) REFERENCES resource_types(id),
  FOREIGN KEY(assigned_user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY(assigned_group_id) REFERENCES project_groups(id) ON DELETE SET NULL
);

-- FIXED: Added ON DELETE CASCADE for complaints
CREATE TABLE complaints (
  id INT PRIMARY KEY AUTO_INCREMENT,
  resource_id INT,
  raised_by INT,
  group_id INT,
  title VARCHAR(200),
  description TEXT,
  status ENUM('Open','In Progress','Resolved') DEFAULT 'Open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(resource_id) REFERENCES resources(id) ON DELETE CASCADE,
  FOREIGN KEY(raised_by) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY(group_id) REFERENCES project_groups(id) ON DELETE CASCADE
);

-- Sample data to get started
INSERT INTO roles (role_name) VALUES ('admin'), ('power_user'), ('normal_user');

-- Default admin user (username: admin, password: admin123)
INSERT INTO users (username, password, full_name, role_id) 
VALUES ('admin', 'admin123', 'System Administrator', 1);