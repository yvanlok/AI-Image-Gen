# Stage 1: Build
FROM node:alpine AS builder

RUN addgroup -S appgroup && \
  adduser -S appuser -G appgroup && \
  mkdir -p /home/appuser/app && \
  chown appuser:appgroup /home/appuser/app

USER appuser

RUN yarn config set prefix ~/.yarn && \
  yarn global add typescript serve vite

WORKDIR /home/appuser/app

COPY --chown=appuser:appgroup package.json  ./
COPY --chown=appuser:appgroup . .

RUN npm install && \
    /home/appuser/.yarn/bin/vite optimize && \
    /home/appuser/.yarn/bin/vite build --minify

# Stage 2: Run
FROM node:alpine

RUN addgroup -S appgroup && \
  adduser -S appuser -G appgroup && \
  mkdir -p /home/appuser/app && \
  chown appuser:appgroup /home/appuser/app

USER appuser

RUN yarn config set prefix ~/.yarn && \
  yarn global add serve

WORKDIR /home/appuser/app

COPY --chown=appuser:appgroup --from=builder /home/appuser/app/dist ./dist

EXPOSE 5002

CMD ["/home/appuser/.yarn/bin/serve", "-s", "dist", "-l", "5002"]


