# Web3 Development Task Board

A React Native task board application designed to streamline Web3 development workflow management with Firebase integration, following Notion-like minimalist aesthetics.

## Features

- Kanban-style task management
- Firebase integration for real-time updates
- File attachments and media previews
- Drag and drop functionality
- Dark mode support
- Responsive design

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd web3-taskboard
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with your Firebase configuration:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## Development Guidelines

- Follow shadcn/ui component composition patterns
- Use Tailwind CSS for custom styling
- Implement proper dark mode support
- Follow TypeScript best practices
- Implement proper error boundaries
- Add comprehensive logging

## License

MIT 