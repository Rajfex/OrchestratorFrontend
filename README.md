# Frontend Robot Orchestrator
This is the Angular frontend for RobotOrchestrator, providing a web interface for robot management, adding tasks, and display logs. It interacts with the backend API to manage tasks, robots, and user accounts.

## Features
 - **User Authentication:** Login and registration with secure JWT token-based authentication.
 - **Robots Management:** View all registered robots, their status, and API keys.
 - **Adding tasks:** Create new tasks for robots and monitor their execution status.
 - **Display logs:** Display system logs returned by the backend, including task‑related messages.
 - **Filtering:** Filter tasks by status, robot, and execution date.
 - **Pagination:** Paginated tables for tasks and logs to improve performance.
 - **Export to XLSX:** Export tasks data to ```.xlsx``` file for reporting and analysis.
 - **API Integration:** Fully communicates with the ASP.NET backend.
   
## Technologies
 - **Frontend**: Angular

## Installation and Setup
Clone the frontend repository:
``` bash
git clone https://github.com/Rajfex/OrchestratorFrontend.git
```

Navigate to the project folder:
``` bash
cd OrchestratorFrontend
```

Install dependencies:
``` bash
npm install
```

Run the application:
``` bash
ng serve
```
