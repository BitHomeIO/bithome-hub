module.exports = {

  postCapability: function (req, res) {

    ActionService.executeCapability(
      req.params['nodeId'],
      req.params['capability'],
      req.body['params']
    );


    return res.ok();
  }
};

