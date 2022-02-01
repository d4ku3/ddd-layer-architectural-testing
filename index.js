import {innerContextCommunicationTests} from './tests/inner-context-communication.js'
import {layeredFileTypeTest} from './tests/file-allocation.js'
import {layeredDependenciesTest} from './tests/layer-dependencies.js'
import {innerAggregateCommunicationTests} from './tests/inner-aggregate-communication.js';

innerContextCommunicationTests();
innerAggregateCommunicationTests();
layeredFileTypeTest();
layeredDependenciesTest();
