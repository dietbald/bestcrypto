const bcv = artifacts.require("bcv");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("bcv", function (/* accounts */) {
  it("should assert true", async function () {
    await bcv.deployed();
    return assert.isTrue(true);
  });
});
