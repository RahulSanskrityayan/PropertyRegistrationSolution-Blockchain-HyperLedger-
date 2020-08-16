'use strict';

const helper = require('./contractHelper');

async function main (orgRole,name, aadharNumber, propertyID, price, status){

try{
      const contractRegnet = await helper.getContractInstance(orgRole);

      const propertyregDetailsBuffer = await contractRegnet.submitTransaction('propertyRegistrationRequest',name, aadharNumber, propertyID, price, status);

      let propertyRedDetailsDetails = JSON.parse(propertyregDetailsBuffer.toString());

      console.log(propertyRedDetailsDetails);
      return propertyRedDetailsDetails;

}catch (error){
  throw new Error(error);
  console.log(`error during calling function $(error)`);
}

finally {
helper.disconnect();
}
}

module.exports.execute=main;
