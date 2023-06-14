DROP TABLE IF EXISTS post;

CREATE TABLE post
(
    id serial,
    role TEXT,
    chat TEXT
);

INSERT INTO post  (role,  chat)
VALUES ('user','Click on the button to guess who is AI');
