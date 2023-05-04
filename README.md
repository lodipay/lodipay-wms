## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

### Mikro-orm migration commands
```
npx mikro-orm migration:create --initial  # Create initial migration file
npx mikro-orm migration:create            # Create new migration with current schema diff
npx mikro-orm migration:up                # Migrate up to the latest version
npx mikro-orm migration:down              # Migrate one step down
npx mikro-orm migration:list              # List all executed migrations
npx mikro-orm migration:check             # Check if schema is up to date
npx mikro-orm migration:pending           # List all pending migrations
npx mikro-orm migration:fresh             # Drop the database and migrate up to the latest version
```
