
interface Member{
  id: String,
  name: String,
  phone_number: String,
  email: String,
}
interface Allotment{
  seat_num: number,
  first_half: boolean,
  second_half: boolean,
  full_day: boolean,
  end_date: Date
}

// SMS:{
//   phoneNumber: 9826836812,
//   smsbody: "LOREM IPSUM",
// }

export const sendWelcome = async (member:Member, SMS_WEBHOOK_URL:string) => {
  // When a new member is created, send a Welcome SMS
  const smsbody = `Welcome to Eklavya Library, ${member.name}`;
  const url = `${SMS_WEBHOOK_URL}?phNumber=${member.phone_number}`;

  try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: smsbody,
      });

      return smsbody;
  } catch (error) {
      console.log('Error:', error);
      return "Could not send SMS";
  }
}

export const sendAllotmentNotification = async (member:Member, allotment:Allotment, SMS_WEBHOOK_URL:string) =>{
  //when allotment is done, send this sms
  //Hello ${member.name}, You have been alloted seat number ${allotment.seat_num} for ${Full Day/ First_Half/ Second_Half} till ${allotment.end_date}.
  let seatStatus = ""
  if(allotment.full_day) seatStatus = "Full Day";
  else if(allotment.first_half) seatStatus = "Half Day (8 am - 3 pm)";
  else if(allotment.second_half) seatStatus = "Half Day (3 pm - 10 pm)";

  const lastDate = `${allotment.end_date}`.slice(0,15);

  const smsbody = `Hi ${member.name}, You have been alloted Seat Number: ${allotment.seat_num} for ${seatStatus} till ${lastDate}`;
  const url = `${SMS_WEBHOOK_URL}?phNumber=${member.phone_number}`;

  try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: smsbody,
      });
      
      return smsbody;
  } catch (error) {
      console.log('Error:', error);
      return "Could not send SMS";
  }
}

export const sendPaymentReminder = () =>{
  
}

export const sendNotification = () =>{
  
}