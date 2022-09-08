CREATE TABLE "koalaHolla" (
    "id" SERIAL PRIMARY KEY,
	"name" VARCHAR (10) NOT NULL,
	"gender" VARCHAR (1) NOT NULL,
	"age" INT,
    "ready_to_transfer" BOOLEAN DEFAULT FALSE,
    "notes" VARCHAR (280)
);


INSERT INTO "koalaHolla" 
	("name", "gender", "age", "notes") 
    VALUES
      ('Scotty', 'M', 4 , 'Born in Guatemala'),
      ('Jean', 'F', 5 , 'Allergic to lots of lava'),
      ('Ororo', 'F', 7 , 'Loves listening to Paula (Abdul)'),
      ('Logan', 'M', 15 , 'Loves the sauna'),
      ('Charlie', 'M', 9 , 'Favorite band is Nirvana'),
      ('Betsy', 'F', 4 , 'Has a pet iguana');