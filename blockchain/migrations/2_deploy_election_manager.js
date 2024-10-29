const ElectionManager = artifacts.require("ElectionManager");

module.exports = function (deployer) {
    deployer.deploy(ElectionManager);
};
