CREATE TABLE votes ( 
  vote_id SERIAL PRIMARY KEY,
  breed_name TEXT NOT NULL,
  user_name TEXT, 
  vote_date TIMESTAMP DEFAULT current_timestamp 
);


