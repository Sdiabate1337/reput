#!/usr/bin/env npx ts-node
/**
 * Script to create Twilio Content Template with Interactive Buttons
 * Run with: npx ts-node create-welcome-template.ts
 */

import Twilio from 'twilio'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN

if (!accountSid || !authToken) {
    console.error('❌ Missing TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN')
    process.exit(1)
}

const client = Twilio(accountSid, authToken)

async function createWelcomeTemplate() {
    console.log('🚀 Creating Welcome Template with Buttons...\n')

    try {
        // Create the content template with quick reply buttons
        const content = await client.content.v1.contents.create({
            friendlyName: 'ReviewMe Welcome - Quick Reply Buttons',
            language: 'fr',
            variables: {
                '1': 'customer_name',
                '2': 'establishment_name'
            },
            types: {
                // WhatsApp Quick Reply Button format
                'twilio/quick-reply': {
                    body: 'Marhba {{1}} ! 🧡\nMerci de votre visite chez {{2}}.\n\nQuelle a été votre impression ?',
                    actions: [
                        { title: 'Top ! 🥳', id: 'rating_5' },
                        { title: 'Bien 👍', id: 'rating_3' },
                        { title: 'Déçu 😔', id: 'rating_1' }
                    ]
                }
            }
        })

        console.log('✅ Template créé avec succès!')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log(`📌 Content SID: ${content.sid}`)
        console.log(`📝 Friendly Name: ${content.friendlyName}`)
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log('\n👉 Copie ce SID et mets-le à jour dans:')
        console.log('   src/app/api/webhooks/twilio/route.ts')
        console.log(`\n   const contentSid = '${content.sid}'`)

        return content.sid

    } catch (error: any) {
        console.error('❌ Erreur:', error.message)
        if (error.code) {
            console.error('   Code:', error.code)
            console.error('   Details:', error.moreInfo)
        }
        process.exit(1)
    }
}

createWelcomeTemplate()
