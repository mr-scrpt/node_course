DROP DATABASE IF EXISTS node_chat;
DROP USER IF EXISTS node_chat;
CREATE USER node_chat WITH PASSWORD 'pgpass';
CREATE DATABASE node_chat OWNER node_chat;
