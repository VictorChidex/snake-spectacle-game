# Root Makefile for Snake Spectacle Game

# Install all dependencies
install:
	npm run install

# Run the development environment (Frontend & Backend)
dev:
	npm run dev

# Run all tests
test:
	npm run test:integration

# Run backend tests (aliased to integration)
test-backend:
	npm run test:integration

# Run backend integration tests
test-integration:
	npm run test:integration

# Run frontend tests
test-frontend:
	npm run test:frontend
