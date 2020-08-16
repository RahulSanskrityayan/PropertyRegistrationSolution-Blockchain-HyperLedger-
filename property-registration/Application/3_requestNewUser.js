'use strict';

const helper = require('./contractHelper');

async function main (orgRole,name, emailId, phoneNo, aadharNumber){

try{
      const contractRegnet = await helper.getContractInstance(orgRole);

      const requestBuffer = await contractRegnet.submitTransaction('requestNewUser',name, emailId, phoneNo, aadharNumber);

      let requestuser = JSON.parse(requestBuffer.toString());

      console.log(requestuser);
      return requestuser;

}catch (error){
  throw new Error(error);
  console.log(`error during calling function $(error)`);
}

finally {
helper.disconnect();
}
}

module.exports.execute=main;
