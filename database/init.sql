CREATE TABLE funky_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    color VARCHAR(20) DEFAULT '#4CAF50',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO funky_items (name, description, color) VALUES 
('Disco Ball', 'Shiny party essential!', '#FFEB3B'),
('Neon Sign', 'Makes everything cooler', '#FF5722'),
('Retro Computer', 'Vintage vibes', '#9C27B0');
