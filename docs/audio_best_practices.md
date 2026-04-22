# Gemini Audio Generation Best Practices

Based on the [Gemini API Speech Generation Documentation](https://ai.google.dev/gemini-api/docs/speech-generation).

## 1. Prompt Structure
To get the best performance from `gemini-2.5-pro-preview-tts` (and similar models), structure your prompt with these four key sections:

### **Audio Profile**
Defines the persona.
```markdown
# AUDIO PROFILE: [Name] ## "[Show Name]"
Role: [Role Description]
Age: [Age]
Accents: [Specific Accent]
```

### **The Scene**
Sets the environment and vibe.
```markdown
## THE SCENE: [Location Name]
[Visual and auditory description of the setting. Mood, lighting, background noise.]
```

### **Director's Notes**
Crucial for performance guidance.
```markdown
### DIRECTOR'S NOTES
Style: [Emotions, e.g., "Vocal Smile", "High Energy", "Somber"]
Pacing: [Speed, rhythm, e.g., "Fast and bouncing", "Slow and deliberate"]
Delivery: [Specific instructions, e.g., "Punchy consonants"]
```

### **Transcript**
The actual dialogue to be spoken.
```markdown
#### TRANSCRIPT
[Speaker Name]: [Dialogue]
```

## 2. Multi-Speaker Best Practices
- **Explicit Speaker Names**: Always use `Speaker: Text` format.
- **Distinct Profiles**: Define a unique Audio Profile for each speaker to help the model differentiate voices and styles.
- **Context**: The `Scene` and `Director's Notes` apply to the conversation as a whole, guiding the interaction.

## 3. Supported Models
- **Audio Generation**: `gemini-2.5-pro-preview-tts` (or newer `flash` variants if supported).
- **Control**: These models allow for fine-grained control via the prompt structure above, unlike basic TTS endpoints.
