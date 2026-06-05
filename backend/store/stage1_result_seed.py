STAGE1_SEED = {
  "_id": "6a22adc0e2bfb7e2021ee9e4",
  "session_id": "ec3177da-b923-49eb-9a6e-2f40797489c4",
  "a2a_messages": [
    {
      "from": "a1_requirement_extractor",
      "status": "ok",
      "duration_ms": 9777,
      "confidence": 0.9,
      "wrote": [
        "transcript",
        "requirements"
      ]
    },
    {
      "from": "a2_gap_detector",
      "status": "ok",
      "duration_ms": 9170,
      "confidence": 0.85,
      "wrote": [
        "gaps"
      ]
    },
    {
      "from": "a3_budget_validator",
      "status": "ok",
      "duration_ms": 8221,
      "confidence": 0.85,
      "wrote": [
        "budget_validation"
      ]
    },
    {
      "from": "a4_past_deal_comparator",
      "status": "ok",
      "duration_ms": 6832,
      "confidence": 0.75,
      "wrote": [
        "past_deals"
      ]
    },
    {
      "from": "a5_sentiment_urgency",
      "status": "ok",
      "duration_ms": 4954,
      "confidence": 0.9,
      "wrote": [
        "sentiment"
      ]
    },
    {
      "from": "a6_objection_anticipator",
      "status": "ok",
      "duration_ms": 8154,
      "confidence": 0.95,
      "wrote": [
        "objections"
      ]
    }
  ],
  "budget_validation": {
    "client_budget": 50000,
    "currency": "RM",
    "estimated_cost_min": 195000,
    "estimated_cost_max": 250000,
    "billing_period": "annual",
    "potential_gap": 145000,
    "risk_level": "medium",
    "budget_alignment_score": 60,
    "insight": "Budget is well below estimated cost \u2014 confirm CFO approval headroom.",
    "notes": "Client indicated budget may increase due to new Johor site.",
    "industry_benchmark": {
      "segment": "ERP integration, SME, Malaysia",
      "typical_range_min": 180000,
      "typical_range_max": 280000,
      "currency": "RM",
      "source": "SEA enterprise software market 2024",
      "client_vs_benchmark": "below range"
    }
  },
  "cot_traces": [
    {
      "agent": "a1_requirement_extractor"
    },
    {
      "agent": "a2_gap_detector"
    },
    {
      "agent": "a3_budget_validator"
    },
    {
      "agent": "a4_past_deal_comparator"
    },
    {
      "agent": "a5_sentiment_urgency"
    },
    {
      "agent": "a6_objection_anticipator"
    }
  ],
  "crm_write_status": {
    "current_stage": "stage1"
  },
  "output": {
    "budget": {
      "value": 50000,
      "currency": "RM",
      "confidence": 95
    },
    "timeline": {
      "value": "end of Q1 before next year",
      "confidence": 90
    },
    "location": {
      "value": "Shah Alam, Penang, Johor",
      "confidence": 90
    },
    "technical_requirements": {
      "value": "Integrate with SAP, support multi-carrier, real-time tracking, mobile app",
      "confidence": 93
    },
    "constraints": {
      "value": "Small IT team of three, Oracle DB and legacy SAP systems",
      "confidence": 85
    },
    "goals": {
      "value": "Improve visibility of deliveries, expand carrier options, and reduce manual work",
      "confidence": 92
    },
    "key_points": {
      "value": [
        "Dispatched manually using spreadsheets causing delays.",
        "Budget initially under RM 50K, approval pending.",
        "Small IT team requires low-maintenance solutions.",
        "Need for SAP integration and mobile app for drivers.",
        "Aim for implementation by end of Q1 before Q2."
      ],
      "confidence": 90
    },
    "summary": {
      "value": "Acme Logistics is aiming to enhance its transparency and operational efficiency.",
      "confidence": 85
    }
  },
  "sentiment": {
    "sentiment": "cautious",
    "urgency_level": "high",
    "urgency_score": 85,
    "deal_pressure": "medium-high"
  },
  "objections": [
    {
      "category": "resource",
      "objection": "Our IT team is too small to handle implementation."
    },
    {
      "category": "technical",
      "objection": "We are worried about Oracle DB compatibility."
    },
    {
      "category": "budget",
      "objection": "The full cost might exceed our allocation."
    },
    {
      "category": "procurement",
      "objection": "We need CFO sign-off before committing."
    }
  ],
  "past_deals": {
    "deal_readiness_score": 72,
    "label": "Proceed with caution",
    "sub_scores": {
      "requirements_clarity": 85,
      "stakeholder_clarity": 40,
      "budget_alignment": 60,
      "technical_feasibility": 78,
      "timeline_realism": 70
    }
  }
}