const express = require("express");
const app = express();
const PORT = 4000;
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
app.use(express.json());
app.use(cors());
const Donor = require("./models/Donor");
const BloodBanks = require("./models/BloodBanks");
const BankReports = require("./models/BankReports");
const DonationEvent = require("./models/DonationEvent")
const RegisterEvent = require("./models/RegisterEvent")
const Requests = require("./models/Requests")
const sendEmail = require("./utility/sendEmail");
const sendEmail2 = require("./utility/sendEmail2");
const sendEmail3 = require("./utility/semdEmail3");
mongoose
  .connect("mongodb://localhost:27017/donorNetDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected to donorNetDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

//Login donors
app.post("/login/donors", async (req, res) => {
  const body = req.body;

  const donor = await Donor.findOne({ email: body.email.trim() });

  if (!donor) {
    return res.status(404).json({ message: "Email not found" });
  }

  const isPasswordCorrect = bcrypt.compareSync(body.password, donor.password);

  if (!isPasswordCorrect) {
    return res.status(401).json({ message: "Incorrect password" });
  }

  return res.status(200).json({
    message: "Login successful",
    donorId: donor._id,
    name: donor.name,
    email: donor.email,
    bloodGroup: donor.bloodGroup,
  });
});

//Login Blood Banks
app.post("/login/bloodBanks", async (req, res) => {
  const body = req.body;
  const bloodBank = await BloodBanks.findOne({ email: body.email.trim() });
  if (!bloodBank) {
    return res.status(404).json({ message: "Email not found" });
  }
  const isPasswordCorrect = bcrypt.compareSync(
    body.password,
    bloodBank.password
  );

  if (!isPasswordCorrect) {
    return res.status(401).json({ message: "Incorrect password" });
  }
  return res.status(200).json({
    message: "Login successful",
    bloodBankId: bloodBank._id,
    hospitalName: bloodBank.hospitalName,
    email: bloodBank.email,
  });
});

//forget and reset password
app.post("/forgot-password/donors", async (req, res) => {
  const { email } = req.body;
  const donor = await Donor.findOne({ email });

  if (!donor) return res.status(404).json({ message: "User not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  donor.resetOTP = otp;
  donor.resetOTPExpiry = Date.now() + 5 * 60 * 1000;
  await donor.save();

  // Send email
  await sendEmail(email, "Reset Password", `Your OTP is ${otp}`, donor.firstName);

  res.json({ message: "OTP sent to your email" });
});

app.post("/verify-otp/donors", async (req, res) => {
  const { email, otp } = req.body;
  const donor = await Donor.findOne({ email });

  if (!donor) return res.status(404).json({ message: "Donor not found" });
  if (donor.resetOTP !== otp || Date.now() > donor.resetOTPExpiry) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  res.json({ message: "OTP verified successfully" });
});

app.post("/reset-password/donors", async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const donor = await Donor.findOne({ email });

  if (!donor) return res.status(404).json({ message: "User not found" });

  if (donor.resetOTP !== otp || Date.now() > donor.resetOTPExpiry) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }
  const hashedPassword = await bcrypt.hash(newPassword, 15);
  donor.password = hashedPassword;

  // Clear OTP
  donor.resetOTP = undefined;
  donor.resetOTPExpiry = undefined;
  await donor.save();

  res.json({ message: "Password reset successful" });
});

app.post("/forgot-password/bloodBank", async (req, res) => {
  const { email } = req.body;
  const bloodBank = await BloodBanks.findOne({ email });

  if (!bloodBank)
    return res.status(404).json({ message: "BloodBank not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  bloodBank.resetOTP = otp;
  bloodBank.resetOTPExpiry = Date.now() + 5 * 60 * 1000;
  await bloodBank.save();

  // Send email
  res.json({ message: "OTP sent to your email" });
  sendEmail(email, "Reset Password", `Your OTP is ${otp}`, bloodBank.hospitalName);
});

app.post("/verify-otp/bloodBank", async (req, res) => {
  const { email, otp } = req.body;
  const bloodBank = await BloodBanks.findOne({ email });

  if (!bloodBank) return res.status(404).json({ message: "Donor not found" });
  if (bloodBank.resetOTP !== otp || Date.now() > bloodBank.resetOTPExpiry) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  res.json({ message: "OTP verified successfully" });
});
app.post("/reset-password/bloodBank", async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const bloodBank = await BloodBanks.findOne({ email });

  if (!bloodBank) return res.status(404).json({ message: "User not found" });

  if (bloodBank.resetOTP !== otp || Date.now() > bloodBank.resetOTPExpiry) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }
  const hashedPassword = await bcrypt.hash(newPassword, 15);
  bloodBank.password = hashedPassword;

  // Clear OTP
  bloodBank.resetOTP = undefined;
  bloodBank.resetOTPExpiry = undefined;
  await bloodBank.save();

  res.json({ message: "Password reset successful" });
});

//donors
app.post("/donors", async (req, res) => {
  const body = req.body;
  const hashedPassword = bcrypt.hashSync(body.password, 15);
  const newDonor = new Donor({
    ...body,
    password: hashedPassword,
    confirmPassword: hashedPassword,
  });
  const savedDonor = await newDonor.save();
  res
    .status(200)
    .json({ message: "Donor added successfully", AddedDonor: savedDonor });
});

app.get("/donors", async (req, res) => {
  const donors = await Donor.find();
  if (donors.length) {
    res
      .status(200)
      .json({ message: "Donor list available", donorDetails: donors });
  } else {
    res.status(400).json({ message: "Donor list is empty" });
  }
});

app.get("/donors/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Mongo _id" });
  }
  const donor = await Donor.findById(id);
  if (donor) {
    return res
      .status(200)
      .json({ message: "Donor list available", donor: donor });
  }
  return res.status(400).json({ message: "Donor not found" });
});

app.patch("/donors/:id", async (req, res) => {
  try {
    const donorId = req.params.id;
    const body = req.body;

    const updatedDonor = await Donor.findByIdAndUpdate(
      donorId,
      { $set: body },
      { new: true }
    );

    if (!updatedDonor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    res
      .status(200)
      .json({
        message: "Donor details updated successfully",
        donor: updatedDonor,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

app.delete("/donors/:id", async (req, res) => {
  const id = req.params.id;
  const result = await Donor.findByIdAndDelete(id);
  if (result) {
    res.status(200).json({ message: "Donor deleted successfully" });
  } else {
    res.status(404).json({ message: "Donor not found" });
  }
});

//bloodbanks
app.post("/bloodbanks", async (req, res) => {
  const body = req.body;
  const hashedPassword = bcrypt.hashSync(body.password, 15);
  const newBloodBanks = new BloodBanks({
    ...body,
    password: hashedPassword,
    confirmPassword: hashedPassword,
  });
  const savedBloodBank = await newBloodBanks.save();
  return res
    .status(200)
    .json({
      message: "BloodBank Added successfully",
      addedBank: savedBloodBank,
    });
});
app.get("/bloodbanks", async (req, res) => {
  const bloodBanks = await BloodBanks.find();
  if (bloodBanks) {
    return res.status(200).json({ BloodBanks: bloodBanks });
  }
  return res.status(404).json({ error: "BloodBanks list is empty" });
});
app.get("/bloodbanks/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Mongo _id" });
  }
  const bloodBankById = await BloodBanks.findById(id);
  if (bloodBankById) {
    return res.status(200).json({ BloodBank: bloodBankById });
  }
  return res.status(404).json({ error: "BloodBank not found" });
});
app.patch("/bloodbanks/:id", async (req, res) => {
  const body = req.body;
  const id = req.params.id;
  const updateBloodBank = await BloodBanks.findByIdAndUpdate(
    id,
    { $set: body },
    { new: true }
  );
  if (updateBloodBank) {
    return res.status(200).json({ Edited: updateBloodBank });
  }
  return res.status(404).json({ error: "BloodBank not found" });
});
app.delete("/bloodbanks/:id", async (req, res) => {
  const id = req.params.id;
  const deleteBloodBank = await BloodBanks.findByIdAndDelete(id);
  if (deleteBloodBank) {
    const findBankReport = await BankReports.findOne({ bankId: id });
    if (findBankReport) {
      const deleteBankReport = await BankReports.findOneAndDelete({
        bankId: id,
      });
      return res
        .status(200)
        .json({ message: "Deletion successful with bank report" });
    }
    return res.status(200).json({ message: "Deletion successful" });
  }
  return res.status(404).json({ error: "BloodBank not found" });
});

//blood banks report
app.post("/bankReport/:id", async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const findBloodBank = await BloodBanks.findById(id);
  const findBankReport = await BankReports.findOne({ bankId: id });
  if (findBloodBank) {
    if (!findBankReport) {
      const newBankReport = new BankReports({
        bankId: id,
        bloodInventory: body,
      });
      const savedBankReport = await newBankReport.save();
      return res
        .status(200)
        .json({ message: "Added successfully", AddedReport: savedBankReport });
    }
    return res.status(404).json({ error: "Blood report already existed" });
  }
  return res.status(404).json({ error: "BloodBank not found" });
});
app.get("/bankReport/:id", async (req, res) => {
  const id = req.params.id;
  const findBloodBank = await BloodBanks.findById(id);
  if (findBloodBank) {
    const findBankReport = await BankReports.find({ bankId: id });
    if (findBankReport) {
      return res.status(200).json(findBankReport);
    }
    return res.status(404).json({ error: "Bank report not found" });
  }
  return res.status(404).json({ error: "BloodBank not found" });
});
app.patch("/bankReport/:id", async (req, res) => {
  const id = req.params.id;
  const findBloodBank = await BloodBanks.findById(id);
  const body = req.body;
  if (findBloodBank) {
    const findBankReport = await BankReports.findOne({ bankId: id });
    if (findBankReport) {
      const updatedReport = await BankReports.findOneAndUpdate(
        { bankId: id },
        { $set: body },
        { new: true }
      );
      if (updatedReport) {
        return res.status(200).json({ BankReport: updatedReport });
      }
      return res.status(404).json({ error: "Blood report not updated" });
    }

    return res.status(404).json({ error: "Blood report not found" });
  }
  return res.status(404).json({ error: "BloodBank not found" });
});
app.delete("/bankReport/:id", async (req, res) => {
  const id = req.params.id;
  const findBloodBank = await BloodBanks.findById(id);
  if (findBloodBank) {
    const deleteBankReport = await BankReports.findOneAndDelete({ bankId: id });
    if (deleteBankReport) {
      return res.status(204).json({ message: "Deletion successful" });
    }
    return res.status(404).json({ error: "BloodReport not found" });
  }
  return res.status(404).json({ error: "BloodBank not found" });
});

//donation event posting

app.post("/event/donations", async (req, res)=>{
    const body = req.body;
    const newEvent = new DonationEvent({
        ...body
    })
    const saveEvent =await newEvent.save();
    if(saveEvent){
        return res.status(200).json({AddedEvent : saveEvent})
    }
    return res.status(204).json({message : "Failed to add event"})
})

app.get("/event/donations", async (req, res) => {
  try {
    const now = new Date();
    const { city, date } = req.query;

    const query = {
      eventStart: { $gt: now },
    };

    if (city) {
      query.city = { $regex: new RegExp(city, 'i') }; // case-insensitive
    }

    if (date) {
      const selectedDate = new Date(date);
      const nextDay = new Date(date);
      nextDay.setDate(selectedDate.getDate() + 1);

      query.eventStart = { $lte: selectedDate }; 
      query.eventEnd = { $gte: selectedDate };    }

    const allEvents = await DonationEvent.find(query);

    if (allEvents.length > 0) {
      return res.status(200).json({ Events: allEvents });
    }

    return res.status(204).json({ message: "No events found" });
  } catch (error) {
    console.error("Error fetching events:", error);
    return res.status(500).json({ message: "Server error" });
  }
});


app.get("/event/donations/:id", async (req, res)=>{
    const id = req.params.id;
    const Event = await DonationEvent.find({hostId : id})
    if(Event){
        return res.status(200).json({Event})
    }
    return res.status(204).json({message : "Failed to load event"})
})
app.patch("/event/donations/:id", async (req, res)=>{
    const id = req.params.id;
    const Event = await DonationEvent.findOne({hostId : id})
    const body = req.body
    if(Event){
        const updateEvent = await DonationEvent.findOneAndUpdate(
            {hostId : id},
            {$set : body},
            {new : true}
        )
        if(updateEvent){
            return res.status(200).json({message : "Updation Successfull", Event : updateEvent})
        }
        return res.status(204).json({message : "Failed to update event"})
    }
    return res.status(204).json({message : "Failed to load event"})
})

app.delete("/event/donations/:id", async (req, res)=>{
    const id = req.params.id;
    const Event = await DonationEvent.findByIdAndDelete(id)
    if(Event){ 
        return res.status(200).json({message : "Deletion Successfull"})
    }
    return res.status(204).json({message : "Failed to delete event"})
})

// event registrations

app.post("/event/registration", async (req, res) => {
    const body = req.body;
    const newRegisteration = new RegisterEvent({ ...body });
    const saveRegisteration = await newRegisteration.save();
    if (saveRegisteration) {
      const eventData = await DonationEvent.findOne(saveRegisteration.eventId);
      const hostData = await BloodBanks.findOne(eventData.hostId);
  
      res.status(200).json({ Added: saveRegisteration });
  
      setImmediate(async () => {
        await sendEmail2(body.email, "Successfully Registered", body.fullname, eventData, hostData);
      });
      return;
    }
    return res.status(204).json({ message: "Failed to register" });
});
app.get("/event/registration", async (req, res)=>{
    const allRegistration = await RegisterEvent.find()
    
    if(allRegistration.length > 0){
        return res.status(200).json({Registration : allRegistration})
    }
    return res.status(204).json({message : "Failed to load registration"})
})
app.get("/event/registration/:id", async (req, res)=>{
    const id = req.params.id;
    const Event = await RegisterEvent.find({eventId : id})
    if(Event){
        return res.status(200).json({Participant : Event})
    }
    return res.status(204).json({message : "Failed to load participant"})
})


//Requests 

app.post("/requests/register", async (req, res)=>{
  const body = req.body;
  const newRequest = new Requests({
    ...body
  })
  const saveRequest =await newRequest.save();
  if(saveRequest){
    return res.status(200).json({message : "Successfully registered", Request : saveRequest})
  }
    return res.status(204).json({message : "Failed to register"})
})
app.get("/requests/register", async (req, res)=>{
  const getRequests =await Requests.find();
  if(getRequests){
    return res.status(200).json({message : "Successfully loaded all requests", Request : getRequests})
  }
    return res.status(204).json({message : "Failed to load"})
})

app.get("/requests/register/donor", async (req, res) => {
  const { bloodType, requireCity, id } = req.query;
  const now = new Date();
  const getRequests = await Requests.find({
    bloodType ,
    requireCity: { $regex: `^${requireCity.trim()}$`, $options: "i" },
    requireDate: { $gt: now }
  });
  const filteredRequests = getRequests.filter(
      req => !req.acceptedIds?.includes(id)
    );
    if (filteredRequests.length === 0) {
      return res.status(204).json({ message: "You have already accepted all matching requests." });
    }
  if (filteredRequests.length) {
    return res
      .status(200)
      .json({ message: "Successfully loaded all requests", Request: filteredRequests });
  } else {
    return res.status(204).json({ message: "No matching requests found" });
  }
});

app.post("/requests/accept/:id", async (req, res) => {
  try {
    const donorId = req.params.id;
    const { reqId } = req.query;

    const donor = await Donor.findById(donorId);
    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    const recipient = await Requests.findById(reqId);
    if (!recipient) {
      return res.status(400).json({ message: "Recipient is required" });
    }
    if (recipient.acceptedIds?.includes(donorId)) {
      return res.status(409).json({ message: "You have already accepted this request." });
    }
    recipient.acceptedIds = recipient.acceptedIds || [];
    recipient.acceptedIds.push(donorId);
    await recipient.save();
    res.status(200).json({ message: "Request accepted. Sending email..." });

    const subject = "Your Blood Request Has Been Accepted";
    sendEmail3(recipient.email, subject, donor)
      .then(() => {
        console.log(`Email sent to ${recipient.email}`);
      })
      .catch(err => {
        console.error("Email sending failed:", err);
      });

  } catch (error) {
    console.error("Error in accepting request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


//search feature
app.get("/searchFeature", async (req, res) => {
  const { bloodType, city } = req.query;
  if (!bloodType) {
    return res.status(400).json({ message: "BloodType is required" });
  }
  if (!city) {
    return res.status(400).json({ message: "City is required" });
  }

 const bloodCompatibility = {
  O_neg: ['O_neg'],
  O_pos: ['O_neg', 'O_pos'],
  A_neg: ['O_neg', 'A_neg'],
  A_pos: ['O_neg', 'O_pos', 'A_neg', 'A_pos'],
  B_neg: ['O_neg', 'B_neg'],
  B_pos: ['O_neg', 'O_pos', 'B_neg', 'B_pos'],
  AB_neg: ['O_neg', 'A_neg', 'B_neg', 'AB_neg'],
  AB_pos: ['O_neg', 'O_pos', 'A_neg', 'A_pos', 'B_neg', 'B_pos', 'AB_neg', 'AB_pos']
};

  const compatibleTypes = bloodCompatibility[bloodType.trim()] || [];

  const donors = await Donor.find({
    bloodType: {
      $regex: `^${bloodType.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
      $options: "i",
    },
    city: { $regex: `^${city.trim()}$`, $options: "i" },
  });

  const crossDonors = await Donor.find({
    bloodType: { $in: compatibleTypes.filter(bt => bt !== bloodType.trim()) },
    city: { $regex: `^${city.trim()}$`, $options: "i" },
  });

  const cityBanks = await BloodBanks.find({
    city: { $regex: `^${city.trim()}$`, $options: "i" },
  });

  const bankIds = cityBanks.map((bank) => bank._id);
  const finalBanks = await BankReports.find({ bankId: { $in: bankIds } });

  const reportCheck = finalBanks.filter(
    (item) => item.bloodInventory[bloodType] > 0
  );

  const availableBankIds = reportCheck.map((report) => report.bankId);
  const availableBanks = await BloodBanks.find({
    _id: { $in: availableBankIds },
  });
  
  const result = availableBanks.map((bank) => {
    const matchingReport = reportCheck.find(
      (report) => report.bankId.toString() === bank._id.toString()
    );
    return {
      ...bank.toObject(),
      availableUnits: matchingReport.bloodInventory[bloodType],
    };
  });

  if (donors.length > 0 || crossDonors.length > 0 || result.length > 0) {
    return res.status(200).json({
      message: "Matching results found",
      donors,
      crossDonors,
      banks: result,
    });
  }

  return res
    .status(404)
    .json({ message: "No matching donors or blood banks found" });
});


app.listen(PORT, () => {
  console.log("Server started at port : " + PORT);
});
