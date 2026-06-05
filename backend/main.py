import asyncio
import logging
from contextlib import asynccontextmanager
import uvicorn

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.mcp.mcp_server import mcp
from app.api.router import api_router

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(_app: FastAPI):
    logger.info("FastAPI started on port 8000")
    logger.info("[MCP] MCP server running on stdio transport alongside FastAPI")
    yield


app = FastAPI(title="AICHack Backend", lifespan=lifespan)

origins = [
    "http://localhost:3000",   # Next.js frontend
    "http://127.0.0.1:3000",
    "https://rectify-ab8exmg82-jonaskwans-projects.vercel.app",

    # add production frontend later
    # "https://yourdomain.com"
]

app.add_middleware(
    CORSMiddleware,

    allow_origins=origins,

    allow_credentials=True,

    allow_origin_regex=r"https://.*\.vercel\.app",

    allow_methods=["*"],

    allow_headers=["*"],
)

app.include_router(api_router)


@app.on_event("startup")
async def startup_event():
    logger.info("FastAPI started on port 8000")
    logger.info("[MCP] MCP server starting on stdio transport alongside FastAPI")


@app.get("/")
async def root():
    return {"message": "Backend running successfully"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.get("/mcp/status")
async def mcp_status():
    """Indicates that the MCP server is running alongside FastAPI."""
    return {
        "mcp": "running",
        "transport": "stdio",
        "server_name": "AICHack MCP Server",
        "tools": ["ping", "get_user_info", "get_session_text"],
    }


async def start_fastapi():
    config = uvicorn.Config(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
    server = uvicorn.Server(config)
    await server.serve()


async def start_mcp():
    logger.info("[MCP] MCP server running (stdio transport)")
    await mcp.run_stdio_async()

async def main():

    await asyncio.gather(
        start_fastapi(),
        start_mcp()
    )


if __name__ == "__main__":
    asyncio.run(main())
