module.exports = {
  apps: [
    {
      name: "appDashboard-blue",
      script: "npm",
      args: "run build && npm run preview",
      cwd: "/root/iwtDashboard/IOTADashboard-blue",
      // Remove hardcoded PORT - let it read from .env
      env_file: ".env",
      watch: false,
      max_restarts: 3,
      restart_delay: 1000
    },
    {
      name: "appDashboard-green",
      script: "npm",
      args: "run build && npm run preview", 
      cwd: "/root/iwtDashboard/IOTADashboard-green",
      // Remove hardcoded PORT - let it read from .env
      env_file: ".env",
      watch: false,
      max_restarts: 3,
      restart_delay: 1000
    }
  ]
};


















// module.exports = {
//     apps : [{
//       name   : "appDashboard",
//       script : "npm run build && npm run dev"
//     }]
//   }
  