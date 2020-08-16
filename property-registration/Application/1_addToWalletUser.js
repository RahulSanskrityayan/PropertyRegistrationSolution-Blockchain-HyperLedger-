'use strict';

const fs = require('fs');

const {FileSystemWallet,X509WalletMixin} = require('fabric-network');

const path = require('path');

const wallet = new FileSystemWallet('./identity/User');

async function main (CertificatePath,PrivateKeyPath){
try{

    const certificate = fs.readFileSync(CertificatePath).toString();

    const privateKeyPath = fs.readFileSync(PrivateKeyPath).toString();

    const identitylabel = 'User_ADMIN';
    const identity = X509WalletMixin.createIdentity('usersMSP',certificate,privateKeyPath);
    await wallet.import(identitylabel,identity);

}catch (error) {
  console.log(`error adding to wallet $(error)`);
  console.log(error.stack);
  throw new Error(error);

}

}
/*main('/home/upgrad/Desktop/ProjectPropertyRegisteration/property-registration/network/crypto-config/peerOrganizations/users.property-registration-network.com/users/Admin@users.property-registration-network.com/msp/signcerts/Admin@users.property-registration-network.com-cert.pem','/home/upgrad/Desktop/ProjectPropertyRegisteration/property-registration/network/crypto-config/peerOrganizations/users.property-registration-network.com/users/Admin@users.property-registration-network.com/msp/keystore/3c6d13a5fceb0bae52628d19d4037624fb39c7b9ebf72472211b1be559174e6e_sk').then(()=> {console.log("User Identity Added to wallet");
});*/

module.exports.execute = main;
