This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Current app functionality:

- Users can create, edit, and delete decks
- Decks can be imported and exported as JSON
- Definition, Concept, and Function cards exist. Function is not included in quizzes
- Study mode and Quiz mode have been implemented. Study mode flips through every card, and Quiz mode allows you to answer questions from the cards and be graded on your responses. Definition cards are autograded, and Concept cards have a 5-star rating system
- Decks are stored in local storage

To be added:

- The parent of all cards, most generic of them all, the Custom Card interface
- Zip and unzip functionality for users uploading code to the Custom Card interface
- Sandbox so foreign code can be safely executed
- Markdown, code, and LaTeX implementation in CardContent (perhaps)
- Cloud storage and login (very very optional, maybe not happening)

## Architecture

The app uses a layered Next.js architecture:

```text
App Router pages and UI
        ↓
React hooks
        ↓
DeckService and AuthService
        ↓
DeckRepository implementations
        ↓
Local storage
```

- `src/app` contains routes for the home page, deck editing, importing, flashcards, and quizzes.
- `src/components` contains shared page, editor, and study UI.
- `src/hooks` connects UI components to application services and reactive state.
- `src/service` coordinates deck operations, authentication state, and change notifications.
- `src/storage` persists decks through a repository interface. Local storage works right now; cloud storage is a placeholder.
- `src/shared` contains deck/card/content models, DTOs, grading, study state, and import/export formats.

### Important components

| Component                              | Purpose                                                                            |
| -------------------------------------- | ---------------------------------------------------------------------------------- |
| `DeckList`                             | Displays saved decks and links to editing, studying, quizzing, and export actions. |
| `DeckForm` and `DeckDraft`             | Manage deck editing, card changes, validation, and conversion to domain objects.   |
| `DeckService`                          | Centralizes listing, loading, saving, deleting, importing, and storage selection.  |
| `DeckRepository`                       | Defines the persistence interface used by local and (maybe) future cloud storage.  |
| `BaseDeck` and `BaseFlashcard`         | Represent runtime deck and card objects and convert to/from serializable DTOs.     |
| `StudySession`                         | Manages immutable flashcard navigation and reveal state.                           |
| `QuizAttempt` and `CardGrader`         | Manage quiz answers, grading rules, progress, results, and missed cards.           |
| `DeckFileFormat` and `JsonDeckFormat`  | Define deck export/import behavior and validate imported data.                     |
| `CardContent` and `CardContentFactory` | Represent question/answer content and reconstruct the appropriate content type.    |
| `AuthService` and `Observable`         | Track authentication state and notify hooks when shared application state changes. |

### Potential improvements to current features

- Validating local storage data in LocalStorageDeckRepository
- Limiting imported file size in DeckService and/or JsonDeckFormat
- Centralizing error handling, making sure errors are returned when something goes wrong
- Adding input limits for deck names and card content
