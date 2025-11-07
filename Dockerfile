# Gunakan Node.js versi stabil
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install dependencies backend
RUN npm install

# Copy semua file proyek
COPY . .

# Jalankan server Express
CMD ["node", "server/index.js"]

# Ekspos port
EXPOSE 5000

#testttt
