
import { PodcastScript, PodcastSegment, PodcastSegmentType, YotoBlueprint, LengthOption, KitLengthOption } from '../types';
import { LENGTH_OPTIONS } from '../constants';

export interface CostBreakdown {
    blueprint: number;
    scripts: number;
    icons: number;
    audio: number;
    total: number;
}

export interface ModelPricing {
    input1M: number;
    output1M: number;
}

const PRICING = {
    // Stage 0: Blueprint (gemini-3-pro-preview + Search Tool)
    BLUEPRINT: { input1M: 2.00, output1M: 12.00 },
    SEARCH_QUERY_COST: 0.035, // $35 per 1,000 queries for Gemini 2.x/3.x
    
    // Stage 1: Narrative (gemini-3-pro-preview)
    NARRATIVE: { input1M: 2.00, output1M: 12.00 },
    
    // Stage 2/3: Casting/Optimization (gemini-2.5-flash)
    FLASH: { input1M: 0.30, output1M: 2.50 },
    
    // Stage 4: Review Translation (gemini-3.1-flash-lite-preview)
    LITE: { input1M: 0.25, output1M: 1.50 },
    
    // Stage 6: Icons (gemini-3-flash-preview)
    ICON: { input1M: 0.50, output1M: 3.00 },
    
    // Audio: Multimodal (gemini-2.5-pro-preview-tts)
    AUDIO: { input1M: 1.25, output1M: 20.00 }, // Updated to $20/1M for Pro TTS output
    
    AUDIO_TOKENS_PER_SEC: 32,
};

// Estimated token counts for various stages
const ESTIMATES = {
    BLUEPRINT: { input: 1500, output: 1000 },
    NARRATIVE: { input: 2000, output: 1500 }, // per part (story or explore)
    CASTING: { input: 1000, output: 500 },
    OPTIMIZATION_PER_CHUNK: { input: 1200, output: 1200 }, // ~15 segments
    BACK_TRANSLATION: { input: 2000, output: 2000 },
    ICON: { input: 500, output: 1000 },
};

const calculateCost = (inputTokens: number, outputTokens: number, pricing: { input1M: number, output1M: number }) => {
    return (inputTokens / 1_000_000) * pricing.input1M + (outputTokens / 1_000_000) * pricing.output1M;
};

const calculateAudioCostFromChars = (charCount: number) => {
    // Roughly 6 chars per word, 150 words per minute
    // 150 wpm = 2.5 words per second
    // 2.5 words/sec * 6 chars/word = 15 chars per second
    const seconds = charCount / 15;
    const tokens = seconds * PRICING.AUDIO_TOKENS_PER_SEC;
    // Audio input tokens for the transcript + audio output tokens
    const inputCost = (tokens / 1_000_000) * PRICING.AUDIO.input1M; 
    const outputCost = (tokens / 1_000_000) * PRICING.AUDIO.output1M;
    return inputCost + outputCost;
};

/**
 * Estimates the cost for a full production run based on the kit length and options.
 * This is used BEFORE the blueprint is generated.
 */
export const estimateInitialCost = (
    kitLength: KitLengthOption,
    generateIcons: boolean
): CostBreakdown => {
    // Estimate number of tracks based on kit length description
    let trackCount = 5;
    if (kitLength.id === 'test') trackCount = 3;
    if (kitLength.id === 'short') trackCount = 5;
    if (kitLength.id === 'medium') trackCount = 7;
    if (kitLength.id === 'long') trackCount = 10;

    const spokenTrackCount = Math.max(1, trackCount - 2); // Assume 2 are music/songs

    const blueprintCost = calculateCost(ESTIMATES.BLUEPRINT.input, ESTIMATES.BLUEPRINT.output, PRICING.BLUEPRINT) + PRICING.SEARCH_QUERY_COST;

    let scriptCost = 0;
    let iconCost = 0;
    let audioCost = 0;

    for (let i = 0; i < spokenTrackCount; i++) {
        // Scripts: Narrative (Pro) + Casting (Flash) + Optimization (Flash) + Back-translation (Lite)
        const narrative = calculateCost(ESTIMATES.NARRATIVE.input * 1.5, ESTIMATES.NARRATIVE.output * 1.5, PRICING.NARRATIVE);
        const casting = calculateCost(ESTIMATES.CASTING.input, ESTIMATES.CASTING.output, PRICING.FLASH);
        const optimization = calculateCost(ESTIMATES.OPTIMIZATION_PER_CHUNK.input * 2, ESTIMATES.OPTIMIZATION_PER_CHUNK.output * 2, PRICING.FLASH);
        const translation = calculateCost(ESTIMATES.BACK_TRANSLATION.input, ESTIMATES.BACK_TRANSLATION.output, PRICING.LITE);
        
        scriptCost += narrative + casting + optimization + translation;

        if (generateIcons) {
            iconCost += calculateCost(ESTIMATES.ICON.input, ESTIMATES.ICON.output, PRICING.ICON);
        }

        // Audio: ~600 words * 6 chars/word = 3600 chars
        audioCost += calculateAudioCostFromChars(3600);
    }

    return {
        blueprint: blueprintCost,
        scripts: scriptCost,
        icons: iconCost,
        audio: audioCost,
        total: blueprintCost + scriptCost + iconCost + audioCost
    };
};

/**
 * Estimates the cost based on an existing blueprint.
 */
export const estimateBlueprintCost = (
    blueprint: YotoBlueprint,
    generateIcons: boolean
): CostBreakdown => {
    const blueprintCost = calculateCost(ESTIMATES.BLUEPRINT.input, ESTIMATES.BLUEPRINT.output, PRICING.BLUEPRINT) + PRICING.SEARCH_QUERY_COST;

    let scriptCost = 0;
    let iconCost = 0;
    let audioCost = 0;

    blueprint.tracks.forEach(track => {
        const isSpoken = track.type === 'spoken_conversational' || track.type === 'spoken_story_explore';
        if (!isSpoken) return;

        // Parts: story+explore (2) or conversational (1)
        const partCount = track.type === 'spoken_story_explore' ? 2 : 1;
        
        // Estimate word count from length option
        const lengthOpt = LENGTH_OPTIONS.find(o => o.name === track.length) || LENGTH_OPTIONS[1];
        const wordCount = parseInt(lengthOpt.wordCount.split('-')[1]) || 600;

        // Script generation costs
        const narrative = calculateCost(ESTIMATES.NARRATIVE.input * partCount, ESTIMATES.NARRATIVE.output * partCount, PRICING.NARRATIVE);
        const casting = calculateCost(ESTIMATES.CASTING.input, ESTIMATES.CASTING.output, PRICING.FLASH);
        
        // Optimization chunks (~15 segments per chunk, ~10 words per segment)
        const chunks = Math.ceil(wordCount / 150); 
        const optimization = calculateCost(ESTIMATES.OPTIMIZATION_PER_CHUNK.input * chunks, ESTIMATES.OPTIMIZATION_PER_CHUNK.output * chunks, PRICING.FLASH);
        
        const translation = calculateCost(ESTIMATES.BACK_TRANSLATION.input * partCount, ESTIMATES.BACK_TRANSLATION.output * partCount, PRICING.LITE);

        scriptCost += narrative + casting + optimization + translation;

        if (generateIcons) {
            iconCost += calculateCost(ESTIMATES.ICON.input, ESTIMATES.ICON.output, PRICING.ICON);
        }

        // Audio cost
        const charCount = wordCount * 6;
        audioCost += calculateAudioCostFromChars(charCount);
    });

    return {
        blueprint: blueprintCost,
        scripts: scriptCost,
        icons: iconCost,
        audio: audioCost,
        total: scriptCost + iconCost + audioCost
    };
};

/**
 * Calculates the ACTUAL cost of audio based on generated scripts.
 */
export const calculateAudioCost = (blueprint: YotoBlueprint): number => {
    let totalChars = 0;
    blueprint.tracks.forEach(track => {
        if (track.script) totalChars += track.script.length;
        if (track.story_script) totalChars += track.story_script.length;
        if (track.explore_script) totalChars += track.explore_script.length;
    });

    return calculateAudioCostFromChars(totalChars);
};

/**
 * Calculates the ACTUAL cost of a run based on captured usage metadata.
 */
export const calculateActualCost = (blueprint: YotoBlueprint): CostBreakdown => {
    let blueprintCost = 0;
    let scriptCost = 0;
    let iconCost = 0;
    let audioCost = 0;

    const calcTier = (usage: UsageMetadata | undefined, pricing: { input1M: number, output1M: number }) => {
        if (!usage) return 0;
        const prompt = usage.prompt_token_count || 0;
        const candidates = usage.candidates_token_count || 0;
        const thoughts = usage.thoughts_token_count || 0;
        return (prompt / 1_000_000) * pricing.input1M +
               ((candidates + thoughts) / 1_000_000) * pricing.output1M;
    };

    // 1. Blueprint Usage
    if (blueprint.usage) {
        blueprintCost = calcTier(blueprint.usage, PRICING.BLUEPRINT) + PRICING.SEARCH_QUERY_COST;
    }

    // 2. Track Usage
    blueprint.tracks.forEach(track => {
        // Scripts (Accumulate from all tiers used in scripting)
        scriptCost += calcTier(track.usage_pro, PRICING.NARRATIVE);
        scriptCost += calcTier(track.usage_flash, PRICING.FLASH);
        scriptCost += calcTier(track.usage_lite, PRICING.LITE);
        
        // Handle legacy/aggregate usage if tiered ones are missing
        if (!track.usage_pro && !track.usage_flash && track.usage) {
            scriptCost += calcTier(track.usage, PRICING.FLASH);
        }

        // Icons
        iconCost += calcTier(track.icon_usage, PRICING.ICON);
    });

    // 3. Audio actuals from Backend
    if (blueprint.audio_output_tokens) {
        const outTokens = blueprint.audio_output_tokens || 0;
        const inTokens = blueprint.audio_input_tokens || 0;
        
        audioCost = (outTokens / 1_000_000) * PRICING.AUDIO.output1M +
                    (inTokens / 1_000_000) * PRICING.AUDIO.input1M;
    } else {
        audioCost = calculateAudioCost(blueprint) || 0;
    }

    const total = blueprintCost + scriptCost + iconCost + audioCost;

    return {
        blueprint: blueprintCost,
        scripts: scriptCost,
        icons: iconCost, 
        audio: audioCost,
        total: total
    };
};
