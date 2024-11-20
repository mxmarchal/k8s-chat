FROM oven/bun:latest

WORKDIR /app

COPY ./backend/package*.json ./
COPY ./bun.lockb ./
RUN bun install
COPY ./backend ./

EXPOSE 3000

CMD ["bun", "start"]
