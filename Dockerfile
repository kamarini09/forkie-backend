FROM node:22-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

ENV NODE_ENV=development

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
