# Action Logger

[![npm version](https://img.shields.io/npm/v/jc-action-logger.svg)](https://www.npmjs.com/package/jc-action-logger)

# Contents

1. [Getting Started](#getting-started)
2. [Installing](#installing)
3. [Using the Library](#using-the-library)
4. [Intended Use](#intended-use)
5. [Developing Locally](#developing-locally)
6. [Running Tests](#running-tests)
7. [Assumptions](#assumptions)
8. [Future Considerations](#future-considerations)

## Getting Started

In order to use this library, you will need both [NodeJS](https://nodejs.org/en/) and [npm](https://docs.npmjs.com/about-npm/) installed on your machine. For NodeJS, please install at least version 10 ([current active LTS version](https://nodejs.org/en/about/releases/)) or later. You can find a link to download NodeJS [here](https://nodejs.org/en/download/) for whatever system you are running. Downloading NodeJS from this source, will also install the latest npm version, so you should not have to install npm separately. If for whatever reason, you would like to install npm separately, you can find instructions to do so [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

## Installing

Once you have NodeJS and npm installed, you can then install this library. This library uses npm as its distribution mechanism, so in order to install the library, you can use the following command:

```
npm install --save jc-action-logger
```

This needs to be run in the project directory for which you are installing this library. The project should already be setup as an npm enabled project. If it is not you can look [here](https://docs.npmjs.com/cli/init) at how to initialize a project with npm.

## Using the Library

This library allows you to log specific actions that are associated with a given time. The library will then track the average time for each action logged. The Library then lets you retrieve the average time associated with all of the actions logged in the system.

The library exposes a `Logger` class, that can be instantiated in the following way:

```
const Logger = require('jc-action-logger');

const logger = new Logger();
```

The `Logger` class has the following API:

### addAction

```
logger.addAction(actionString);
```

`addAction` is an asynchronous function that takes a JSON serialized string as its only argument. It returns a Promise that does not return any data when resolved. It will asynchronously log the action so that the time value can then be calculated as part of the average time for that specific action.

This must be valid JSON and must be structured in the following format:

```
{"action":"jump","time":100}
```

The value for the `action` property is a string that represents the name of the action being logged. The value for the `time` property is a number that represents the time associated with that action.

If there are any errors that occur within `addAction` it will throw an exception that can be caught in a `catch` block, which would look like this:

```
logger.addAction(actionString)
  .catch(error => {});
```

### getStats

```
logger.getStats()
  .then(actionData => {})
  .catch(error => {});
```

`getStats` is used to asynchronously retrieve the average time for each action that has been logged. It takes no arguments and returns a Promise that resolves with the the data of all of the actions and their average. In the case above, `actionData` is a JSON serialized string, which takes the following form:

```
[
  {"action":"jump","avg":20},
  {"action":"run","avg":50}
]
```

If there are any errors that occur within `getStats` it will throw an exception that can be caught in the `catch` block.

### Using async/await

You can utilize this library using the Promise API, like mentioned above, with `then` and `catch`. However, if you want, you can also utilize the library with async/await, which would look like this:

```
async function addAction() {
  try {
    await logger.addAction('{"action":"jump","time":100}');
  } catch (error) {
    //handle error
  }
}
```

```
async function getStats() {
  try {
    const stats = await logger.getStats();
    const deserializedStats = JSON.parse(stats);
  } catch (error) {
    //handle error
  }
}
```

## Intended Use

This library could be used for many purposes. It would be helpful for any sort of system where you have something happening, an event or action, and would like to track some sort of time metric associated with that event. One example would be performance tracking. Say you had a couple of events within a system and you wanted to track how long on average each of these events took, then this would be a good use case for this library.

## Developing locally

When developing locally, you can pull down [this github repository](https://github.com/davidtadams/action_logger).

You will need to have git installed on your machine along with the above mentioned dependencies of NodeJS and npm.

## Running Tests

In order to run the tests for the library, you need to do the following:

```
npm install
npm run test
```

This library uses [Jest](https://jestjs.io/) as the testing framework.

## Assumptions

In regards to the environment that this code will be run in, the only assumption that I am making is that it will be on a machine that can run the above specified dependencies of NodeJS and npm.

I am assuming that a library of this sort would be consumed by some sort of package manager, which in this case, I chose to use npm.

When the assignment says that a user will be making concurrent calls into this library, I am assuming that this means that even though the nature of the library functionality is not inherently asynchronous, it should be asynchronous in order to allow for concurrent calls. Therefore, I utilized setTimeout to turn the synchronous nature of adding and retrieving the data into asynchronous code.

The assignment does not say anything about rounding the averages, but I decided to round the averages that are sent back from getStats to two decimal places. This was primarily just to make the response cleaner and could be easily changed as I am not rounding the average that is stored, but only the average that is returned.

## Future Considerations

I think in terms of future considerations, this sort of library would ideally be connected to some sort of persistent data layer, which would store the data around the actions. This would also make the concurrency and asynchronous aspect of the library make more sense, since the library would be making calls to a data store.
