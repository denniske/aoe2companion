import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

export const hello3: APIGatewayProxyHandler = async (event, _context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless Webpack (Typescript) v10.0! Your function executed successfully!',
      input: event,
    }, null, 2),
  };
}
