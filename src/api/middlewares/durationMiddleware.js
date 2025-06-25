import durationModel from "../../models/durationModel.js";

//--------------Har EK month update------------//


const updateDurationIfMonthEnd = async () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (tomorrow.getDate() === 1) {
    try {
      console.log("Month end searching");

     
      await durationModel.updateMany({}, { $inc: { durationInMonths: 1 } });
      console.log("Duration updated successfully");

     
      const purchases = await purchaseModel.find().populate("userId");

      for (const purchase of purchases) {
        if (!purchase.userId) continue; 

       
        const investedAmount = purchase.minAmount || 0;
        if (investedAmount <= 0) continue;

     
        let returnRate = 0;
        if (purchase.returnRate) {
          returnRate = parseFloat(purchase.returnRate.replace("%", ""));
          if (isNaN(returnRate)) returnRate = 0;
        }

        if (returnRate > 0) {
      
          const returnAmount = (investedAmount * returnRate) / 100;

       
          await userModel.findByIdAndUpdate(
            purchase.userId._id,
            { $inc: { walletBalance: returnAmount } },
            { new: true }
          );

          console.log(
            `User ${purchase.userId._id} wallet updated by ${returnAmount}`
          );
        }
      }
    } catch (error) {
      console.error("Error updating durations and returns:", error);
    }
  } else {
    console.log("Not month end. No update performed.");
  }
};


updateDurationIfMonthEnd();
setInterval(updateDurationIfMonthEnd, 24 * 60 * 60 * 1000);




//--------------EveryScond update------------//


const updateEverySecond = async () => {
  try {
    await durationModel.updateMany({}, { $inc: { durationInMonths: 1 } });
    console.log("Updated durations at", new Date().toLocaleTimeString());

    const purchases = await purchaseModel.find().populate("userId");

    for (const purchase of purchases) {
      if (!purchase.userId) continue;

      const investedAmount = purchase.minAmount || 0;
      if (investedAmount <= 0) continue;

      let returnRate = 0;
      if (purchase.returnRate) {
        returnRate = parseFloat(purchase.returnRate.replace("%", ""));
        if (isNaN(returnRate)) returnRate = 0;
      }

      if (returnRate > 0) {
        const returnAmount = (investedAmount * returnRate) / 100;

        await userModel.findByIdAndUpdate(
          purchase.userId._id,
          { $inc: { walletBalance: returnAmount } },
          { new: true }
        );

        console.log(
          `User ${purchase.userId._id} wallet updated by ${returnAmount} at ${new Date().toLocaleTimeString()}`
        );
      }
    }
  } catch (error) {
    console.error("Error updating durations and wallets every second:", error);
  }
};

setInterval(updateEverySecond, 1000);