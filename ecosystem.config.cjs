module.exports = {
  apps: [
    {
      name: "appDashboard-blue",
      script: "npm",
      args: "run dev -- --port 8080 --host 0.0.0.0"
    },
    {
      name: "appDashboard-green",
      script: "npm",
      args: "run dev -- --port 8081 --host 0.0.0.0"
    }
  ]
};















// module.exports = {
//     apps : [{
//       name   : "appDashboard",
//       script : "npm run build && npm run dev"
//     }]
//   }
  