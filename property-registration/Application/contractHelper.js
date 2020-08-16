const fs = require('fs');
const {FileSystemWallet,Gateway} = require('fabric-network');
const yaml = require('js-yaml');

let fabricname;
let filesystemWallet;
let gateway;
let connectProfile;

async function getContractInstance(MspID){

if(MspID=='users'){
  filesystemWallet= './identity/User';
  fabricname = 'User_ADMIN';
  connectProfile = './connection-Profile-User.yaml';
}else{
  filesystemWallet= './identity/Registerar';
  fabricname = 'Registarar_ADMIN';
  connectProfile = 'connection-Profile-Registerar.yaml';
}

gateway = new Gateway();

const wallet = new FileSystemWallet(filesystemWallet);

const fabricUserName = fabricname;

const ccp = yaml.safeLoad(fs.readFileSync(connectProfile,'utf-8'));

let connectobj = {
  wallet : wallet,
  identity : fabricUserName,
  discovery : {enabled:false,asLocalHost:true}
};

await gateway.connect(ccp,connectobj);

const channel = await gateway.getNetwork('registrationchannel');
if(MspID=='users'){
return channel.getContract('regnet','org.property-registration-network.com.user');
}else{

return channel.getContract('regnet','org.property-registration-network.com.registrar');
}

}

function disconnect(){
gateway.disconnect();
}

module.exports.getContractInstance=getContractInstance;
module.exports.disconnect = disconnect;
