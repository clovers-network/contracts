// const Artifactor = require("@truffle/artifactor");
var { deployAllContracts } = require('../helpers/deployAllContracts')
const extractNetworks = require('@gnosis.pm/util-contracts/src/util/extractNetworks')
// const injectNetworks = require('@gnosis.pm/util-contracts/src/util/injectNetworks')
const path = require('path')

var {saveNetworks} = require('../helpers/utils')
const confFile = path.join(__dirname, '../conf/network-restore')
const conf = require(confFile)
// const artifactor = new Artifactor(conf.buildPath);

let overwrites = {
    Reversi: false,
    Support: false,
    Clovers: false,
    CloversMetadata: false,
    CloversController: false,
    ClubTokenController: false,
    SimpleCloversMarket: false,
    ClubToken: false
}
task("deploy", "Deploys contracts")
.addFlag("v", "Add verbose output to the command", false)
.addFlag("a", "Deploy all", false)
.addOptionalVariadicPositionalParam("overwrite", "Just list the contract names you'd like to overwrite", [])
.setAction(async ({ overwrite, v, a }, env) => {
    const verbose = v
    overwrite.forEach(element => {
        if (overwrites[element] === undefined) throw new Error(`${element} does not exist`)
        overwrites[element] = true
    });

    // there's some kind of race condition where this function prevents extractNetworks from working
    // await injectNetworks(confFile)

    const accounts = await web3.eth.getAccounts();

    var {
        reversi, 
        clovers, 
        cloversMetadata, 
        cloversController, 
        clubTokenController, 
        simpleCloversMarket, 
        clubToken
    } = await deployAllContracts({
        overwrites, 
        accounts, 
        artifacts, 
        web3, 
        verbose,
        deployAll: a
    })


    // save contract info inside of ./build/contracts
    saveNetworks([reversi, 
        clovers, 
        cloversMetadata, 
        cloversController, 
        clubTokenController, 
        simpleCloversMarket, 
        clubToken], env)

    // save network info inside of ./networks.json
    await extractNetworks(confFile)
    return {
        reversi, 
        clovers, 
        cloversMetadata, 
        cloversController, 
        clubTokenController, 
        simpleCloversMarket, 
        clubToken
    }
 });