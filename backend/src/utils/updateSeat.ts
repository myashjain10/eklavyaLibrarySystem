interface Seat{
  full_day: boolean,
  first_half: boolean,
  second_half: boolean,
  seat_num: number,
  id: string,
  prisma:any
}

interface Allotment{
  full_day: boolean,
  first_half: boolean,
  second_half: boolean,
  seat_num: number,
  member_id: string,
  id:string
}

export const updateSeat = async ({full_day, first_half, second_half, seat_num, id, prisma}:Seat) => {
  let newSeat;
  if(full_day){
    newSeat = await prisma.seat.update({
      where:{
        seat_num: seat_num
      },
      data:{
        fh_allotted: true,
        fh_allotment: id,
        sh_allotted: true,
        sh_allotment: id
      }
    })
  }else if(first_half){
    newSeat = await prisma.seat.update({
      where:{
        seat_num: seat_num
      },
      data:{
        fh_allotted: true,
        fh_allotment: id
      }
    })
  }else if(second_half){
    newSeat = await prisma.seat.update({
      where:{
        seat_num: seat_num
      },
      data:{
        sh_allotted: true,
        sh_allotment: id
      }
    })
  }
  console.log(newSeat)
  return newSeat;
}


export const unAllotSeat = async (previousAllotment:Allotment, prisma:any) => {
  let newSeat;

  if(previousAllotment.full_day){
    newSeat = await prisma.seat.update({
      where:{
        seat_num: previousAllotment.seat_num
      },
      data:{
        fh_allotted: false,
        fh_allotment: null,
        sh_allotted: false,
        sh_allotment: null
      }
    })
  }else if(previousAllotment.first_half){
    newSeat = await prisma.seat.update({
      where:{
        seat_num: previousAllotment.seat_num
      },
      data:{
        fh_allotted: false,
        fh_allotment: null
      }
    })
  }else if(previousAllotment.second_half){
    newSeat = await prisma.seat.update({
      where:{
        seat_num: previousAllotment.seat_num
      },
      data:{
        sh_allotted: false,
        sh_allotment: null
      }
    })
  }
  console.log(newSeat)
  return newSeat;
}
