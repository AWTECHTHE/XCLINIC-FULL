"""Implementação real (Docling + LLM) do extrator de dados de bioimpedância.

NÃO É USADA POR PADRÃO — só é instanciada quando `LLM_PROVIDER` e
`LLM_API_KEY` estão configurados (ver `app/core/config.py` e
`app/services/extraction/__init__.py`). Mesmo assim, hoje ela é apenas o
esqueleto: levanta `NotImplementedError` ao ser chamada.

Por quê ainda não está implementada de verdade:
- Requer o pacote `docling`, que não está em `requirements.txt` (é uma
  dependência pesada - inclui modelos de ML - e só faz sentido puxá-la
  quando este extrator for de fato usado).
- Requer uma chave de API real de um provedor de LLM (GPT-4, Gemini Flash,
  DeepSeek, etc.) para desenvolver e testar contra respostas reais -
  nenhuma foi configurada até este ponto.

Quando isso estiver disponível, o trabalho aqui é: 1) rodar o PDF pela
Docling para obter texto limpo; 2) montar um prompt estruturado pedindo os
campos de `ExtractedMetrics`; 3) chamar a API do LLM escolhido; 4)
validar/parsear a resposta (idealmente com structured output / JSON mode)
para `ExtractedMetrics`; 5) retornar `ExtractionResult(status="extracted", ...)`
ou `ExtractionResult(status="error", error=...)` em caso de falha.
"""
from .base import BioimpedanceExtractor, ExtractionResult


class DoclingLLMExtractor(BioimpedanceExtractor):
    def __init__(self, provider: str, api_key: str):
        self.provider = provider
        self.api_key = api_key

    def extract(self, pdf_bytes: bytes, filename: str) -> ExtractionResult:
        raise NotImplementedError(
            "Extração via Docling + LLM ainda não implementada de verdade - "
            "ver docstring deste módulo."
        )
