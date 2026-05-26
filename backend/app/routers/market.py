import uuid
import asyncio
import datetime
from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.responses import HTMLResponse
from ..services.parser import parse_csv_content
from ..services.price_fetcher import fetch_prices_async, job_progress
from ..services.analyzer import analyze_data
from ..models.schemas import UploadResponse, StatusResponse, AnalysisResult
from jinja2 import Environment, FileSystemLoader
import os
import json
from fastapi.responses import HTMLResponse, StreamingResponse

router = APIRouter()

job_results = {}

@router.post("/api/upload", response_model=UploadResponse)
async def upload_csv(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")
    
    content = await file.read()
    content_str = content.decode('utf-8-sig', errors='replace')
    
    transactions = parse_csv_content(content_str)
    if not transactions:
        raise HTTPException(status_code=400, detail="No valid transactions found in CSV")
        
    unique_items = set()
    for tx in transactions:
        unique_items.add((tx['app_id'], tx['market_name']))
        
    job_id = str(uuid.uuid4())
    upload_time = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    
    job_progress[job_id] = {
        "status": "pending",
        "total": len(unique_items),
        "fetched": 0,
        "prices": {},
        "transactions": transactions,
        "error": None
    }
    
    async def process_job():
        prices = await fetch_prices_async(job_id, unique_items)
        results, summary = analyze_data(transactions, prices)
        job_results[job_id] = {
            "summary": summary,
            "items": results
        }
        
        try:
            data_dir = "/app/data/runs"
            os.makedirs(data_dir, exist_ok=True)
            file_path = os.path.join(data_dir, f"{upload_time}_{job_id}.json")
            with open(file_path, "w", encoding="utf-8") as f:
                json.dump({
                    "job_id": job_id,
                    "upload_time": upload_time,
                    "summary": summary,
                    "items": results,
                    "transactions": transactions
                }, f, ensure_ascii=False, indent=2)
            print(f"Saved job to {file_path}")
        except Exception as e:
            print(f"Error saving job to PVC: {e}")
        
    background_tasks.add_task(process_job)
    
    return UploadResponse(
        job_id=job_id,
        message="Upload successful, processing started",
        total_transactions=len(transactions),
        unique_items=len(unique_items)
    )

@router.get("/api/status/{job_id}", response_model=StatusResponse)
async def get_status(job_id: str):
    if job_id not in job_progress:
        raise HTTPException(status_code=404, detail="Job not found")
        
    prog = job_progress[job_id]
    progress_pct = (prog["fetched"] / prog["total"]) * 100 if prog["total"] > 0 else 0
    
    return StatusResponse(
        job_id=job_id,
        status=prog["status"],
        progress=progress_pct,
        total_items=prog["total"],
        fetched_items=prog["fetched"],
        error=prog.get("error")
    )

@router.get("/api/stream/{job_id}")
async def stream_status(job_id: str):
    if job_id not in job_progress:
        raise HTTPException(status_code=404, detail="Job not found")

    async def event_generator():
        while True:
            if job_id not in job_progress:
                break
                
            prog = job_progress[job_id]
            progress_pct = (prog["fetched"] / prog["total"]) * 100 if prog["total"] > 0 else 0
            
            data = {
                "status": prog["status"],
                "progress": progress_pct,
                "total_items": prog["total"],
                "fetched_items": prog["fetched"],
                "error": prog.get("error")
            }
            
            if prog["status"] == "completed":
                if job_id in job_results:
                    res = job_results[job_id]
                    data["results"] = {
                        "summary": res["summary"],
                        "items": res["items"]
                    }
                yield f"data: {json.dumps(data)}\n\n"
                break
            elif prog["status"] == "error":
                yield f"data: {json.dumps(data)}\n\n"
                break
            elif prog["status"] == "processing":
                if "transactions" in prog and "prices" in prog:
                    # Only show items that have been fetched so far
                    fetched_txs = [tx for tx in prog["transactions"] if (tx['app_id'], tx['market_name']) in prog["prices"]]
                    res_items, res_summary = analyze_data(fetched_txs, prog["prices"])
                    data["results"] = {
                        "summary": res_summary,
                        "items": res_items
                    }
                
            yield f"data: {json.dumps(data)}\n\n"
            await asyncio.sleep(1)

    return StreamingResponse(event_generator(), media_type="text/event-stream")

@router.get("/api/results/{job_id}", response_model=AnalysisResult)
async def get_results(job_id: str):
    if job_id not in job_progress:
        raise HTTPException(status_code=404, detail="Job not found")
        
    if job_progress[job_id]["status"] != "completed":
        return AnalysisResult(job_id=job_id, status=job_progress[job_id]["status"])
        
    if job_id not in job_results:
        raise HTTPException(status_code=500, detail="Results not available")
        
    res = job_results[job_id]
    return AnalysisResult(
        job_id=job_id,
        status="completed",
        summary=res["summary"],
        items=res["items"]
    )

@router.get("/api/report/{job_id}", response_class=HTMLResponse)
async def download_report(job_id: str):
    if job_id not in job_results:
        raise HTTPException(status_code=404, detail="Report not ready or job not found")
        
    res = job_results[job_id]
    sorted_results = sorted(res['items'], key=lambda x: x['pl_amount'], reverse=True)
    
    template_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'templates')
    env = Environment(loader=FileSystemLoader(template_dir))
    template = env.get_template('report.html')
    
    html_content = template.render(
        results=sorted_results,
        summary=res['summary']
    )
    
    return HTMLResponse(content=html_content, headers={
        "Content-Disposition": f'attachment; filename="steam_report_{job_id}.html"'
    })
