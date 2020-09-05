-- select database
CREATE DATABASE IF NOT EXISTS SnippetShareServer;
USE SnippetShareServer;

-- drop existing tables
DROP TABLE IF EXISTS Files;
DROP TABLE IF EXISTS Users;

-- create table Files
CREATE TABLE Files(
  username	VARCHAR(40),
  fileName	VARCHAR(256),
  content	TEXT,
  visible   BOOLEAN,
  modified	DATETIME DEFAULT '2000-01-01 00:00:00',
  PRIMARY KEY(username, fileName)
);

CREATE TABLE Users(
  username	VARCHAR(40),
  password	VARCHAR(256),
  PRIMARY KEY(username)
);

INSERT INTO Files Values
('user', 'test',     '# Hello world! ',      true,  '2020-01-03 09:10:00'),
('user', 'test.txt', 'Hello world! ',        true,  '2020-01-03 09:10:02'),
('user', 'test.md',  '### Hello world!!!! ', false,  '2020-01-03 09:10:04');
