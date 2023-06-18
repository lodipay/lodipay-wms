# Building layer
FROM node:20-alpine as development

# Optional NPM automation (auth) token build argument
# ARG NPM_TOKEN

# Optionally authenticate NPM registry
# RUN npm set //registry.npmjs.org/:_authToken ${NPM_TOKEN}

# persistent / runtime deps

WORKDIR /app

# Copy configuration files
RUN apk add --no-cache bash git
RUN apk add busybox-extras

RUN git config --global --add safe.directory '*'

COPY . .
RUN cp .env.example .env

RUN npm ci
RUN npm install -g @nestjs/cli

CMD [ "npm", "run", "start:dev" ]

# Runtime (production) layer
FROM node:20-alpine as production

# Optional NPM automation (auth) token build argument
# ARG NPM_TOKEN

# Optionally authenticate NPM registry
# RUN npm set //registry.npmjs.org/:_authToken ${NPM_TOKEN}

WORKDIR /app

# Copy dependencies files
COPY package*.json ./

# Install runtime dependecies (without dev/test dependecies)
RUN npm ci --omit=dev

# Copy production build
COPY --from=development /app/dist/ ./dist/

# Expose application port
EXPOSE 13000

# Start application
CMD [ "node", "dist/main.js" ]
