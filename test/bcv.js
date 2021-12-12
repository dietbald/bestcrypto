const bcv = artifacts.require("bcv");
const BN = require("bn.js");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */

const oneEther = new web3.utils.BN(10).pow(new web3.utils.BN(18));

contract("bcv", function ([owner, account1, account2] /* accounts */) {
  it("bcv contract should be deployed", async function () {
    await bcv.deployed();
    return assert.isTrue(true);
  });

  it("should update crypto name", async function () {
    const b = await bcv.deployed();
    await b.Elect("Ethereum", { from: account1, value: oneEther });
    const cryptoName = await b.getBestCryptoName();
    return assert.equal(cryptoName, "Ethereum");
  });

  it("should assign first Token to owner", async function () {
    const b = await bcv.new();

    const balance = await b.balanceOf(owner);
    const expected = oneEther;

    return expect(expected.toString()).to.eql(balance.toString());
  });

  it("Check total supply after 3 elects", async function () {
    const b = await bcv.new();

    await b.Elect("Ethereum", { from: account1, value: oneEther });
    await b.Elect("Harmony One", { from: account2, value: oneEther });
    await b.Elect("Eden", { from: account1, value: oneEther });
    await b.Elect("AXS", { from: account2, value: oneEther });

    const supply = await b.totalSupply();
    const expected = oneEther.mul(new BN(5));

    return expect(expected.toString()).to.eql(supply.toString());
  });

  it("One bcv owner should exist after constructor call ", async function () {
    const b = await bcv.new();
    const owners = await b.getBcvOwnerLength();

    return expect("1").to.eql(owners.toString());
  });

  it("3 bcv owner should exist after constructor and 2 elects ", async function () {
    const b = await bcv.new();

    await b.Elect("Eden", { from: account1, value: oneEther });
    await b.Elect("AXS", { from: account2, value: oneEther });
    await b.Elect("JEWEL", { from: account1, value: oneEther });

    const owners = await b.getBcvOwnerLength();

    return expect("3").to.eql(owners.toString());
  });

  it("should distribute ONE's to bcv owners", async function () {
    const b = await bcv.new();

    let initialBalanceOwner = await web3.eth.getBalance(owner);

    await b.Elect("Ethereum", { from: account1, value: oneEther });

    let updatedBalanceOwner = await web3.eth.getBalance(owner);

    const expected = oneEther;

    const diff = updatedBalanceOwner - initialBalanceOwner;
    return expect(expected.toString()).to.eql(diff.toString());
  });

  it("should distribute ONE's to 3 bcv owners", async function () {
    const b = await bcv.new();

    let initialBalanceAccount1 = await web3.eth.getBalance(account1);
    let initialBalanceOwner = await web3.eth.getBalance(owner);

    let supply = await b.totalSupply();
    console.log("supply", supply.toString());
    console.log("u    owner", await web3.eth.getBalance(owner));
    console.log("u account1", await web3.eth.getBalance(account1));
    console.log("u account2", await web3.eth.getBalance(account2));
    console.log("bcv suppliers", await b.getBcvOwnerLength());

    console.log("");

    console.log("Account 1 Elect ");
    const tx = await b.Elect("Ethereum", { from: account1, value: oneEther });
    supply = await b.totalSupply();
    console.log("supply", supply.toString());
    console.log("u    owner", await web3.eth.getBalance(owner));
    console.log("u account1", await web3.eth.getBalance(account1));
    console.log("u account2", await web3.eth.getBalance(account2));
    console.log("bcv suppliers", await b.getBcvOwnerLength());

    console.log("");

    console.log("Account 2 Elect ");
    await b.Elect("Harmony One", { from: account2, value: oneEther });
    supply = await b.totalSupply();
    console.log("supply", supply.toString());
    console.log("u    owner", await web3.eth.getBalance(owner));
    console.log("u account1", await web3.eth.getBalance(account1));
    console.log("u account2", await web3.eth.getBalance(account2));
    console.log("bcv suppliers", await b.getBcvOwnerLength());

    console.log("Account 1 Elect ");
    await b.Elect("Ethereum", { from: account1, value: oneEther });
    supply = await b.totalSupply();
    console.log("supply", supply.toString());
    console.log("u    owner", await web3.eth.getBalance(owner));
    console.log("u account1", await web3.eth.getBalance(account1));
    console.log("u account2", await web3.eth.getBalance(account2));
    console.log("bcv suppliers", await b.getBcvOwnerLength());

    console.log("");

    let updatedBalanceAccount1 = await web3.eth.getBalance(account1);
    let updatedBalanceOwner = await web3.eth.getBalance(owner);

    const balanceDifference = initialBalanceAccount1 - updatedBalanceAccount1;
    console.log("d account1 ", balanceDifference);

    const expected = oneEther;
    assert(balanceDifference >= oneEther);

    const diff = updatedBalanceOwner - initialBalanceOwner;
    console.log("difference ", diff.toString());
    return expect(expected.toString()).to.lt(diff.toString());
  });

  /*
  it("should distribute ONE's to bcv owners", async function () {
    const b = await bcv.new();

    let actualBalanceAccount1 = await web3.eth.getBalance(account1);
    await b.Elect("Ethereum").send({ from: account1, value: 1 * 10 ** 18 })

    await b.Elect("Polygon").send({ from: account2, value: 1 * 10 ** 18 });

    const balance = await b.getBalance();
    return assert.equal(balance, 0 );
  });
  */
});
