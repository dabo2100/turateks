/** PM2 — run from this folder after `npm run build`. Env stays in `.env`. */
module.exports = {
  apps: [
    {
      name: "turateks-next",
      cwd: __dirname,
      script: "node_modules/next/dist/bin/next",
      args: "start -H 127.0.0.1 -p 3000",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
