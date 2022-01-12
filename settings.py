# Database settings
import os
import re

DB_URI = os.getenv('DATABASE_URL')

if DB_URI and DB_URI.startswith("postgres://"):
    DB_URI = DB_URI.replace("postgres://", "postgresql://", 1)
# rest of connection code using the connection string `uri`