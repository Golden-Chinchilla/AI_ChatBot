// wrangler.toml 里配置： [vars] OPENAI_API_KEY = "sk-..."
export default {
    async fetch(req, env) {
        const body = await req.json().catch(() => ({}));
        const r = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: body.messages ?? [{ role: "user", content: "ping" }],
            }),
        });
        return new Response(await r.text(), { status: r.status, headers: { "content-type": "application/json" } });
    }
};
