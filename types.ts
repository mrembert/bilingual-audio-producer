
export interface LanguageOption {
  code: string;
  name: string;
}

export interface LengthOption {
  id: 'short' | 'medium' | 'long';
  name: string;
  wordCount: string;
}

export interface KitLengthOption {
  id: 'test' | 'short' | 'medium' | 'long';
  name: string;
  duration: string;
  description: string;
}

export interface VoiceOption {
  id: string;
  name: string;
  description: string;
  gender: string;
  accent: string;
  isExclusive?: boolean;
}

export interface AgeRangeOption {
  id: 'preschool' | 'early_elementary' | 'upper_elementary';
  name: string;
}

export interface KeyVocabulary {
  english_word: string;
  translated_word: string;
}

export enum PodcastTypeOption {
  STORY_EXPLORE = 'story_explore',
  STORY_LANGUAGE = 'story_language',
  CONVERSATIONAL = 'conversational',
}

export enum PodcastSegmentType {
  INTRO_MUSIC = 'intro_music',
  STORY_PART = 'story_part',
  SHORT_PAUSE = 'short_pause',
  AUDIO_CUE = 'audio_cue',
  DEEP_DIVE_PART = 'deep_dive_part',
  LANGUAGE_DEEP_DIVE = 'language_deep_dive',
  WHY_EXPLORATION = 'why_exploration',
  CONVERSATION_PART = 'conversation_part',
  OUTRO_MUSIC = 'outro_music',
}

export interface PodcastCharacter {
  name: string;
  voice_description?: string;
  voice?: string;
  audioProfile?: string; // e.g. "Age: 40, Role: Wizard, Voice: Deep and scratchy"
}

export interface PodcastSegment {
  type: PodcastSegmentType;
  role: string;
  text?: string;
  language_code?: string;
  english_translation?: string;
}

export interface PodcastScript {
  title: string;
  summary?: string;
  characters: PodcastCharacter[];
  segments: PodcastSegment[];
  sceneDescription?: string; // e.g. "A spooky forest at night"
  directorNotes?: string; // e.g. "Pacing: Slow, Style: Ominous"
  debug_prompt_used?: string; // Captures actual prompt used for generation
  raw_text?: string;
}

export interface UsageMetadata {
  prompt_token_count: number;
  candidates_token_count: number;
  thoughts_token_count?: number; // Thinking/reasoning tokens
  total_token_count: number;
}

export interface YotoTrack {
  track_number: number;
  type: 'spoken_conversational' | 'spoken_story_explore' | 'external_music' | 'closing_song';
  title: string;
  description: string;
  youtube_query?: string;
  script?: string;
  script_english_review?: string;
  story_script?: string;
  story_script_english_review?: string;
  explore_script?: string;
  explore_script_english_review?: string;
  characters?: PodcastCharacter[];
  length?: string;
  debug_system_prompt?: string;
  sceneDescription?: string;
  directorNotes?: string;
  icon_grid?: string[][];
  icon_prompt?: string; // Custom prompt for icon regeneration
  usage?: UsageMetadata; // Legacy / Aggregate
  usage_flash?: UsageMetadata;
  usage_pro?: UsageMetadata;
  usage_lite?: UsageMetadata;
  icon_usage?: UsageMetadata; 
  audio_output_tokens?: number;
}

export interface YotoBlueprint {
  theme: string;
  targetAge: string;
  tracks: YotoTrack[];
  usage?: UsageMetadata; // Blueprint usage (usually Pro)
  usage_flash?: UsageMetadata;
  usage_pro?: UsageMetadata;
  usage_lite?: UsageMetadata;
  icon_usage?: UsageMetadata; 
  audio_input_tokens?: number;
  audio_output_tokens?: number;
}

export interface RoleMapping {
  [actorName: string]: string[];
}

export type GenerationStepStatus = 'pending' | 'in-progress' | 'success' | 'failed';

export interface GenerationStep {
  id: string;
  title: string;
  status: GenerationStepStatus;
  subSteps?: GenerationStep[];
}

export type AudioFormatOption = 'wav' | 'mp3';
