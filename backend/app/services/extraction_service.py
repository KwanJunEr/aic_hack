import asyncio
import logging 
from pathlib import Path 
from typing import List 

from fastapi import UploadFile
from openai import AsyncOpenAI


from app.core.config import settings
from app.core.temp_storage import detect_audio_file, save_temp_audio, cleanup_temp
from app.schema.upload_schema import AudioTranscribeResponse, FileExtractionResult

logger = logging.getLogger(__name__)

_openai = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)


async def _transcribe_openai(file_path: Path) -> str:
    """
    Send an audio file to OpenAI whisper-1 and return the transcript.
    Runs async — no thread pool needed (it's a network call, not CPU).
    """
    logger.info(f"Transcribing via OpenAI Whisper API: {file_path.name}")
    with open(file_path, "rb") as audio_file:
        response = await _openai.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file,
            response_format="text",   # plain string back — simplest
        )
 
    # response_format="text" returns the transcript string directly
    text = response.strip() if isinstance(response, str) else str(response).strip()
    return text or "[No speech detected]"



 
async def transcribe_single(upload: UploadFile) -> FileExtractionResult:
    """
    Save → transcribe via OpenAI → cleanup for one audio UploadFile.
    Never raises — always returns a FileExtractionResult.
    """
    filename = upload.filename or "unknown"
    content_type = upload.content_type or ""
    temp_path = None
 
    try:
        if not detect_audio_file(filename, content_type):
            return FileExtractionResult(
                filename=filename,
                file_type="unknown",
                extracted_text="",
                char_count=0,
                success=False,
                error="Not an audio file. Accepted: mp3, wav, ogg, flac, m4a, mp4.",
            )
 
        # Save to temp disk (async chunked — enforces 50 MB limit)
        temp_path = await save_temp_audio(upload)
 
        # OpenAI API call — async network, no thread pool needed
        text = await _transcribe_openai(temp_path)
 
        return FileExtractionResult(
            filename=filename,
            file_type="audio",
            extracted_text=text,
            char_count=len(text),
            success=True,
        )
 
    except ValueError as e:
        # File too large or bad format
        return FileExtractionResult(
            filename=filename,
            file_type="audio",
            extracted_text="",
            char_count=0,
            success=False,
            error=str(e),
        )
 
    except Exception as e:
        logger.exception(f"Transcription failed for '{filename}': {e}")
        return FileExtractionResult(
            filename=filename,
            file_type="audio",
            extracted_text="",
            char_count=0,
            success=False,
            error=f"Transcription error: {e}",
        )
 
    finally:
        if temp_path:
            cleanup_temp(temp_path)
 
 
# ---------------------------------------------------------------------------
# High-level — batch (called by router)
# ---------------------------------------------------------------------------
 
async def transcribe_batch(uploads: List[UploadFile]) -> AudioTranscribeResponse:
    """Transcribe 1–10 audio files concurrently via OpenAI Whisper API."""
    if not uploads:
        raise ValueError("No files provided.")
    if len(uploads) > 10:
        raise ValueError("Maximum 10 audio files per request.")
 
    # All files transcribed concurrently — each is an independent API call
    results = list(await asyncio.gather(*[transcribe_single(f) for f in uploads]))
 
    successful = sum(1 for r in results if r.success)
    return AudioTranscribeResponse(
        total_files=len(results),
        successful=successful,
        failed=len(results) - successful,
        results=results,
    )
 