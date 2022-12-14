import { IResolvers } from '@graphql-tools/utils';
import { merge } from 'lodash';

import { resolvers as urlResolvers } from './modules/url';

const resolverMap: IResolvers = merge(urlResolvers);
export default resolverMap;
