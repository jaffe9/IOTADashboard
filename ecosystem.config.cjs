module.exports = {
  apps: [
    {
      name: "appDashboard-blue",
      script: "npm",
      args: "run preview -- --port 8080",
      cwd: "/root/iwtDashboard/IOTADashboard-blue",
      env: {
        NODE_ENV: "production"
      },
      watch: false,
      max_restarts: 3,
      restart_delay: 1000
    },
    {
      name: "appDashboard-green",
      script: "npm",
      args: "run preview -- --port 8081",
      cwd: "/root/iwtDashboard/IOTADashboard-green",
      env: {
        NODE_ENV: "production"
      },
      watch: false,
      max_restarts: 3,
      restart_delay: 1000
    }
  ]
};
