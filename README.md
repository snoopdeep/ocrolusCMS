# Ocrolus Assignment

## 🛠️ Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Available Migration Commands:**

   - **Check migration status:**
     ```bash
     npm run migrate:status
     ```

   - **Apply all pending migrations:**
     ```bash
     npm run migrate:up
     ```

   - **Rollback a specific migration:**
     ```bash
     npm run migrate:down <migration_name>
     ```
     Example:
     ```bash
     npm run migrate:down 001_add_article_views_field
     ```

## ✅ Example

```bash
npm run migrate:status           # See current migration state
npm run migrate:up               # Apply the migration
npm run migrate:status           # Confirm it's applied
npm run migrate:down 001_add_article_views_field  # Roll it back
npm run migrate:status           # Confirm it's rolled back
```
---