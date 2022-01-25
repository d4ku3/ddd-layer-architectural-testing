#!/usr/bin/env node

import {crossContextCommunicationTests} from './tests/cross-context-communication.js'
import {layeredFileTypeTest} from './tests/file-in-directory-structure.js'
import {layeredDependenciesTest} from './tests/layered-dependencies.js'

crossContextCommunicationTests();
layeredFileTypeTest();
layeredDependenciesTest();
