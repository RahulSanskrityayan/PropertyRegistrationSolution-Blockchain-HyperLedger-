'use strict';

const fs = require('fs');

const {FileSystemWallet,X509WalletMixin} = require('fabric-network');

const path = require('path');

const wallet = new FileSystemWallet('./identity/Registerar');

async function main (CertificatePath,PrivateKeyPath){
try{

    const certificate = fs.readFileSync(CertificatePath).toString();

    const privateKeyPath = fs.readFileSync(PrivateKeyPath).toString();

    const identitylabel = 'Registarar_ADMIN';
    const identity = X509WalletMixin.createIdentity('registrarMSP',certificate,privateKeyPath);
    await wallet.import(identitylabel,identity);

}catch (error) {
  console.log(`error adding to wallet $(error)`);
  console.log(error.stack);
  throw new Error(error);

}
}
/*main(/home/upgrad/Desktop/ProjectPropertyRegisteration/property-registration/network/crypto-config/peerOrganizations/registrar.property-registration-network.com/users/Admin@registrar.property-registration-network.com/msp/signcerts/Admin@registrar.property-registration-network.com-cert.pem,/home/upgrad/Desktop/ProjectPropertyRegisteration/property-registration/network/crypto-config/peerOrganizations/registrar.property-registration-network.com/users/Admin@registrar.property-registration-network.com/msp/keystore/a92c7e061ccd7b12ecf35040658633a2b8496750cb52ed59791919d896ed6a11_sk).then(=> {console.log("User Identity Added to wallet")
});*/

module.exports.execute = main;
