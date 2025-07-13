module.exports = {
  apps: [
    {
      name: "appDashboard-blue",
      script: "npx",
      args: "serve -s dist -l 8080",  // Serve built files, not Vite dev server
      cwd: "/root/iwtDashboard/IOTADashboard-blue",
      env_file: ".env",
      watch: false,
      max_restarts: 3,
      restart_delay: 1000
    },
    {
      name: "appDashboard-green",
      script: "npx",
      args: "serve -s dist -l 8081",  // Serve built files, not Vite dev server
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
  