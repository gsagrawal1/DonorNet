const express = require('express')
const app = express();
const PORT = 4000;
const fs = require('fs')
const cors = require('cors')
const bcrypt = require('bcrypt')
app.use(express.json());
app.use(cors());

let donorDetails = require('./donorDetails.json');
let bloodBanks = require('./bloodBanks.json');
let bankReport = require('./bankReport');
const { report } = require('process');

//Login donors
app.post('/login/donors', (req, res) => {
    const body = req.body;
  
    const donor = donorDetails.find(item => item.email.trim() === body.email.trim());
  
    if (!donor) {
      return res.status(404).json({ message: 'Email not found' });
    }
  
    const isPasswordCorrect = bcrypt.compareSync(body.password, donor.password);
  
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    return res.status(200).json({
      message: 'Login successful',
      donorId: donor.id,
      name: donor.name,
      email: donor.email,
      bloodGroup: donor.bloodGroup
    });
  });

//Login Blood Banks
app.post('/login/bloodBanks', (req, res) => {
    const body = req.body;
    const bloodBank = bloodBanks.find(item => item.email.trim() === body.email.trim());
  
    if (!bloodBank) {
      return res.status(404).json({ message: 'Email not found' });
    }
    const isPasswordCorrect = bcrypt.compareSync(body.password, bloodBank.password);
  
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Incorrect password' });
    }
    return res.status(200).json({
      message: 'Login successful',
      bloodBankId: bloodBank.id,
      hospitalName: bloodBank.hospitalName,
      email: bloodBank.email,
    });
  });


//donors
app.post('/donors', (req, res) => {
    const body = req.body;
    const hashedPassword = bcrypt.hashSync(body.password , 15);
    const newDonor = {
        id : donorDetails.length > 0 ? donorDetails[donorDetails.length-1].id + 1 : 1,
        ...body,
        password : hashedPassword,
        confirmPassword : hashedPassword
    }
    donorDetails.push(newDonor);
    fs.writeFileSync('./donorDetails.json',JSON.stringify(donorDetails, null , 2), 'utf-8');
    donorDetails.push(newDonor);
    res.status(200).json({ message: 'Donor added successfully', AddedDonor: newDonor });
})

app.get('/donors', (req, res)=> {
    if(donorDetails.length){
        res.status(200).json({message : "Donor list available", donorDetails : donorDetails})
    }
    else{
        res.status(400).json({message : "Donor list is empty"})
    }
    
})

app.get('/donors/:id', (req, res)=> {
    const id = parseInt(req.params.id)
    const index = donorDetails.findIndex(item => item.id === id)
    if(donorDetails.length && index !== -1){
        return res.status(200).json({message : "Donor list available", donor : donorDetails[index]})
    }
    return res.status(400).json({message : "Donor not found"})

})

app.patch('/donors/:id', (req, res) => {
    const body = req.body;
    const id = parseInt(req.params.id, 10);
    const index = donorDetails.findIndex(donor => donor.id === id);

    if (index !== -1) {
        donorDetails[index] = { ...donorDetails[index], ...body };
        fs.writeFileSync('./donorDetails.json',JSON.stringify(donorDetails, null , 2), 'utf-8');
        res.status(200).json({ message: 'Donor details updated successfully', donor: donorDetails[index] });
    } else {
        res.status(404).json({ message: 'Donor not found' });
    }
});

app.delete('/donors/:id', (req, res)=> {
    const id = parseInt(req.params.id);
    const index = donorDetails.findIndex(item => item.id === id);
    if(index !== -1){
        donorDetails.splice(index, 1);
        fs.writeFileSync('./donorDetails.json',JSON.stringify(donorDetails, null , 2), 'utf-8');
        res.status(200).json({message : "Donor deleted successfully"})
    }
    else{
        res.status(404).json({ message: 'Donor not found' });
    }
 
})


//bloodbanks
app.post('/bloodbanks', (req, res)=> {
    const body = req.body
    const hashedPassword = bcrypt.hashSync(body.password, 15);
    const newBloodBanks = {
        id : bloodBanks.length > 0 ? bloodBanks[bloodBanks.length - 1].id + 1 : 1,
        ...body,
        password : hashedPassword,
        confirmPassword : hashedPassword
    }
    bloodBanks.push(newBloodBanks)
    fs.writeFileSync('./bloodBanks.json',JSON.stringify(bloodBanks, null , 2), 'utf-8');
    return res.status(200).json({message : "BloodBank Added successfully", addedBank : newBloodBanks})
})
app.get('/bloodbanks', (req, res) => {
    if(bloodBanks.length > 0){
        return res.status(200).json({BloodBanks : bloodBanks})
    }
    return res.status(404).json({error : "BloodBanks list is empty"})

})
app.get('/bloodbanks/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const index = bloodBanks.findIndex(item => item.id === id)
    if(bloodBanks.length > 0 && index !== -1){
        return res.status(200).json({BloodBanks: bloodBanks[index]})
    }
    return res.status(404).json({error : "BloodBank not found"})

})
app.patch('/bloodbanks/:id', (req, res) => {
    const body = req.body
    const id = parseInt(req.params.id)
    const index = bloodBanks.findIndex(item => item.id === id)
    if(index !== -1){
        bloodBanks[index] = {...bloodBanks[index], ...body}
        fs.writeFileSync('./bloodBanks.json',JSON.stringify(bloodBanks, null , 2), 'utf-8');
        return res.status(200).json({Edited : bloodBanks[index]})
    }
    return res.status(404).json({error : "BloodBank not found"})

})
app.delete('/bloodbanks/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const index = bloodBanks.findIndex(item => item.id === id)
    if(index !== -1){
        bloodBanks.splice(index , 1);
        fs.writeFileSync('./bloodBanks.json',JSON.stringify(bloodBanks, null , 2), 'utf-8');
        const reportIndex = bankReport.findIndex(item => item.bankId === id)
        if(reportIndex !== -1){
            bankReport.splice(reportIndex, 1);
            fs.writeFileSync('./bankReport.json',JSON.stringify(bankReport, null , 2), 'utf-8');
            return res.status(200).json({message : "Deletion successful with bank report"})
        }
        return res.status(200).json({message : "Deletion successful"})
    }
    return res.status(404).json({error : "BloodBank not found"})

})


//blood banks report
app.post('/bankReport/:id', (req, res) =>{
    const id = parseInt(req.params.id)
    const body = req.body
    const index = bloodBanks.findIndex(item => item.id === id)
    const reportIndex = bankReport.findIndex(item => item.bankId === id)
    if(index !== -1){
        if(reportIndex === -1){
        const newBankReport = {
            id : bankReport.length > 0 ? bankReport[bankReport.length - 1].id + 1 : 1,
            bankId : id,
            ...body
        }
        bankReport.push(newBankReport)
        fs.writeFileSync('./bankReport.json',JSON.stringify(bankReport, null , 2), 'utf-8');
        return res.status(200).json({ message : "Added successfully",AddedReport : newBankReport})
    }
        return res.status(404).json({error : "Blood report already existed"})
    }
    return res.status(404).json({error : "BloodBank not found"})
})
app.get('/bankReport/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const index = bloodBanks.findIndex(item => item.id === id)
    if(bloodBanks.length > 0){
        if(index !== -1){
            const reportIndex = bankReport.findIndex(item => item.bankId === id)
            if(reportIndex !== -1){
                const report = bankReport.filter(item => item.bankId === id) ;
                return res.status(200).json(report)
            }
            return res.status(404).json({error : "Bank report not found"})
        }
        return res.status(404).json({error : "BloodBank not found"})
    }
    return res.status(404).json({error : "BloodBank not found"})

})
app.patch('/bankReport/:id', (req, res)=> {
    const id = parseInt(req.params.id)
    const index = bloodBanks.findIndex(item => item.id === id)
    const body = req.body
    if(index !== -1){
        const reportIndex = bankReport.findIndex(item => item.bankId === id)
        if(reportIndex !== -1) {
            bankReport[reportIndex] = {...bankReport[reportIndex], ...body}
            fs.writeFileSync('./bankReport.json',JSON.stringify(bankReport, null , 2), 'utf-8');
            return res.status(200).json({BankReport : bankReport[reportIndex]})
        }

           return res.status(404).json({error : "Blood report not found"})

    }
    return res.status(404).json({error : "BloodBank not found"})

})
app.delete('/bankReport/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const index = bloodBanks.findIndex(item => item.id === id)
    if(bloodBanks.length > 0){
        if(index !== -1){
            const reportIndex = bankReport.findIndex(item => item.bankId === id)
            if(reportIndex !== -1){
                bankReport.splice(reportIndex , 1);
                fs.writeFileSync('./bankReport.json',JSON.stringify(bankReport, null , 2), 'utf-8');
                return res.status(204).json({message : "Deletion successful"})
            }
            return res.status(404).json({error : "BloodReport not found"})
        }
        return res.status(404).json({error : "BloodBank not found"})
    }
    return res.status(404).json({error : "BloodBank not found"})

})



//search feature
app.get('/searchFeature', (req, res) => {
    const { bloodType, city } = req.query; 

    console.log("Search request received for bloodType:", bloodType, "city:", city);
    if (!bloodType) {
        return res.status(400).json({ message: 'BloodType is required' });
    }
    if (!city) {
        return res.status(400).json({ message: 'City is required' });
    }

    const donors = donorDetails.filter(item => 
        item.bloodType.trim().toUpperCase() === bloodType.trim().toUpperCase() &&
        item.city.toLowerCase().includes(city.trim().toLowerCase())
    );

    const cityBanks = bloodBanks.filter(item => 
        item.city.toLowerCase().includes(city.trim().toLowerCase())
    );
    const finalBanks = cityBanks.flatMap(bank => 
        bankReport.filter(report => {
            const bloodTypeKey = `${bloodType.trim().toUpperCase()}`;    
            return report.bankId === bank.id && report[bloodTypeKey] > 0;
        })
    );
    if (donors.length > 0 && finalBanks.length > 0) {
        return res.status(200).json({ message: "Donors and Blood Banks found", donors, banks: finalBanks.flatMap(item => bloodBanks.filter(bank => bank.id === item.bankId)) });
    }
    if(donors.length > 0){
        return res.status(200).json({ message: "Donors found", donors });
    }
    if (finalBanks.length > 0) {
        return res.status(200).json({ message: "Blood Banks found", banks: finalBanks.flatMap(item => bloodBanks.filter(bank => bank.id === item.bankId))});
    }
    return res.status(404).json({ message: "No matching donors or blood banks found" });
});

app.listen(PORT, () =>{
    console.log("Server started at port : " + PORT)
})