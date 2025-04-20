# IBAN Project

## Overview

This application provides a web interface and an API to manage IBAN codes. It supports:
- User authentication and authorization.
- Creating, reading, updating, and deleting IBAN codes with fields: IBAN, Year, Cod Eco, Raion, and Localitate.
- Filtering and searching IBAN records.
- Exporting IBAN lists to CSV.

## Technologies

- **Server**: .NET 8 Web API using MediatR, Entity Framework Core, FluentValidation.
- **Client**: React, TypeScript, Vite, Tailwind CSS, React Router, React Toastify.
- **Database**: SQL Server (or LocalDB) with EF Core migrations.

## Getting Started

### Prerequisites
- .NET 8 SDK
- Node.js (>=16) and npm or yarn
- SQL Server (or LocalDB)

### Setup and Run
1. **Database**
   ```bash
   From project directory, start up database by running docker compose up

2. **Server**
   ```bash
   cd server/IbanApi
   # Configure connection string in appsettings.json
   dotnet ef database update   # apply migrations
   dotnet run                  # starts API on http://localhost:5141
   ```

3. **Client**
   ```bash
   cd client/iban-client
   npm install
   npm run dev                # starts frontend on http://localhost:5173
   ```
