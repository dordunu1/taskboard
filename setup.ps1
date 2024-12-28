# Create directories
New-Item -ItemType Directory -Force -Path "app"
New-Item -ItemType Directory -Force -Path "components/ui"
New-Item -ItemType Directory -Force -Path "lib"

# Install dependencies
npm install next@latest react@latest react-dom@latest
npm install @radix-ui/react-tabs @radix-ui/react-icons class-variance-authority clsx tailwind-merge firebase
npm install -D typescript @types/node @types/react @types/react-dom tailwindcss postcss autoprefixer tailwindcss-animate

# Initialize TypeScript
npx tsc --init

# Initialize Tailwind CSS
npx tailwindcss init -p 