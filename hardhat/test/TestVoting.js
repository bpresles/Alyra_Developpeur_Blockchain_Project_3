const { expect } = require('chai');
const { BigNumber } = require('ethers');
const { ethers } = require('hardhat');

/**
 * Tests for Voting contract.
 */
context("Voting", () => {
    let owner;
    let voter1;
    let voter2;
    let votingInstance;

  /**
   * We use a distinct instance of voting contract before each tests to avoid side effects.
   */
  beforeEach(async () => {
    [owner, voter1, voter2] = await ethers.getSigners();
    const Voting = await ethers.getContractFactory("Voting");
    votingInstance = await Voting.connect(owner).deploy();
  });

  /**
   * Tests on voters registrations.
   */
  context("Voters registration", () => {
    context('addVoter', () => {
      it("Require - Should not allow adding voter if not owner", async () => {
        await expect(votingInstance.connect(voter1).addVoter(voter2.address)).to.be.revertedWith('Ownable: caller is not the owner');
      });

      it("Require - Should not allow registering existing voter", async () => {
        await votingInstance.connect(owner).addVoter(voter1.address);
        await expect(votingInstance.connect(owner).addVoter(voter1.address)).to.be.revertedWith('Already registered');
      });

      it("Require - Should not allow registering voter if workflow status is not RegisteringVoters", async () => {
        votingInstance.connect(owner).startProposalsRegistering();
        await expect(votingInstance.connect(owner).addVoter(voter1.address)).to.be.revertedWith('Voters registration is not open yet');
      });

      it("Event - Should allow adding not registered voter by owner", async () => {
        const addVoter = await votingInstance.connect(owner).addVoter(voter1.address);
        const voter = await votingInstance.connect(voter1).getVoter(voter1.address);

        expect(voter.isRegistered).to.equal(true);
        expect(addVoter).to.emit(votingInstance, 'VoterRegistered').withArgs(voter1.address);
      });
    })

  });

  /**
   * Tests on proposals management.
   */
  context("Proposals", () => {
    context('getOneProposal', () => {
      it("Require - Should not allow to get one proposal information when caller is not voter", async () => {
        await expect(votingInstance.connect(voter1).getOneProposal(BigNumber.from(0))).to.be.revertedWith('You\'re not a voter');
      });

      it("getVoter - Should return the proposal information when called by a voter", async () => {
        await votingInstance.connect(owner).addVoter(voter1.address);
        await votingInstance.connect(owner).startProposalsRegistering();
        await votingInstance.connect(voter1).addProposal('Proposal 1');

        const proposal = await votingInstance.connect(voter1).getOneProposal(BigNumber.from(1));

        expect(proposal[0]).to.equal('Proposal 1');
        expect(proposal[1]).to.equal(0);
      });
    }),

    context('addProposal/getOneProposal', () => {
      it("Require - addProposal - Should not allow to add proposal to not registered voters", async () => {
        await expect(votingInstance.connect(voter1).addProposal('Proposal 2')).to.be.revertedWith('You\'re not a voter');
      });

      it("Require - addProposal - Should not allow adding proposal if workflow status is not ProposalsRegistrationStarted", async () => {
        await votingInstance.connect(owner).addVoter(voter1.address);
        await expect(votingInstance.connect(voter1).addProposal("Proposal")).to.be.revertedWith('Proposals are not allowed yet');
      });

      it("Require - addProposal - Should not allow empty proposal", async () => {
        await votingInstance.connect(owner).addVoter(voter1.address);
        await votingInstance.connect(owner).startProposalsRegistering();

        await expect(votingInstance.connect(voter1).addProposal('')).to.be.revertedWith('Vous ne pouvez pas ne rien proposer');
      });

      it("Event - addProposal - Should emit ProposalRegistered on successful proposal", async () => {
        await votingInstance.connect(owner).addVoter(voter1.address);
        await votingInstance.connect(owner).startProposalsRegistering();

        const receipt1 = await votingInstance.connect(voter1).addProposal('Proposal 1');
        expect(receipt1).to.emit(votingInstance, 'ProposalRegistered').withArgs({proposalId: BigNumber.from(1)});
      });

      it("addProposal - Should add proposal when the caller is a registered voter", async () => {  
        await votingInstance.addVoter(voter1.address);
        await votingInstance.connect(owner).startProposalsRegistering();
  
        await votingInstance.connect(voter1).addProposal('Proposal 1');
  
        const proposalAdded = await votingInstance.connect(voter1).getOneProposal(BigNumber.from(1));
        expect(proposalAdded.description).to.equal('Proposal 1');
      });

      it("getOneProposal - Should revert on overflow argument value", async () => {
        await votingInstance.connect(owner).addVoter(voter1.address);

        try {
          await votingInstance.connect(voter1).getOneProposal(BigNumber.from(Math.pow(2, 256)));
        }
        catch (error) {
          expect(error.code).to.equal('NUMERIC_FAULT');
          expect(error.fault).to.equal('overflow');
        }
      });
    });

    context('Workflow startProposalsRegistering/endProposalsRegistering', () => {
      it("Require - startProposalsRegistering - Should revert when called from not owner", async () => {
        await expect(votingInstance.connect(voter1).startProposalsRegistering()).to.revertedWith('Ownable: caller is not the owner');
      });

      it("Require - startProposalsRegistering - Should emit WorkflowStatusChange with status 1", async () => {
        const receipt = await votingInstance.connect(owner).startProposalsRegistering();
        expect(receipt).to.emit(votingInstance, 'WorkflowStatusChange').withArgs({previousStatus: BigNumber.from(0), newStatus: BigNumber.from(1)});
      });

      it("Require - startProposalsRegistering - Should not allow starting proposal registering when not in correct state", async () => {
        const receipt = await votingInstance.connect(owner).startProposalsRegistering();
        await expect(votingInstance.connect(owner).startProposalsRegistering()).to.revertedWith('Registering proposals cant be started now');
      });

      it("Require - endProposalsRegistering - Should revert when called from not owner", async () => {
        await expect(votingInstance.connect(voter1).endProposalsRegistering()).to.revertedWith('Ownable: caller is not the owner');
      });

      it("Require - endProposalsRegistering - Should not allow ending proposal registering when not started yet", async () => {
        await expect(votingInstance.connect(owner).endProposalsRegistering()).to.revertedWith('Registering proposals havent started yet');
      });

      it("Event - endProposalsRegistering - Should emit WorkflowStatusChange with status change from 1 to 2", async () => {
        await votingInstance.connect(owner).startProposalsRegistering();
        const receipt = await votingInstance.connect(owner).endProposalsRegistering();
        expect(receipt).to.emit(votingInstance, 'WorkflowStatusChange').withArgs({previousStatus: BigNumber.from(1), newStatus: BigNumber.from(2)});
      });
    });

  });

  /**
   * Tests on voting session.
   */
  context("Votes", () => {

    context('getVoter', () => {
      it("Require - Should not allow to get voter information when caller is not voter", async () => {
        await expect(votingInstance.connect(voter1).getVoter(voter1.address)).to.be.revertedWith('You\'re not a voter');
      });

      it("getVoter - Should return the voter information when called by a voter", async () => {
        await votingInstance.connect(owner).addVoter(voter1.address);
        const voter = await votingInstance.connect(voter1).getVoter(voter1.address);

        expect(voter[0]).to.equal(true);
        expect(voter[1]).to.equal(false);
        expect(voter[2]).to.equal(BigNumber.from(0));
      });
    }),

    context('setVote', () => {
      it("Require - Should not allow to vote when caller is not voter", async () => {
        await expect(votingInstance.connect(voter1).setVote(BigNumber.from(0))).to.be.revertedWith('You\'re not a voter');
      });

      it("Require - Should not allow to vote voting session has not started", async () => {

        await votingInstance.addVoter(voter1.address);
        await votingInstance.connect(owner).startProposalsRegistering();
        await votingInstance.connect(owner).endProposalsRegistering();
  
        await expect(votingInstance.connect(voter1).setVote(BigNumber.from(0))).to.be.revertedWith('Voting session havent started yet');
      });

      it("Require - Should not allow to vote twice", async () => {

        await votingInstance.addVoter(voter1.address);
        await votingInstance.connect(owner).startProposalsRegistering();
        await votingInstance.connect(owner).endProposalsRegistering();
        await votingInstance.connect(owner).startVotingSession();
        
        // first vote.
        await votingInstance.connect(voter1).setVote(BigNumber.from(0));
        
        // seconf vote should fail.
        await expect(votingInstance.connect(voter1).setVote(BigNumber.from(0))).to.be.revertedWith('You have already voted');
      });

      it("Require - Should not allow vote on nonexisting proposal", async () => {

        await votingInstance.addVoter(voter1.address);
        await votingInstance.connect(owner).startProposalsRegistering();
        await votingInstance.connect(owner).endProposalsRegistering();
        await votingInstance.connect(owner).startVotingSession();

        await expect(votingInstance.connect(voter1).setVote(BigNumber.from(1))).to.be.revertedWith('Proposal not found');
      });

      it("Arguments - Should revert on overflow argument value", async () => {
        await votingInstance.connect(owner).addVoter(voter1.address);

        try {
          await votingInstance.connect(voter1).setVote(BigNumber.from(Math.pow(2, 256)));
        }
        catch (error) {
          expect(error.code).to.equal('NUMERIC_FAULT');
          expect(error.fault).to.equal('overflow');
        }
      });

      it("Vote & Event - Should a registered voter to vote once and emit Voted event", async () => {
        await votingInstance.addVoter(voter1.address);
        await votingInstance.connect(owner).startProposalsRegistering();
        await votingInstance.connect(owner).endProposalsRegistering();
        await votingInstance.connect(owner).startVotingSession();
        
        const proposalBeforeVote = await votingInstance.connect(voter1).getOneProposal(BigNumber.from(0));
        const receipt = await votingInstance.connect(voter1).setVote(BigNumber.from(0));
        const voter = await votingInstance.connect(voter1).getVoter(voter1.address);
        const proposalVoted = await votingInstance.connect(voter1).getOneProposal(BigNumber.from(0));
        
        await expect(voter.votedProposalId).to.equal(BigNumber.from(0));
        await expect(voter.hasVoted).to.equal(true);
        await expect(proposalVoted.voteCount).to.equal(proposalBeforeVote.voteCount+1);

        expect(receipt).to.emit(votingInstance, 'Voted').withArgs({voter: voter1.address, proposalId: BigNumber.from(0)});
      });
    });

    context('Workflow startVotingSession/endVotingSession', () => {
      it("Require - startVotingSession - Should revert when called from not owner", async () => {
        await expect(votingInstance.connect(voter1).startVotingSession()).to.revertedWith('Ownable: caller is not the owner');
      });

      it("Require - startVotingSession - Should emit WorkflowStatusChange with status from 2 to 3", async () => {
        await votingInstance.connect(owner).startProposalsRegistering();
        await votingInstance.connect(owner).endProposalsRegistering();
        const receipt = await votingInstance.connect(owner).startVotingSession();
        expect(receipt).to.emit(votingInstance, 'WorkflowStatusChange').withArgs({previousStatus: BigNumber.from(2), newStatus: BigNumber.from(3)});
      });

      it("Require - startVotingSession - Should not allow ending proposal registering when not started yet", async () => {
        await expect(votingInstance.connect(owner).startVotingSession()).to.revertedWith('Registering proposals phase is not finished');
      });

      it("Require - endVotingSession - Should revert when called from not owner", async () => {
        await expect(votingInstance.connect(voter1).endVotingSession()).to.revertedWith('Ownable: caller is not the owner');
      });

      it("Require - endVotingSession - Should not allow ending proposal registering when not started yet", async () => {
        await expect(votingInstance.connect(owner).endVotingSession()).to.revertedWith('Voting session havent started yet');
      });

      it("Event - endVotingSession - Should emit WorkflowStatusChange with status from 3 to 4", async () => {
        await votingInstance.connect(owner).startProposalsRegistering();
        await votingInstance.connect(owner).endProposalsRegistering();
        await votingInstance.connect(owner).startVotingSession();
        const receipt = await votingInstance.connect(owner).endVotingSession();
        expect(receipt).to.emit(votingInstance, 'WorkflowStatusChange').withArgs({previousStatus: BigNumber.from(3), newStatus: BigNumber.from(4)});
      });
    });

  });

  /**
   * Tests on votes counting process.
   */
  context("Tally votes", () => {
    it("Require - Should not allow to tallyVote when caller is not owner", async () => {
      await expect(votingInstance.connect(voter1).tallyVotes()).to.be.revertedWith('Ownable: caller is not the owner');
    });

    it("Require - Should not allow to tally vote when voting session is not ended", async () => {
      await votingInstance.connect(owner).startProposalsRegistering();
      await votingInstance.connect(owner).endProposalsRegistering();
      await votingInstance.connect(owner).startVotingSession();

      await expect(votingInstance.connect(owner).tallyVotes()).to.be.revertedWith('Current status is not voting session ended');
    });

    it("Event - Tally - winningProposalID should stay at default value 0 when there are no votes and sill emit VotesTallied status change event", async () => {
      await votingInstance.connect(owner).startProposalsRegistering();
      await votingInstance.connect(owner).endProposalsRegistering();
      await votingInstance.connect(owner).startVotingSession();
      await votingInstance.connect(owner).endVotingSession();

      const receipt = await votingInstance.connect(owner).tallyVotes();

      expect(await votingInstance.winningProposalID.call()).to.equal(BigNumber.from(0));
      expect(receipt).to.emit(votingInstance, 'WorkflowStatusChange').withArgs({previousStatus: BigNumber.from(4), newStatus: BigNumber.from(5)});
    });

    it("Event - Tally - winningProposalID should be set to winning proposal and emit VotesTallied status change event", async () => {
      await votingInstance.connect(owner).addVoter(owner.address);  
      await votingInstance.connect(owner).addVoter(voter1.address);  
      await votingInstance.connect(owner).addVoter(voter2.address);

      await votingInstance.connect(owner).startProposalsRegistering();

      await votingInstance.connect(owner).addProposal('Proposal 1');  
      await votingInstance.connect(voter2).addProposal('Proposal 3');  
      await votingInstance.connect(voter2).addProposal('Proposal 4');  

      await votingInstance.connect(owner).endProposalsRegistering();

      await votingInstance.connect(owner).startVotingSession();

      await votingInstance.connect(owner).setVote(BigNumber.from(1));  
      await votingInstance.connect(voter1).setVote(BigNumber.from(3));  
      await votingInstance.connect(voter2).setVote(BigNumber.from(3));  

      await votingInstance.connect(owner).endVotingSession();

      const receipt = await votingInstance.connect(owner).tallyVotes();

      expect(await votingInstance.winningProposalID.call()).to.equal(BigNumber.from(3));
      expect(receipt).to.emit(votingInstance, 'WorkflowStatusChange').withArgs({previousStatus: BigNumber.from(4), newStatus: BigNumber.from(5)});
    });
  });

});

