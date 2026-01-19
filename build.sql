IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'feeder')
BEGIN
  CREATE TABLE feeder (
    feedID INT PRIMARY KEY,
    Feed_Num INT NOT NULL
  );

  INSERT INTO feeder (feedID, Feed_Num)
  VALUES (1, 0);
END;
