from mcp.server.fastmcp import FastMCP

mcp = FastMCP("AIHack MCP Server")

@mcp.tool()
async def ping() -> str:
    return "pong"


@mcp.tool()
async def get_user_info(email: str) -> dict:
    return {
        "email": email,
        "status": "active"
    }