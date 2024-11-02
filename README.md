# my-app

todo example app using Hono and Drizzle

## Installation

```sh
bun install
export DB_FILE_NAME=file:drizzle/tasks.db
sqlite3 $DB_FILE_NAME < schema.sql
call npx drizzle-kit pull 
cp drizzle/relations.ts src/db/relations.ts
cp drizzle/schema.ts src/db/schema.ts
```

```sh
bun run dev
```

open http://localhost:3000

## License

MIT

## Author

Yasuhiro Matsumoto (a.k.a. mattn)
