# Steam Investment Checker

A production-ready, containerized application that analyzes your Steam Market trading history to calculate Profit/Loss. Built with React, FastAPI, and Docker.

![Architecture Diagram](./images/architecture.png)

## Overview

**Steam Investment Checker** helps you track and analyze your Steam Community Market transactions. Upload your market history CSV export, and the application will:

- Fetch current market prices in real-time using the Steam API
- Calculate profit/loss for each item
- Display comprehensive analytics and statistics
- Generate downloadable HTML reports

## Key Features

Core Functionality

- CSV Upload: Easily import your `market_history.csv` exported from Steam
- Live Price Fetching: Real-time price data from Steam Community Market API
- Async Processing: Non-blocking analysis with live progress tracking
- Dashboard: View Total Spent, Total Earned, and Net Profit/Loss
- Interactive Table: Sort, filter, and search through transactions
- Report Export: Download beautiful, standalone HTML reports

Architecture

- Containerized: Deploy with Docker Compose or Kubernetes
- Microservices: Decoupled frontend and backend services
- Stateless Backend: Simplified deployment and scaling
- Rate-Limited: Respectful API usage with built-in rate limiting

## Tech Stack

### Frontend

- **React 19** - UI framework
- **Vite** - Fast build tool and dev server
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **Nginx** - Production server

### Backend

- **FastAPI** - Modern Python API framework
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation
- **Jinja2** - HTML templating
- **Requests** - HTTP library for Steam API

### DevOps

- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## Quick Start

### Prerequisites

- Docker and Docker Compose
- OR: Node.js 18+, Python 3.9+

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/imInde09/steam-investment-checker.git
cd steam-investment-checker

# Start the application
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
```

### Option 2: Local Development

#### Frontend Setup

```bash
cd frontend
npm install
npm run dev  # Starts on http://localhost:5173
```

#### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

## Project Structure

```text
steam-investment-checker/
├── frontend/                 # React + Vite application
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── api/              # API client
│   │   └── App.jsx          # Main app component
│   └── package.json
├── backend/                  # FastAPI application
│   ├── app/
│   │   ├── routers/          # API endpoints
│   │   ├── services/         # Business logic
│   │   ├── models/           # Data schemas
│   │   ├── templates/        # HTML templates
│   │   └── main.py          # FastAPI app entry
│   └── requirements.txt
├── docs/                     # Documentation
│   ├── README.md            # Features overview
│   ├── setup-guide.md       # Detailed setup instructions
│   ├── architecture.md      # System architecture
│   └── api-reference.md     # API documentation
├── images/                   # Assets and diagrams
├── docker-compose.yml        # Docker Compose configuration
└── .gitignore               # Git ignore rules
```

## Documentation

- **[Setup Guide](./docs/setup-guide.md)** - Detailed installation and configuration
- **[Architecture](./docs/architecture.md)** - System design and data flow
- **[API Reference](./docs/api-reference.md)** - REST API endpoints and schemas
- **[Features Overview](./docs/README.md)** - Detailed feature descriptions

## API Endpoints

### Upload & Analyze

- `POST /api/upload` - Upload CSV file and start analysis
- `GET /api/jobs/{job_id}` - Get job status and progress
- `GET /api/jobs/{job_id}/results` - Get analysis results
- `GET /api/jobs/{job_id}/report` - Download HTML report

For detailed API documentation, see [api-reference.md](./docs/api-reference.md).

## Usage

1. **Export Steam History**
   - Visit [Steam Community Market](https://steamcommunity.com/market/)
   - Export your market history as CSV

2. **Upload CSV**
   - Open the application frontend
   - Click "Upload CSV" and select your exported file
   - Wait for analysis to complete

3. **View Results**
   - See your profit/loss analytics on the dashboard
   - Explore individual transactions in the table
   - Sort, filter, or search for specific items

4. **Export Report**
   - Click "Download Report" to save an HTML report
   - Share or archive for record-keeping

## Development

### Running Tests

```bash
# Frontend
cd frontend
npm run lint

# Backend
cd backend
pytest
```

### Building for Production

```bash
# Build with Docker Compose
docker-compose build

# Or build individual services
docker build -t steam-checker-frontend ./frontend
docker build -t steam-checker-backend ./backend
```

## Environment Variables

Create `.env` file in the root directory:

```env
# Backend
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Frontend
VITE_API_URL=http://localhost:8000
```

## Rate Limiting

The backend implements rate limiting for Steam API requests to respect their terms of service. Current limits:

- Max requests per second: Configurable
- Automatic request queuing
- Graceful handling of API limits

## Error Handling

- Invalid CSV format handling with detailed error messages
- Network error recovery
- API rate limit resilience
- File size validation

## Performance

- **Frontend**: Optimized bundle with Vite (~100KB gzipped)
- **Backend**: Async processing for concurrent requests
- **API Calls**: Rate-limited, efficient Steam API usage

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Support

For issues, questions, or suggestions, please:

- Open an [Issue](https://github.com/imInde09/steam-investment-checker/issues)
- Check existing [Documentation](./docs)
- Review [API Reference](./docs/api-reference.md)

## Disclaimer

This application is not affiliated with or endorsed by Valve Corporation or Steam. Usage of Steam's API is subject to their terms of service. Users are responsible for complying with Steam's policies.

---

Made with love for Steam traders
