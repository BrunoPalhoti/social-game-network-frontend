/**
 * Plugin Vite para persistir mock users no arquivo src/data/mockUsers.json em dev.
 * POST /api/dev/mock-users → grava no arquivo (body: { users: UserRecord[] }).
 * Só ativo em desenvolvimento.
 */
import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";

const MOCK_USERS_PATH = "src/data/mockUsers.json";

export function mockUsersPlugin(): Plugin {
  return {
    name: "mock-users-write",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url !== "/api/dev/mock-users" || req.method !== "POST") {
          next();
          return;
        }

        let body = "";
        req.on("data", (chunk) => { body += chunk; });
        req.on("end", () => {
          try {
            const data = JSON.parse(body) as { users?: unknown[] };
            if (!Array.isArray(data?.users)) {
              res.statusCode = 400;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: "Body must be { users: UserRecord[] }" }));
              return;
            }
            const projectRoot = process.cwd();
            const filePath = path.join(projectRoot, MOCK_USERS_PATH);
            const content = JSON.stringify({ users: data.users }, null, 2);
            fs.writeFileSync(filePath, content, "utf-8");
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ ok: true }));
          } catch (e) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: e instanceof Error ? e.message : "Write failed" }));
          }
        });
      });
    },
  };
}
