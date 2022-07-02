import fetch, {Headers, Request, Response,} from 'node-fetch'

if (!globalThis.fetch) {
    // @ts-ignore
    globalThis.fetch = fetch
    globalThis.Headers = Headers
    // @ts-ignore
    globalThis.Request = Request
    // @ts-ignore
    globalThis.Response = Response
}