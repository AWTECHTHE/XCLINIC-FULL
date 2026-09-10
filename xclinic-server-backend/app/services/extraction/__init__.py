from app.core.config import settings
from .base import BioimpedanceExtractor, ExtractionResult, ExtractedMetrics
from .unavailable_extractor import UnavailableExtractor

__all__ = [
    "BioimpedanceExtractor",
    "ExtractionResult",
    "ExtractedMetrics",
    "get_extractor",
]


def get_extractor() -> BioimpedanceExtractor:
    """Escolhe a implementação de extração a usar, com base em configuração.

    Sem LLM_PROVIDER + LLM_API_KEY configurados (o caso hoje em todo
    ambiente), retorna o extrator "indisponível" - nunca inventa dados
    clínicos que não foram de fato extraídos do PDF.
    """
    if settings.LLM_PROVIDER and settings.LLM_API_KEY:
        from .docling_llm_extractor import DoclingLLMExtractor

        return DoclingLLMExtractor(settings.LLM_PROVIDER, settings.LLM_API_KEY)
    return UnavailableExtractor()
