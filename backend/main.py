import asyncio
import uvicorn

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.mcp.mcp_server import mcp
from app.api.router import api_router

app = FastAPI(
    title="AICHack Backend"
)

origins = [
    "http://localhost:3000",   # Next.js frontend
    "http://127.0.0.1:3000",

    # add production frontend later
    # "https://yourdomain.com"
]

app.add_middleware(
    CORSMiddleware,

    allow_origins=origins,

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)

app.include_router(api_router)


@app.get("/")
async def root():
    return {
        "message": "Backend running successfully"
    }

@app.get("/health")
async def health_check():
    return{
        "status": "healthy"
    }

async def start_fastapi():

    config = uvicorn.Config(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )

    server = uvicorn.Server(config)

    await server.serve()

async def start_mcp():
    await mcp.run_stdio_async()

async def main():

    await asyncio.gather(
        start_fastapi(),
        start_mcp()
    )


if __name__ == "__main__":
    asyncio.run(main())
