import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
export default buildModule("VotingModule", (m) => {
  const question = m.getParameter("question", "Which language should we learn next?");
  const options = m.getParameter("options", ["Solidity", "Rust", "Go"]);
  const durationSeconds = m.getParameter("durationSeconds", 604800n); // 7 days
  const voting = m.contract("Voting", [question, options, durationSeconds]);
  return { voting };
});