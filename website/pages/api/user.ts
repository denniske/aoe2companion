import { NowRequest, NowResponse } from '@vercel/node'

let counter = 0;
export default (request: NowRequest, response: NowResponse) => {
    const { name = 'World' } = request.query
    response.json({ name: 'John Doe', counter: counter++ })
}
