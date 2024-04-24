
## Build and publish docker images
```bash
docker build -t udnboss/song-database:latest ./song-database
docker push udnboss/song-database:latest

docker build -t udnboss/song-service:v1.0.0 ./song-service
docker push udnboss/song-service:v1.0.0

#upgraded version of service
docker build -t udnboss/song-service:v1.0.1 ./song-service
docker push udnboss/song-service:v1.0.1
```

## Install Minikube

```bash
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube_latest_amd64.deb
sudo dpkg -i minikube_latest_amd64.deb

```

## Start Minikube

```bash
minikube start
alias kubectl="minikube kubectl --"

```

## Deploy

```bash

kubectl apply -f db-config.yaml
kubectl apply -f db-init-scripts-config.yaml
kubectl apply -f db-secrets.yaml
kubectl apply -f db-deployment.yaml
kubectl apply -f db-service.yaml

kubectl apply -f app-config.yaml
kubectl apply -f app-deployment.yaml
kubectl apply -f app-service.yaml


```

## Verify Deployment

```bash
kubectl get all
kubectl get deployments
kubectl get pods

```

# Delete Deployment
```bash
kubectl delete deployment nodejs-app
```
# Delete StatefulSet
```bash
kubectl delete statefulset postgres-db

```

# Status

```bash
kubectl describe pod nodejs-app-7d5cb69789-7569b
kubectl logs nodejs-app-7d5cb69789-7569b

kubectl describe service/nodejs-app-service
kubectl describe service/song-db

kubectl describe statefulset postgres-db
kubectl logs postgres-db-0

```

# Scale up or down

```bash
kubectl scale --replicas=0 deployment/nodejs-app
kubectl scale --replicas=1 deployment/nodejs-app
```

# Rolling Update
```bash
kubectl set image deployment/nodejs-app nodejs=udnboss/song-service:v1.0.1
kubectl annotate deployment/nodejs-app kubernetes.io/change-cause="image updated to udnboss/song-service:v1.0.1"

# monitor the progress
kubectl rollout status deployment/nodejs-app

```

# Rollback the Update
```bash
kubectl rollout undo deployment/nodejs-app --to-revision=1
kubectl annotate deployment/nodejs-app kubernetes.io/change-cause="Rolled back to revision 1"

```

# Deployment history
```bash
kubectl rollout history deployment/nodejs-app
```