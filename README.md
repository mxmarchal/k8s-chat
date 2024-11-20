# Chat Backend Service

A simple chat backend service built with Bun.js and PostgreSQL, deployed on Kubernetes. This project is for **educational purposes only** and should never be used in production.

## ⚠️ Warning

This project contains hardcoded credentials and lacks proper security measures. It is designed solely for learning purposes to demonstrate:

- Bun.js backend development
- Docker containerization
- Kubernetes deployment
- PostgreSQL integration
- Basic health checks and readiness probes

## 🔧 Prerequisites

- [Bun](https://bun.sh) (v1.1.34 or later)
- [Docker](https://www.docker.com/)
- [Minikube](https://minikube.sigs.k8s.io/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)

## 🚀 Local Development

1. Install dependencies:

```sh
cd backend
bun install
```

You'll need to have a PostgreSQL database running locally. You can use the following command to start a PostgreSQL container:

```sh
docker run --name postgres -e POSTGRES_PASSWORD=postgres -d -p 5432:5432 postgres
```

2. Run the application:

You'll have to create a `.env` file to run the application (see `.env.example`).

```sh
bun start
```

3. Test the application:

```sh
curl http://localhost:3000/readyz
```

```sh
curl http://localhost:3000/messages
```

```sh
curl -X POST http://localhost:3000/messages -H "Content-Type: application/json" -d '{"username": "John", "message": "Hello, world!"}'
```

## 🐳 Docker Containerization

I use a Makefile to build and run the Docker container (see `Makefile`).
Also, it's a docker-compose file to run the container (see `docker-compose.yml`).

```sh
make build
make run
```

## 🚀 Kubernetes Deployment

### Prerequisites

- Minikube installed
- kubectl configured to use Minikube cluster (see [Minikube installation guide](https://minikube.sigs.k8s.io/docs/start/))

1. Start Minikube:

```sh
minikube start
```

2. Enable the tunnel for LoadBalancer service:

```sh
minikube tunnel
```

3. Build the Docker image in Minikube’s environment:

Minikube uses its own Docker daemon. Configure your terminal to build the image directly inside Minikube's environment.

```sh
make minikube-build
```

4. Deploy the application:

```sh
make k8s-up
```

5. Access the application:

```sh
minikube service chat-backend-service --url
```

Use the provided URL to test the endpoints:

- Retrieve Messages: GET /messages
- Post a Message: POST /message (body: {"username": "Alice", "message": "Hello Minikube!"})

6. Stop the application:

```sh
make k8s-down
```

## Debugging the k8s cluster

[RTFD](https://kubernetes.io/docs/reference/kubectl/)

But since i'm nice, here's a cheat sheet:

```sh
kubectl get pods
kubectl logs <pod-name>
kubectl describe pod <pod-name>
```
