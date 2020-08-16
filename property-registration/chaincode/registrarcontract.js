'use strict';

const {Contract} = require ('fabric-contract-api');

class RegistrarContract extends Contract{

constructor(){

	super('org.property-registration-network.com.registrar');
}

// function to instantiate the chaincode
async instantiate(ctx){
console.log('Registrar Smart Contract Instantiated');
}

// function to approve newUser after fetching the details of the userRequest and creating a user Asset on the network
async approveNewUser(ctx, name, aadharNumber){

const userRequestKey = ctx.stub.createCompositeKey('org.property-registration-network.createUserRequest', [name + '-' + aadharNumber]);
const userKey = ctx.stub.createCompositeKey('org.property-registration-network.userinfo',[name + '-' + aadharNumber]);

let userRequestBuffer = await ctx.stub.getState(userRequestKey).catch(err => consloe.log(err));
const userRequest =JSON.parse(userRequestBuffer.toString());

// creating a user request for the network
let userdetailsobj = {
	name : userRequest.name,
	emailId : userRequest.emailId,
	phoneNo : userRequest.phoneNo,
	aadharNumber : userRequest.aadharNumber,
	upgradCoins : 0,
	CreatedAt : new Date(),
};

let dataBuffer = Buffer.from(JSON.stringify(userdetailsobj));
await ctx.stub.putState(userKey,dataBuffer);
return userdetailsobj;
}

// function to view the current state of user in the network
async viewUser (ctx, name, aadharNumber){
	const userKey = ctx.stub.createCompositeKey('org.property-registration-network.userinfo',[name + '-' + aadharNumber]);
	let userDetailsBuffer = await ctx.stub.getState(userKey).catch(err => consloe.log(err));
	return JSON.parse(userDetailsBuffer.toString());
}

// function to approve PropertRegisteration request after fetching the details of the PropertRegisteration request and creating a Property Asset on the network
async approvePropertyRegistration (ctx, propertyID ){
	const propertyRegRequestKey = ctx.stub.createCompositeKey('org.property-registration-network.propertyRequest',[propertyID]);
	const propertyKey = ctx.stub.createCompositeKey('org.property-registration-network.property',[propertyID]);
	let propertyRequestDetailsbuffer = await ctx.stub.getState(propertyRegRequestKey).catch(err => console.log(err));
	const propertyreq = JSON.parse(propertyRequestDetailsbuffer.toString());

// creating a property asset on the network
	let propertyobj = {
		propertyID : propertyreq.propertyID,
		price : parseInt(propertyreq.price),
		owner : propertyreq.owner,
		status : propertyreq.status,
		CreatedAt : new Date(),
	};

	let propertyobjBuffer = Buffer.from(JSON.stringify(propertyobj));
	await ctx.stub.putState(propertyKey,propertyobjBuffer);
	return propertyobj;
}

// function to view the current state of property on the network
async viewProperty (ctx, propertyID){
	const propertyKey = ctx.stub.createCompositeKey('org.property-registration-network.property',[propertyID]);
	let propertyDetailsBuffer = await ctx.stub.getState(propertyKey).catch(err => consloe.log(err));
	return JSON.parse(propertyDetailsBuffer.toString());
}

// function to update details of property on the network
async updateProperty (ctx, propertyID, name, aadharNumber, status ){
	const propertyKey = ctx.stub.createCompositeKey('org.property-registration-network.property',[propertyID]);
	let propertyInfoBuffer = await ctx.stub.getState(propertyKey).catch(err => consloe.log(err));
	const propertyInfo = JSON.parse(propertyInfoBuffer.toString());

// Only the owner has the rights to update the details of the property
	if(propertyInfo.owner !== name + '-' + aadharNumber){
		throw new Error('Only the Owner of the Property can update the Propert Details');
	}else{

//updated property object 
		let updatedpropertyobj = {
			propertyID : propertyID,
			price : propertyInfo.price,
			owner : name + '-' + aadharNumber,
			status : status,
			CreatedAt : new Date(),
		};

		let updatePropertybuffer = Buffer.from(JSON.stringify(updatedpropertyobj));
		await ctx.stub.putState(propertyKey,updatePropertybuffer);
		return updatedpropertyobj;
	}

}


}
module.exports=RegistrarContract;
