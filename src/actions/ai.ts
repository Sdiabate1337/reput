'use server'

import { chatCompletionJSON } from '@/lib/openai'
import type { ActionResult } from '@/types/database'

// ===========================================
// Types
// ===========================================

export interface SentimentAnalysisResult {
    sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'CRITICAL'
    language: 'FR' | 'EN' | 'AR' | 'DARIJA'
    replyText: string
    shouldIncludeGoogleLink: boolean
    isCritical: boolean
    criticalKeywords?: string[]
}

interface Message {
    role: 'client' | 'assistant'
    content: string
}

// ===========================================
// Analyze Message and Generate Response
// ===========================================

export async function analyzeAndRespond(params: {
    conversationHistory: Message[]
    establishmentName: string
    googleMapsLink: string
}): Promise<ActionResult<SentimentAnalysisResult>> {
    try {
        const systemPrompt = buildSystemPrompt(params.establishmentName, params.googleMapsLink)

        const messages = params.conversationHistory.map(m => ({
            role: m.role === 'client' ? 'user' as const : 'assistant' as const,
            content: m.content,
        }))

        const result = await chatCompletionJSON<SentimentAnalysisResult>({
            systemPrompt,
            messages,
            temperature: 0.7,
        })

        // If positive sentiment, include Google link in reply
        if (result.shouldIncludeGoogleLink && params.googleMapsLink) {
            result.replyText = `${result.replyText}\n\n📍 Laissez-nous un avis: ${params.googleMapsLink}`
        }

        return { success: true, data: result }
    } catch (error) {
        console.error('analyzeAndRespond error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        }
    }
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
- POSITIVE: Note >= 4/5, mots comme "excellent", "parfait", "bravo", "top", "شكرا", "مزيان", "très bien", "super"
- NEUTRAL: Note 3/5, feedback mixte, questions générales
- NEGATIVE: Note 1-2/5, plaintes sur service/qualité, insatisfaction
- CRITICAL: Mots alarmants comme "punaise", "cafard", "vomir", "intoxication", "escroquerie", "vol", "rat", "souris"

## Règles de réponse
- Si POSITIVE: Réponse chaleureuse + shouldIncludeGoogleLink = true
- Si NEUTRAL: Réponse informative, shouldIncludeGoogleLink = false
- Si NEGATIVE: Réponse empathique, excuses, proposition de contact direct, shouldIncludeGoogleLink = false
- Si CRITICAL: Réponse urgente, excuses sincères, promesse d'action immédiate, isCritical = true

## Détection Darija (Arabe Marocain)
Exemples: "wakha", "labas", "mzyen", "safi", "daba", "bzaf", "chhal", "kifach", "3afak", "chukran"

## Format de réponse (JSON strict)
{
  "sentiment": "POSITIVE" | "NEUTRAL" | "NEGATIVE" | "CRITICAL",
  "language": "FR" | "EN" | "AR" | "DARIJA",
  "replyText": "Ta réponse ici...",
  "shouldIncludeGoogleLink": true | false,
  "isCritical": true | false,
  "criticalKeywords": ["punaise"] // Si critical, liste des mots détectés, sinon []
}

## Lien Google Maps
${googleMapsLink || 'Non configuré'}

## Ton et style
- Chaleureux et professionnel
- Personnalisé (utilise le prénom si disponible)
- Court et direct (max 3 phrases)
- Emoji occasionnel pour les réponses positives 🧡
- En Darija/Arabe si le client écrit en Darija/Arabe
- Ne JAMAIS inclure le lien Google directement dans replyText (il sera ajouté automatiquement si shouldIncludeGoogleLink=true)`
}
