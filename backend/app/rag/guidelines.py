"""
RAG Knowledge Base & Strict AI Safety Guardrails.
Populated with verified indoor air quality guidelines from:
- World Health Organization (WHO) Global Air Quality Guidelines
- EPA Indoor Air Quality (IAQ) Tools & Residential Air Cleaners
- ASHRAE Standard 62.2 (Ventilation and Acceptable Indoor Air Quality in Residential Buildings)
- CDC & Clean Air Crew DIY Air Purifier Standards (Corsi-Rosenthal Box)
"""

from typing import List, Dict, Any, Optional

VERIFIED_GUIDELINES = [
    {
        "id": "WHO_AQG_2021",
        "title": "WHO Global Air Quality Guidelines (2021)",
        "source": "World Health Organization",
        "principles": [
            "24-hour mean PM2.5 guideline target is 15 ug/m3; annual mean is 5 ug/m3.",
            "During acute smog spikes (>150 ug/m3), vulnerable groups (infants, asthmatics, elderly) must minimize strenuous outdoor exertion.",
            "Indoor air filtration reduces systemic inflammatory biomarkers and sub-micron lung deposition."
        ]
    },
    {
        "id": "EPA_IAQ_RESIDENTIAL",
        "title": "EPA Guide to Air Cleaners in the Home",
        "source": "U.S. Environmental Protection Agency",
        "principles": [
            "Mechanical air filters (HEPA, MERV 13+) physically remove particles without producing harmful byproducts.",
            "Ozone generators and uncertified ionizers emit ozone, a powerful lung irritant that exacerbates asthma and damages airway tissue.",
            "Draft-proofing doors and windows during thermal inversions reduces outdoor particulate infiltration by 30-50%."
        ]
    },
    {
        "id": "ASHRAE_62_2",
        "title": "ASHRAE Standard 62.2: Ventilation & IAQ in Residential Buildings",
        "source": "American Society of Heating, Refrigerating and Air-Conditioning Engineers",
        "principles": [
            "Maintain controlled balanced ventilation; avoid unsealed open windows when ambient PM exceeds 100 ug/m3.",
            "Use kitchen range hoods vented to the outdoors during any cooking to avoid compounding indoor PM2.5 with outdoor smog.",
            "Thermal inversion layers trap surface pollutants overnight until midday boundary layer solar expansion."
        ]
    },
    {
        "id": "DIY_CORSI_ROSENTHAL",
        "title": "Corsi-Rosenthal Box Protocol",
        "source": "UC Davis College of Engineering / Clean Air Crew",
        "principles": [
            "Built with 4 or 5 MERV 13 pleated HVAC filters (20x20x2 or 20x20x1) taped to a 20-inch box fan.",
            "Achieves Clean Air Delivery Rate (CADR) of 200–280 CFM for PM2.5 at roughly 15-20% of the cost of commercial HEPA units.",
            "Include a cardboard shroud on the fan face to eliminate corner air backflow and optimize fan blade static pressure."
        ]
    },
    {
        "id": "WET_MOPPING_PROTOCOL",
        "title": "Dust Suppression & Surface Particulate Protocol",
        "source": "EPA IAQ Tools for Schools",
        "principles": [
            "Never dry-sweep or feather-dust during heavy smog days, as this re-suspends settled PM10 and PM2.5 into breathing zones.",
            "Use damp microfiber cloths and wet mopping with plain water or mild eco-surfactants to trap particulate safely.",
            "Place damp mats at main entryways to prevent shoe-borne particulate tracking."
        ]
    }
]

# Guardrails against unverified, dangerous, or harmful hacks
DANGEROUS_PATTERNS = [
    {
        "keyword": "ozone",
        "warning": "SAFETY INTERCEPTION: Ozone generators are scientifically hazardous to human lungs and forbidden under EPA/WHO indoor protocols. Ozone causes severe pulmonary inflammation, especially in infants and asthmatics. Use only mechanical HEPA or MERV 13 filtration."
    },
    {
        "keyword": "chemical spray",
        "warning": "SAFETY INTERCEPTION: Airborne chemical neutralizing sprays release volatile organic compounds (VOCs) that worsen bronchial reactivity during smog. Rely strictly on physical filtration and damp surface trapping."
    },
    {
        "keyword": "incense",
        "warning": "SAFETY INTERCEPTION: Burning incense or scented candles creates dense ultrafine carbon soot and indoor PM2.5 spikes, directly counteracting smog defense."
    },
    {
        "keyword": "ionizer",
        "warning": "SAFETY NOTE: Bipolar ionization without certified zero-ozone (UL 2998) validation can generate dangerous ozone byproducts. Standard mechanical filtration (HEPA/MERV 13) is strongly recommended."
    }
]

DISCLAIMER_TEXT = (
    "Non-Diagnostic Lifestyle Guidance: SmogShield AI provides preventive environmental lifestyle "
    "recommendations based on EPA, WHO, and ASHRAE frameworks. This information does not constitute medical "
    "diagnosis, treatment, or clinical prescription. Asthmatic or respiratory patients should follow their physician's "
    "Asthma Action Plan."
)

def inspect_query_for_guardrails(text: str) -> Optional[str]:
    """Checks if query violates safety protocols (e.g. asking about home ozone generators)."""
    text_lower = text.lower()
    for item in DANGEROUS_PATTERNS:
        if item["keyword"] in text_lower:
            return item["warning"]
    return None

def get_relevant_guidelines(query: str) -> List[Dict[str, Any]]:
    """Simple semantic/keyword matcher for RAG grounding."""
    q_lower = query.lower()
    results = []
    
    # Priority matching
    if any(k in q_lower for k in ["filter", "purifier", "nursery", "cheap", "diy", "corsi", "box"]):
        results.append(VERIFIED_GUIDELINES[3]) # Corsi-Rosenthal
        results.append(VERIFIED_GUIDELINES[1]) # EPA Guide
    if any(k in q_lower for k in ["mop", "sweep", "dust", "clean", "floor", "hack"]):
        results.append(VERIFIED_GUIDELINES[4]) # Wet mopping
    if any(k in q_lower for k in ["window", "ventilat", "inversion", "open", "hour", "fresh"]):
        results.append(VERIFIED_GUIDELINES[2]) # ASHRAE
        results.append(VERIFIED_GUIDELINES[0]) # WHO
        
    if not results:
        results = [VERIFIED_GUIDELINES[0], VERIFIED_GUIDELINES[1], VERIFIED_GUIDELINES[3]]
        
    return results
