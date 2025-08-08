FROM node:18-alpine
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm install --production

# Copy app source
COPY . .

# Environment variables
ENV PORT=5000
ENV DB_HOST=db
ENV DB_USER=postgres
ENV DB_PASSWORD=password
ENV DB_NAME=postgres

EXPOSE 5000
CMD ["node", "server.js"]
