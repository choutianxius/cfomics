/**
 * Async function to start promise chain.
 *
 * @param {function} next Callback
 * @returns {Promise}
 */
export default async function myAsyncFunction () {
  return new Promise((resolve) => {
    resolve();
  });
}
