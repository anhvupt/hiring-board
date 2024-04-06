# Hiring-board
Full stack .NET and Angular project illustating a simple Kanban board for hiring process 

### Technology Stack

- **Backend**: .NET 8 Minimal API, integrated with MediatR.
- **Database**: MySQL with Entity Framework Core.
- **Frontend**: Angular 17 with standalone components, styled with Taiga UI and TailwindCSS.
- **State Management**: NgRx Store and NgRx Store Component.

### Design Reference

For a visual representation of the UI/UX design, refer to the Figma design reference: [Hiring Board Figma Design](https://www.figma.com/file/vRtB0xGVCyzCuCI0gv7D9E/Hiring-board?type=design&node-id=0%3A1&mode=design&t=Jy5JFhghKfwLQe0i-1).

## Prerequisites

Before setting up the project, ensure you have the following installed:
- .NET 8 SDK
- MySQL
- Node.js (latest LTS version)
- Angular CLI (compatible with Angular 17)

## Setup & Run

### Backend

1. Navigate to the project's backend directory.
2. Run `dotnet restore` to install the necessary .NET dependencies.
3. To start the backend server, execute `dotnet run`. The application is configured to automatically generate the database schema based on the Entity Framework Core models. 

> **Note**: If you need to modify the database connection string, you can find it in the `appsettings.json` file.

### Frontend

1. Navigate to the project's frontend directory.
2. Run `npm install` to install the required Node.js dependencies.
3. To launch the Angular application, execute `npm run start`.
4. Access the application by navigating to `http://localhost:4200` in your web browser.




