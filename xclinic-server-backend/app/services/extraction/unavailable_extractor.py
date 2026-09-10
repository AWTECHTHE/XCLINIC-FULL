from .base import BioimpedanceExtractor, ExtractionResult

class UnavailableExtractor(BioimpedanceExtractor):
    """Extrator padrão usado enquanto nenhum provedor de LLM está configurado.

    Não tenta ler o conteúdo do PDF; apenas sinaliza de forma honesta que a
    extração automática ainda não está disponível neste ambiente, em vez de
    inventar dados clínicos. Vira ativo assim que `LLM_PROVIDER`/`LLM_API_KEY`
    forem configurados (ver `app/services/extraction/__init__.py`).
    """

    def extract(self, pdf_bytes: bytes, filename: str) -> ExtractionResult:
        return ExtractionResult(status="unavailable")
