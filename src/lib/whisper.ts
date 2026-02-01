// ===========================================
// Whisper API - Voice Note Transcription
// ===========================================
// Transcribes audio messages for FEEDBACK_PENDING conversations

import { getOpenAIClient } from './openai'

// Detect if the incoming message is a voice note
export function isVoiceNote(body: Record<string, string>): boolean {
    const mediaType = body.MediaContentType0 || ''
    return mediaType.startsWith('audio/')
}

// Get the number of media attachments
export function getMediaCount(body: Record<string, string>): number {
    return parseInt(body.NumMedia || '0', 10)
}

// Transcribe audio from Twilio media URL
export async function transcribeAudio(mediaUrl: string): Promise<{
    success: boolean
    text?: string
    error?: string
    duration?: number
}> {
    try {
        const client = getOpenAIClient()

        // 1. Download audio from Twilio (requires auth)
        const accountSid = process.env.TWILIO_ACCOUNT_SID!
        const authToken = process.env.TWILIO_AUTH_TOKEN!
        const authHeader = Buffer.from(`${accountSid}:${authToken}`).toString('base64')

        const response = await fetch(mediaUrl, {
            headers: {
                'Authorization': `Basic ${authHeader}`
            }
        })

        if (!response.ok) {
            return {
                success: false,
                error: `Failed to download audio: ${response.status}`
            }
        }

        // 2. Get content type and convert to blob
        const contentType = response.headers.get('content-type') || 'audio/ogg'
        const audioBuffer = await response.arrayBuffer()

        // Determine file extension
        let extension = 'ogg'
        if (contentType.includes('mp4') || contentType.includes('m4a')) {
            extension = 'm4a'
        } else if (contentType.includes('mpeg') || contentType.includes('mp3')) {
            extension = 'mp3'
        } else if (contentType.includes('wav')) {
            extension = 'wav'
        } else if (contentType.includes('webm')) {
            extension = 'webm'
        }

        // 3. Create File object for OpenAI API
        const audioFile = new File(
            [audioBuffer],
            `voice.${extension}`,
            { type: contentType }
        )

        console.log(`[Whisper] Transcribing ${audioFile.size} bytes of ${contentType}`)

        // 4. Call Whisper API
        const transcription = await client.audio.transcriptions.create({
            file: audioFile,
            model: 'whisper-1',
            language: 'fr', // Default to French, Whisper auto-detects Arabic/Darija
            response_format: 'verbose_json' // Get duration info
        })

        console.log(`[Whisper] Transcribed: "${transcription.text.substring(0, 100)}..."`)

        return {
            success: true,
            text: transcription.text,
            duration: transcription.duration
        }
    } catch (error) {
        console.error('[Whisper] Transcription error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Transcription failed'
        }
    }
}

// Estimate transcription cost (for monitoring)
// Whisper API: $0.006 per minute
export function estimateTranscriptionCost(durationSeconds: number): number {
    const minutes = durationSeconds / 60
    return minutes * 0.006
}
