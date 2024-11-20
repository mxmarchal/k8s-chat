import postgres from "postgres";

interface Message {
  username: string;
  message: string;
}

const sql = postgres(process.env.DATABASE_URL!, {
  idle_timeout: 1000,
});

async function initPostgres() {
  await sql`CREATE TABLE IF NOT EXISTS messages (username TEXT, message TEXT)`;
}

async function handlerMessages(req: Request) {
  const method = req.method;
  if (method === "GET") {
    try {
      const messages = await sql<Message[]>`SELECT * FROM messages`;
      return new Response(JSON.stringify(messages));
    } catch (error) {
      return new Response(`Internal server error`, { status: 500 });
    }
  }
  return new Response(`Not found`, { status: 404 });
}

async function handlerMessage(req: Request) {
  const method = req.method;
  if (method === "POST") {
    const body = await req.json();
    if (!body.username || !body.message) {
      return new Response(`Bad request`, { status: 400 });
    }
    try {
      await sql`INSERT INTO messages (username, message) VALUES (${body.username}, ${body.message})`;
      return new Response(`Message received`);
    } catch (error) {
      return new Response(`Internal server error`, { status: 500 });
    }
  }
  return new Response(`Not found`, { status: 404 });
}

async function handlerHello(req: Request) {
  const method = req.method;
  if (method === "GET") {
    return new Response(`Hello world`);
  }
  return new Response(`Not found`, { status: 404 });
}

async function handlerHealthz(req: Request) {
  return new Response(`OK`);
}

async function handlerReadyz(req: Request) {
  // TODO: check if postgres is ready
  if (!process.env.DATABASE_URL) {
    return new Response(`Internal server error`, { status: 500 });
  }
  try {
    await sql`SELECT 1`;
    return new Response(`OK`);
  } catch (error) {
    return new Response(`Internal server error`, { status: 500 });
  }
}

const routes: Record<string, (req: Request) => Promise<Response>> = {
  "/": handlerHello,
  "/messages": handlerMessages,
  "/message": handlerMessage,
  "/healthz": handlerHealthz,
  "/readyz": handlerReadyz,
};

Bun.serve({
  port: 3000,
  fetch(req) {
    const url = new URL(req.url);
    const route = routes[url.pathname];
    if (route) {
      return route(req);
    }
    return new Response(`Not found`, { status: 404 });
  },
});

initPostgres();

console.log(
  `Server is running on port 3000 at time ${new Date().toISOString()}`
);
