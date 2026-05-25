from pydantic import BaseModel
from typing import List, Dict, Any, Optional


class ProductResponse(BaseModel):
    id: str
    productCode: str
    productName: str
    category: str
    vendor: str
    version: str
    tier: str
    deploymentOptions: List[str]
    targetSegment: List[str]
    description: str
    thumbnail: str
    pricing: Dict[str, Any]
    modules: List[Dict[str, Any]]
    integrations: Dict[str, Any]
    sla: Dict[str, Any]
    compliance: List[str]
    tags: List[str]
    active: bool