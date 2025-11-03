# Quick Docker Commands Reference

## Login to Docker Hub
```bash
docker login
```

## Build Images Locally

### API
```bash
docker build -f ./docker/Dockerfile.api -t NectarEDU/api:latest .
```

### Dashboard
```bash
docker build -f ./docker/Dockerfile.dashboard -t NectarEDU/dashboard:latest .
```

## Push to Docker Hub

### API
```bash
docker push NectarEDU/api:latest
```

### Dashboard
```bash
docker push NectarEDU/dashboard:latest
```

## All in One Script
```bash
# Make script executable (first time only)
chmod +x docker-push.sh

# Run the script
./docker-push.sh

# With custom username
DOCKERHUB_USERNAME=your-username ./docker-push.sh

# With version tag
VERSION=v1.0.0 ./docker-push.sh
```

## Pull Published Images
```bash
docker pull NectarEDU/api:latest
docker pull NectarEDU/dashboard:latest
```

## Run Published Images
```bash
# API
docker run -d -p 3081:3081 \
  -e PUBLIC_SUPABASE_ANON_KEY=your_key \
  -e PUBLIC_SUPABASE_URL=your_url \
  NectarEDU/api:latest

# Dashboard
docker run -d -p 3082:3082 \
  -e PUBLIC_SUPABASE_ANON_KEY=your_key \
  -e PUBLIC_SUPABASE_URL=your_url \
  NectarEDU/dashboard:latest
```

## Useful Commands

### Check local images
```bash
docker images | grep NectarEDU
```

### Remove local images
```bash
docker rmi NectarEDU/api:latest
docker rmi NectarEDU/dashboard:latest
```

### View image details
```bash
docker inspect NectarEDU/api:latest
```

### Check image size
```bash
docker images NectarEDU/api:latest --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"
```

