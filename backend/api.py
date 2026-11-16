
import uuid
import traceback

from datetime import datetime, timezone
from threading import Lock

from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from pipeline import run_research_pipeline

from fastapi.responses import StreamingResponse
from export import (
    generate_word_report,
    generate_pdf_report,
    clean_filename
)


app = FastAPI(
    title="ResearchLab API",
    description="Multi-Agent AI Research System",
    version="1.0.0"
)


# ----------------------------------
# CORS CONFIGURATION
# ----------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


# ----------------------------------
# IN-MEMORY RESEARCH STORAGE
# ----------------------------------

research_tasks = {}
tasks_lock = Lock()


# ----------------------------------
# REQUEST MODEL
# ----------------------------------

class ResearchRequest(BaseModel):

    topic: str = Field(
        min_length=3,
        max_length=500
    )


# ----------------------------------
# BACKGROUND RESEARCH WORKER
# ----------------------------------

def execute_research(research_id: str, topic: str):

    def update_progress(progress, message, current_step):

        with tasks_lock:

            research_tasks[research_id].update({

                "progress": progress,
                "message": message,
                "current_step": current_step,
                "updated_at": datetime.now(timezone.utc).isoformat()

            })

    try:

        result = run_research_pipeline(
            topic=topic,
            progress_callback=update_progress
        )

        with tasks_lock:

            research_tasks[research_id].update({

                "status": "completed",
                "progress": 100,
                "message": "Research completed successfully!",
                "current_step": 4,
                "result": result,
                "completed_at": datetime.now(timezone.utc).isoformat()

            })

    except Exception as error:

        traceback.print_exc()

        with tasks_lock:

            research_tasks[research_id].update({

                "status": "failed",
                "message": "Research execution failed.",
                "error": str(error),
                "completed_at": datetime.now(timezone.utc).isoformat()

            })


# ----------------------------------
# HEALTH CHECK
# ----------------------------------

@app.get("/api/health")
def health_check():

    return {
        "status": "healthy",
        "application": "ResearchLab",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


# ----------------------------------
# START RESEARCH
# ----------------------------------

@app.post("/api/research", status_code=202)
def start_research(
    request: ResearchRequest,
    background_tasks: BackgroundTasks
):

    topic = request.topic.strip()

    if len(topic) < 3:
        raise HTTPException(
            status_code=400,
            detail="Research topic must contain at least 3 characters."
        )

    research_id = str(uuid.uuid4())

    with tasks_lock:

        research_tasks[research_id] = {

            "research_id": research_id,
            "topic": topic,
            "status": "running",
            "progress": 0,
            "current_step": 0,
            "message": "Initializing research agents...",
            "result": None,
            "error": None,
            "created_at": datetime.now(timezone.utc).isoformat()

        }

    background_tasks.add_task(
        execute_research,
        research_id,
        topic
    )

    return {
        "research_id": research_id,
        "topic": topic,
        "status": "running",
        "message": "Research started successfully."
    }


# ----------------------------------
# GET RESEARCH STATUS
# ----------------------------------

@app.get("/api/research/{research_id}")
def get_research(research_id: str):

    with tasks_lock:

        task = research_tasks.get(research_id)

        if task is None:
            raise HTTPException(
                status_code=404,
                detail="Research task not found."
            )

        return dict(task)



# ==========================================
# DOWNLOAD RESEARCH REPORT
# ==========================================

@app.get("/api/research/{research_id}/export/{file_format}")
def download_research_report(
    research_id: str,
    file_format: str
):

    # Validate format
    if file_format not in ["pdf", "docx"]:
        raise HTTPException(
            status_code=400,
            detail="Supported formats are PDF and DOCX."
        )

    # Get completed research
    with tasks_lock:
        task = research_tasks.get(research_id)

        if task is None:
            raise HTTPException(
                status_code=404,
                detail="Research not found."
            )

        if task["status"] != "completed":
            raise HTTPException(
                status_code=400,
                detail="Research is not completed yet."
            )

        topic = task["topic"]
        report = task["result"]["report"]

    # Generate requested document
    if file_format == "pdf":

        file_stream = generate_pdf_report(
            topic,
            report
        )

        media_type = "application/pdf"
        extension = "pdf"

    else:

        file_stream = generate_word_report(
            topic,
            report
        )

        media_type = (
            "application/vnd.openxmlformats-officedocument."
            "wordprocessingml.document"
        )

        extension = "docx"

    filename = f"{clean_filename(topic)}_Research_Report.{extension}"

    return StreamingResponse(
        file_stream,
        media_type=media_type,
        headers={
            "Content-Disposition": (
                f'attachment; filename="{filename}"'
            )
        }
    )

