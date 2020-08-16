'use strict';

const helper = require('./contractHelper');

async function main (orgRole,name, aadharNumber){

try{
      const contractRegnet = await helper.getContractInstance(orgRole);

      const UserDetailsBuffer = await contractRegnet.submitTransaction('viewUser',name, aadharNumber);

      let userDetails = JSON.parse(UserDetailsBuffer.toString());

      console.log(userDetails);
      return userDetails;

}catch (error){
  throw new Error(error);
  console.log(`error during calling function $(error)`);
}

finally {
helper.disconnect();
}
}

module.exports.execute=main;
