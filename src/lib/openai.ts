import OpenAI from 'openai'

// Initialize OpenAI client
const apiKey = process.env.OPENAI_API_KEY!

// Create client singleton
let openaiClient: OpenAI | null = null

export function getOpenAIClient(): OpenAI {
    if (!openaiClient) {
        if (!apiKey) {
            throw new Error('OpenAI API key not configured')
        }
        openaiClient = new OpenAI({ apiKey })
    }
    return openaiClient
}

// ===========================================
// Types
// ===========================================

export interface Message {
    role: 'system' | 'user' | 'assistant'
    content: string
}

export interface SentimentAnalysis {
    sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'CRITICAL'
    language: 'FR' | 'EN' | 'AR' | 'DARIJA'
    replyText: string
    shouldIncludeGoogleLink: boolean
    isCritical: boolean
    criticalKeywords?: string[]
}

// ===========================================
// Chat Completion Functions
// ===========================================

/**
 * Send a chat completion request to GPT-4o
 */
export async function chatCompletion(params: {
    systemPrompt: string
    messages: Message[]
    temperature?: number
    maxTokens?: number
}): Promise<string> {
    const client = getOpenAIClient()

    const allMessages: OpenAI.ChatCompletionMessageParam[] = [
        { role: 'system', content: params.systemPrompt },
        ...params.messages.map(m => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
        })),
    ]

    const response = await client.chat.completions.create({
        model: 'gpt-4o',
        messages: allMessages,
        temperature: params.temperature ?? 0.7,
        max_tokens: params.maxTokens ?? 500,
    })

    return response.choices[0]?.message?.content || ''
}

/**
 * Send a structured JSON response request to GPT-4o
 */
export async function chatCompletionJSON<T>(params: {
    systemPrompt: string
    messages: Message[]
    temperature?: number
}): Promise<T> {
    const client = getOpenAIClient()

    const allMessages: OpenAI.ChatCompletionMessageParam[] = [
        { role: 'system', content: params.systemPrompt },
        ...params.messages.map(m => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
        })),
    ]

    const response = await client.chat.completions.create({
        model: 'gpt-4o',
        messages: allMessages,
        temperature: params.temperature ?? 0.7,
        response_format: { type: 'json_object' },
    })

    const content = response.choices[0]?.message?.content || '{}'
    return JSON.parse(content) as T
}

/**
 * Analyze message sentiment and generate response
 */
export async function analyzeAndRespond(params: {
    conversationHistory: { role: 'client' | 'assistant'; content: string }[]
    establishmentName: string
    googleMapsLink: string
}): Promise<SentimentAnalysis> {
    const systemPrompt = buildSystemPrompt(params.establishmentName, params.googleMapsLink)

    const messages: Message[] = params.conversationHistory.map(m => ({
        role: m.role === 'client' ? 'user' : 'assistant',
        content: m.content,
    }))

    const result = await chatCompletionJSON<SentimentAnalysis>({
        systemPrompt,
        messages,
        temperature: 0.7,
    })

    return result
}

// ===========================================
// System Prompt Builder
// ===========================================

function buildSystemPrompt(establishmentName: string, googleMapsLink: string): string {
    return `Tu es l'assistant virtuel de "${establishmentName}", un établissement HORECA au Maroc.

## Ton rôle
1. Analyser le sentiment des messages clients (POSITIVE, NEUTRAL, NEGATIVE, CRITICAL)
2. Détecter la langue (FR, EN, AR, DARIJA)
3. Générer une réponse appropriée et chaleureuse

## Règles de sentiment
- POSITIVE: Note >= 4/5, mots comme "excellent", "parfait", "bravo", "top", "شكرا", "مزيان"
- NEUTRAL: Note 3/5, feedback mixte
- NEGATIVE: Note 1-2/5, plaintes sur service/qualité
- CRITICAL: Mots alarmants comme "punaise", "cafard", "vomir", "intoxication", "escroquerie", "vol"

## Règles de réponse
- Si POSITIVE: Réponse chaleureuse + invitation à laisser un avis Google
- Si NEGATIVE: Réponse empathique, excuses, proposition de contact direct (PAS de lien Google)
- Si CRITICAL: Réponse urgente, excuses sincères, promesse d'action immédiate

## Détection Darija (Arabe Marocain)
Exemples: "wakha", "labas", "mzyen", "safi", "daba", "bzaf", "chhal", "kifach"

## Format de réponse (JSON)
{
  "sentiment": "POSITIVE" | "NEUTRAL" | "NEGATIVE" | "CRITICAL",
  "language": "FR" | "EN" | "AR" | "DARIJA",
  "replyText": "Ta réponse ici...",
  "shouldIncludeGoogleLink": true | false,
  "isCritical": true | false,
  "criticalKeywords": ["punaise"] // Si critical, liste des mots détectés
}

## Lien Google Maps
${googleMapsLink}

## Ton et style
- Chaleureux et professionnel
- Personnalisé (utilise le prénom si disponible)
- Court et direct (max 3 phrases)
- Emoji occasionnel pour les réponses positives 🧡`
}
