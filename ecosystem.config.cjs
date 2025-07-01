module.exports = {
  apps: [
    {
      name: "appDashboard-blue",
      script : "npm run dev",
      env: {
        PORT: 8080,
        HOST: "0.0.0.0"
      },
      cwd: "/root/iwtDashboard/IOTADashboard-blue"
    },
    {
      name: "appDashboard-green",
      script : "npm run dev",
      env: {
        PORT: 8081,
        HOST: "0.0.0.0"
      },
      cwd: "/root/iwtDashboard/IOTADashboard-green"
    }
  ]
};
















// module.exports = {
//     apps : [{
//       name   : "appDashboard",
//       script : "npm run build && npm run dev"
//     }]
//   }
  