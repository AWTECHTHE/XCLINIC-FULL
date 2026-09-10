from dataclasses import dataclass, field
from typing import Optional

@dataclass
class ExtractedMetrics:
    weight_kg: Optional[float] = None
    height_cm: Optional[float] = None
    body_fat_percent: Optional[float] = None
    lean_mass_kg: Optional[float] = None
    total_body_water_l: Optional[float] = None
    basal_metabolic_rate: Optional[float] = None
    phase_angle: Optional[float] = None

@dataclass
class ExtractionResult:
    # "unavailable": nenhum provedor de extração está configurado neste
    #   ambiente (padrão hoje - ver app/services/extraction/__init__.py).
    # "extracted": extração concluída com sucesso, `metrics` preenchido.
    # "error": um provedor está configurado mas a extração falhou.
    status: str
    metrics: ExtractedMetrics = field(default_factory=ExtractedMetrics)
    raw_text: Optional[str] = None
    error: Optional[str] = None

class BioimpedanceExtractor:
    """Interface para extração dos dados clínicos de um PDF de bioimpedância.

    Implementações concretas plugam aqui: hoje só existe `UnavailableExtractor`
    (nenhum LLM configurado); `DoclingLLMExtractor` é o ponto de extensão
    para a integração real com Docling + um LLM (GPT-4/Gemini/DeepSeek),
    descrita no MVP de Análise Inteligente de Bioimpedância.
    """

    def extract(self, pdf_bytes: bytes, filename: str) -> ExtractionResult:
        raise NotImplementedError
