class KassspayClient {
    private readonly api_url: string;
    private readonly websocket_url: string;

    constructor(api_url: string, websocket_url: string) {
        this.api_url = api_url;
        this.websocket_url = websocket_url;
    }

    async get_tokens() {
        const response = await fetch(`${this.api_url}/tokens`);
        return response.json();
    }
}

export default KassspayClient;
