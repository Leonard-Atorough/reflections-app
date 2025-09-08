# Reflections App

A modular, accessible React application for journaling technical insights and personal growth. Built with a focus on maintainability, testability, and future extensibility.

## Features

### Current Functionality

#### Reflection Listing

- Displays a list of saved reflections with title and last updated date.

#### Selection & Detail View

- Click or keyboard-select a reflection to view its full content in the main panel.

#### Add New Reflection

- Clicking “Add Reflection” opens a form for creating a new entry.

#### Keyboard Accessibility

- Reflection items are fully navigable via keyboard (tab, Enter) with aria-pressed and role="button" support.

#### State-Driven UI Logic

- Selection and form toggling are managed via top-down state, ensuring predictable rendering.

#### CSS Modules

- Scoped styling with conditional class application for selected items.

#### Test Coverage with Vitest + React Testing Library

- Includes behavioral tests for rendering, selection toggling, and accessibility.

### Future Improvements

#### Markdown Editing

- Integrate a Markdown editor (e.g. @uiw/react-md-editor) for rich-text reflection input.
- Render Markdown in the detail view using react-markdown.

#### Reflection Metadata

- Add tags, categories, or mood indicators for filtering and search.
- Support timestamps for creation vs. last edit.

#### Persistence Layer

- Store reflections in localStorage or sync with a backend API.
- Add optimistic updates and error handling.

#### Search & Filter

- Implement fuzzy search by title/content.
- Filter reflections by tag, date, or keyword.

#### Enhanced Testing

- Snapshot tests for layout consistency.
- Accessibility audits and keyboard navigation tests.
- Mock layer for simulating backend fetches and form submission.

#### SEO & Meta Content

- Add structured data for discoverability.
- Optimize titles and descriptions for rich results.

## Tech Stack

- React (functional components + hooks)
- TypeScript (strict typing across components and test data)
- Vitest (unit + integration testing)
- React Testing Library (DOM-centric testing)
- CSS Modules (scoped styles)
- Jest-DOM Matchers (semantic assertions)

## Getting Started

### Install dependencies

npm install

### Start development server

npm run dev

### Run tests

npm run test

## Author

Built by Leonard — a reflective, growth-oriented engineer transitioning from QA to full-stack development. This project serves as both a learning sandbox and a showcase of architectural thinking, accessibility, and testing discipline.
