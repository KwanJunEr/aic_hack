import logging
from mcp.server.fastmcp import FastMCP

logger = logging.getLogger(__name__)

mcp = FastMCP("AICHack MCP Server")
logger.info("[MCP] AICHack MCP Server initialized")

from app.mcp.tools import system
from app.mcp.tools import upload_sessions

logger.info("[MCP] Tools registered: ping, get_user_info, get_session_text")