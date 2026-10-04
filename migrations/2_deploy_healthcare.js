const HealthcareData = artifacts.require("HealthcareData");

module.exports = function (deployer) {
  deployer.deploy(HealthcareData);
};
