#!/usr/bin/env node

import {crossContextCommunicationTests} from './tests/cross-context-communication.js'
import {layeredFileTypeTest} from './tests/file-in-directory-structure.js'
import {layeredDependenciesTest} from './tests/layered-dependencies.js'
import {testingInRealProject} from './tests/shared/testing-in-real-project.js'

// testingInRealProject();

crossContextCommunicationTests();
layeredFileTypeTest();
layeredDependenciesTest();
