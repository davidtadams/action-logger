const fs = require('fs');
const path = require('path');

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

    this.filePath = null;
  }

  _setFilePath(filePath) {
    this.filePath = filePath;
  }

  createStore(storeName) {
    const filePath = path.resolve(process.cwd(), 'data', `${storeName}.json`);

    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, JSON.stringify({}), err => {
        if (err) {
          reject({
            error: error.toString(),
            status: 'error',
          })
        } else {
          this._setFilePath(filePath);

          resolve();
        }
      });
    });
  }

  /**
   * Logs an action of a certain type while maintaining the average time for all actions of that type
   * @param {string} actionJSON - a JSON string of the format "{"action":"actionName", "time":12}"
   * @return {Promise} - Returns a promise that does not resolve with anything
   */
  addAction(actionJSON) {
    return new Promise((resolve, reject) => {
      fs.readFile(this.filePath, (err, data) => {
        if (err) {
          reject({
            error: error.toString(),
            status: 'error',
          });
        } else {
          try {
            if (!actionJSON) {
              throw new Error('There was no action provided.');
            }

            const { action: actionName, time } = JSON.parse(actionJSON);

            if (
              !actionName ||
              actionName.length === 0 ||
              typeof time !== 'number'
            ) {
              throw new Error('There was an error with the provided action.');
            }

            if (this.actions.hasOwnProperty(actionName)) {
              // If the action already exists, then we need to update the avg and count for the action
              const action = this.actions[actionName];

              action.avg =
                (action.avg * action.count + time) / (action.count + 1);
              action.count += 1;
            } else {
              // If the action doesn't already exist, we need to create a new entry for it
              this.actions[actionName] = {
                avg: time,
                count: 1,
              };
            }

            resolve();
          } catch (error) {
            reject({
              error: error.toString(),
              status: 'error',
            });
          }
        }
      });


      //setTimeout is used here to simulate async activity
      setTimeout(() => {
        // try {
        //   if (!actionJSON) {
        //     throw new Error('There was no action provided.');
        //   }

        //   const { action: actionName, time } = JSON.parse(actionJSON);

        //   if (
        //     !actionName ||
        //     actionName.length === 0 ||
        //     typeof time !== 'number'
        //   ) {
        //     throw new Error('There was an error with the provided action.');
        //   }

        //   if (this.actions.hasOwnProperty(actionName)) {
        //     // If the action already exists, then we need to update the avg and count for the action
        //     const action = this.actions[actionName];

        //     action.avg =
        //       (action.avg * action.count + time) / (action.count + 1);
        //     action.count += 1;
        //   } else {
        //     // If the action doesn't already exist, we need to create a new entry for it
        //     this.actions[actionName] = {
        //       avg: time,
        //       count: 1,
        //     };
        //   }

        //   resolve();
        // } catch (error) {
        //   reject({
        //     error: error.toString(),
        //     status: 'error',
        //   });
        // }
      });
    });
  }

  /**
   * Retrieves all of the stats for all of the actions that have been logged
   * @return {Promise} - Returns a promise that resolves with a JSON serialized list of actions and their stats
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
            const { avg } = this.actions[actionKey];

            // This rounds the average to two decimal places
            const roundedAvg = Number(Math.round(avg + 'e2') + 'e-2');

            acc.push({
              action: actionKey,
              avg: roundedAvg,
            });

            return acc;
          }, []);

          resolve(JSON.stringify(stats));
        } catch (error) {
          reject({
            error: error.toString(),
            status: 'error',
          });
        }
      });
    });
  }
}

module.exports = Logger;
