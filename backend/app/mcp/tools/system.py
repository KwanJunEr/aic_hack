from app.mcp.mcp_server import mcp

@mcp.tool()
async def ping() -> str:
    """Health-check for the MCP server."""
    return "pong"
 
 
@mcp.tool()
async def get_user_info(user_id: str) -> dict:
    """Return basic info about a user (stub)."""
    return {"user_id": user_id, "status": "active"}
 