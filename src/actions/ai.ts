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
            result.replyText = `${result.replyText}\n\n⭐ Cela nous aiderait beaucoup si vous laissiez un avis ici :\n${params.googleMapsLink}`
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
- POSITIVE: Note >= 4/5, mots comme "excellent", "parfait", "bravo", "top", "شكرا", "مزيان", "très bien", "super".
- ALSO POSITIVE: Si le client répond "Oui", "Ça marche", "Bien", "Cool" à une question du type "Tout s'est bien passé ?", c'est POSITIVE.
- NEUTRAL: Note 3/5, feedback mixte, questions générales
- NEGATIVE: Note 1-2/5, plaintes sur service/qualité, insatisfaction
- CRITICAL: Mots alarmants comme "punaise", "cafard", "vomir", "intoxication", "escroquerie", "vol", "rat", "souris"

## Règles de réponse
- Si POSITIVE: Réponse chaleureuse + shouldIncludeGoogleLink = true
- Si NEUTRAL: Réponse informative, shouldIncludeGoogleLink = false
- Si NEGATIVE/NEUTRAL: Ne pas simplement s'excuser. Tu DOIS poser une question polie pour comprendre la raison (ex: "Qu'est-ce qui vous a déplu ?", "Un détail à améliorer ?"). But : obtenir du feedback concret. shouldIncludeGoogleLink = false
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
- Ne JAMAIS inclure le lien Google directement dans replyText (il sera ajouté automatiquement si shouldIncludeGoogleLink=true)

## Règle Spéciale "Premier Message"
Si le message utilisateur commence par "Avis" (QR code scan) OU si c'est une relance manuelle ("Tout s'est bien passé ?"), et que le client répond simplement "Oui" ou équivalent :
ALORS sentiment = POSITIVE. Réponse : "Ravi de l'entendre ! ⭐"`
}

// ===========================================
// Generate Personalized Feedback Response
// ===========================================

export async function generateFeedbackResponse(params: {
    feedbackText: string
    clientName: string | null
    establishmentName: string
    sentiment: 'NEUTRAL' | 'NEGATIVE'
}): Promise<ActionResult<{ response: string }>> {
    try {
        const systemPrompt = `Tu es l'assistant de "${params.establishmentName}", un établissement au Maroc.

## Ton rôle
Générer une réponse personnalisée et empathique au feedback d'un client.

## Contexte
- Client: ${params.clientName || 'Client'}
- Sentiment: ${params.sentiment}
- Tu réponds à un feedback que le client vient d'envoyer

## Règles de réponse

### Pour NEUTRAL (avis mitigé, 3-4 étoiles):
- Remercie sincèrement pour le retour PRÉCIS qu'il a donné
- Montre que tu as COMPRIS ce qu'il a dit (reformule brièvement)
- Termine positivement (ex: "On espère vous revoir bientôt pour une meilleure expérience !")
- Ton: Chaleureux, humble, reconnaissant

### Pour NEGATIVE (avis négatif, 1-2 étoiles):
- Exprime des excuses SINCÈRES et spécifiques (pas génériques)
- Montre que tu as COMPRIS le problème qu'il a soulevé
- Assure que la direction a été informée
- Propose de te rattraper (sans promettre de compensation directe)
- Ton: Humble, empathique, professionnel

## Format
- 2-3 phrases maximum
- Utilise le prénom du client si disponible
- Un emoji maximum (ou aucun pour NEGATIVE)
- Langue: Français (ou Darija si le feedback est en Darija)
- NE PAS mentionner de note ou d'avis public

## Exemples de bonnes réponses

NEUTRAL - Feedback: "Le café était bon mais l'attente un peu longue"
→ "Merci pour ce retour honnête ! On note le souci d'attente et on travaille dessus. On espère vous offrir un service plus rapide lors de votre prochaine visite 🙏"

NEGATIVE - Feedback: "Service vraiment pas top, le serveur était désagréable"
→ "Nous sommes sincèrement désolés pour cette expérience. Ce n'est pas le service que nous voulons offrir. La direction a été informée et prendra les mesures nécessaires."

## Réponse (JSON strict)
{
  "response": "Ta réponse personnalisée ici..."
}`

        const result = await chatCompletionJSON<{ response: string }>({
            systemPrompt,
            messages: [{ role: 'user', content: params.feedbackText }],
            temperature: 0.7,
        })

        return { success: true, data: result }
    } catch (error) {
        console.error('generateFeedbackResponse error:', error)
        // Fallback to appropriate static message
        const fallback = params.sentiment === 'NEUTRAL'
            ? "Merci beaucoup pour ce retour précieux ! Nous en prenons bonne note. 🙏"
            : "Merci pour votre retour détaillé. Votre message a été transmis à la direction. Nous ferons notre possible pour nous améliorer. 🙏"
        return { success: true, data: { response: fallback } }
    }
}

