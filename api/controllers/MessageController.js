/**
 * MessageController
 *
 * @description :: Server-side logic for managing messages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
  /**
   * `MessageController.get()`
   */
  get: function (req, res) {
    return res.json(
      MessageService.query(0, 20)
    );
  },

  /**
   * `MessageController.clear()`
   */
  clear: function (req, res) {
    MessageService.clear();
    return res.ok();
  }
};

