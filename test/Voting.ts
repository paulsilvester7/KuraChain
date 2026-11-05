import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { network } from "hardhat";
describe("Voting", async function () {
  const { viem, networkHelpers } = await network.connect();
  const [owner, voter1, voter2] = await viem.getWalletClients();
  const QUESTION = "Best language?";
  const OPTIONS = ["Solidity", "Rust", "Go"];
  const DURATION = 3600n; // one hour
  async function deploy() {
    return viem.deployContract("Voting", [QUESTION, OPTIONS, DURATION]);
  }
  it("should start with zero votes and an open poll", async function () {
    const voting = await deploy();
    assert.deepEqual(await voting.read.getVotes(), [0n, 0n, 0n]);
    assert.equal(await voting.read.isOpen(), true);
  });
  it("should count a vote", async function () {
    const voting = await deploy();
    await voting.write.vote([1n], { account: voter1.account });
    assert.deepEqual(await voting.read.getVotes(), [0n, 1n, 0n]);
  });
  it("should count votes from different wallets", async function () {
    const voting = await deploy();
    await voting.write.vote([0n], { account: voter1.account });
    await voting.write.vote([0n], { account: voter2.account });
    assert.deepEqual(await voting.read.getVotes(), [2n, 0n, 0n]);
  });
  it("should reject a second vote from the same wallet", async function () {
    const voting = await deploy();
    await voting.write.vote([0n], { account: voter1.account });
    await viem.assertions.revertWith(
      voting.write.vote([1n], { account: voter1.account }),
      "Already voted",
          );
  });
  it("should reject an invalid option", async function () {
    const voting = await deploy();
    await viem.assertions.revertWith(
      voting.write.vote([99n], { account: voter1.account }),
      "Invalid option",
    );
  });
  it("should emit VoteCast", async function () {
    const voting = await deploy();
    await viem.assertions.emit(
      voting.write.vote([2n], { account: voter1.account }),
      voting,
      "VoteCast",
    );
  });
  it("should only let the owner close the poll", async function () {
    const voting = await deploy();
    await viem.assertions.revertWith(
      voting.write.closePoll({ account: voter1.account }),
      "Only owner",
    );
    await voting.write.closePoll({ account: owner.account });
    assert.equal(await voting.read.isOpen(), false);
  });
  it("should reject votes after the deadline", async function () {
    const voting = await deploy();
    await networkHelpers.time.increase(3601);
    await viem.assertions.revertWith(
      voting.write.vote([0n], { account: voter1.account }),
      "Poll is closed",
    );
  });
});