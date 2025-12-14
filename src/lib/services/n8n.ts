export interface N8nResponse {
    success: boolean;
    message?: string;
    data?: any;
}

const REGENERATE_WEBHOOK = process.env.NEXT_PUBLIC_N8N_REGENERATE_URL;
const PUBLISH_WEBHOOK = process.env.NEXT_PUBLIC_N8N_PUBLISH_URL;

export const n8nService = {
    /**
     * Triggers the n8n webhook to regenerate a draft response for a review.
     */
    /**
     * Triggers the n8n webhook to regenerate a draft response for a review.
     */
    async regenerateDraft(reviewId: string, reviewContent: string, currentDraft?: string): Promise<N8nResponse> {
        try {
            console.log("Regenerating Draft for:", reviewId, "with instruction:", reviewContent);

            // Call local API route to bypass CORS
            const res = await fetch('/api/n8n/regenerate', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    review_id: reviewId,
                    instruction: reviewContent,
                    timestamp: new Date().toISOString()
                })
            });

            if (!res.ok) {
                const errorBody = await res.text();
                console.error("API call failed detail:", errorBody);
                throw new Error(`API call failed: ${res.status} ${res.statusText}`);
            }

            const result = await res.json();
            if (!result.success) throw new Error(result.message);

            return result;
        } catch (error) {
            console.error("Regenerate Draft Error:", error);
            return { success: false, message: "Failed to regenerate draft" };
        }
    },

    /**
     * Triggers the n8n webhook to publish a response to the review platform.
     */
    async publishResponse(reviewId: string, responseContent: string, platform: string): Promise<N8nResponse> {
        try {
            console.log("Publishing response via Proxy:", { reviewId, platform, responseContent })

            // Call local API route to bypass CORS
            const res = await fetch('/api/n8n/publish', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    review_id: reviewId,
                    draft_response: responseContent,
                    platform: platform,
                    timestamp: new Date().toISOString()
                })
            });

            if (!res.ok) throw new Error("API call failed");

            const result = await res.json();
            if (!result.success) throw new Error(result.message);

            return result;
        } catch (error) {
            console.error("Publish Response Error:", error);
            return { success: false, message: "Failed to publish response" };
        }
    }
};
