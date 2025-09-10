module.exports = {
  apps: [
    {
      name: "appDashboard-blue",
      script: "npm",
      args: "run dev",
      cwd: "/root/iwtDashboard/IOTADashboard-blue",
      env: { NODE_ENV: "production" }
    },
    {
      name: "appDashboard-green",
      script: "npm",
      args: "start dev", 
      cwd: "/root/iwtDashboard/IOTADashboard-green",
      env: {  NODE_ENV: "production" }
    }
  ]
};
  