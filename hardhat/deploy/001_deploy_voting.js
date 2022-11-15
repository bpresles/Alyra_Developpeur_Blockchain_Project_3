module.exports = async ({
    getNamedAccounts,
    deployments,
  }) => {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();

    await deploy('Voting', {
        contract: 'Voting',
        from: deployer,
        args: [],
        log: true,
    });
};