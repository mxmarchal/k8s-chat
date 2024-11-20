DOCKER_IMAGE_NAME = chat-backend
DOCKER_COMPOSE_FILE = docker-compose.yml

build:
	docker build -t $(DOCKER_IMAGE_NAME) .

run:
	docker-compose -f $(DOCKER_COMPOSE_FILE) up --build -d

stop:
	docker-compose -f $(DOCKER_COMPOSE_FILE) down

clean:
	docker-compose -f $(DOCKER_COMPOSE_FILE) down --volumes --remove-orphans
	docker system prune -f

logs:
	docker-compose -f $(DOCKER_COMPOSE_FILE) logs -f

minikube-build:
	eval $(minikube docker-env)
	make build

k8s-up:
	kubectl apply -f k8s/postgres-service.yml
	kubectl apply -f k8s/postgres-statefulset.yml
	kubectl apply -f k8s/backend-service.yml
	kubectl apply -f k8s/backend-deployment.yml

k8s-down:
	kubectl delete -f k8s/postgres-service.yml
	kubectl delete -f k8s/postgres-statefulset.yml
	kubectl delete -f k8s/backend-service.yml
	kubectl delete -f k8s/backend-deployment.yml
