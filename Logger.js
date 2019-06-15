class Logger {
  constructor() {
    /**
     * This will be used as a map to hold the data for each action
     * in the form of:
     * {
     *   [actionName]: { //data for the action },
     * }
     */
    this.actions = {};
  }

  /**
   * Logs an action of a certain type while maintaining the average time for all actions of that type
   * @param {string} actionJSON - a JSON string of the format "{"action":"actionName", "time":12}"
   * @return {Promise} - Returns a promise that does not resolve with anything
   */
  addAction(actionJSON) {
    return new Promise((resolve, reject) => {
      //setTimeout is used here to simulate async activity

      setTimeout(() => {
        try {
          const { action: actionName, time } = JSON.parse(actionJSON);

          if (this.actions.hasOwnProperty(actionName)) {
            // If the action already exists, then we need to update the avg and count for the action

            const action = this.actions[actionName];

            action.count += 1;
            action.avg = (action.avg + time) / action.count;
          } else {
            // If the action doesn't already exist, we need to create a new entry for it

            this.actions[actionName] = {
              avg: time,
              count: 1,
            };
          }

          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  /**
   * Retrieves all of the stats for all of the actions that have been logged
   * @return {Promise} - Returns a promise that resolves with the list of actions and their stats
   */
  getStats() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          /**
           * We need to turn the actions map into an array of objects where
           * each object contains information about the action.
           */

          const stats = Object.keys(this.actions).reduce((acc, actionKey) => {
            acc.push({
              action: actionKey,
              avg: this.actions[actionKey].avg,
            });

            return acc;
          }, []);

          const statsJSON = JSON.stringify(stats);

          resolve(statsJSON);
        } catch (error) {
          reject(error);
        }
      });
    });
  }
}

module.exports = Logger;
