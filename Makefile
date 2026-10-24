.PHONY: setup start

setup:
	cd backend && npm install
	cd frontend && npm install
	cd backend && [ -f .env ] || cp .env.example .env
	cd backend && grep -Eq '^APP_KEY=.+' .env || node ace generate:key
	cd backend && node ace migration:run

start:
	@trap 'kill 0' INT TERM EXIT; \
	(cd frontend && npm run dev) & \
	(cd backend && npm run dev) & \
	wait
