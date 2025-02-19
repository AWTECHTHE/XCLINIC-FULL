# Use the official PostgreSQL image from the Docker Hub
FROM postgres:latest

# Set environment variables for PostgreSQL
ENV POSTGRES_USER=myuser
ENV POSTGRES_PASSWORD=mypassword
ENV POSTGRES_DB=mydatabase

# Expose the PostgreSQL port
EXPOSE 5432

# Create a volume to persist data
VOLUME ["/var/lib/postgresql/data"]

# Start the PostgreSQL server
CMD ["postgres"]