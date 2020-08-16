'use strict';

const {Contract} = require ('fabric-contract-api');

class UserContract extends Contract{

// Provide a custom name to refer to this smart contract
	constructor(){

		super('org.property-registration-network.com.user');
}

/* ****** All custom functions are defined below ***** */

    // This is a basic user defined function used at the time of instantiating the smart contract
	// to print the success message on console

	async instantiate (ctx){
	console.log('User Smart Contract Instantiated');
	}

	//function to create a new User Registeration request on the network
	async requestNewUser(ctx, name, emailId, phoneNo, aadharNumber){
	const userRequestKey = ctx.stub.createCompositeKey('org.property-registration-network.createUserRequest', [name + '-' + aadharNumber]);

		// Create a UserRequest object to be stored in blockchain
		let newUserCreationRequestobj = {
			name : name,
			emailId : emailId,
			phoneNo : phoneNo,
			aadharNumber : aadharNumber,
			CreatedAt : new Date(),
		};

		// Convert the JSON object to a buffer and send it to blockchain for storage
		let dataBuffer = Buffer.from(JSON.stringify(newUserCreationRequestobj));
		await ctx.stub.putState(userRequestKey, dataBuffer);
		// Return value of new UserCreation  Request created to user
		return newUserCreationRequestobj;

	}

// function to recharge the account with valid bank transaction ID
	async rechargeAccount(ctx, name, aadharNumber, bankTransactionId){
	const allowedValues ="upg100,upg500,upg1000";
	let coinvalue=0;

		if(!allowedValues.split(',').includes(bankTransactionId)){
			throw new Error('Invalid Bank Transaction ID' + " "+ bankTransactionId);
		}else{
			switch (bankTransactionId) {
				case "upg100":
					coinvalue =100;
					break;
				case "upg500":
					coinvalue =500;
					break;
				case "upg1000":
					coinvalue =1000;
					break;
			}

	const userKey = ctx.stub.createCompositeKey('org.property-registration-network.userinfo',[name + '-' + aadharNumber]);
	let dataBuffer = await ctx.stub.getState(userKey).catch(err => console.log(err));
	const userData = JSON.parse(dataBuffer.toString());

// Create a updated user object to be stored in blockchain with updated upgrade coins
	let userinfosobj = {
		name : userData.name,
		emailId : userData.emailId,
		phoneNo : userData.phoneNo,
		aadharNumber : userData.aadharNumber,
		upgradCoins : parseInt(userData.upgradCoins)+coinvalue,
		CreatedAt : new Date(),
	};

	let userdataBuffer = Buffer.from(JSON.stringify(userinfosobj));
	await ctx.stub.putState(userKey,userdataBuffer);
	return userinfosobj;
	}

}

// function to view the current userstate on the network
async viewUser (ctx, name, aadharNumber){
	const userKey = ctx.stub.createCompositeKey('org.property-registration-network.userinfo',[name + '-' + aadharNumber]);
	let userDetailsBuffer = await ctx.stub.getState(userKey).catch(err => consloe.log(err));
	return JSON.parse(userDetailsBuffer.toString());
}

// function to create propertyregisteration request on the network
async propertyRegistrationRequest(ctx, name, aadharNumber, propertyID, price, status){

const allowedStatus = "registered,onSale";
if(!allowedStatus.split(',').includes(status)){
	 throw new Error('The allowed status for the property is either registered or onSale');
}else{
	const propertyRegRequestKey = ctx.stub.createCompositeKey('org.property-registration-network.propertyRequest',[propertyID]);

// create propertyregisteration object to be stored on blockchain network
	let propertyReqobj = {
		propertyID : propertyID,
		price :parseInt(price),
		owner : name + '-' + aadharNumber,
		status : status,
	};

	let propertyreqbuffer = Buffer.from(JSON.stringify(propertyReqobj));
	await ctx.stub.putState(propertyRegRequestKey,propertyreqbuffer);
	return propertyReqobj;
}
}

// function to view the current state of property on the network
async viewProperty (ctx, propertyID){
	const propertyKey = ctx.stub.createCompositeKey('org.property-registration-network.property',[propertyID]);
	let propertyDetailsBuffer = await ctx.stub.getState(propertyKey).catch(err => consloe.log(err));
	return JSON.parse(propertyDetailsBuffer.toString());
}

// function to purchase property
	async purchaseProperty(ctx, propertyID, name, aadharNumber){

//Fetching details of buyer from the network
	const userKey = ctx.stub.createCompositeKey('org.property-registration-network.userinfo',[name + '-' + aadharNumber]);
	let buyerDetailsBuffer = await ctx.stub.getState(userKey).catch(err => consloe.log(err));
	const bueryInfo = JSON.parse(buyerDetailsBuffer.toString());

//Fetching details of Property from the network
	const propertyKey = ctx.stub.createCompositeKey('org.property-registration-network.property',[propertyID]);
	let propertyInformationBuffer = await ctx.stub.getState(propertyKey).catch(err => consloe.log(err));
	const propertyDetails = JSON.parse(propertyInformationBuffer.toString());

// Fetching details of Seller from the network based on current owner of property details fetched
  const selleruserKey = ctx.stub.createCompositeKey('org.property-registration-network.userinfo',[propertyDetails.owner]);
	let SellerDetailsBuffer = await ctx.stub.getState(selleruserKey).catch(err => consloe.log(err));
	const SellerInfo = JSON.parse(SellerDetailsBuffer.toString());

// checking weather property is up for sale or not and buyer has sufficiend funds to purchase the property
	if (propertyDetails.status !== "onSale" ){
		throw new Error('Property is not on Sale');
	} else if(bueryInfo.upgradCoins < propertyDetails.price){
		throw new Error('Your back Account does not have enough balance. You need to recharge your account');
	} else{

// updating property owner details with buyers details
		let PropertyUpdateobj = {
			propertyID : propertyID,
			price : propertyDetails.price,
			owner : name + '-' + aadharNumber,
			status : "registered",
			CreatedAt : new Date(),
		};

		let updatePropertyDetailsbuffer = Buffer.from(JSON.stringify(PropertyUpdateobj));
		await ctx.stub.putState(propertyKey,updatePropertyDetailsbuffer);

// updating buyer upgradCoins details by substracting  buyers upgradCoins with price of the property
	  let updatebuyeruserobj = {
			name : name,
			emailId : bueryInfo.emailId,
			phoneNo : bueryInfo.phoneNo,
			aadharNumber : aadharNumber,
			upgradCoins : bueryInfo.upgradCoins-propertyDetails.price,
			CreatedAt : new Date(),
		};

		let updatedbuyerUserbuffer = Buffer.from(JSON.stringify(updatebuyeruserobj));
		await ctx.stub.putState(userKey,updatedbuyerUserbuffer);

// updating Seller upgradCoins details by Adding  Seller upgradCoins with price of the property
		let updateSelleruserobj = {
			name : SellerInfo.name,
			emailId : SellerInfo.emailId,
			phoneNo : SellerInfo.phoneNo,
			aadharNumber : SellerInfo.aadharNumber,
			upgradCoins : SellerInfo.upgradCoins+propertyDetails.price,
			CreatedAt : new Date(),
		};

		let updatedsellerUserbuffer = Buffer.from(JSON.stringify(updateSelleruserobj));
		await ctx.stub.putState(selleruserKey,updatedsellerUserbuffer);
		return  PropertyUpdateobj;

	}
}

}
module.exports=UserContract;
