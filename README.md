
## Build and publish docker images
```bash
docker build -t udnboss/user-service:v1.0.0 ./user-service
docker push udnboss/user-service:v1.0.0

docker build -t udnboss/post-service:v1.0.0 ./post-service
docker push udnboss/post-service:v1.0.0

#upgraded version of service
docker build -t udnboss/user-service:v1.0.1 ./user-service
docker push udnboss/user-service:v1.0.1
```

## Test using docker compose
```bash
docker compose up -d
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
#namespace
kubectl create namespace my-namespace

#user config and secrets
kubectl -n my-namespace apply -f ./user-app-config.yaml
kubectl -n my-namespace apply -f ./user-db-config.yaml
kubectl -n my-namespace apply -f ./user-db-secrets.yaml
kubectl -n my-namespace apply -f ./user-db-init-scripts-config.yaml

#user api
kubectl -n my-namespace apply -f ./user-app-deployment.yaml
kubectl -n my-namespace apply -f ./user-app-service.yaml

#user database
kubectl -n my-namespace apply -f ./user-db-volume.yaml
kubectl -n my-namespace apply -f ./user-db-statefulset.yaml
kubectl -n my-namespace apply -f ./user-db-service.yaml

#post config and secrets
kubectl -n my-namespace apply -f ./post-app-config.yaml
kubectl -n my-namespace apply -f ./post-db-config.yaml
kubectl -n my-namespace apply -f ./post-db-secrets.yaml
kubectl -n my-namespace apply -f ./post-db-init-scripts-config.yaml

#post api
kubectl -n my-namespace apply -f ./post-app-deployment.yaml
kubectl -n my-namespace apply -f ./post-app-service.yaml

#post database
kubectl -n my-namespace apply -f ./post-db-volume.yaml
kubectl -n my-namespace apply -f ./post-db-statefulset.yaml
kubectl -n my-namespace apply -f ./post-db-service.yaml
```

## Verify Deployment

```bash
kubectl get all -n my-namespace

kubectl get deployments -n my-namespace
kubectl get pods -n my-namespace

```

# Delete Deployment
```bash
kubectl -n my-namespace delete deployment.apps/user-app-deployment
```
# Delete StatefulSet
```bash
kubectl -n my-namespace delete statefulset.apps/user-postgres-statefulset

```

# Status

```bash
kubectl describe pod nodejs-app-7d5cb69789-7569b -n my-namespace
kubectl logs nodejs-app-7d5cb69789-7569b -n my-namespace

kubectl describe service/nodejs-app-service -n my-namespace
kubectl describe service/song-db -n my-namespace

kubectl describe statefulset postgres-db -n my-namespace
kubectl logs postgres-db-0 -n my-namespace

```

# Scale up or down

```bash
kubectl scale --replicas=0 deployment/nodejs-app -n my-namespace
kubectl scale --replicas=1 deployment/nodejs-app -n my-namespace
```

# Rolling Update
```bash
kubectl set image deployment/nodejs-app nodejs=udnboss/song-service:v1.0.1 -n my-namespace
kubectl annotate deployment/nodejs-app kubernetes.io/change-cause="image updated to udnboss/song-service:v1.0.1" -n my-namespace

# monitor the progress
kubectl rollout status deployment/nodejs-app -n my-namespace

```

# Rollback the Update
```bash
kubectl rollout undo deployment/nodejs-app --to-revision=1 -n my-namespace
kubectl annotate deployment/nodejs-app kubernetes.io/change-cause="Rolled back to revision 1" -n my-namespace

```

# Deployment history
```bash
kubectl rollout history deployment/nodejs-app -n my-namespace
```


user-database.my-namespace.svc.cluster.local