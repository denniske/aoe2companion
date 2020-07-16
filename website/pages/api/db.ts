import { NowRequest, NowResponse } from '@vercel/node'

require('dotenv').config()

export default (request: NowRequest, response: NowResponse) => {
    const { name = 'World' } = request.query
    response.status(200).send(`${process.env.TEMP} ${name}!`)
}
