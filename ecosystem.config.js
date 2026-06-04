module.exports = {
  apps: [
    {
      name: "ai-video-app",
      script: "npm",
      args: "run start",
      env_production: {
        NODE_ENV: "production",
      },
    },
    {
      name: "image-restore-worker",
      script: "npm",
      args: "run worker",
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
