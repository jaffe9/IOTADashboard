module.exports = {
  apps: [
    {
      name: "appDashboard-blue",
      script: "npm",
      args: "run preview",
      cwd: "/root/iwtDashboard/IOTADashboard-blue",
      env: {
        NODE_ENV: "production",
        PORT: 8080
      }
    },
    {
      name: "appDashboard-green",
      script: "npm",
      args: "run preview",
      cwd: "/root/iwtDashboard/IOTADashboard-green",
      env: {
        NODE_ENV: "production",
        PORT: 8081
      }
    }
  ]
};















// module.exports = {
//     apps : [{
//       name   : "appDashboard",
//       script : "npm run build && npm run dev"
//     }]
//   }
  