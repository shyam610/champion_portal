
//const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];


// const nowDate=new Date();
// var currentDate=nowDate.getDate();
// var noOfWeek=0;
// for(var i=1;i<=currentDate;i++){
//     var date=nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+i;
//     console.log(date);
//     const pastDate = new Date(date);
//     console.log(pastDate.getDay())
//     if(pastDate.getDay()==6)
//     noOfWeek++;
//     console.log(noOfWeek);

// }
function date(){
    const nowDate=new Date();
    var currentDate=nowDate.getDate();
    var noOfWeek=0;
    var month=(nowDate.getMonth()+1);
    var year=nowDate.getFullYear();
    for(var i=1;i<=currentDate;i++){
        var date=year+'-'+month+'-'+i;
        
        const pastDate = new Date(date);
        console.log(date);
        console.log(pastDate.getDay())
        if(pastDate.getDay()==6)
        noOfWeek++;
        
    
    }
    return {noOfWeek,month,year}
   }
   console.log(date());