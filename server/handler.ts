import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

export const hello3: APIGatewayProxyHandler = async (event, _context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hi:' + process.env.TWITTER_ACCESS_TOKEN + '. Ho:' + process.env.TWITTER_ACCESS_TOKEN2 + '. Go Serverless Webpack (Typescript) v10.0! Your function executed successfully!',
      input: event,
    }, null, 2),
  };
}
