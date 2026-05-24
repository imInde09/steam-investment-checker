# Architecture

The application is split into two independent services, making it easy to deploy using Docker Compose or Kubernetes.

![Architecture Diagram](../images/architecture.png)

## Architecture Overview

```mermaid
graph TB
    subgraph "Docker Compose / Kubernetes"
        subgraph "Frontend Container"
            REACT["React App<br/>(Vite + Nginx)"]
        end
        subgraph "Backend Container"
            FASTAPI["FastAPI Server<br/>(Uvicorn)"]
            PARSER["CSV Parser"]
            FETCHER["Price Fetcher<br/>(Steam API)"]
            ANALYZER["P/L Analyzer"]
            FASTAPI --> PARSER
            FASTAPI --> FETCHER
            FASTAPI --> ANALYZER
        end
    end
    
    USER["User Browser"] -->|"Upload CSV"| REACT
    REACT -->|"REST API<br/>(VITE_API_URL)"| FASTAPI
    FETCHER -->|"Rate-Limited<br/>Requests"| STEAM["Steam Community<br/>Market API"]
    FASTAPI -->|"Analysis Results<br/>+ HTML Report"| REACT
```

## Frontend (React + Vite)
Served via Nginx in production. It communicates with the backend via REST API.

## Backend (FastAPI)
Handles CSV parsing, async rate-limited price fetching, and P/L calculations. Uses in-memory storage for jobs, meaning it's stateless between restarts.
