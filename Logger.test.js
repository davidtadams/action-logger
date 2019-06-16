const Logger = require('./Logger');

describe('Logger', () => {
  let logger;

  beforeEach(() => {
    logger = new Logger();
  });

  describe('when adding an action', () => {
    describe('when the action is invalid JSON', () => {
      test('it should reject the promise with an error', async () => {
        expect.assertions(1);

        try {
          await logger.addAction('invalid json string');
        } catch (error) {
          expect(error.error.startsWith('SyntaxError:')).toBe(true);
        }
      });
    });

    describe('when the action does not exist', () => {
      test('should reject the promise with an error', async () => {
        expect.assertions(1);

        try {
          await logger.addAction();
        } catch (error) {
          expect(error.error).toBe('Error: There was no action provided.');
        }
      });
    });

    describe('when the action is valid json', () => {
      describe('and the action is null', () => {
        test('should reject the promise with an error', async () => {
          expect.assertions(1);

          try {
            await logger.addAction(null);
          } catch (error) {
            expect(error.error).toBe('Error: There was no action provided.');
          }
        });
      });

      test('should reject the promise with an error when the action name is null', async () => {
        expect.assertions(1);

        try {
          await logger.addAction('{"action":null, "time":75}');
        } catch (error) {
          expect(error.error).toBe(
            'Error: There was an error with the provided action.'
          );
        }
      });

      test('should reject the promise with an error when the action name is empty', async () => {
        expect.assertions(1);

        try {
          await logger.addAction('{"action":"", "time":75}');
        } catch (error) {
          expect(error.error).toBe(
            'Error: There was an error with the provided action.'
          );
        }
      });

      describe('when the action time is not a number', () => {
        test('should reject the promise with an error', async () => {
          expect.assertions(1);

          try {
            await logger.addAction('{"action":"", "time":"75"}');
          } catch (error) {
            expect(error.error).toBe(
              'Error: There was an error with the provided action.'
            );
          }
        });
      });
    });
  });

  describe('when retrieving all stats', () => {
    describe('when no actions have been added', () => {
      test('should resolve the promise with an empty JSON list of actions', async () => {
        const actions = await logger.getStats();

        expect(actions).toBe('[]');
      });
    });

    describe('when only one action has been added', () => {
      test('should resolve the promise with a JSON list of the action and its stats', async () => {
        await logger.addAction('{"action":"action1", "time":50}');
        const actions = await logger.getStats();

        expect(actions).toBe('[{"action":"action1","avg":50}]');
      });
    });

    describe('when multiple actions have been added', () => {
      test('should resolve the promise with a JSON list of the actions and their stats', async () => {
        await logger.addAction('{"action":"action1", "time":50}');
        await logger.addAction('{"action":"action1", "time":100}');
        await logger.addAction('{"action":"action1", "time":150}');
        await logger.addAction('{"action":"action1", "time":200}');
        const actions = await logger.getStats();

        expect(actions).toBe('[{"action":"action1","avg":125}]');
      });
    });

    describe('when multiple actions of multiple types have been added', () => {
      test('should resolve the promise with a JSON list of the actions and their stats', async () => {
        await logger.addAction('{"action":"action1", "time":5}');
        await logger.addAction('{"action":"action2", "time":20}');
        await logger.addAction('{"action":"action3", "time":30}');
        await logger.addAction('{"action":"action3", "time":40}');
        await logger.addAction('{"action":"action2", "time":50}');
        await logger.addAction('{"action":"action1", "time":10}');
        await logger.addAction('{"action":"action2", "time":70}');
        await logger.addAction('{"action":"action1", "time":15}');
        await logger.addAction('{"action":"action3", "time":90}');
        await logger.addAction('{"action":"action1", "time":10}');
        const actions = await logger.getStats();

        expect(actions).toBe(
          '[{"action":"action1","avg":10},{"action":"action2","avg":46.67},{"action":"action3","avg":53.33}]'
        );
      });
    });

    describe('when there is an error', () => {
      test('should reject the promise with an error', async () => {
        expect.assertions(1);

        /**
         * I am not fond of this test as it utilizes implementation details,
         * in order to test this, which is not good. The test should not care
         * where or how the actions are stored on the logger object.
         * However, this was the only way I could think of to simulate an error
         * condition within getStats that would cause the Promise to reject.
         */
        try {
          logger.actions = null;
          await logger.getStats();
        } catch (error) {
          expect(error.status).toBe('error');
        }
      });
    });
  });
});
