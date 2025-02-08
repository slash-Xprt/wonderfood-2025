-- Create a new admin user (password will be "admin123")
INSERT INTO users (username, password_hash, role) 
VALUES ('admin', '$2b$10$rMbGJOzPm8aJVn3zHOQnrOdVy1yXALnGA6qZZqtXf8khPNJ9VYEeW', 'admin')
ON CONFLICT (username) DO NOTHING;

-- Insert some sample products
INSERT INTO products (name, description, price, stock_quantity, image) VALUES
('Burger Classique', 'Steak haché juteux avec laitue fraîche, tomate et notre sauce spéciale', 11.99, 50, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80'),
('Cheese Deluxe', 'Double steak haché avec fromage fondu et bacon', 13.99, 30, 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&q=80')
ON CONFLICT DO NOTHING; 