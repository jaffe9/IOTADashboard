module.exports = {
  apps: [
    {
      name: "appDashboard-blue",
      script: "npm",
      args: "start",  // Changed from "run dev" to "start"
      cwd: "/root/iwtDashboard/IOTADashboard-blue",
      env_file: ".env",
      watch: false,
      max_restarts: 3,
      restart_delay: 1000
    },
    {
      name: "appDashboard-green",
      script: "npm",
      args: "start",  // Changed from "run dev" to "start"
      cwd: "/root/iwtDashboard/IOTADashboard-green",
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
  