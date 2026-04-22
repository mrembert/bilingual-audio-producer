# Bilingual Audio Director: AI-Powered Immersive Learning

[![Architecture](https://img.shields.io/badge/Pattern-Orchestration%20Director-blue)](#)
[![Governance](https://img.shields.io/badge/Governance-API%20Unit%20Economics-green)](#)
[![Multimodal](https://img.shields.io/badge/AI-Multimodal%20Synthesis-orange)](#)

> **Note on Intellectual Property:** This repository contains the **Architectural Reference** and **Data Models** for the Bilingual Audio Director. The core synthesis engine, specialized prompts, and proprietary audio processing logic are withheld for commercial IP protection. This public blueprint demonstrates technical leadership in **Agentic Orchestration** and **AI Cost Governance**.

---

## 🎙️ What is the Bilingual Audio Director?

The **Bilingual Audio Director** is an end-to-end production suite that transforms a simple topic—like "The Life Cycle of a Butterfly" or "Exploring a Spooky Forest"—into a professional-grade, multi-character audio experience for children.

Unlike standard "Text-to-Speech" tools, the Director uses **Agentic AI** to act as a writer, casting director, and sound engineer, specifically optimized for **dual-language immersion** (e.g., teaching Mandarin to English speakers or vice versa).

### ✨ Why it's Cool

*   **🎭 Immersive "Screenplay" Synthesis:** It doesn't just read text; it writes and performs *audio dramas*. It casts distinct AI voices for different characters (e.g., a "Spark" host and an "Anchor" host) to keep children engaged.
*   **🌐 The "Linguistic Bridge":** The system is designed for **Bilingual-First storytelling**. It uses specialized narrative patterns to introduce new vocabulary in one language (e.g., Mandarin) and naturally reinforce it in another (English) through context, rather than simple translation.
*   **🧩 Screen-Free Magic (Yoto Integration):** Features a specialized "Yoto Wizard" that automates the creation of content for **Yoto screen-free players**, including automated track sequencing and the generation of custom 16x16 pixel art icons for the physical cards.
*   **🤖 Truly Agentic Orchestration:** It uses a "Director Agent" pattern. It starts with a high-level "Blueprint" (curating themes and cultural facts) and iteratively refines it through casting, linguistic review, and multimodal audio synthesis.

---

## 🏗️ High-Level Architecture

The system follows a 6-stage **Refinement & Synthesis** lifecycle powered by **Gemini 3.1 Pro**:

1.  **Blueprint Generation:** Contextual discovery of themes and pedagogical goals.
2.  **Narrative Scripting:** Generation of multi-character, bilingual screenplay dialogue.
3.  **Casting:** Analyzing scripts to assign tone-appropriate, distinct AI voices.
4.  **Optimization:** Hardening scripts with SSML tags for performance pacing and children's "interactive pauses."
5.  **Multimodal Synthesis:** Concurrent generation of high-fidelity character segments via **Gemini 2.5 Pro TTS**.
6.  **Assembly:** Backend orchestration of volume leveling, background music, and final encoding.

## 📊 Governance: API Unit Economics

A key differentiator of this architecture is the **Cost & Token Governance** layer (see `services/costService.ts`). 

Building at scale with Multimodal AI requires a deep understanding of **Unit Economics**. This architecture includes real-time cost modeling that predicts and tracks the financial footprint of every production run—a critical requirement for any enterprise-grade AI deployment.

## 🛠 Tech Stack (Reference)

-   **Frontend:** React 19, TypeScript.
-   **Backend:** Python (FastAPI), Pydub, Google GenAI SDK.
-   **AI Models:** Gemini 3.1 Pro (Director), Gemini 2.5 Pro TTS (Multimodal Synthesis).

---
*Built to explore the intersection of Multimodal AI, Pedagogical Design, and Audio Engineering.*
