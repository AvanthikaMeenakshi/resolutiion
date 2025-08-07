## Set-up, demo and running the app locally

1. Clone the repository

```
git clone https://github.com/AvanthikaMeenakshi/resolutiion.git
cd your-repo
```

2. Install dependencies

```
npm install
```

3. Set up your local environment for SQLite (via Prisma):

```
npx prisma generate
npx prisma migrate dev --name init
npx tsx prisma/seed.ts
```

4. Start the development server

```
npm run dev
```

Navigate to http://localhost:3000 to view the app.

## Demo Video

For a quick walkthrough of the app's functionality including core features like listing books, adding new entries, and toggling read status, please watch the recorded demo:

[Watch the app demo](https://www.loom.com/share/b835ed6940584d7da4b558b0dcfbae55)

## Trade-offs & Areas for Improvement

### Modal Behavior & Escape Handling

The modal supports dismissal via the Escape key for accessibility and keyboard-friendliness. However, without a confirmation step, this may lead to accidental closure.
In a production context, I’d introduce unsaved change detection with a guard or confirmation prompt to avoid data loss.

### Error Feedback

Server-side errors are currently surfaced as generic toast messages or UI messages. With more time, I'd introduce a schema validation library like zod to validate inputs at the server action boundary and return structured, user-facing error messages to improve form usability and reduce support overhead.

### Testing Coverage vs Realism

Tests focus on unit and light integration layers. They mock server actions and router behavior, which enables speed and determinism but limits end-to-end confidence. For a production-ready version, I’d introduce Playwright-based tests to cover user flows (e.g., adding a book, toggling read state) against a test database.

### Typing & Validation

Types are defined for API contracts (ApiSuccess, ApiError, Book), and FormData parsing is type-aware. That said, stronger type guards for user input and return values (especially around FormData.get) would further reduce runtime risks. I'd also consider Zod or Valibot to validate input closer to the source.

### Accessibility & Semantics

Headless UI provides a solid foundation, but semantic enhancements like proper ARIA attributes for error messaging, keyboard navigation support in dropdowns, and focus ring styling would be next steps to ensure compliance with WCAG standards.

### Search Filtering UX

The current filtering logic is synchronous and case-insensitive, which is sufficient for small datasets. For larger or dynamic datasets, I would introduce debounced input handling to improve performance and consider offloading filtering to the server—potentially integrating with a search engine like Elasticsearch for scalable, full-text search capabilities.

### Commit Time Safe Guards

The current setup lacks commit-time safeguards. With more time, I would introduce pre-commit hooks using tools like Husky to enforce code quality standards such as linting, formatting, and type checks—before code is pushed. This ensures consistent code across the team and catches issues earlier in the development workflow.
