module.exports = {
  apps: [
    {
      name: "appDashboard-blue",
      script: "npm",
      args: "run dev",
      env: {
        PORT: 8080
      }
    },
    {
      name: "appDashboard-green",
      script: "npm",
      args: "run dev",
      env: {
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
  