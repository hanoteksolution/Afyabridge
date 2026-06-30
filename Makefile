SHELL := /bin/sh
NPM := npm

.PHONY: help install setup dev dev-all build lint deploy deploy-install deploy-update db-generate db-dev db-restart db-push db-migrate db-seed db-reset db-studio db-sync-url

help:
	@echo Afya Bridge make targets
	@echo.
	@echo App:
	@echo   make install       Install dependencies
	@echo   make setup         First-time dev setup (DB + seed)
	@echo   make dev           Run Next.js dev server
	@echo   make dev-all       Restart local Prisma DB then run dev server
	@echo   make build         Build production bundle
	@echo   make lint          Run ESLint
	@echo.
	@echo Production (server — needs Docker):
	@echo   make deploy-install  First-time install on Droplet
	@echo   make deploy-update   Pull code and restart containers
	@echo   make deploy          docker compose up -d --build
	@echo.
	@echo Database (local dev only):
	@echo   make db-generate   Run prisma generate
	@echo   make db-dev        Start local Prisma Postgres
	@echo   make db-restart    Restart local Prisma Postgres
	@echo   make db-push       Push schema to DB
	@echo   make db-migrate    Run prisma migrate dev
	@echo   make db-seed       Seed database
	@echo   make db-reset      Reset DB, migrate, and seed
	@echo   make db-studio     Open Prisma Studio
	@echo   make db-sync-url   Sync DIRECT_DATABASE_URL helper

install:
	$(NPM) install

setup:
	$(NPM) run setup

dev:
	$(NPM) run dev

dev-all:
	$(NPM) run dev:all

build:
	$(NPM) run build

lint:
	$(NPM) run lint

deploy:
	docker compose up -d --build

deploy-install:
	bash scripts/install-production.sh

deploy-update:
	bash scripts/deploy-droplet.sh

db-generate:
	$(NPM) run db:generate

db-dev:
	$(NPM) run db:dev

db-restart:
	$(NPM) run db:restart

db-push:
	$(NPM) run db:push

db-migrate:
	$(NPM) run db:migrate

db-seed:
	$(NPM) run db:seed

db-reset:
	npx prisma migrate reset --force && $(NPM) run db:seed

db-studio:
	$(NPM) run db:studio

db-sync-url:
	$(NPM) run db:sync-url
