#!/usr/bin/env node

import {crossContextCommunicationTests} from './src/cross-context-communication.js'
import {layeredFileTypeTest} from './src/file-in-directory-structure.js'
import {layeredDependenciesTest} from './src/layered-dependencies.js'

crossContextCommunicationTests();
layeredFileTypeTest();
layeredDependenciesTest();