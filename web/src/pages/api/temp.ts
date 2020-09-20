import {asNexusMethod, makeSchema} from '@nexus/schema'
import {GraphQLDate, GraphQLDateTime} from 'graphql-iso-date'
import {ApolloServer} from 'apollo-server-micro'
import path from 'path'
import Cors from 'cors'
import {Query} from "../../backend/queries";
import {Match, MatchList} from "../../backend/entities/match";
import {Player} from "../../backend/entities/player";
import {Mutation} from "../../backend/mutations";
import {Leaderboard} from "../../backend/entities/leaderboard";
import {Profile} from "../../backend/entities/profile";
// import {
//   BaseContext, GraphQLRequestContext, GraphQLRequestContextExecutionDidStart, GraphQLRequestContextResponseForOperation,
//   GraphQLRequestContextWillSendResponse
// } from "apollo-server-types";
// import {GraphQLRequestListener} from "apollo-server-plugin-base/src/index";
// import {ApolloServerPlugin} from "apollo-server-plugin-base";
import {RatingHistory, RatingHistoryEntry} from "../../backend/entities/rating-history";
import {Stats, StatsEntry} from "../../backend/entities/stats";
import {User} from "../../backend/entities/user";

const cors = Cors({
  methods: ['GET', 'HEAD'],
})

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

export const GQLDate = asNexusMethod(GraphQLDate, 'date')
export const GQLDateTime = asNexusMethod(GraphQLDateTime, 'datetime')

export const schema = makeSchema({
  // plugins: [nexusPluginPrisma({
  //   scalars: {
  //     DateTime: DateTime
  //   }
  // })],
  types: [Query, Mutation, GQLDate, GQLDateTime, User, Match, MatchList, Player, Leaderboard, Profile, RatingHistory, RatingHistoryEntry, Stats, StatsEntry],
  outputs: {
    typegen: path.join(process.cwd(), 'nexus', 'nexus-typegen.ts'),
    schema: path.join(process.cwd(), 'nexus', 'schema.graphql')
  },
})

export const config = {
  api: {
    bodyParser: false,
  },
};

// class BasicLogging implements ApolloServerPlugin {
//   requestDidStart?(requestContext: GraphQLRequestContext<BaseContext>) {
//     const operationName = requestContext.request.operationName;
//     if (operationName === 'IntrospectionQuery') return;
//     return new BasicLoggingListener();
//   }
// }
//
// class BasicLoggingListener implements GraphQLRequestListener {
//
//    willSendResponse(requestContext: GraphQLRequestContextWillSendResponse<BaseContext>) {
//      const tracing = requestContext.response.extensions?.['tracing'];
//      if (tracing == null) return;
//      const durationNs = tracing.duration;
//      const durationMs = durationNs / 1000 / 1000;
//      const operationName = requestContext.request.operationName;
//      console.log();
//      console.log(operationName);
//      console.log(durationMs + 'ms');
//   }
//
//   [key: string]: import("apollo-server-types").AnyFunction
//
//   // didResolveSource?(requestContext: GraphQLRequestContextDidResolveSource<BaseContext>) {}
//   // parsingDidStart?(requestContext: GraphQLRequestContextParsingDidStart<BaseContext>) {}
//   // validationDidStart?(requestContext: GraphQLRequestContextValidationDidStart<BaseContext>) {}
//   // didResolveOperation?(requestContext: GraphQLRequestContextDidResolveOperation<BaseContext>) {}
//   // didEncounterErrors?(requestContext: GraphQLRequestContextDidEncounterErrors<BaseContext>) {}
//
//   responseForOperation(requestContext: GraphQLRequestContextResponseForOperation<BaseContext>) { return null; }
//   executionDidStart(requestContext: GraphQLRequestContextExecutionDidStart<BaseContext>) {}
// }

const handler2 = new ApolloServer({
  schema,
  tracing: true,
  // plugins: [() => new BasicLogging()],
  // engine: {
  //   reportSchema: true,
  //   graphVariant: 'current',
  //   apiKey: 'service:my-test-graph-01231231:v4d02oQWpa-q8R6bMFpxxQ'
  // }
}).createHandler({
  path: '/api',
});

async function handler(req, res) {
  // Run the middleware
  await runMiddleware(req, res, cors)
  return handler2(req, res);

  // Rest of the API logic
  // res.json({ message: 'Hello Everyone!' })
}

export default handler
