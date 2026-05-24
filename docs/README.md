# Steam Loss Visualizer

A production-ready, containerized application that analyzes your Steam Market history to calculate Profit/Loss.

## Features
- **Upload CSV**: Easily upload the `market_history.csv` exported from Steam.
- **Live Price Fetching**: The backend uses the Steam Community Market API to fetch real-time prices.
- **Asynchronous Processing**: Rate limits are handled gracefully in the background while the frontend shows a live progress bar.
- **Dashboard**: View Total Spent, Total Earned, and Net Profit/Loss.
- **Interactive Data Table**: Sort, filter, and search your transactions.
- **Export**: Download a beautiful, standalone HTML report for safekeeping.

See [Setup Guide](setup-guide.md) for running the application.
