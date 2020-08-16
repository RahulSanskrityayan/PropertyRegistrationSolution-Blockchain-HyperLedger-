const express = require('express');
const app = new express();
const cors = require('cors');
const port = 3000;

const addToWalletUser = require('./1_addToWalletUser.js');
const addToWalletRegistarar = require('./2_addToWalletRegistarar.js');
const requestNewUser = require('./3_requestNewUser.js');
const approveNewUser = require('./4_ApproveUser.js');
const viewUser = require('./5_ViewUser.js');
const propertyRegRequest = require('./6_PropertyRegisterationRequest.js');
const approvedProperty = require('./7_ApproveProperty.js');


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set('title','PropertyRegApp');

app.get('/', (req, res) => res.send('hello world'));

app.post('/1_addToWalletUser.js',(req,res) =>{
  addToWalletUser.execute(req.body.certificatePath, req.body.privateKeyPath).then(()=> {
    console.log('added to Wallet');
    const result = {
					status: 'success',
					message: 'User credentials added to wallet'
				};
        res.json(result);

  }).catch((error) => {
    const result = {
          status: 'success',
          message: 'User credentials added to wallet'
        };
        res.status(500).json(result);
  });
});

app.post('/2_addToWalletRegistarar.js',(req,res) =>{
  addToWalletRegistarar.execute(req.body.certificatePath, req.body.privateKeyPath).then(()=> {
    console.log('added to Wallet');
    const result = {
					status: 'success',
					message: 'Registerar credentials added to wallet'
				};
        res.json(result);

  }).catch((error) => {
    const result = {
          status: 'error',
          message: 'Failed'
        };
        res.status(500).json(result);
  });
});

app.post('/3_requestNewUser.js',(req,res) => {
  requestNewUser.execute(req.body.orgRole,req.body.name,req.body.emailId,req.body.phoneNo,req.body.aadharNumber).then(()=>{
    console.log('User Added');
    const result = {
					status: 'success',
					message: 'user request Submitted'
				};
        res.json(result);
  }).catch((error)=>{
    const result = {
          status: 'error',
          message: 'Failed'
        };
        res.status(500).json(result);
  });
});

app.post('/4_ApproveUser.js',(req,res) => {
  approveNewUser.execute(req.body.orgRole,req.body.name,req.body.aadharNumber).then(()=>{
    console.log('User Approved');
    const result = {
					status: 'success',
					message: 'Approved User Details'
				};
        res.json(result);
  }).catch((error)=>{
    const result = {
          status: 'error',
          message: 'Failed'
        };
        res.status(500).json(result);
  });
});

app.post('/5_ViewUser.js',(req,res) => {
  viewUser.execute(req.body.orgRole,req.body.name,req.body.aadharNumber).then(()=>{
    console.log('Registered User Details');
    const result = {
					status: 'success',
					message: 'user details'
				};
        res.json(result);
  }).catch((error)=>{
    const result = {
          status: 'error',
          message: 'Failed'
        };
        res.status(500).json(result);
  });
});

app.post('/6_PropertyRegisterationRequest.js',(req,res) => {
  propertyRegRequest.execute(req.body.orgRole,req.body.name,req.body.aadharNumber,req.body.propertyID,req.body.price,req.body.status).then(()=>{
    console.log('Registered Property Details');
    const result = {
					status: 'success',
					message: 'Property Registered'
				};
        res.json(result);
  }).catch((error)=>{
    const result = {
          status: 'error',
          message: 'Failed'
        };
        res.status(500).json(result);
  });
});

app.post('/7_ApproveProperty.js',(req,res) => {
  approvedProperty.execute(req.body.orgRole,req.body.propertyID).then(()=>{
    console.log('Approved Property Details');
    const result = {
					status: 'success',
					message: 'Property Approved'
				};
        res.json(result);
  }).catch((error)=>{
    const result = {
          status: 'error',
          message: 'Failed'
        };
        res.status(500).json(result);
  });
});

app.listen(port,()=>console.log(`Distributed Pharma App listening on port ${port}!`));
