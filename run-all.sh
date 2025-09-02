(cd ./apps/web/ && pnpm dev) &
(cd ./apps/api/ && pnpm dev) &
(docker-compose up -d) &

wait