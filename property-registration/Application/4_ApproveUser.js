'use strict';

const helper = require('./contractHelper');

async function main (orgRole,name, aadharNumber){

try{
      const contractRegnet = await helper.getContractInstance(orgRole);

      const approvedUserBuffer = await contractRegnet.submitTransaction('approveNewUser',name, aadharNumber);

      let approveduser = JSON.parse(approvedUserBuffer.toString());

      console.log(approveduser);
      return approveduser;

}catch (error){
  throw new Error(error);
  console.log(`error during calling function $(error)`);
}

finally {
helper.disconnect();
}
}

module.exports.execute=main;
