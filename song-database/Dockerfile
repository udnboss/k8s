# Use the official image as a parent image
FROM postgres:latest

# Set environment variables
ENV POSTGRES_USER username
ENV POSTGRES_PASSWORD password
ENV POSTGRES_DB songdb

# Run the SQL command
RUN bash -c 'echo "CREATE TABLE IF NOT EXISTS songs (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, artist VARCHAR(255) NOT NULL);" > /docker-entrypoint-initdb.d/init.sql'
RUN bash -c 'echo "insert into songs (name, artist) values ('\''song 1'\'', '\''artist 1'\'');" >> /docker-entrypoint-initdb.d/init.sql'
RUN bash -c 'echo "insert into songs (name, artist) values ('\''song 2'\'', '\''artist 2'\'');" >> /docker-entrypoint-initdb.d/init.sql'

EXPOSE 5432

# Run the command inside your image filesystem
CMD ["postgres"]
