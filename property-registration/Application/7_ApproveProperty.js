'use strict';

const helper = require('./contractHelper');

async function main (orgRole,propertyID){

try{
      const contractRegnet = await helper.getContractInstance(orgRole);

      const approvedPropertyBuffer = await contractRegnet.submitTransaction('approvePropertyRegistration',propertyID);

      let approvedProprtyDetails = JSON.parse(approvedPropertyBuffer.toString());

      console.log(approvedProprtyDetails);
      return approvedProprtyDetails;

}catch (error){
  throw new Error(error);
  console.log(`error during calling function $(error)`);
}

finally {
helper.disconnect();
}
}

module.exports.execute=main;
