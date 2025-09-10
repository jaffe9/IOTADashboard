module.exports = {
  apps: [
    {
      name: "appDashboard-blue",
      script: "npm",
      args: "run preview",
      cwd: "/root/iwtDashboard/IOTADashboard-blue",
      watch: false,
      max_restarts: 3,
      restart_delay: 1000
    },
    {
      name: "appDashboard-green",
      script: "npm",
      args: "run preview", 
      cwd: "/root/iwtDashboard/IOTADashboard-green",
      watch: false,
      max_restarts: 3,
      restart_delay: 1000
    }
  ]
};
