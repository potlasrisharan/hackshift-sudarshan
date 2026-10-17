.PHONY: setup dev up down test lint build seed bench eval demo deploy destroy verify-untouched mobile e2e privacy
setup:
	npm ci
dev: build
	npm run dev
up:
	docker compose -f infra/compose.yaml up --build
down:
	docker compose -f infra/compose.yaml down
test:
	npm test
lint:
	npm run lint
	npm run typecheck
build:
	npm run build
seed:
	@echo 'Synthetic fixtures are seeded independently when each demo session starts.'
bench:
	npm run bench
eval:
	npm run eval
demo: setup dev
verify-untouched:
	bash scripts/verify-untouched.sh
e2e:
	npm run e2e
mobile:
	cd apps/mobile && npm ci && npm start
privacy:
	python3 services/privacy-node/run.py
deploy:
	bash infra/aws/deploy.sh
destroy:
	aws cloudformation delete-stack --stack-name dhaaga-demo --region $${AWS_REGION:-ap-south-1}
