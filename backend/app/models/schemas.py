from pydantic import BaseModel
from typing import List, Optional

class UploadResponse(BaseModel):
    job_id: str
    message: str
    total_transactions: int
    unique_items: int

class StatusResponse(BaseModel):
    job_id: str
    status: str # pending, processing, completed, error
    progress: float # 0.0 to 100.0
    total_items: int
    fetched_items: int
    error: Optional[str] = None

class TransactionItem(BaseModel):
    qty: int = 1
    item_name: str
    market_name: str
    app_id: str
    game_name: str
    type: str
    buy_date: Optional[str] = None
    sell_date: Optional[str] = None
    buy_price: Optional[float] = None
    sell_price: Optional[float] = None
    margin: Optional[float] = None
    current_price: float
    pl_amount: float
    pl_percent: float

class AnalysisSummary(BaseModel):
    total_spent: float
    total_earned: float
    overall_pl: float
    total_transactions: int

class AnalysisResult(BaseModel):
    job_id: str
    status: str
    summary: Optional[AnalysisSummary] = None
    items: Optional[List[TransactionItem]] = None
