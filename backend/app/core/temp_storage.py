 
import uuid
import aiofiles
from pathlib import Path
from fastapi import UploadFile
 
TEMP_DIR = Path("/tmp/hos_audio")
TEMP_DIR.mkdir(parents=True, exist_ok=True)
 
# Audio-only — PDF/DOCX/TXT are extracted in the browser
AUDIO_MIME_TYPES: dict[str, str] = {
    "audio/mpeg":   "audio",
    "audio/mp3":    "audio",
    "audio/wav":    "audio",
    "audio/x-wav":  "audio",
    "audio/ogg":    "audio",
    "audio/flac":   "audio",
    "audio/mp4":    "audio",
    "audio/x-m4a":  "audio",
    "video/mp4":    "audio",   # Whisper reads the audio track directly
}
 
AUDIO_EXTENSIONS = {".mp3", ".wav", ".ogg", ".flac", ".m4a", ".mp4"}
 
MAX_AUDIO_SIZE_BYTES = 50 * 1024 * 1024   #


def detect_audio_file(filename: str, content_type: str) -> bool:
    """Returns True if the file is a recognised audio format."""
    if content_type in AUDIO_MIME_TYPES:
        return True
    return Path(filename).suffix.lower() in AUDIO_EXTENSIONS

async def save_temp_audio(upload: UploadFile) -> Path:
    """
    Stream an UploadFile to a unique temp path.
    Raises ValueError if the file exceeds MAX_AUDIO_SIZE_BYTES.
    """

    suffix = Path(upload.filename or "audio").suffix or ".mp3"
    temp_path = TEMP_DIR / f"{uuid.uuid4().hex}{suffix}"
 
    total = 0
    async with aiofiles.open(temp_path, "wb") as f:
        while chunk := await upload.read(64 * 1024):   # 64 KB chunks
            total += len(chunk)
            if total > MAX_AUDIO_SIZE_BYTES:
                temp_path.unlink(missing_ok=True)
                raise ValueError(
                    f"'{upload.filename}' exceeds the 50 MB audio size limit."
                )
            await f.write(chunk)
 
    return temp_path
 
 
def cleanup_temp(path: Path) -> None:
    try:
        path.unlink(missing_ok=True)
    except Exception:
        pass
