// Right click on the script name and hit 'Run' to execute
(async () => {
    try {
        console.log('Running estimate_gas_fees script...');

        const contractName = 'PolyPILIX'; // Change this for other contract
        const contract_address = '0x8982F2001c9e34C8a6109FC8a85539b14D23f9a9';

        // Note that the script needs the ABI which is generated from the compilation artifact.
        // Make sure contract is compiled and artifacts are generated
        const artifactsPath = `browser/contracts/artifacts/${contractName}.json`; // Change this for different path

        const metadata = JSON.parse(
            await remix.call('fileManager', 'getFile', artifactsPath)
        );
        const accounts = await web3.eth.getAccounts();

        const artCollectible = new web3.eth.Contract(
            metadata.abi,
            contract_address,
            {
                from: accounts[0]
            }
        );
        const ids = getTokenIds(111, 10);
        const amounts = getAmounts(10);
        console.log('Token ids => ', ids);
        console.log('Amounts => ', amounts);
        const gas = await artCollectible.methods
            .mintBatch(ids, amounts)
            .estimateGas();
        console.log('Gas required for batch minting: ', gas);
        // const estimatedGasPrice = await web3.eth.getGasPrice();
        // console.log('estimated network gas price:', estimatedGasPrice);
        const gasPrice = web3.utils.toWei('30', 'gwei');
        console.log('gas cost estimation = ' + gas * gasPrice + ' wei');
        console.log(
            'gas cost estimation = ' +
                web3.utils.fromWei((gas * gasPrice).toString(), 'ether') +
                ' ether'
        );
        const block = await web3.eth.getBlock('latest');
        console.log('block gasLimit:', block.gasLimit);
    } catch (e) {
        console.log(e.message);
    }
})();

function getTokenIds(startTokenId, size) {
    return Array(size)
        .fill()
        .map((element, index) => index + startTokenId);
}

function getAmounts(size) {
    return Array(size).fill(1);
}
