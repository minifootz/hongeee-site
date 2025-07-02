-- build.sql

-- Create the feed_counter table
CREATE TABLE IF NOT EXISTS feed_counter (
    id INT PRIMARY KEY,
    count INT NOT NULL
);

-- Insert initial row with id=1 and count=0, only if it doesn't exist
IF NOT EXISTS (SELECT 1 FROM feed_counter WHERE id = 1)
BEGIN
    INSERT INTO feed_counter (id, count) VALUES (1, 0);
END
