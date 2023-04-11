psql -f install.sql -U node_chat
PGPASSWORD=pgpass psql -d node_chat -f structure.sql -U node_chat
PGPASSWORD=pgpass psql -d node_chat -f data.sql -U node_chat
