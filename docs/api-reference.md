# API Reference

FastAPI automatically generates OpenAPI documentation. You can view the interactive Swagger UI by navigating to `http://localhost:8000/docs` when the backend is running.

## Endpoints

### `POST /api/upload`
Uploads the `market_history.csv` file. Returns a Job ID and starts fetching prices asynchronously.
- **Request Body**: `multipart/form-data` with `file` field.
- **Response**:
```json
{
  "job_id": "uuid-string",
  "message": "Upload successful, processing started",
  "total_transactions": 2018,
  "unique_items": 562
}
```

### `GET /api/status/{job_id}`
Returns the current progress of the price fetching job.
- **Response**:
```json
{
  "job_id": "uuid-string",
  "status": "processing",
  "progress": 45.5,
  "total_items": 562,
  "fetched_items": 256,
  "error": null
}
```

### `GET /api/results/{job_id}`
Returns the full JSON result containing summary metrics and per-transaction data.
- **Response**:
```json
{
  "job_id": "uuid-string",
  "status": "completed",
  "summary": { ... },
  "items": [ ... ]
}
```

### `GET /api/report/{job_id}`
Downloads the standalone HTML report.
- **Response**: HTML file (`Content-Disposition: attachment`).
